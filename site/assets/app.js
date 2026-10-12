/* Hydra School – study planner. Plain JS, no build step. Progress lives in localStorage and syncs to your account (sync.js). */
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
      coding: true,
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
    if (!state.settings.coding && !state.settings.japanese) state.settings.coding = true;
    // keep any newly added tracks
    TRACKS.filter((t) => !t.core && !state.settings.tracks.some((x) => x.id === t.id))
      .forEach((t) => state.settings.tracks.push({ id: t.id, on: false }));
  }
  function save() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { toast("Couldn't save – is browser storage blocked?"); }
    if (window.Sync) window.Sync.changed();
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
    if (!state.settings.coding) return [];
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
    if (r) out.push(`<a class="btn sm" href="${r}" target="_blank" rel="noopener">${icon("file-text")} Tasks (reference README)</a>`);
    out.push(`<a class="btn sm" href="${searchUrl(p)}" target="_blank" rel="noopener">${icon("search")} Other students' versions</a>`);
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

  let planWeekOffset = null;
  /* ---------------- learning path ---------------- */
  const PATHS = [
    { id: "both", icon: "graduation", title: "Programming + Japanese", sub: "3 hours a day: 2 h of code and 1 h of Japanese" },
    { id: "code", icon: "code", title: "Programming only", sub: "2 hours a day on the ALX / Holberton curriculum" },
    { id: "jp", icon: "language", title: "Japanese only", sub: "1 hour a day, from kana to A2" },
  ];
  const pathOf = (st) => (st.coding && st.japanese ? "both" : st.coding ? "code" : "jp");
  const pathPicker = (selected, name) => `<div class="path-pick" role="radiogroup" aria-label="Learning path">${PATHS.map((x) => `
    <label class="path-opt"><input type="radio" name="${name}" value="${x.id}" ${x.id === selected ? "checked" : ""}>
      <span class="path-ico">${icon(x.icon)}</span><span><b>${esc(x.title)}</b><span class="muted small">${esc(x.sub)}</span></span></label>`).join("")}</div>`;
  // Set the learning path. With restart, the plan starts from today (used when an account is created).
  function applyPath(path, restart) {
    state.settings.coding = path !== "jp";
    state.settings.japanese = path !== "code";
    if (restart) { state.settings.start = todayISO(); state.anchors = { code: [], jp: [] }; planWeekOffset = null; }
    save(); rebuild(); render();
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

    const dayNo = code ? CODE.indexOf(code) + 1 : CODE.length;
    const now = new Date();
    const clock = `${fmt(t, { year: true })} · ${pad(now.getHours())}:${pad(now.getMinutes())}`;
    const st = state.settings;
    const headline = code ? `Day ${dayNo}. ${esc(byId[code.pid].title)}.`
      : !st.coding && jp ? `Day ${jp.i + 1}. ${esc(jp.day.title)}.` : "You finished the whole plan.";
    const sub = st.coding && st.japanese ? "Two hours of code and one hour of Japanese. Show up today and the schedule takes care of the rest."
      : st.coding ? "Two hours of code a day. Show up today and the schedule takes care of the rest."
      : "One hour of Japanese a day. Show up today and the schedule takes care of the rest.";
    let html = `<section class="hero"><canvas data-pixel="${st.coding ? "mountains" : "hills"}" data-seed="${st.coding ? dayNo : 11}" aria-hidden="true"></canvas>
      <div class="hero-in">
        <span class="meta">${clock}${restDay ? " · rest day" : ""}${doneToday ? ` · ${doneToday} done today` : ""}</span>
        <h1><span class="mark">${greeting}.</span><br><span class="mark">${headline}</span></h1>
        <p class="sub"><span class="mark-soft">${sub}</span></p>
        <div class="btn-row">${code ? `<a class="btn primary chev" href="#practice/${encodeURIComponent(code.pid)}">Start practising</a>` : ""}${jp ? `<a class="btn${code ? "" : " primary chev"}" href="#jp/${jp.i}">${code ? icon("pen") + " " : ""}Japanese drills</a>` : ""}</div>
      </div></section>`;

    if (cBehind + jBehind > 0) {
      html += `<div class="banner warn"><p>You're behind plan: ${cBehind ? `${cBehind} coding session${cBehind > 1 ? "s" : ""}` : ""}${cBehind && jBehind ? " and " : ""}${jBehind ? `${jBehind} Japanese day${jBehind > 1 ? "s" : ""}` : ""}. No stress — just carry on, or shift the plan so it starts from today.</p>
        <div class="btn-row">${cBehind ? `<button class="btn sm" data-resched="code">Shift coding plan</button>` : ""}${jBehind ? `<button class="btn sm" data-resched="jp">Shift Japanese plan</button>` : ""}</div></div>`;
    }

    html += `<div class="grid-2">`;
    // Coding card
    if (!st.coding) { /* Japanese-only path */ } else if (code) {
      const p = byId[code.pid], tr = trackOf(code.track);
      const ahead = code.date > t;
      html += `<section class="card today-card" style="--card-accent:var(--a-${p.area})">
        <div class="eyebrow">${icon("code")} Coding · 2 hours ${areaChip(p.area)}<span class="chip">${esc(tr.short)}</span>${ahead ? `<span class="chip ok">ahead · planned ${fmt(code.date)}</span>` : code.date < t ? `<span class="chip warn">planned ${fmt(code.date)}</span>` : ""}</div>
        <div><div class="big-title">${esc(p.title)}</div><div class="muted small">Session ${code.i + 1} of ${code.n}</div></div>
        <div class="session-task">${esc(sessionPlan(p, code.i))}</div>
        ${code.i === 0 ? `<div><h4 class="eyebrow" style="margin:0 0 6px">By the end you should know</h4><ul class="objectives">${p.learn.map((l) => `<li>${esc(l)}</li>`).join("")}</ul></div>` : ""}
        <div><h4 class="eyebrow" style="margin:0 0 6px">Resources</h4><ul class="links">${p.res.map((r) => `<li>${link(r)}</li>`).join("")}</ul></div>
        <div class="btn-row">${projectLinks(p)}</div>
        <div class="btn-row"><button class="btn action" data-toggle="${code.key}">${icon("check")} Mark session done</button><a class="btn" href="#curriculum/${encodeURIComponent(p.id)}">Project page</a></div>
        ${practiceButton(p.id)}
        <p class="tip">Open the reference README for the exact task list. Do every task yourself first — only peek at the solution code when you're truly stuck, then rewrite it in your own words.</p>
      </section>`;
    } else {
      html += `<section class="card today-card"><div class="big-title">${icon("graduation")} All coding sessions complete!</div><p>Incredible work. Turn on another specialization in Settings to keep going.</p></section>`;
    }
    // Japanese card
    if (state.settings.japanese) {
      if (jp) {
        const ahead = jp.date > t;
        html += `<section class="card today-card" style="--card-accent:var(--a-jp)">
          <div class="eyebrow">${icon("language")} Japanese · 1 hour <span class="chip">${esc(jp.day.stage)}</span>${ahead ? `<span class="chip ok">ahead · planned ${fmt(jp.date)}</span>` : jp.date < t ? `<span class="chip warn">planned ${fmt(jp.date)}</span>` : ""}</div>
          <div><div class="big-title">${esc(jp.day.title)}</div><div class="muted small">Day ${jp.i + 1} of ${jp.n}</div></div>
          <div class="session-task"><ul>
            <li>15 min · Anki reviews${jp.i >= 6 ? " + 10 new Kaishi cards" : ""}</li>
            ${jp.day.stage === "Kana" ? `<li>45 min · ${jp.day.tasks.map(esc).join(". Then: ")}</li>` : jp.day.tasks.map((x, k) => `<li>${k === 0 ? "30 min · " : "15 min · "}${esc(x)}</li>`).join("")}
          </ul></div>
          <div><h4 class="eyebrow" style="margin:0 0 6px">Resources</h4><ul class="links">${jp.day.res.map((r) => `<li>${link(r)}</li>`).join("")}</ul></div>
          <div class="btn-row"><button class="btn action" data-toggle="${jp.key}">${icon("check")} Mark day done</button><a class="btn" href="#japanese">Japanese plan</a></div>
          ${jpPracticeButton(jp.i)}
        </section>`;
      } else {
        html += `<section class="card today-card"><div class="big-title">${icon("award")} Japanese plan complete — おめでとう!</div></section>`;
      }
    }
    html += `</div>`;

    // Up next
    const upcoming = (st.coding ? CODE : JPD).filter((s) => !s.done).slice(1, 6);
    if (upcoming.length) {
      html += `<h2>Coming up</h2><div class="stack">${upcoming.map((s) => {
        const title = s.kind === "code" ? byId[s.pid].title : s.day.title;
        const what = s.kind === "code" ? sessionPlan(byId[s.pid], s.i) : s.day.tasks.join(" · ");
        return `<div class="card" style="padding:12px 16px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:center">
          <div><div style="font-weight:600">${esc(title)} <span class="muted small">· ${s.i + 1}/${s.n}</span></div><div class="muted small">${esc(what)}</div></div>
          <span class="chip">${fmt(s.date)}</span></div>`;
      }).join("")}</div>`;
    }
    return html;
  };

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

    const both = state.settings.coding && state.settings.japanese;
    const hours = [state.settings.coding && "Coding: 2 h/day", state.settings.japanese && "Japanese: 1 h/day"].filter(Boolean).join(", ");
    let html = `<h1>Schedule</h1><p class="lead">Your week-by-week plan. ${hours}. Dates move if you shift the plan from the Today page. Finishes around <strong>${fmtMonth(lastDate)}</strong> (${totalWeeks} weeks).</p>`;
    const pager = `<div class="pager">
      <button class="btn sm" data-week="${planWeekOffset - PER}" ${planWeekOffset <= 0 ? "disabled" : ""}>${icon("arrow-left")} Earlier</button>
      <div class="btn-row"><button class="btn sm" data-week="${curWeek}">This week</button>
      <select class="btn sm" data-weekjump aria-label="Jump to month">${monthOptions(startMon, totalWeeks)}</select></div>
      <button class="btn sm" data-week="${planWeekOffset + PER}" ${planWeekOffset + PER >= totalWeeks ? "disabled" : ""}>Later ${icon("arrow-right")}</button></div>`;
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
        html += `<div class="day-row ${both ? "" : "one"} ${date === t ? "today" : ""} ${rest ? "rest" : ""}">
          <div class="day-date">${fmt(date)}<span class="muted">${date === t ? "Today" : rest ? "Rest" : ""}</span></div>
          ${!state.settings.coding ? "" : `<div class="day-cell">${code.map((s) => { const p = byId[s.pid]; return checkRow(s.key, s.done, `<span class="ptitle">${esc(p.title)}</span> <span class="sub">${s.i + 1}/${s.n}</span><div class="sub">${esc(sessionPlan(p, s.i))}</div>`); }).join("") || (rest ? "" : `<span class="muted small">—</span>`)}</div>`}
          ${!state.settings.japanese ? "" : `<div class="day-cell">${jp.map((s) => checkRow(s.key, s.done, `<span class="ptitle">${esc(s.day.title)}</span><div class="sub">${esc(s.day.tasks[0])}</div>`)).join("")}</div>`}
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
    if (!state.settings.coding) return `<h1>Curriculum</h1><p class="lead">Programming isn't part of your learning path. Change your path in <a href="#settings">Settings</a> to add it.</p>`;
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
          <summary><div class="proj-title">${all ? `<span class="tick">${icon("check-circle")}</span>` : ""}${esc(p.title)} ${areaChip(p.area)}</div>
          <span class="chip">${p.days} session${p.days > 1 ? "s" : ""}</span>
          <div class="proj-meta">${bar(pct(pd, s.length), `var(--a-${p.area})`)}<span>${pd}/${s.length}</span>${s.length ? `<span>· ${fmt(s[0].date)}${s.length > 1 ? ` → ${fmt(s[s.length - 1].date)}` : ""}</span>` : ""}</div></summary>
          <div class="proj-body">
            <div><h4>You'll learn</h4><ul class="objectives">${p.learn.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>
              <h4 style="margin-top:14px">Resources</h4><ul class="links">${p.res.map((r) => `<li>${link(r)}</li>`).join("")}</ul>
              <div class="btn-row" style="margin-top:14px">${projectLinks(p)}</div>${practiceButton(p.id, true)}</div>
            <div><h4>Sessions</h4>${s.map((x) => checkRow(x.key, x.done, `${esc(sessionPlan(p, x.i))} <span class="muted small">· ${fmt(x.date)}</span>`)).join("")}
              <div class="btn-row" style="margin-top:8px"><button class="btn sm" data-markall="${esc(id)}" data-val="${all ? 0 : 1}">${all ? "Un-mark all" : "Mark whole project done"}</button></div></div>
          </div></details>`;
      }
      html += `</section>`;
    }
    return html;
  };

  views.japanese = () => {
    if (!state.settings.japanese) return `<h1>Japanese</h1><p class="lead">Japanese isn't part of your learning path. Change your path in <a href="#settings">Settings</a> to add it.</p>`;
    const d = JPD.filter((s) => s.done).length;
    const stages = [];
    for (const s of JPD) {
      let st = stages[stages.length - 1];
      if (!st || st.name !== s.day.stage) { st = { name: s.day.stage, items: [] }; stages.push(st); }
      st.items.push(s);
    }
    const nextJp = firstUndone(JPD);
    let html = `<section class="hero"><canvas data-pixel="hills" data-seed="11" aria-hidden="true"></canvas>
      <div class="hero-in"><h1><span class="mark-soft" style="color:#2a3f8f">Learn Japanese,</span><br><span class="mark-soft" style="color:#2a3f8f">one hour a day <span class="jp">日本語</span></span></h1>
      ${nextJp ? `<div class="btn-row"><a class="btn primary chev" href="#jp/${nextJp.i}">Today: ${esc(nextJp.day.title)}</a></div>` : ""}</div></section>
      <p class="lead">One hour a day, from zero to roughly JLPT N4, using only free material: kana first, then the Japan Foundation's IRODORI course (the official A1–A2 textbook, free PDFs + audio), with Anki vocabulary and plenty of listening.</p>
      <div class="stat-row"><div class="stat"><div class="v">${d}/${JPD.length}</div><div class="l">days done</div></div>
      <div class="stat"><div class="v">${pct(d, JPD.length)}%</div><div class="l">complete</div></div>
      <div class="stat"><div class="v">${JPD.length ? fmtMonth(JPD[JPD.length - 1].date) : "–"}</div><div class="l">planned finish</div></div></div>
      <div class="card"><h3>Your daily hour</h3><ul class="objectives">
        <li><strong>15 min – Anki.</strong> Do your reviews every day, even on busy days. From day 7, add 10 new cards a day from the Kaishi 1.5k deck.</li>
        <li><strong>30 min – Main lesson.</strong> Kana in weeks 1–2, then IRODORI lessons. Always listen to the audio and say things out loud.</li>
        <li><strong>15 min – Listening/reading.</strong> NHK Easy Japanese lessons, Comprehensible Japanese videos, and later NHK News Web Easy.</li></ul>
        <p class="tip" style="margin-top:12px">First, download the IRODORI Starter textbook + audio from the IRODORI site (free, no account needed).</p></div>
      <h2>Stages</h2><div class="stack flush">`;
    for (const st of stages) {
      const sd = st.items.filter((x) => x.done).length;
      html += `<details class="proj" id="stage-${stages.indexOf(st)}"><summary><div class="proj-title">${sd === st.items.length ? `<span class="tick">${icon("check-circle")}</span>` : ""}${esc(st.name)}</div><span class="chip">${st.items.length} day${st.items.length > 1 ? "s" : ""}</span>
        <div class="proj-meta">${bar(pct(sd, st.items.length), "var(--a-jp)")}<span>${sd}/${st.items.length}</span><span>· ${fmt(st.items[0].date)} → ${fmt(st.items[st.items.length - 1].date)}</span></div></summary>
        <div style="padding:4px 16px 16px">${st.items.map((x) => `<div class="jp-row">${checkRow(x.key, x.done, `<strong>${esc(x.day.title)}</strong> <span class="muted small">· ${fmt(x.date)}</span><div class="small muted">${x.day.tasks.map(esc).join(" · ")}</div>`)}<a class="btn sm" href="#jp/${x.i}">${icon("pen")} Practice</a></div>`).join("")}</div></details>`;
    }
    html += `</div><h2>Free resources</h2><div class="grid-3">${JP.resources.map((g) => `<div class="card"><h3>${esc(g.group)}</h3><ul class="links">${g.items.map((r) => `<li>${link(r)}</li>`).join("")}</ul></div>`).join("")}</div>`;
    return html;
  };

  views.settings = () => {
    const s = state.settings;
    return `<h1>Settings</h1><p class="lead">Changes recalculate every date instantly. Your ticks are kept.</p>
      ${accountSection()}
      <h2>Plan</h2>
      <div class="card">
        <div class="field"><label for="start">Start date</label><input type="date" id="start" value="${s.start}"></div>
        <div class="field"><label>Study days</label><div class="daypick">${[1, 2, 3, 4, 5, 6, 0].map((d) => `<label><input type="checkbox" data-sday="${d}" ${s.studyDays[d] ? "checked" : ""}>${WEEKDAYS[d]}</label>`).join("")}</div>
          <span class="muted small">Untick a day to make it a rest day (applies to both coding and Japanese).</span></div>
        <div class="field"><label>Learning path</label>${pathPicker(pathOf(s), "set-path")}</div>
        ${!s.coding ? "" : `<div class="field"><label>Specializations (in the order you'll do them, after Foundations)</label>
          <ul class="order-list">${s.tracks.map((x, i) => { const t = trackOf(x.id); return t ? `<li><input class="switch" type="checkbox" data-track="${x.id}" ${x.on ? "checked" : ""} aria-label="Include ${esc(t.name)}"><span class="name">${esc(t.name)}</span>
            <button class="btn sm" data-move="${i}" data-dir="-1" ${i === 0 ? "disabled" : ""} aria-label="Move up">${icon("arrow-up")}</button><button class="btn sm" data-move="${i}" data-dir="1" ${i === s.tracks.length - 1 ? "disabled" : ""} aria-label="Move down">${icon("arrow-down")}</button></li>` : ""; }).join("")}</ul></div>`}
        <div class="field"><label for="theme">Theme</label><select id="theme"><option value="">Match my device</option><option value="light">Light</option><option value="dark">Dark</option></select></div>
      </div>
      <h2>Backup</h2>
      <div class="card"><p class="muted" style="margin-top:0">${syncState().user ? "Your progress is saved to your account and in this browser. You can still export a copy." : "Progress is stored only in this browser. Export a backup now and then, or log in to keep it in your account."}</p>
        <div class="btn-row"><button class="btn" id="export">${icon("download")} Export progress</button><label class="btn">${icon("upload")} Import progress<input type="file" id="import" accept="application/json" hidden></label>
        <button class="btn" id="reset-anchors">Undo all plan shifts</button><button class="btn" id="reset" style="color:var(--warn)">Reset everything</button></div></div>
      <h2>About</h2><div class="card small muted"><p style="margin-top:0">Curriculum order follows the ALX Software Engineering programme (built on Holberton School's). The official task pages are on the ALX/Holberton intranet, which needs a login, so each project links to a public student repo whose README lists the tasks. Session counts are estimates for 2-hour days.</p><p>Japanese stroke-order data comes from <a href="https://kanjivg.tagaini.net" target="_blank" rel="noopener">KanjiVG</a> © Ulrich Apel, licensed CC BY-SA 3.0. C code is compiled by the free <a href="https://godbolt.org" target="_blank" rel="noopener">Compiler Explorer</a> service; Python runs with <a href="https://pyodide.org" target="_blank" rel="noopener">Pyodide</a> and SQL with <a href="https://sql.js.org" target="_blank" rel="noopener">sql.js</a>.</p></div>`;
  };

  /* ---------------- accounts ---------------- */
  const syncState = () => (window.Sync ? window.Sync.state : { available: false, user: null, oauth: {}, status: "unavailable" });
  const AUTH_ERRORS = {
    not_configured: "That sign-in option isn't set up on this site yet.",
    rate_limited: "Too many attempts. Please wait a few minutes and try again.",
    cancelled: "Sign-in was cancelled.",
    state: "That sign-in link expired. Please try again.",
    provider: "We couldn't reach the sign-in provider. Please try again.",
    no_email: "Your account has no verified email address. Add one with the provider, or sign up with email and password.",
    email_exists: "An account with this email already uses a password. Log in with your password, then connect GitHub or Google in Settings.",
  };
  const SETTINGS_NOTES = { linked: "Connected. You can now sign in with it too.", link_taken: "That account is already connected to a different Hydra School account." };
  function statusLabel(st) {
    return ({ checking: "Checking…", syncing: "Syncing…", pending: "Saving soon…", saved: "All changes saved", offline: "Offline: will sync later", error: st.message || "Sync problem", guest: "Not signed in", unavailable: "Accounts unavailable" })[st.status] || "";
  }
  function oauthButtons(st, signup) {
    const b = [], d = signup ? " data-signup" : "";
    if (st.oauth.github) b.push(`<a class="btn oauth" href="/api/auth/github"${d}>${icon("github")} Continue with GitHub</a>`);
    if (st.oauth.google) b.push(`<a class="btn oauth" href="/api/auth/google"${d}>${icon("google")} Continue with Google</a>`);
    return b.length ? `<div class="oauth-row">${b.join("")}</div><div class="or"><span>or</span></div>` : "";
  }
  function authView(mode, code) {
    const st = syncState();
    const signup = mode === "signup";
    let body;
    if (st.user) {
      body = `<h1>You're signed in</h1><p class="lead">as <b>${esc(st.user.email || st.user.name)}</b>. Your progress syncs to your account.</p>
        <div class="btn-row"><a class="btn primary chev" href="#today">Go to today</a><a class="btn" href="#settings">Account settings</a></div>`;
    } else if (st.available === false) {
      body = `<h1>Accounts aren't available here</h1><p class="lead">This copy of Hydra School is running without its server, so progress stays in this browser. Everything else works.</p>
        <div class="btn-row"><a class="btn primary chev" href="#today">Keep studying</a></div>`;
    } else {
      body = `<h1>${signup ? "Create your account" : "Welcome back"}</h1>
        <p class="lead">${signup ? "Save your schedule, ticks, quiz answers and code to your account, and pick up on any device." : "Log in to load your progress on this device."}</p>
        ${code && AUTH_ERRORS[code] ? `<p class="form-error" role="alert">${esc(AUTH_ERRORS[code])}</p>` : ""}
        ${signup ? `<div class="field"><label>Choose your learning path</label>${pathPicker(signupChoice(), "signup-path")}
          <span class="muted small">Your plan starts today, ${fmt(todayISO(), { year: true })}, and is dated day by day from there.</span></div>` : ""}
        ${oauthButtons(st, signup)}
        <form id="auth-form" data-mode="${mode}" novalidate>
          ${signup ? `<div class="field"><label for="au-name">Name <span class="muted">(optional)</span></label><input id="au-name" name="name" autocomplete="name" maxlength="80"></div>` : ""}
          <div class="field"><label for="au-email">Email</label><input id="au-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="au-pass">Password</label><input id="au-pass" name="password" type="password" autocomplete="${signup ? "new-password" : "current-password"}" minlength="8" required>
            ${signup ? `<span class="muted small">At least 8 characters.</span>` : ""}</div>
          <p class="form-error" id="auth-error" role="alert" hidden></p>
          <button class="btn action wide" type="submit">${signup ? "Create account" : "Log in"}</button>
        </form>
        <p class="muted small switch">${signup ? `Already have an account? <a href="#login">Log in</a>` : `New here? <a href="#signup">Create an account</a>`}</p>
        ${hasGuestProgress() ? `<p class="note small">${icon("cloud")} The progress already in this browser will be added to your account.</p>` : ""}`;
    }
    return `<div class="auth"><div class="auth-form">${body}</div>
      <div class="auth-art"><canvas data-pixel="mountains" data-seed="3" aria-hidden="true"></canvas>
        <div class="auth-quote"><span class="mark-soft">Two hours a day.</span><br><span class="mark-soft">Every project, in order.</span></div></div></div>`;
  }
  function hasGuestProgress() {
    try { if (localStorage.getItem("hydra-sync-owner")) return false; } catch (e) { return false; }
    const P = window.Practice ? window.Practice._P() : {};
    return Object.keys(state.done).length > 0 || ["quiz", "tasks", "jp", "chars"].some((k) => Object.keys(P[k] || {}).length);
  }
  // The path picked on the sign-up page is kept until the new account first syncs (including through a GitHub/Google redirect).
  const PENDING = "hydra-pending-path";
  function signupChoice() {
    let v = null; try { v = localStorage.getItem("hydra-path-choice"); } catch (e) {}
    return PATHS.some((x) => x.id === v) ? v : "both";
  }
  function setPendingPath() { try { localStorage.setItem(PENDING, JSON.stringify({ path: signupChoice(), at: Date.now() })); } catch (e) {} }
  function takePendingPath() {
    let p = null;
    try { p = JSON.parse(localStorage.getItem(PENDING)); localStorage.removeItem(PENDING); } catch (e) {}
    return p && PATHS.some((x) => x.id === p.path) && Date.now() - p.at < 3600e3 ? p.path : null;
  }
  // A brand-new account: set up its plan from the chosen path, starting today, or ask for a path.
  function setUpNewAccount() {
    const path = takePendingPath();
    if (path) applyPath(path, true);
    else location.hash = "#welcome";
  }
  document.addEventListener("click", (e) => { if (e.target.closest("a.oauth[data-signup]")) setPendingPath(); });

  views.welcome = () => `<div class="welcome"><h1>Welcome to Hydra School${syncState().user && syncState().user.name ? `, ${esc(syncState().user.name.split(" ")[0])}` : ""}</h1>
    <p class="lead">What do you want to learn? Your plan starts today, ${fmt(todayISO(), { year: true })}. You can change this later in Settings.</p>
    <form id="welcome-form">${pathPicker(pathOf(state.settings), "welcome-path")}
      <button class="btn action" type="submit" style="margin-top:18px">Start my plan</button></form></div>`;

  views.login = (code) => authView("login", code);
  views.signup = (code) => authView("signup", code);

  function accountSection() {
    const st = syncState();
    if (st.available === false) return "";
    if (!st.user) {
      return `<h2>Account</h2><div class="card account-card"><div><h3>Keep your progress in an account</h3>
        <p class="muted small" style="margin:0">Sign in to save your plan, ticks, quiz answers and code, and use them on any device.</p></div>
        <div class="btn-row"><a class="btn primary" href="#login">Log in</a><a class="btn" href="#signup">Create account</a></div></div>`;
    }
    const u = st.user, m = u.methods;
    const connect = ["github", "google"].filter((p) => st.oauth[p] && !m[p]).map((p) => `<a class="btn sm" href="/api/auth/${p}">${icon(p)} Connect ${p === "github" ? "GitHub" : "Google"}</a>`).join("");
    const methods = [m.password && "email and password", m.github && "GitHub", m.google && "Google"].filter(Boolean).join(", ");
    return `<h2>Account</h2><div class="card">
      <div class="account-head"><span class="avatar lg">${esc(initial(u))}</span><div class="who"><b>${esc(u.name || u.email)}</b>${u.name ? `<div class="muted small">${esc(u.email)}</div>` : ""}
        <div class="muted small">Signs in with ${esc(methods)}</div></div>
        <span class="sync-pill" id="sync-status" data-s="${st.status}">${esc(statusLabel(st))}</span></div>
      <div class="btn-row" style="margin-top:16px">${connect}<button class="btn sm" id="logout">${icon("log-out")} Log out</button></div>
      <details class="acct-more"><summary>${m.password ? "Change password" : "Add a password"}</summary>
        <form id="pw-form" class="acct-form">${m.password ? `<div class="field"><label for="pw-cur">Current password</label><input id="pw-cur" type="password" autocomplete="current-password" required></div>` : ""}
          <div class="field"><label for="pw-new">New password</label><input id="pw-new" type="password" autocomplete="new-password" minlength="8" required></div>
          <p class="form-error" hidden></p><button class="btn primary sm" type="submit">Save password</button></form></details>
      <details class="acct-more"><summary>Delete account</summary>
        <form id="del-form" class="acct-form"><p class="muted small" style="margin-top:0">This deletes your account and the progress saved in it, and clears it from this browser. Export a backup first if you want to keep it.</p>
          ${m.password ? `<div class="field"><label for="del-pw">Password</label><input id="del-pw" type="password" autocomplete="current-password" required></div>` : ""}
          <p class="form-error" hidden></p><button class="btn sm danger" type="submit">${icon("trash")} Delete my account</button></form></details>
    </div>`;
  }
  const initial = (u) => ((u.name || u.email || "?").trim()[0] || "?").toUpperCase();

  async function onSubmit(e) {
    const f = e.target;
    if (f.id === "welcome-form") {
      e.preventDefault();
      applyPath(f.querySelector("input[name=welcome-path]:checked").value, true);
      location.hash = "#today";
      return;
    }
    if (!["auth-form", "pw-form", "del-form"].includes(f.id)) return;
    e.preventDefault();
    const err = f.querySelector(".form-error");
    const btn = f.querySelector("button[type=submit]");
    const show = (msg) => { err.textContent = msg; err.hidden = !msg; };
    show("");
    btn.disabled = true;
    try {
      if (f.id === "auth-form") {
        const email = f.querySelector("#au-email").value.trim(), password = f.querySelector("#au-pass").value;
        const name = f.querySelector("#au-name");
        if (!email || !password) return show("Enter your email and password.");
        const signup = f.dataset.mode === "signup";
        if (signup) setPendingPath();
        const r = signup ? await window.Sync.signup(email, password, name ? name.value : "") : await window.Sync.login(email, password);
        if (!r.ok) return show(r.data.error || "Something went wrong.");
        toast(signup ? "Account created" : "Logged in");
        location.hash = "#today";
      } else if (f.id === "pw-form") {
        const cur = f.querySelector("#pw-cur");
        const r = await window.Sync.updateAccount({ newPassword: f.querySelector("#pw-new").value, password: cur ? cur.value : undefined });
        if (!r.ok) return show(r.data.error || "Something went wrong.");
        toast("Password saved");
      } else if (f.id === "del-form") {
        if (!confirm("Delete your account and all the progress saved in it? This can't be undone.")) return;
        const pw = f.querySelector("#del-pw");
        const r = await window.Sync.deleteAccount(pw ? pw.value : undefined);
        if (!r.ok) return show(r.data.error || "Something went wrong.");
        toast("Account deleted"); location.hash = "#today";
      }
    } finally { btn.disabled = false; }
  }
  document.addEventListener("submit", onSubmit);

  // Re-render account-dependent pages when the signed-in user changes; otherwise just refresh the status bits.
  let syncKey = "";
  function onSync(st) {
    if (st.user && st.fresh) { st.fresh = false; setUpNewAccount(); }
    renderSide();
    const pill = document.getElementById("sync-status");
    if (pill) { pill.textContent = statusLabel(st); pill.dataset.s = st.status; }
    const key = [st.available, st.user && JSON.stringify(st.user), st.oauth.github, st.oauth.google].join("|");
    if (key !== syncKey) {
      syncKey = key;
      if (["login", "signup", "settings"].includes(route().view)) render();
    }
  }

  /* ---------------- practice ---------------- */
  function practiceButton(pid, block) {
    const s = window.Practice && window.Practice.stats(pid);
    if (!s) return "";
    const label = `${icon("practice")} Practice: ${s.quiz ? `${s.quiz} quiz question${s.quiz > 1 ? "s" : ""}` : ""}${s.quiz && s.tasks ? " + " : ""}${s.tasks ? `${s.tasks} task${s.tasks > 1 ? "s" : ""}` : ""}`;
    return `<div class="btn-row"${block ? ' style="margin-top:10px"' : ""}><a class="btn practice-btn" href="#practice/${encodeURIComponent(pid)}">${label}</a>${s.qDone || s.tPassed ? `<span class="chip ${s.pct === 100 ? "ok" : ""}">${s.pct}% done</span>` : ""}</div>`;
  }
  function jpPracticeButton(i) {
    const s = window.Practice && window.Practice.jpDayStats(i);
    if (!s) return "";
    return `<div class="btn-row"><a class="btn practice-btn" href="#jp/${i}">${icon("pen")} Draw today's characters &amp; quiz</a><span class="chip ${s.drawn === s.total ? "ok" : ""}">${s.drawn}/${s.total} drawn</span></div>`;
  }

  views.practice = (pid) => {
    if (pid && byId[pid]) {
      const p = byId[pid];
      return `<div class="crumbs"><a href="#practice">Practice</a> › <a href="#curriculum/${encodeURIComponent(pid)}">${esc(p.title)}</a></div>
        <h1>${esc(p.title)}</h1><p class="lead">Answer the quiz questions, then solve the tasks. Each task is checked automatically, like the ALX checker. Your code is saved in this browser as you type.</p>
        <div class="btn-row" style="margin-bottom:16px">${projectLinks(p)}</div>
        <div id="practice-root">${window.Practice.projectPage(pid, p)}</div>`;
    }
    if (!state.settings.coding) return `<h1>Practice</h1><p class="lead">Programming isn't part of your learning path. Change your path in <a href="#settings">Settings</a> to add it.</p>`;
    let html = `<h1><span class="mark">Practice</span></h1><p class="lead">ALX-style quiz questions and auto-checked tasks for every project. C is compiled online. Python, JavaScript and SQL run in your browser. Shell answers are pattern-checked. Server work is a checklist you tick yourself.</p>`;
    const shown = new Set();
    for (const t of activeTracks()) {
      const pids = t.projects.filter((id) => byId[id] && !shown.has(id) && (window.EX || {})[id]);
      pids.forEach((id) => shown.add(id));
      if (!pids.length) continue;
      html += `<section class="track"><h2>${esc(t.name)}</h2><div class="practice-grid">${pids.map((id) => {
        const s = window.Practice.stats(id), p = byId[id];
        return `<a class="practice-tile" href="#practice/${encodeURIComponent(id)}" style="--c:var(--a-${p.area})">
          <span class="pt-title">${esc(p.title)}</span>
          <span class="muted small">${s.quiz} Q · ${s.tasks} task${s.tasks === 1 ? "" : "s"}</span>${bar(s.pct, `var(--a-${p.area})`)}</a>`;
      }).join("")}</div></section>`;
    }
    return html;
  };
  views.practice.after = (pid) => {
    const root = document.getElementById("practice-root");
    if (root && pid) window.Practice.bindProject(root, pid);
  };

  views.jp = (arg) => {
    const i = Math.max(0, Math.min(JP.days.length - 1, parseInt(arg, 10) || 0));
    return `<div id="jp-root">${window.Practice.jpPage(i)}</div>
      <div class="pager"><a class="btn sm" href="#jp/${Math.max(0, i - 1)}">${icon("arrow-left")} Previous day</a><a class="btn sm" href="#jp/${Math.min(JP.days.length - 1, i + 1)}">Next day ${icon("arrow-right")}</a></div>`;
  };
  views.jp.after = (arg) => {
    const i = Math.max(0, Math.min(JP.days.length - 1, parseInt(arg, 10) || 0));
    window.Practice.bindJp(document.getElementById("jp-root"), i);
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
    const sameView = render.lastView === view + (arg || "");
    const openIds = sameView ? [...el.querySelectorAll("details[open][id]")].map((d) => d.id) : [];
    el.innerHTML = views[view](arg);
    openIds.forEach((id) => { const d = document.getElementById(id); if (d) d.open = true; });
    if (views[view].after) views[view].after(arg);
    if (window.PixelArt) window.PixelArt.paintAll(el);
    const navView = view === "jp" ? "japanese" : view;
    document.querySelectorAll("#nav a").forEach((a) => {
      a.classList.toggle("active", a.dataset.view === navView);
      a.hidden = (!state.settings.coding && (a.dataset.view === "curriculum" || a.dataset.view === "practice")) || (!state.settings.japanese && a.dataset.view === "japanese");
    });
    renderSide();
    if (view === "settings") {
      const th = document.getElementById("theme"); if (th) th.value = document.documentElement.dataset.theme || "";
      if (arg && SETTINGS_NOTES[arg] && render.lastView !== view + arg) toast(SETTINGS_NOTES[arg]);
    }
    const anchor = arg && view === "curriculum" ? document.getElementById("p-" + arg) : null;
    if (render.lastView === view + (arg || "")) window.scrollTo(0, y);
    else if (anchor) anchor.scrollIntoView({ block: "start" });
    else window.scrollTo(0, 0);
    render.lastView = view + (arg || "");
  }
  function renderSide() {
    const cd = CODE.filter((s) => s.done).length, jd = JPD.filter((s) => s.done).length;
    const st = streak();
    document.getElementById("side-stats").innerHTML = `
      ${state.settings.coding ? `<span class="mini-stat">code <b>${pct(cd, CODE.length)}%</b></span>` : ""}
      ${state.settings.japanese ? `<span class="mini-stat">日本語 <b>${pct(jd, JPD.length)}%</b></span>` : ""}
      <span class="mini-stat">streak <b>${st}d</b></span>
      ${accountChip()}<a class="btn primary chev sm" href="#today">Today</a>`;
  }
  function accountChip() {
    const st = syncState();
    if (st.user) return `<a class="avatar" href="#settings" title="${esc(`${st.user.email} · ${statusLabel(st)}`)}" aria-label="Account: ${esc(st.user.email)}" data-s="${st.status}">${esc(initial(st.user))}</a>`;
    if (st.available) return `<a class="btn sm" href="#login">Log in</a>`;
    return "";
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-toggle],[data-resched],[data-week],[data-markall],[data-move],#export,#reset,#reset-anchors,#logout");
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
    } else if (b.id === "logout") {
      if (window.Sync.pending() && window.Sync.state.status === "offline" && !confirm("Some changes haven't synced yet because you're offline. Log out anyway and lose them?")) return;
      b.disabled = true;
      window.Sync.logout().then(() => { toast("Logged out"); location.hash = "#today"; });
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
    else if (el.name === "set-path") { applyPath(el.value, false); toast("Learning path updated"); }
    else if (el.name === "signup-path") { try { localStorage.setItem("hydra-path-choice", el.value); } catch (_) {} }
    else if (el.id === "theme") {
      if (el.value) document.documentElement.dataset.theme = el.value; else delete document.documentElement.dataset.theme;
      try { el.value ? localStorage.setItem("hydra-theme", el.value) : localStorage.removeItem("hydra-theme"); } catch (_) {}
    } else if (el.dataset.weekjump !== undefined && el.value !== "") { planWeekOffset = +el.value; render(); }
    else if (el.id === "import" && el.files[0]) {
      el.files[0].text().then((txt) => {
        const data = JSON.parse(txt);
        if (!data || typeof data.done !== "object") throw new Error("bad file");
        localStorage.setItem(STORE_KEY, JSON.stringify(data));
        if (window.Sync) window.Sync.changed();
        load(); rebuild(); render(); toast("Progress imported");
      }).catch(() => toast("That file doesn't look like a Hydra School backup"));
    }
  });
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.addEventListener("hashchange", render);
  document.addEventListener("practice-change", renderSide);
  window.App = { reload() { load(); rebuild(); render(); } };
  if (window.Sync) window.Sync.on(onSync);
  load(); rebuild(); render();
})();
