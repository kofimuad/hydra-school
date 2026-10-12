import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { memoryStore, useStore } from "../netlify/lib/store.mjs";
import handler from "../netlify/functions/api.mjs";

const ORIGIN = "https://hydra.example";
let store, ipN = 0, ip;

beforeEach(() => { store = memoryStore(); useStore(store); ip = `10.0.0.${++ipN}`; });

function call(method, path, { body, cookie, headers = {}, raw } = {}) {
  const h = { ...headers };
  if (method !== "GET") { h["x-hydra"] = "1"; h.origin = ORIGIN; }
  if (cookie) h.cookie = cookie;
  if (body !== undefined) h["content-type"] = "application/json";
  return handler(new Request(ORIGIN + "/api" + path, { method, headers: h, body: raw ?? (body !== undefined ? JSON.stringify(body) : undefined) }), { ip });
}
const sessionOf = (res) => (res.headers.get("set-cookie") || "").match(/hs_session=([^;]*)/)?.[1];

test("sign up, me, log out, log in", async () => {
  let r = await call("POST", "/auth/signup", { body: { email: "Ada@Example.com ", password: "correct horse", name: "Ada" } });
  assert.equal(r.status, 201);
  const c = "hs_session=" + sessionOf(r);
  assert.match(r.headers.get("set-cookie"), /HttpOnly; Secure; SameSite=Lax/);
  r = await call("GET", "/me", { cookie: c });
  const me = await r.json();
  assert.equal(me.user.email, "ada@example.com");
  assert.deepEqual(me.user.methods, { password: true, github: false, google: false });
  assert.equal(JSON.stringify(me).includes("scrypt"), false);

  r = await call("POST", "/auth/signup", { body: { email: "ada@example.com", password: "another one" } });
  assert.equal(r.status, 409);

  r = await call("POST", "/auth/logout", { cookie: c });
  assert.equal(r.status, 200);
  assert.equal((await (await call("GET", "/me", { cookie: c })).json()).user, null);

  r = await call("POST", "/auth/login", { body: { email: "ada@example.com", password: "wrong pass" } });
  assert.equal(r.status, 401);
  r = await call("POST", "/auth/login", { body: { email: "ADA@example.com", password: "correct horse" } });
  assert.equal(r.status, 200);
  assert.ok(sessionOf(r));
});

test("validation", async () => {
  assert.equal((await call("POST", "/auth/signup", { body: { email: "nope", password: "12345678" } })).status, 400);
  assert.equal((await call("POST", "/auth/signup", { body: { email: "a@b.co", password: "short" } })).status, 400);
  assert.equal((await call("POST", "/auth/signup", { raw: "{bad" })).status, 400);
});

test("CSRF: writes need the custom header and same origin", async () => {
  const req = (h) => handler(new Request(ORIGIN + "/api/auth/login", { method: "POST", headers: h, body: "{}" }), { ip });
  assert.equal((await req({ origin: ORIGIN })).status, 403);
  assert.equal((await req({ "x-hydra": "1", origin: "https://evil.example" })).status, 403);
  assert.equal((await req({ "x-hydra": "1", origin: ORIGIN })).status, 400);
});

test("progress: auth required, versioning and conflicts", async () => {
  assert.equal((await call("GET", "/progress")).status, 401);
  const c = "hs_session=" + sessionOf(await call("POST", "/auth/signup", { body: { email: "p@x.io", password: "password1" } }));
  let r = await call("GET", "/progress", { cookie: c });
  assert.deepEqual(await r.json(), { data: null, version: 0 });
  const data = { app: { done: { a: "2026-01-01" } }, practice: { tasks: { t1: { code: "int main(void){}", passed: true } } } };
  r = await call("PUT", "/progress", { cookie: c, body: { data, baseVersion: 0 } });
  assert.equal(r.status, 200);
  assert.equal((await r.json()).version, 1);
  r = await call("PUT", "/progress", { cookie: c, body: { data, baseVersion: 0 } });
  assert.equal(r.status, 409);
  const conflict = await r.json();
  assert.equal(conflict.version, 1);
  assert.deepEqual(conflict.data, data);
  r = await call("GET", "/progress", { cookie: c });
  assert.equal((await r.json()).data.practice.tasks.t1.code, "int main(void){}");
  assert.equal((await call("PUT", "/progress", { cookie: c, body: { data: [1], baseVersion: 1 } })).status, 400);
  assert.equal((await call("PUT", "/progress", { cookie: c, raw: JSON.stringify({ data: { app: { x: "y".repeat(2_100_000) } }, baseVersion: 1 }) })).status, 413);
});

test("users can't read each other's progress", async () => {
  const a = "hs_session=" + sessionOf(await call("POST", "/auth/signup", { body: { email: "a@x.io", password: "password1" } }));
  ip = "10.9.9.9";
  const b = "hs_session=" + sessionOf(await call("POST", "/auth/signup", { body: { email: "b@x.io", password: "password1" } }));
  await call("PUT", "/progress", { cookie: a, body: { data: { app: { secret: 1 } }, baseVersion: 0 } });
  assert.deepEqual(await (await call("GET", "/progress", { cookie: b })).json(), { data: null, version: 0 });
});

test("rate limits sign-in attempts per IP and per email", async () => {
  await call("POST", "/auth/signup", { body: { email: "r@x.io", password: "password1" } });
  let last;
  for (let i = 0; i < 12; i++) last = await call("POST", "/auth/login", { body: { email: "r@x.io", password: "bad password" } });
  assert.equal(last.status, 429);
  assert.ok(Number(last.headers.get("retry-after")) > 0);
  // a different IP is still blocked for this email after 8 failures
  ip = "10.200.0.1";
  const r = await call("POST", "/auth/login", { body: { email: "r@x.io", password: "password1" } });
  assert.equal(r.status, 429);
});

test("account update and delete", async () => {
  const c = "hs_session=" + sessionOf(await call("POST", "/auth/signup", { body: { email: "d@x.io", password: "password1" } }));
  await call("PUT", "/progress", { cookie: c, body: { data: { app: {} }, baseVersion: 0 } });
  assert.equal((await call("PATCH", "/account", { cookie: c, body: { newPassword: "password2", password: "nope" } })).status, 401);
  assert.equal((await call("PATCH", "/account", { cookie: c, body: { newPassword: "password2", password: "password1", name: "Dee" } })).status, 200);
  assert.equal((await call("DELETE", "/account", { cookie: c, body: { password: "password1" } })).status, 401);
  assert.equal((await call("DELETE", "/account", { cookie: c, body: { password: "password2" } })).status, 200);
  assert.equal([...store._map.keys()].filter((k) => !k.startsWith("rl/")).length, 0);
  assert.equal((await call("POST", "/auth/login", { body: { email: "d@x.io", password: "password2" } })).status, 401);
});

/* ---------------- OAuth with mocked providers ---------------- */
function mockFetch(profiles) {
  const real = globalThis.fetch;
  globalThis.fetch = async (url, init = {}) => {
    const u = String(url);
    const ok = (b) => new Response(JSON.stringify(b), { status: 200, headers: { "content-type": "application/json" } });
    if (u.startsWith("https://github.com/login/oauth/access_token")) return ok({ access_token: "gh-tok" });
    if (u === "https://api.github.com/user") return ok(profiles.github);
    if (u === "https://api.github.com/user/emails") return ok(profiles.githubEmails);
    if (u === "https://oauth2.googleapis.com/token") {
      assert.ok(String(init.body).includes("code_verifier="));
      return ok({ access_token: "gg-tok" });
    }
    if (u === "https://openidconnect.googleapis.com/v1/userinfo") return ok(profiles.google);
    throw new Error("unexpected fetch " + u);
  };
  return () => { globalThis.fetch = real; };
}
async function oauth(provider, cookie = "") {
  const start = await call("GET", `/auth/${provider}`, { cookie });
  assert.equal(start.status, 302);
  const loc = new URL(start.headers.get("location"));
  const state = loc.searchParams.get("state");
  assert.equal(loc.searchParams.get("redirect_uri"), `${ORIGIN}/api/auth/${provider}/callback`);
  const oc = start.headers.get("set-cookie").match(/hs_oauth=([^;]*)/)[1];
  return call("GET", `/auth/${provider}/callback?code=abc&state=${state}`, { cookie: `hs_oauth=${oc}${cookie ? "; " + cookie : ""}` });
}

test("OAuth: not configured, bad state, sign up, sign in, linking rules", async () => {
  delete process.env.GITHUB_CLIENT_ID;
  assert.match((await call("GET", "/auth/github")).headers.get("location"), /not_configured/);
  Object.assign(process.env, { GITHUB_CLIENT_ID: "id", GITHUB_CLIENT_SECRET: "s", GOOGLE_CLIENT_ID: "gid", GOOGLE_CLIENT_SECRET: "gs" });
  assert.deepEqual((await (await call("GET", "/me")).json()).oauth, { github: true, google: true });
  const restore = mockFetch({
    github: { id: 42, login: "octo", name: "Octo Cat" },
    githubEmails: [{ email: "octo@x.io", primary: true, verified: true }],
    google: { sub: "g-1", email: "octo@x.io", email_verified: true, name: "Octo" },
  });
  try {
    let r = await call("GET", "/auth/github/callback?code=abc&state=forged", { cookie: "hs_oauth=github.real.v" });
    assert.match(r.headers.get("location"), /#login\/state/);

    r = await oauth("github");
    assert.equal(r.headers.get("location"), "/#today");
    const c = "hs_session=" + sessionOf(r);
    let me = (await (await call("GET", "/me", { cookie: c })).json()).user;
    assert.deepEqual(me.methods, { password: false, github: true, google: false });

    // Google with the same verified email joins the same (password-less) account
    r = await oauth("google");
    const c2 = "hs_session=" + sessionOf(r);
    me = (await (await call("GET", "/me", { cookie: c2 })).json()).user;
    assert.deepEqual(me.methods, { password: false, github: true, google: true });

    // password sign-in on an OAuth-only account explains what to do
    r = await call("POST", "/auth/login", { body: { email: "octo@x.io", password: "whatever1" } });
    assert.match((await r.json()).error, /GitHub or Google/);

    // a password account is never auto-linked by email
    await call("POST", "/auth/signup", { body: { email: "pw@x.io", password: "password1" } });
    restore();
    const restore2 = mockFetch({ github: { id: 7 }, githubEmails: [{ email: "pw@x.io", primary: true, verified: true }], google: {} });
    r = await oauth("github");
    assert.match(r.headers.get("location"), /email_exists/);
    // ...but it can be connected from Settings while signed in
    const pc = "hs_session=" + sessionOf(await call("POST", "/auth/login", { body: { email: "pw@x.io", password: "password1" } }));
    r = await oauth("github", pc);
    assert.equal(r.headers.get("location"), "/#settings/linked");
    me = (await (await call("GET", "/me", { cookie: pc })).json()).user;
    assert.deepEqual(me.methods, { password: true, github: true, google: false });
    restore2();
  } finally { restore(); }
});
