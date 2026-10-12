// Hydra School API: accounts (email + password, GitHub, Google) and per-user progress sync.
// All data lives in Netlify Blobs. Routes are served under /api/*.
import { createHash } from "node:crypto";
import { db } from "../lib/store.mjs";
import { hashPassword, verifyPassword, sha256, token } from "../lib/crypto.mjs";
import { hit, peek, reset } from "../lib/ratelimit.mjs";

export const config = { path: "/api/*" };

const SESSION_COOKIE = "hs_session";
const OAUTH_COOKIE = "hs_oauth";
const SESSION_DAYS = 60;
const MAX_SESSIONS = 20;
const MAX_PROGRESS_BYTES = 2_000_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------------- helpers ---------------- */
const env = (k) => (globalThis.Netlify?.env?.get?.(k) ?? process.env[k]) || "";

function json(status, body, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}
const fail = (status, error, extra = {}, headers = {}) => json(status, { error, ...extra }, headers);
const tooMany = (sec) => fail(429, "Too many requests. Please wait a few minutes and try again.", { retryAfter: sec }, { "retry-after": String(sec) });

function redirect(location, cookies = []) {
  const h = new Headers({ location, "cache-control": "no-store" });
  cookies.forEach((c) => h.append("set-cookie", c));
  return new Response(null, { status: 302, headers: h });
}

function cookies(req) {
  const out = {};
  (req.headers.get("cookie") || "").split(";").forEach((p) => {
    const i = p.indexOf("=");
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
const cookie = (name, value, { maxAge, path = "/" } = {}) =>
  `${name}=${encodeURIComponent(value)}; Path=${path}; HttpOnly; Secure; SameSite=Lax${maxAge !== undefined ? `; Max-Age=${maxAge}` : ""}`;

const clientIp = (req, context) => context?.ip || req.headers.get("x-nf-client-connection-ip") || "unknown";
const normEmail = (e) => String(e || "").trim().toLowerCase();

async function readJson(req, limit = 20_000) {
  const text = await req.text();
  if (text.length > limit) throw Object.assign(new Error("too large"), { status: 413 });
  try { return text ? JSON.parse(text) : {}; } catch { throw Object.assign(new Error("bad json"), { status: 400 }); }
}

const publicUser = (u) => ({
  id: u.id, email: u.email, name: u.name || "",
  methods: { password: !!u.pw, github: !!u.github, google: !!u.google },
  created: u.created,
});

/* ---------------- sessions ---------------- */
async function currentUser(req) {
  const t = cookies(req)[SESSION_COOKIE];
  if (!t) return null;
  const store = await db();
  const s = await store.get(`sess/${sha256(t)}`);
  if (!s || s.exp < Date.now()) return null;
  return store.get(`users/${s.uid}`);
}

async function startSession(user) {
  const store = await db();
  const t = token();
  const h = sha256(t);
  await store.set(`sess/${h}`, { uid: user.id, exp: Date.now() + SESSION_DAYS * 864e5 });
  user.sessions = [...(user.sessions || []), h];
  while (user.sessions.length > MAX_SESSIONS) await store.del(`sess/${user.sessions.shift()}`);
  await store.set(`users/${user.id}`, user);
  return cookie(SESSION_COOKIE, t, { maxAge: SESSION_DAYS * 86400 });
}

async function endSession(req) {
  const t = cookies(req)[SESSION_COOKIE];
  if (!t) return;
  const store = await db();
  const h = sha256(t);
  const s = await store.get(`sess/${h}`);
  await store.del(`sess/${h}`);
  if (s) {
    const u = await store.get(`users/${s.uid}`);
    if (u) { u.sessions = (u.sessions || []).filter((x) => x !== h); await store.set(`users/${u.id}`, u); }
  }
}
const clearSession = () => cookie(SESSION_COOKIE, "", { maxAge: 0 });

async function createUser({ email, name, pw, github, google }) {
  const store = await db();
  const id = token(12);
  if (email) {
    const { modified } = await store.set(`email/${sha256(email)}`, { uid: id }, { onlyIfNew: true });
    if (!modified) return null;
  }
  const user = { id, email: email || "", name: name || "", created: new Date().toISOString(), sessions: [] };
  if (pw) user.pw = pw;
  if (github) user.github = github;
  if (google) user.google = google;
  await store.set(`users/${id}`, user);
  if (github) await store.set(`gh/${github}`, { uid: id });
  if (google) await store.set(`gg/${google}`, { uid: id });
  return user;
}

/* ---------------- email + password ---------------- */
async function signup(req, ip) {
  const wait = await hit("auth", ip);
  if (wait) return tooMany(wait);
  const body = await readJson(req);
  const email = normEmail(body.email);
  const password = String(body.password || "");
  const name = String(body.name || "").trim().slice(0, 80);
  if (!EMAIL_RE.test(email) || email.length > 254) return fail(400, "Enter a valid email address.");
  if (password.length < 8) return fail(400, "Use at least 8 characters for your password.");
  if (password.length > 200) return fail(400, "That password is too long.");
  const user = await createUser({ email, name, pw: await hashPassword(password) });
  if (!user) return fail(409, "An account with this email already exists. Log in instead.");
  return json(201, { user: publicUser(user) }, { "set-cookie": await startSession(user) });
}

async function login(req, ip) {
  const wait = await hit("auth", ip);
  if (wait) return tooMany(wait);
  const body = await readJson(req);
  const email = normEmail(body.email);
  const password = String(body.password || "").slice(0, 200);
  if (!email || !password) return fail(400, "Enter your email and password.");
  const locked = await peek("email", email);
  if (locked) return tooMany(locked);
  const store = await db();
  const idx = await store.get(`email/${sha256(email)}`);
  const user = idx && (await store.get(`users/${idx.uid}`));
  const ok = await verifyPassword(password, user && user.pw);
  if (!ok) {
    await hit("email", email);
    if (user && !user.pw) {
      const via = [user.github && "GitHub", user.google && "Google"].filter(Boolean).join(" or ");
      return fail(401, `This account signs in with ${via}. Use that button below.`);
    }
    return fail(401, "Wrong email or password.");
  }
  await reset("email", email);
  return json(200, { user: publicUser(user) }, { "set-cookie": await startSession(user) });
}

/* ---------------- OAuth (GitHub, Google) ---------------- */
const PROVIDERS = {
  github: {
    key: "gh",
    id: () => env("GITHUB_CLIENT_ID"),
    secret: () => env("GITHUB_CLIENT_SECRET"),
    authorize: (p) => `https://github.com/login/oauth/authorize?${new URLSearchParams({
      client_id: p.clientId, redirect_uri: p.redirect, scope: "read:user user:email", state: p.state, allow_signup: "true",
    })}`,
    async profile(code, p) {
      const tr = await fetch("https://github.com/login/oauth/access_token", {
        method: "POST",
        headers: { accept: "application/json", "content-type": "application/json" },
        body: JSON.stringify({ client_id: p.clientId, client_secret: p.secret, code, redirect_uri: p.redirect }),
      });
      const tok = await tr.json();
      if (!tok.access_token) throw new Error("token exchange failed");
      const h = { authorization: `Bearer ${tok.access_token}`, accept: "application/vnd.github+json", "user-agent": "hydra-school" };
      const me = await (await fetch("https://api.github.com/user", { headers: h })).json();
      if (!me || !me.id) throw new Error("no profile");
      let email = "";
      const er = await fetch("https://api.github.com/user/emails", { headers: h });
      if (er.ok) {
        const list = await er.json();
        const best = Array.isArray(list) && (list.find((e) => e.primary && e.verified) || list.find((e) => e.verified));
        if (best) email = best.email;
      }
      return { id: String(me.id), email: normEmail(email), name: me.name || me.login || "" };
    },
  },
  google: {
    key: "gg",
    id: () => env("GOOGLE_CLIENT_ID"),
    secret: () => env("GOOGLE_CLIENT_SECRET"),
    authorize: (p) => `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
      client_id: p.clientId, redirect_uri: p.redirect, response_type: "code", scope: "openid email profile",
      state: p.state, code_challenge: p.challenge, code_challenge_method: "S256", prompt: "select_account",
    })}`,
    async profile(code, p) {
      const tr = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded", accept: "application/json" },
        body: new URLSearchParams({
          code, client_id: p.clientId, client_secret: p.secret, redirect_uri: p.redirect,
          grant_type: "authorization_code", code_verifier: p.verifier,
        }),
      });
      const tok = await tr.json();
      if (!tok.access_token) throw new Error("token exchange failed");
      const me = await (await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: { authorization: `Bearer ${tok.access_token}` },
      })).json();
      if (!me || !me.sub) throw new Error("no profile");
      return { id: String(me.sub), email: me.email_verified ? normEmail(me.email) : "", name: me.name || "" };
    },
  },
};
const configured = (name) => !!(PROVIDERS[name].id() && PROVIDERS[name].secret());

async function oauthStart(req, ip, name) {
  const prov = PROVIDERS[name];
  if (!configured(name)) return redirect(`/#login/not_configured`);
  const wait = await hit("oauth", ip);
  if (wait) return redirect(`/#login/rate_limited`);
  const origin = new URL(req.url).origin;
  const state = token(16), verifier = token(32);
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  const url = prov.authorize({ clientId: prov.id(), redirect: `${origin}/api/auth/${name}/callback`, state, challenge });
  return redirect(url, [cookie(OAUTH_COOKIE, `${name}.${state}.${verifier}`, { maxAge: 600, path: "/api/auth" })]);
}
async function oauthCallback(req, ip, name) {
  const prov = PROVIDERS[name];
  const clear = cookie(OAUTH_COOKIE, "", { maxAge: 0, path: "/api/auth" });
  const back = (code) => redirect(`/#login/${code}`, [clear]);
  if (!configured(name)) return back("not_configured");
  const url = new URL(req.url);
  if (url.searchParams.get("error")) return back("cancelled");
  const [cName, cState, verifier] = (cookies(req)[OAUTH_COOKIE] || "").split(".");
  const code = url.searchParams.get("code");
  if (!code || cName !== name || !cState || cState !== url.searchParams.get("state")) return back("state");
  const wait = await hit("oauth", ip);
  if (wait) return back("rate_limited");

  let profile;
  try {
    profile = await prov.profile(code, { clientId: prov.id(), secret: prov.secret(), redirect: `${url.origin}/api/auth/${name}/callback`, verifier });
  } catch (e) {
    console.error(`${name} oauth failed:`, e.message);
    return back("provider");
  }

  const store = await db();
  const linkKey = `${prov.key}/${profile.id}`;
  const link = await store.get(linkKey);
  const current = await currentUser(req);

  // Signed in already: connect this provider to the current account.
  if (current) {
    if (link && link.uid !== current.id) return redirect(`/#settings/link_taken`, [clear]);
    current[name] = profile.id;
    await store.set(`users/${current.id}`, current);
    await store.set(linkKey, { uid: current.id });
    return redirect(`/#settings/linked`, [clear]);
  }

  let user = link && (await store.get(`users/${link.uid}`));
  if (!user && profile.email) {
    const idx = await store.get(`email/${sha256(profile.email)}`);
    const existing = idx && (await store.get(`users/${idx.uid}`));
    if (existing) {
      // Never attach a provider to a password account automatically: the password holder
      // may not own the address (we don't send verification emails).
      if (existing.pw) return back("email_exists");
      existing[name] = profile.id;
      await store.set(`users/${existing.id}`, existing);
      await store.set(linkKey, { uid: existing.id });
      user = existing;
    }
  }
  if (!user) {
    if (!profile.email) return back("no_email");
    user = await createUser({ email: profile.email, name: profile.name, [name]: profile.id });
    if (!user) return back("email_exists");
  }
  return redirect(`/#today`, [clear, await startSession(user)]);
}

/* ---------------- progress ---------------- */
async function getProgress(user) {
  const p = await (await db()).get(`progress/${user.id}`);
  return json(200, p ? { data: p.data, version: p.version, updated: p.updated } : { data: null, version: 0 });
}

async function putProgress(req, user) {
  const wait = await hit("write", user.id);
  if (wait) return tooMany(wait);
  const body = await readJson(req, MAX_PROGRESS_BYTES);
  const data = body.data;
  const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
  if (!isObj(data) || (data.app !== undefined && !isObj(data.app)) || (data.practice !== undefined && !isObj(data.practice)))
    return fail(400, "Progress must be an object with app and practice sections.");
  const store = await db();
  const cur = await store.get(`progress/${user.id}`);
  const version = cur ? cur.version : 0;
  if (Number(body.baseVersion) !== version) return json(409, { error: "conflict", data: cur && cur.data, version });
  const next = { version: version + 1, updated: new Date().toISOString(), data: { app: data.app || {}, practice: data.practice || {} } };
  await store.set(`progress/${user.id}`, next);
  return json(200, { version: next.version, updated: next.updated });
}

async function deleteAccount(req, user) {
  const body = await readJson(req);
  if (user.pw && !(await verifyPassword(String(body.password || "").slice(0, 200), user.pw)))
    return fail(401, "That password isn't right.");
  const store = await db();
  for (const h of user.sessions || []) await store.del(`sess/${h}`);
  if (user.email) await store.del(`email/${sha256(user.email)}`);
  if (user.github) await store.del(`gh/${user.github}`);
  if (user.google) await store.del(`gg/${user.google}`);
  await store.del(`progress/${user.id}`);
  await store.del(`users/${user.id}`);
  return json(200, { ok: true }, { "set-cookie": clearSession() });
}

async function updateAccount(req, user) {
  const body = await readJson(req);
  const store = await db();
  if (body.name !== undefined) user.name = String(body.name).trim().slice(0, 80);
  if (body.newPassword !== undefined) {
    const np = String(body.newPassword);
    if (np.length < 8 || np.length > 200) return fail(400, "Use 8 to 200 characters for your password.");
    if (user.pw && !(await verifyPassword(String(body.password || "").slice(0, 200), user.pw)))
      return fail(401, "Your current password isn't right.");
    if (!user.email) return fail(400, "Your account has no email address to sign in with.");
    user.pw = await hashPassword(np);
  }
  await store.set(`users/${user.id}`, user);
  return json(200, { user: publicUser(user) });
}

/* ---------------- router ---------------- */
export default async function handler(req, context) {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/api/, "").replace(/\/+$/, "") || "/";
  const method = req.method;
  const ip = clientIp(req, context);

  try {
    // OAuth redirects are plain browser navigations (GET, no custom header).
    const m = path.match(/^\/auth\/(github|google)(\/callback)?$/);
    if (m && method === "GET") return await (m[2] ? oauthCallback(req, ip, m[1]) : oauthStart(req, ip, m[1]));

    const wait = await hit("api", ip);
    if (wait) return tooMany(wait);

    // CSRF: writes must come from our own pages (custom header + same origin).
    if (method !== "GET" && method !== "HEAD") {
      const origin = req.headers.get("origin");
      if (req.headers.get("x-hydra") !== "1" || (origin && origin !== url.origin)) return fail(403, "Forbidden");
    }

    if (path === "/me" && method === "GET") {
      const user = await currentUser(req);
      return json(200, { user: user ? publicUser(user) : null, oauth: { github: configured("github"), google: configured("google") } });
    }
    if (path === "/auth/signup" && method === "POST") return await signup(req, ip);
    if (path === "/auth/login" && method === "POST") return await login(req, ip);
    if (path === "/auth/logout" && method === "POST") {
      await endSession(req);
      return json(200, { ok: true }, { "set-cookie": clearSession() });
    }

    const user = await currentUser(req);
    if (path === "/progress" || path === "/account") {
      if (!user) return fail(401, "Please log in.", {}, { "set-cookie": clearSession() });
      if (path === "/progress" && method === "GET") return await getProgress(user);
      if (path === "/progress" && method === "PUT") return await putProgress(req, user);
      if (path === "/account" && method === "PATCH") return await updateAccount(req, user);
      if (path === "/account" && method === "DELETE") return await deleteAccount(req, user);
      return fail(405, "Method not allowed");
    }
    return fail(404, "Not found");
  } catch (e) {
    if (e.status) return fail(e.status, e.status === 413 ? "That's too much data to save." : "Bad request");
    console.error(e);
    return fail(500, "Something went wrong. Please try again.");
  }
}
