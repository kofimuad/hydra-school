/* Accounts and progress sync with the Netlify Functions API (/api/*).
   The app keeps working from localStorage; when you're signed in, the same data is mirrored to your account. */
(function () {
  "use strict";
  const APP_KEY = "hydra-school-v1", PR_KEY = "hydra-practice-v1";
  const OWNER = "hydra-sync-owner", VER = "hydra-sync-version", DIRTY = "hydra-sync-dirty";
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, String(v)); } catch (e) {} },
    del(k) { try { localStorage.removeItem(k); } catch (e) {} },
  };
  const isObj = (x) => x && typeof x === "object" && !Array.isArray(x);
  const parse = (s) => { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } };

  const S = {
    available: null, // null = checking, false = no backend (opened as a file or on static hosting)
    user: null,
    oauth: { github: false, google: false },
    status: "checking", // checking | unavailable | guest | syncing | pending | saved | offline | error
    message: "",
    updated: null,
    fresh: false, // set after the first sync of an account that has no saved progress yet
  };
  const listeners = [];
  const emit = () => listeners.forEach((fn) => { try { fn(S); } catch (e) { console.error(e); } });
  const setStatus = (status, message) => { S.status = status; S.message = message || ""; emit(); };

  async function api(method, path, body, opts = {}) {
    const init = { method, credentials: "same-origin", headers: {}, keepalive: !!opts.keepalive };
    if (method !== "GET") init.headers["x-hydra"] = "1";
    if (body !== undefined) { init.headers["content-type"] = "application/json"; init.body = JSON.stringify(body); }
    try {
      const res = await fetch("/api" + path, init);
      const data = (res.headers.get("content-type") || "").includes("application/json") ? await res.json() : null;
      return { ok: res.ok, status: res.status, data: data || {} };
    } catch (e) {
      return { ok: false, status: 0, data: { error: "You're offline. Changes will sync when you reconnect." } };
    }
  }

  /* ---------------- local data ---------------- */
  const readLocal = () => ({ app: parse(ls.get(APP_KEY)) || {}, practice: parse(ls.get(PR_KEY)) || {} });
  function writeLocal(d) {
    const a = isObj(d.app) && Object.keys(d.app).length ? JSON.stringify(d.app) : null;
    const p = isObj(d.practice) && Object.keys(d.practice).length ? JSON.stringify(d.practice) : null;
    if (a === ls.get(APP_KEY) && p === ls.get(PR_KEY)) return;
    a ? ls.set(APP_KEY, a) : ls.del(APP_KEY);
    p ? ls.set(PR_KEY, p) : ls.del(PR_KEY);
    if (window.Practice && window.Practice._reload) window.Practice._reload();
    if (window.App && window.App.reload) window.App.reload();
  }
  const nonEmpty = (o) => isObj(o) && Object.keys(o).length > 0;
  const hasContent = (d) => nonEmpty(d.app && d.app.done) ||
    ["quiz", "tasks", "jp", "chars"].some((k) => nonEmpty(d.practice && d.practice[k]));

  // Combine two copies of the progress. Ticks and passed tasks are never lost;
  // otherwise this device's copy wins, except schedule settings, where the account's copy wins.
  function deepMerge(s, l) {
    if (!isObj(s) || !isObj(l)) return l === undefined ? s : l;
    const out = Object.assign({}, s);
    Object.keys(l).forEach((k) => { out[k] = deepMerge(s[k], l[k]); });
    if (s.passed === true && l.passed !== true) { out.passed = true; if ("code" in s) out.code = s.code; }
    if (typeof s.n === "number" && typeof l.n === "number" && s.n > l.n) { out.n = s.n; out.miss = s.miss; }
    return out;
  }
  function mergeData(srv, loc) {
    srv = srv || {}; loc = loc || {};
    const sa = srv.app || {}, la = loc.app || {};
    const done = Object.assign({}, la.done || {});
    Object.entries(sa.done || {}).forEach(([k, v]) => { if (!done[k] || v < done[k]) done[k] = v; });
    const app = Object.assign({}, la, sa, { done });
    return { app, practice: deepMerge(srv.practice || {}, loc.practice || {}) };
  }

  /* ---------------- sync ---------------- */
  let timer = null, inflight = null, again = false, gen = 0;

  async function pull() {
    setStatus("syncing");
    const r = await api("GET", "/progress");
    if (!r.ok) {
      if (r.status === 401) { S.user = null; return setStatus("guest"); }
      return setStatus(r.status ? "error" : "offline", r.data.error);
    }
    const srv = r.data, local = readLocal(), owner = ls.get(OWNER);
    let next = local, needPush = false;
    if (owner === S.user.id) {
      const dirty = ls.get(DIRTY) === "1", lv = +ls.get(VER) || 0;
      if (dirty && lv === srv.version) needPush = true;
      else if (dirty) { next = mergeData(srv.data, local); needPush = true; }
      else if (srv.data) next = srv.data;
      else needPush = hasContent(local);
    } else if (!owner) {
      // First sign-in on this device: keep anything done as a guest.
      if (hasContent(local)) { next = mergeData(srv.data, local); needPush = true; } else if (srv.data) next = srv.data;
    } else {
      next = srv.data || {}; // another account's data was on this device
    }
    ls.set(OWNER, S.user.id); ls.set(VER, srv.version);
    S.fresh = !srv.data; // nothing saved yet: a brand-new account
    writeLocal(next);
    S.updated = srv.updated || null;
    if (needPush) { ls.set(DIRTY, "1"); await push(); } else { ls.del(DIRTY); setStatus("saved"); }
  }

  function push(keepalive) {
    clearTimeout(timer);
    if (!S.user || ls.get(OWNER) !== S.user.id) return Promise.resolve();
    if (inflight) { again = true; return inflight; }
    const g = gen;
    setStatus("syncing");
    inflight = (async () => {
      for (let tries = 0; tries < 3; tries++) {
        const local = readLocal();
        const r = await api("PUT", "/progress", { data: local, baseVersion: +ls.get(VER) || 0 }, { keepalive: keepalive && JSON.stringify(local).length < 60000 });
        if (r.ok) {
          ls.set(VER, r.data.version); S.updated = r.data.updated;
          if (g === gen) ls.del(DIRTY);
          return setStatus("saved");
        }
        if (r.status === 409) { ls.set(VER, r.data.version); writeLocal(mergeData(r.data.data, local)); continue; }
        if (r.status === 401) { S.user = null; return setStatus("guest", "You were signed out. Log in again to keep syncing."); }
        return setStatus(r.status ? "error" : "offline", r.data.error);
      }
      setStatus("error", "Couldn't save your progress. Try again in a moment.");
    })().finally(() => { inflight = null; if (again) { again = false; push(); } });
    return inflight;
  }

  function changed() {
    // Not signed in right now but this device holds an account's data (offline, session expired):
    // remember that it changed so the next sign-in merges instead of overwriting it.
    if (!S.user) { if (ls.get(OWNER)) { gen++; ls.set(DIRTY, "1"); } return; }
    gen++;
    ls.set(DIRTY, "1");
    if (S.status !== "syncing") setStatus("pending");
    clearTimeout(timer);
    timer = setTimeout(push, 2000);
  }

  async function signedIn(user) {
    S.user = user;
    emit();
    await pull();
  }

  function clearLocal() {
    [APP_KEY, PR_KEY, OWNER, VER, DIRTY].forEach(ls.del);
    if (window.Practice && window.Practice._reload) window.Practice._reload();
    if (window.App && window.App.reload) window.App.reload();
  }

  /* ---------------- public API ---------------- */
  const Sync = {
    state: S,
    on(fn) { listeners.push(fn); },
    changed,
    pending: () => ls.get(DIRTY) === "1",
    flush: () => push(),
    retry: () => (S.user ? pull() : Promise.resolve()),
    async login(email, password) {
      const r = await api("POST", "/auth/login", { email, password });
      if (r.ok) await signedIn(r.data.user);
      return r;
    },
    async signup(email, password, name) {
      const r = await api("POST", "/auth/signup", { email, password, name });
      if (r.ok) await signedIn(r.data.user);
      return r;
    },
    async logout() {
      if (Sync.pending()) await push();
      await api("POST", "/auth/logout");
      S.user = null;
      clearLocal();
      setStatus("guest");
    },
    async updateAccount(fields) {
      const r = await api("PATCH", "/account", fields);
      if (r.ok) { S.user = r.data.user; emit(); }
      return r;
    },
    async deleteAccount(password) {
      const r = await api("DELETE", "/account", { password });
      if (r.ok) { S.user = null; clearLocal(); setStatus("guest"); }
      return r;
    },
  };
  window.Sync = Sync;

  async function init() {
    const r = await api("GET", "/me");
    if (!r.ok || !("user" in r.data)) { S.available = false; return setStatus("unavailable"); }
    S.available = true;
    S.oauth = r.data.oauth || S.oauth;
    if (r.data.user) await signedIn(r.data.user); else setStatus("guest");
  }
  window.addEventListener("pagehide", () => { if (S.user && Sync.pending()) push(true); });
  window.addEventListener("online", () => { if (S.user && (Sync.pending() || S.status === "offline")) pull(); });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
