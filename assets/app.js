/* Hydra School – study planner. Plain JS, no build step. All progress lives in localStorage. */
(function () {
  "use strict";

  const { PROJECTS, TRACKS } = window.CURRICULUM;
  const JP = window.JAPANESE;
  const byId = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));
  TRACKS.forEach((t) => t.projects.forEach((id) => { if (!byId[id]) console.warn("Unknown project id", id); }));

  const STORE_KEY = "hydra-school-v1";
  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  /* ---------------- dates (local, as YYYY-MM-DD strings) ---------------- */
  const pad = (n) => String(n).padStart(2, "0");
  const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const fromISO = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d, 12); };
  const addDays = (s, n) => { const d = fromISO(s); d.setDate(d.getDate() + n); return toISO(d); };
  const todayISO = () => toISO(new Date());
  const fmt = (s, opts = {}) => {
    const d = fromISO(s);
    const base = `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
    return opts.year ? `${base} ${d.getFullYear()}` : base;
  };
  const fmtMonth = (s) => { const d = fromISO(s); return `${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
  const mondayOf = (s) => { const d = fromISO(s); return addDays(s, -((d.getDay() + 6) % 7)); };

  /* ---------------- state ---------------- */
  const defaultState = () => ({
    done: {}, // key -> ISO date it was ticked
    settings: {
      start: todayISO(),
      studyDays: [true, true, true, true, true, true, true],
      tracks: [
        { id: "backend", on: true }, { id: "ml", on: true },
        { id: "lowlevel", on: true }, { id: "frontend", on: true },
      ],
      japanese: true,
    },
    anchors: { code: [], jp: [] }, // reschedules: {key, date}
  });

  let state;
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      state = raw ? JSON.parse(raw) : defaultState();
    } catch (e) { state = defaultState(); }
    const d = defaultState();
    state.done = state.done || {};
    state.settings = Object.assign(d.settings, state.settings || {});
    state.anchors = Object.assign(d.anchors, state.anchors || {});
    // keep any newly added tracks
    TRACKS.filter((t) => !t.core && !state.settings.tracks.some((x) => x.id === t.id))
      .forEach((t) => state.settings.tracks.push({ id: t.id, on: false }));
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { toast("Couldn't save – is browser storage blocked?"); }
  }

  /* ---------------- schedule building ---------------- */
  function activeTracks() {
    const core = TRACKS.filter((t) => t.core);
    const rest = state.settings.tracks.filter((x) => x.on).map((x) => TRACKS.find((t) => t.id === x.id)).filter(Boolean);
    return [...core, ...rest];
  }

  function sessionPlan(p, i) {
    if (p.plan && p.plan[i]) return p.plan[i];
    const n = p.days;
    if (n === 1) return "Read the objectives & resources, then complete all the tasks";
    if (i === 0) return "Read the learning objectives & resources, then start the first tasks";
    if (i === n - 1) return "Finish the remaining (and advanced) tasks, push to GitHub, and check you can explain every objective without notes";
    return `Keep going through the tasks (session ${i + 1} of ${n}) – look things up instead of copying`;
  }

  function buildCode() {
    const seen = new Set(), list = [];
    for (const t of activeTracks()) {
      for (const pid of t.projects) {
        if (seen.has(pid) || !byId[pid]) continue;
        seen.add(pid);
        const p = byId[pid];
        for (let i = 0; i < p.days; i++) list.push({ key: `${pid}:${i}`, pid, i, n: p.days, track: t.id, kind: "code" });
      }
    }
    return list;
  }
  function buildJp() {
    if (!state.settings.japanese) return [];
    return JP.days.map((d, i) => ({ key: `jp:${i}`, i, n: JP.days.length, day: d, kind: "jp" }));
  }

  const isStudyDay = (s) => state.settings.studyDays[fromISO(s).getDay()];
  function nextStudyDay(s) {
    if (!state.settings.studyDays.some(Boolean)) return s;
    while (!isStudyDay(s)) s = addDays(s, 1);
    return s;
  }

  function assignDates(list, anchors) {
    const anchorAt = new Map(anchors.map((a) => [a.key, a.date]));
    let cursor = nextStudyDay(state.settings.start);
    for (const s of list) {
      if (anchorAt.has(s.key)) cursor = nextStudyDay(anchorAt.get(s.key));
      s.date = cursor;
      s.done = !!state.done[s.key];
      cursor = nextStudyDay(addDays(cursor, 1));
    }
    return list;
  }

  let CODE = [], JPD = [];
  function rebuild() {
    CODE = assignDates(buildCode(), state.anchors.code);
    JPD = assignDates(buildJp(), state.anchors.jp);
  }

  const firstUndone = (list) => list.find((s) => !s.done);
  const behindCount = (list) => { const t = todayISO(); return list.filter((s) => !s.done && s.date < t).length; };

  function toggle(key, value) {
    if (value === undefined) value = !state.done[key];
    if (value) state.done[key] = todayISO(); else delete state.done[key];
    save(); rebuild(); render();
  }

  function reschedule(kind) {
    const list = kind === "code" ? CODE : JPD;
    const next = firstUndone(list);
    if (!next) return;
    state.anchors[kind] = state.anchors[kind].filter((a) => a.key !== next.key);
    state.anchors[kind].push({ key: next.key, date: todayISO() });
    save(); rebuild(); render();
    toast("Plan moved: the rest of the schedule now starts today");
  }

  function streak() {
    const days = new Set(Object.values(state.done));
    let s = todayISO(), n = 0;
    if (!days.has(s)) s = addDays(s, -1);
    while (days.has(s)) { n++; s = addDays(s, -1); }
    return n;
  }

  /* ---------------- helpers ---------------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const link = ([label, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a>`;
  const areaChip = (a) => `<span class="chip area" style="--c:var(--a-${a})">${esc(a === "dsa" ? "algorithms" : a)}</span>`;
  const pct = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  const bar = (p, c) => `<div class="bar" style="${c ? `--c:${c}` : ""}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100"><span style="width:${p}%"></span></div>`;
  function repoUrl(p) {
    if (!p.repo) return null;
    return `https://github.com/${p.repo}${p.path ? `/tree/HEAD/${p.path}` : ""}`;
  }
  function searchUrl(p) {
    const q = p.path ? p.path.split("/").pop() : p.repo ? p.repo.split("/")[1] : p.title;
    return `https://github.com/search?q=${encodeURIComponent(q)}&type=${p.path ? "code" : "repositories"}`;
  }
  function projectLinks(p) {
    const out = [];
    const r = repoUrl(p);
    if (r) out.push(`<a class="btn sm" href="${r}" target="_blank" rel="noopener">📄 Tasks (reference README)</a>`);
    out.push(`<a class="btn sm" href="${searchUrl(p)}" target="_blank" rel="noopener">🔎 Other students' versions</a>`);
    return out.join("");
  }
  const trackOf = (id) => TRACKS.find((t) => t.id === id);

  let toastTimer;
  function toast(msg) {
    let el = document.querySelector(".toast");
    if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  /* ---------------- views ---------------- */
  const views = {};

  views.today = () => {
    const t = todayISO();
    const code = firstUndone(CODE), jp = firstUndone(JPD);
    const cBehind = behindCount(CODE), jBehind = behindCount(JPD);
    const restDay = !isStudyDay(t);
    const doneToday = [...CODE, ...JPD].filter((s) => state.done[s.key] === t).length;
    const greeting = (() => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening"; })();

    let html = `<h1>${greeting} 👋</h1><p class="lead">${fmt(t, { year: true })}${restDay ? " · rest day (nothing scheduled — catch up or relax)" : ""}${doneToday ? ` · ${doneToday} session${doneToday > 1 ? "s" : ""} done today ✅` : ""}</p>`;

    if (cBehind + jBehind > 0) {
      html += `<div class="banner warn"><p>You're behind plan: ${cBehind ? `${cBehind} coding session${cBehind > 1 ? "s" : ""}` : ""}${cBehind && jBehind ? " and " : ""}${jBehind ? `${jBehind} Japanese day${jBehind > 1 ? "s" : ""}` : ""}. No stress — just carry on, or shift the plan so it starts from today.</p>
        <div class="btn-row">${cBehind ? `<button class="btn sm" data-resched="code">Shift coding plan</button>` : ""}${jBehind ? `<button class="btn sm" data-resched="jp">Shift Japanese plan</button>` : ""}</div></div>`;
    }

    html += `<div class="grid-2">`;
    // Coding card
    if (code) {
      const p = byId[code.pid], tr = trackOf(code.track);
      const ahead = code.date > t;
      html += `<section class="card today-card" style="--card-accent:var(--a-${p.area})">
        <div class="eyebrow">💻 Coding · 2 hours ${areaChip(p.area)}<span class="chip">${esc(tr.short)}</span>${ahead ? `<span class="chip ok">ahead · planned ${fmt(code.date)}</span>` : code.date < t ? `<span class="chip warn">planned ${fmt(code.date)}</span>` : ""}</div>
        <div><div class="big-title">${esc(p.title)}</div><div class="muted small">Session ${code.i + 1} of ${code.n}</div></div>
        <div class="session-task">${esc(sessionPlan(p, code.i))}</div>
        ${code.i === 0 ? `<div><h4 class="eyebrow" style="margin:0 0 6px">By the end you should know</h4><ul class="objectives">${p.learn.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></div>` : ""}
        <div><h4 class="eyebrow" style="margin:0 0 6px">Resources</h4><ul class="links">${p.res.map((r) => `<li>${link(r)}</li>`).join("")}</ul></div>
        <div class="btn-row">${projectLinks(p)}</div>
        <div class="btn-row"><button class="btn primary" data-toggle="${code.key}">✓ Mark session done</button><a class="btn" href="#curriculum/${encodeURIComponent(p.id)}">Project page</a></div>
        <p class="tip">Open the reference README for the exact task list. Do every task yourself first — only peek at the solution code when you're truly stuck, then rewrite it in your own words.</p>
      </section>`;
    } else {
      html += `<section class="card today-card"><div class="big-title">🎓 All coding sessions complete!</div><p>Incredible work. Turn on another specialization in Settings to keep going.</p></section>`;
    }
    // Japanese card
    if (state.settings.japanese) {
      if (jp) {
        const ahead = jp.date > t;
        html += `<section class="card today-card" style="--card-accent:var(--a-jp)">
          <div class="eyebrow">🇯🇵 Japanese · 1 hour <span class="chip">${esc(jp.day.stage)}</span>${ahead ? `<span class="chip ok">ahead · planned ${fmt(jp.date)}</span>` : jp.date < t ? `<span class="chip warn">planned ${fmt(jp.date)}</span>` : ""}</div>
          <div><div class="big-title">${esc(jp.day.title)}</div><div class="muted small">Day ${jp.i + 1} of ${jp.n}</div></div>
          <div class="session-task"><ul>
            <li>15 min · Anki reviews${jp.i >= 6 ? " + 10 new Kaishi cards" : ""}</li>
            ${jp.day.stage === "Kana" ? `<li>45 min · ${jp.day.tasks.map(esc).join(". Then: ")}</li>` : jp.day.tasks.map((x, k) => `<li>${k === 0 ? "30 min · " : "15 min · "}${esc(x)}</li>`).join("")}
          </ul></div>
          <div><h4 class="eyebrow" style="margin:0 0 6px">Resources</h4><ul class="links">${jp.day.res.map((r) => `<li>${link(r)}</li>`).join("")}</ul></div>
          <div class="btn-row"><button class="btn primary" data-toggle="${jp.key}">✓ Mark day done</button><a class="btn" href="#japanese">Japanese plan</a></div>
        </section>`;
      } else {
        html += `<section class="card today-card"><div class="big-title">🎌 Japanese plan complete — おめでとう!</div></section>`;
      }
    }
    html += `</div>`;

    // Up next
    const upcoming = CODE.filter((s) => !s.done).slice(1, 6);
    if (upcoming.length) {
      html += `<h2>Coming up</h2><div class="stack">${upcoming.map((s) => {
        const p = byId[s.pid];
        return `<div class="card" style="padding:12px 16px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
          <div><div style="font-weight:600">${esc(p.title)} <span class="muted small">· ${s.i + 1}/${s.n}</span></div><div class="muted small">${esc(sessionPlan(p, s.i))}</div></div>
          <span class="chip">${fmt(s.date)}</span></div>`;
      }).join("")}</div>`;
    }
    return html;
  };

  let planWeekOffset = null;
  views.plan = () => {
    const all = [...CODE, ...JPD];
    if (!all.length) return `<h1>Schedule</h1><p class="lead">Nothing scheduled.</p>`;
    const byDate = new Map();
    for (const s of all) { if (!byDate.has(s.date)) byDate.set(s.date, []); byDate.get(s.date).push(s); }
    const startMon = mondayOf(state.settings.start);
    const lastDate = all.reduce((m, s) => (s.date > m ? s.date : m), state.settings.start);
    const totalWeeks = Math.floor((fromISO(mondayOf(lastDate)) - fromISO(startMon)) / (7 * 864e5)) + 1;
    const curWeek = Math.max(0, Math.min(totalWeeks - 1, Math.floor((fromISO(mondayOf(todayISO())) - fromISO(startMon)) / (7 * 864e5))));
    if (planWeekOffset === null) planWeekOffset = curWeek;
    planWeekOffset = Math.max(0, Math.min(totalWeeks - 1, planWeekOffset));
    const PER = 2;
    const t = todayISO();

    let html = `<h1>Schedule</h1><p class="lead">Your week-by-week plan. Coding: 2 h/day, Japanese: 1 h/day. Dates move if you shift the plan from the Today page. Finishes around <strong>${fmtMonth(lastDate)}</strong> (${totalWeeks} weeks).</p>`;
    const pager = `<div class="pager">
      <button class="btn sm" data-week="${planWeekOffset - PER}" ${planWeekOffset <= 0 ? "disabled" : ""}>← Earlier</button>
      <div class="btn-row"><button class="btn sm" data-week="${curWeek}">This week</button>
      <select class="btn sm" data-weekjump aria-label="Jump to month">${monthOptions(startMon, totalWeeks)}</select></div>
      <button class="btn sm" data-week="${planWeekOffset + PER}" ${planWeekOffset + PER >= totalWeeks ? "disabled" : ""}>Later →</button></div>`;
    html += pager;

    for (let w = planWeekOffset; w < Math.min(totalWeeks, planWeekOffset + PER); w++) {
      const mon = addDays(startMon, w * 7);
      const weekSessions = [];
      for (let d = 0; d < 7; d++) weekSessions.push(...(byDate.get(addDays(mon, d)) || []));
      const wDone = weekSessions.filter((s) => s.done).length;
      html += `<section class="week"><div class="week-head"><h3>Week ${w + 1} <span class="muted small">· ${fmt(mon)} – ${fmt(addDays(mon, 6))}</span></h3><span class="chip ${wDone === weekSessions.length && wDone ? "ok" : ""}">${wDone}/${weekSessions.length} done</span></div>`;
      for (let d = 0; d < 7; d++) {
        const date = addDays(mon, d);
        const items = byDate.get(date) || [];
        const code = items.filter((s) => s.kind === "code"), jp = items.filter((s) => s.kind === "jp");
        const rest = !items.length;
        html += `<div class="day-row ${date === t ? "today" : ""} ${rest ? "rest" : ""}">
          <div class="day-date">${fmt(date)}<span class="muted">${date === t ? "Today" : rest ? "Rest" : ""}</span></div>
          <div class="day-cell">${code.map((s) => { const p = byId[s.pid]; return checkRow(s.key, s.done, `<span class="ptitle">${esc(p.title)}</span> <span class="sub">${s.i + 1}/${s.n}</span><div class="sub">${esc(sessionPlan(p, s.i))}</div>`); }).join("") || (rest ? "" : `<span class="muted small">—</span>`)}</div>
          <div class="day-cell">${jp.map((s) => checkRow(s.key, s.done, `<span class="ptitle">🇯🇵 ${esc(s.day.title)}</span><div class="sub">${esc(s.day.tasks[0])}</div>`)).join("")}</div>
        </div>`;
      }
      html += `</section>`;
    }
    return html + pager;
  };
  function monthOptions(startMon, totalWeeks) {
    let out = `<option value="">Jump to…</option>`, last = "";
    for (let w = 0; w < totalWeeks; w++) {
      const m = fmtMonth(addDays(startMon, w * 7));
      if (m !== last) { out += `<option value="${w}" ${w === planWeekOffset ? "selected" : ""}>${m}</option>`; last = m; }
    }
    return out;
  }
  const checkRow = (key, done, label) => `<label class="check ${done ? "is-done" : ""}"><input type="checkbox" data-check="${key}" ${done ? "checked" : ""}><span class="txt">${label}</span></label>`;

  views.curriculum = (focusId) => {
    const sessionsByPid = {};
    CODE.forEach((s) => (sessionsByPid[s.pid] = sessionsByPid[s.pid] || []).push(s));
    const shown = new Set();
    let html = `<h1>Curriculum</h1><p class="lead">Every project in order, with what you'll learn, free resources, and a link to a public repo whose README lists the real ALX/Holberton tasks. Projects shared between tracks (e.g. ES6 in Backend and Frontend) appear once.</p>`;
    for (const t of activeTracks()) {
      const pids = t.projects.filter((id) => byId[id] && !shown.has(id));
      pids.forEach((id) => shown.add(id));
      const ss = pids.flatMap((id) => sessionsByPid[id] || []);
      const d = ss.filter((s) => s.done).length;
      const from = ss[0] && ss[0].date, to = ss.length && ss[ss.length - 1].date;
      html += `<section class="track"><div class="track-head"><div><h2>${esc(t.name)}</h2><div class="muted small" style="max-width:70ch">${esc(t.blurb)}</div></div>
        <div style="min-width:min(100%,280px)"><div class="small muted" style="display:flex;justify-content:space-between;gap:12px;margin-bottom:6px"><span>${pct(d, ss.length)}% · ${pids.length} projects</span><span>${from ? `${fmtMonth(from)} → ${fmtMonth(to)}` : ""}</span></div>${bar(pct(d, ss.length))}</div></div>`;
      for (const id of pids) {
        const p = byId[id], s = sessionsByPid[id] || [];
        const pd = s.filter((x) => x.done).length, all = pd === s.length && s.length > 0;
        html += `<details class="proj ${all ? "is-done" : ""}" id="p-${esc(id)}" ${focusId === id ? "open" : ""}>
          <summary><div class="proj-title">${all ? `<span class="tick">✔</span>` : ""}${esc(p.title)} ${areaChip(p.area)}</div>
          <span class="chip">${p.days} session${p.days > 1 ? "s" : ""}</span>
          <div class="proj-meta">${bar(pct(pd, s.length), `var(--a-${p.area})`)}<span>${pd}/${s.length}</span>${s.length ? `<span>· ${fmt(s[0].date)}${s.length > 1 ? ` → ${fmt(s[s.length - 1].date)}` : ""}</span>` : ""}</div></summary>
          <div class="proj-body">
            <div><h4>You'll learn</h4><ul class="objectives">${p.learn.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
              <h4 style="margin-top:14px">Resources</h4><ul class="links">${p.res.map((r) => `<li>${link(r)}</li>`).join("")}</ul>
              <div class="btn-row" style="margin-top:14px">${projectLinks(p)}</div></div>
            <div><h4>Sessions</h4>${s.map((x) => checkRow(x.key, x.done, `${esc(sessionPlan(p, x.i))} <span class="muted small">· ${fmt(x.date)}</span>`)).join("")}
              <div class="btn-row" style="margin-top:8px"><button class="btn sm" data-markall="${esc(id)}" data-val="${all ? 0 : 1}">${all ? "Un-mark all" : "Mark whole project done"}</button></div></div>
          </div></details>`;
      }
      html += `</section>`;
    }
    return html;
  };

  views.japanese = () => {
    if (!state.settings.japanese) return `<h1>Japanese</h1><p class="lead">The Japanese track is turned off. Turn it on in <a href="#settings">Settings</a>.</p>`;
    const d = JPD.filter((s) => s.done).length;
    const stages = [];
    for (const s of JPD) {
      let st = stages[stages.length - 1];
      if (!st || st.name !== s.day.stage) { st = { name: s.day.stage, items: [] }; stages.push(st); }
      st.items.push(s);
    }
    let html = `<h1>Japanese <span class="jp muted" style="font-weight:500">日本語</span></h1>
      <p class="lead">One hour a day, from zero to roughly JLPT N4, using only free material: kana first, then the Japan Foundation's IRODORI course (the official A1–A2 textbook, free PDFs + audio), with Anki vocabulary and plenty of listening.</p>
      <div class="stat-row"><div class="stat"><div class="v">${d}/${JPD.length}</div><div class="l">days done</div></div>
      <div class="stat"><div class="v">${pct(d, JPD.length)}%</div><div class="l">complete</div></div>
      <div class="stat"><div class="v">${JPD.length ? fmtMonth(JPD[JPD.length - 1].date) : "–"}</div><div class="l">planned finish</div></div></div>
      <div class="card"><h3>Your daily hour</h3><ul class="objectives">
        <li><strong>15 min – Anki.</strong> Do your reviews every day, even on busy days. From day 7, add 10 new cards a day from the Kaishi 1.5k deck.</li>
        <li><strong>30 min – Main lesson.</strong> Kana in weeks 1–2, then IRODORI lessons. Always listen to the audio and say things out loud.</li>
        <li><strong>15 min – Listening/reading.</strong> NHK Easy Japanese lessons, Comprehensible Japanese videos, and later NHK News Web Easy.</li></ul>
        <p class="tip" style="margin-top:12px">First, download the IRODORI Starter textbook + audio from the IRODORI site (free, no account needed).</p></div>
      <h2>Stages</h2><div class="stack">`;
    for (const st of stages) {
      const sd = st.items.filter((x) => x.done).length;
      html += `<details class="proj"><summary><div class="proj-title">${sd === st.items.length ? `<span class="tick">✔</span>` : ""}${esc(st.name)}</div><span class="chip">${st.items.length} day${st.items.length > 1 ? "s" : ""}</span>
        <div class="proj-meta">${bar(pct(sd, st.items.length), "var(--a-jp)")}<span>${sd}/${st.items.length}</span><span>· ${fmt(st.items[0].date)} → ${fmt(st.items[st.items.length - 1].date)}</span></div></summary>
        <div style="padding:4px 16px 16px">${st.items.map((x) => checkRow(x.key, x.done, `<strong>${esc(x.day.title)}</strong> <span class="muted small">· ${fmt(x.date)}</span><div class="small muted">${x.day.tasks.map(esc).join(" · ")}</div>`)).join("")}</div></details>`;
    }
    html += `</div><h2>Free resources</h2><div class="grid-3">${JP.resources.map((g) => `<div class="card"><h3>${esc(g.group)}</h3><ul class="links">${g.items.map((r) => `<li>${link(r)}</li>`).join("")}</ul></div>`).join("")}</div>`;
    return html;
  };

  views.settings = () => {
    const s = state.settings;
    return `<h1>Settings</h1><p class="lead">Changes recalculate every date instantly. Your ticks are kept.</p>
      <div class="card">
        <div class="field"><label for="start">Start date</label><input type="date" id="start" value="${s.start}"></div>
        <div class="field"><label>Study days</label><div class="daypick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<label><input type="checkbox" data-sday="${d}" ${s.studyDays[d] ? "checked" : ""}>${WEEKDAYS[d]}</label>`).join("")}</div>
          <span class="muted small">Untick a day to make it a rest day (applies to both coding and Japanese).</span></div>
        <div class="field"><label>Specializations (in the order you'll do them, after Foundations)</label>
          <ul class="order-list">${s.tracks.map((x, i) => { const t = trackOf(x.id); return t ? `<li><input class="switch" type="checkbox" data-track="${x.id}" ${x.on ? "checked" : ""} aria-label="Include ${esc(t.name)}"><span class="name">${esc(t.name)}</span>
            <button class="btn sm" data-move="${i}" data-dir="-1" ${i === 0 ? "disabled" : ""} aria-label="Move up">↑</button><button class="btn sm" data-move="${i}" data-dir="1" ${i === s.tracks.length - 1 ? "disabled" : ""} aria-label="Move down">↓</button></li>` : ""; }).join("")}</ul></div>
        <div class="field"><label class="check"><input type="checkbox" id="jp-on" ${s.japanese ? "checked" : ""}><span>Include the Japanese track (1 h/day)</span></label></div>
        <div class="field"><label for="theme">Theme</label><select id="theme"><option value="">Match my device</option><option value="light">Light</option><option value="dark">Dark</option></select></div>
      </div>
      <h2>Backup</h2>
      <div class="card"><p class="muted" style="margin-top:0">Progress is stored only in this browser. Export a backup now and then (or to move to another device).</p>
        <div class="btn-row"><button class="btn" id="export">⬇ Export progress</button><label class="btn">⬆ Import progress<input type="file" id="import" accept="application/json" hidden></label>
        <button class="btn" id="reset-anchors">Undo all plan shifts</button><button class="btn" id="reset" style="color:var(--warn)">Reset everything</button></div></div>
      <h2>About</h2><div class="card small muted"><p style="margin-top:0">Curriculum order follows the ALX Software Engineering programme (built on Holberton School's). The official task pages are on the ALX/Holberton intranet, which needs a login, so each project links to a public student repo whose README lists the tasks. Session counts are estimates for 2-hour days.</p></div>`;
  };

  /* ---------------- render & routing ---------------- */
  function route() {
    const [v, arg] = (location.hash.slice(1) || "today").split("/");
    return { view: views[v] ? v : "today", arg: arg && decodeURIComponent(arg) };
  }
  function render() {
    const { view, arg } = route();
    const el = document.getElementById("view");
    const y = window.scrollY;
    el.innerHTML = views[view](arg);
    document.querySelectorAll("#nav a").forEach((a) => a.classList.toggle("active", a.dataset.view === view));
    renderSide();
    if (view === "settings") { const th = document.getElementById("theme"); if (th) th.value = document.documentElement.dataset.theme || ""; }
    if (render.lastView === view) window.scrollTo(0, y);
    else if (arg) { const t = document.getElementById("p-" + arg); if (t) t.scrollIntoView({ block: "start" }); }
    else window.scrollTo(0, 0);
    render.lastView = view;
  }
  function renderSide() {
    const cd = CODE.filter((s) => s.done).length, jd = JPD.filter((s) => s.done).length;
    const st = streak();
    document.getElementById("side-stats").innerHTML = `
      <div class="side-stat"><div class="lbl"><span>💻 Coding</span><span>${pct(cd, CODE.length)}%</span></div>${bar(pct(cd, CODE.length))}</div>
      ${state.settings.japanese ? `<div class="side-stat"><div class="lbl"><span>🇯🇵 Japanese</span><span>${pct(jd, JPD.length)}%</span></div>${bar(pct(jd, JPD.length), "var(--a-jp)")}</div>` : ""}
      <div class="side-stat"><div class="lbl"><span>🔥 Streak</span><span>${st} day${st === 1 ? "" : "s"}</span></div></div>`;
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-toggle],[data-resched],[data-week],[data-markall],[data-move],#export,#reset,#reset-anchors");
    if (!b) return;
    if (b.dataset.toggle) toggle(b.dataset.toggle);
    else if (b.dataset.resched) reschedule(b.dataset.resched);
    else if (b.dataset.week !== undefined) { planWeekOffset = +b.dataset.week; render(); }
    else if (b.dataset.markall) {
      const v = b.dataset.val === "1";
      CODE.filter((s) => s.pid === b.dataset.markall).forEach((s) => { if (v) state.done[s.key] = state.done[s.key] || todayISO(); else delete state.done[s.key]; });
      save(); rebuild(); render();
    } else if (b.dataset.move) {
      const i = +b.dataset.move, j = i + +b.dataset.dir, tr = state.settings.tracks;
      [tr[i], tr[j]] = [tr[j], tr[i]]; save(); rebuild(); render();
    } else if (b.id === "export") {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `hydra-school-backup-${todayISO()}.json`; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } else if (b.id === "reset-anchors") {
      state.anchors = { code: [], jp: [] }; save(); rebuild(); render(); toast("Back to the original plan dates");
    } else if (b.id === "reset") {
      if (confirm("Delete ALL progress and settings? This can't be undone (export a backup first).")) { state = defaultState(); save(); rebuild(); render(); }
    }
  });

  document.addEventListener("change", (e) => {
    const el = e.target;
    if (el.dataset.check) toggle(el.dataset.check, el.checked);
    else if (el.id === "start" && el.value) { state.settings.start = el.value; state.anchors = { code: [], jp: [] }; planWeekOffset = null; save(); rebuild(); render(); toast("Start date updated"); }
    else if (el.dataset.sday !== undefined) {
      state.settings.studyDays[+el.dataset.sday] = el.checked;
      if (!state.settings.studyDays.some(Boolean)) { state.settings.studyDays[+el.dataset.sday] = true; toast("Keep at least one study day"); }
      save(); rebuild(); render();
    } else if (el.dataset.track) { state.settings.tracks.find((x) => x.id === el.dataset.track).on = el.checked; save(); rebuild(); render(); }
    else if (el.id === "jp-on") { state.settings.japanese = el.checked; save(); rebuild(); render(); }
    else if (el.id === "theme") {
      if (el.value) document.documentElement.dataset.theme = el.value; else delete document.documentElement.dataset.theme;
      try { el.value ? localStorage.setItem("hydra-theme", el.value) : localStorage.removeItem("hydra-theme"); } catch (_) {}
    } else if (el.dataset.weekjump !== undefined && el.value !== "") { planWeekOffset = +el.value; render(); }
    else if (el.id === "import" && el.files[0]) {
      el.files[0].text().then((txt) => {
        const data = JSON.parse(txt);
        if (!data || typeof data.done !== "object") throw new Error("bad file");
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
        load(); rebuild(); render(); toast("Progress imported");
      }).catch(() => toast("That file doesn't look like a Hydra School backup"));
    }
  });
  window.addEventListener("hashchange", render);
  load(); rebuild(); render();
})();
