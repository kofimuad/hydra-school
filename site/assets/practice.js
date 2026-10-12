/*
 * Practice engine: ALX-style quizzes and auto-checked tasks, plus Japanese drawing drills.
 *
 * Code runners
 *   C       -> Compiler Explorer public API (godbolt.org), compiled with the ALX flags
 *   Python  -> Pyodide (CPython compiled to WebAssembly) in a Web Worker
 *   JS      -> a Web Worker with a tiny Node-like shim (require, process.argv, console)
 *   SQL     -> sql.js (SQLite in WebAssembly); your result is compared with a reference query
 *   Shell   -> pattern check of the command/script you write
 *   HTML    -> rendered in a sandboxed frame, then the page structure is checked
 */
(function () {
  "use strict";

  const CDN = {
    pyodide: "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/",
    sqljs: "https://cdn.jsdelivr.net/npm/sql.js@1.10.3/dist/",
    cm: "https://cdn.jsdelivr.net/npm/codemirror@5.65.16/",
  };
  const GODBOLT = "https://godbolt.org/api/compiler/";
  const C_COMPILERS = ["cg142", "cg132", "cg122"];
  const C_FLAGS = "-Wall -Werror -Wextra -pedantic -std=gnu89";

  /* ---------------- storage ---------------- */
  const KEY = "hydra-practice-v1";
  let P;
  function loadP() {
    try { P = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { P = {}; }
    P.quiz = P.quiz || {}; P.tasks = P.tasks || {}; P.jp = P.jp || {}; P.chars = P.chars || {};
  }
  loadP();
  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) {}
    if (window.Sync) window.Sync.changed();
  };

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const EX = () => window.EX || {};

  /* ---------------- script / css loader ---------------- */
  const loaded = {};
  function loadScript(src) {
    if (!loaded[src]) loaded[src] = new Promise((res, rej) => {
      const s = document.createElement("script"); s.src = src; s.onload = res; s.onerror = () => rej(new Error("Could not load " + src));
      document.head.appendChild(s);
    });
    return loaded[src];
  }
  function loadCss(href) {
    if (loaded[href]) return; loaded[href] = true;
    const l = document.createElement("link"); l.rel = "stylesheet"; l.href = href; document.head.appendChild(l);
  }

  /* ---------------- code editor (CodeMirror 5, falls back to textarea) ---------------- */
  const CM_MODES = { c: "text/x-csrc", python: "python", js: "javascript", sql: "text/x-mysql", shell: "shell", html: "htmlmixed" };
  let cmReady = null;
  function loadCM() {
    if (!cmReady) {
      loadCss(CDN.cm + "lib/codemirror.css");
      cmReady = loadScript(CDN.cm + "lib/codemirror.js").then(() => Promise.all(
        ["clike/clike", "python/python", "javascript/javascript", "sql/sql", "shell/shell", "xml/xml", "css/css"].map((m) => loadScript(CDN.cm + "mode/" + m + ".js"))
      )).then(() => loadScript(CDN.cm + "mode/htmlmixed/htmlmixed.js")).then(() => true).catch(() => false);
    }
    return cmReady;
  }
  function makeEditor(textarea, lang) {
    const listeners = [];
    let cm = null;
    const fire = () => listeners.forEach((fn) => fn());
    textarea.addEventListener("input", fire);
    textarea.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { e.preventDefault(); textarea.setRangeText(lang === "python" ? "    " : "\t", textarea.selectionStart, textarea.selectionEnd, "end"); fire(); }
    });
    loadCM().then((ok) => {
      if (!ok || !window.CodeMirror || !textarea.isConnected) return;
      cm = window.CodeMirror.fromTextArea(textarea, {
        mode: CM_MODES[lang] || "text/plain", lineNumbers: true,
        indentUnit: lang === "python" || lang === "js" || lang === "html" ? 4 : 8,
        tabSize: lang === "python" || lang === "js" || lang === "html" ? 4 : 8,
        indentWithTabs: lang === "c" || lang === "shell", viewportMargin: Infinity,
      });
      cm.on("change", fire);
    });
    return {
      get: () => (cm ? cm.getValue() : textarea.value),
      set: (v) => { if (cm) cm.setValue(v); else textarea.value = v; },
      onChange: (fn) => listeners.push(fn),
    };
  }

  /* ================= RUNNERS ================= */
  const norm = (s) => String(s == null ? "" : s).replace(/\r\n/g, "\n");

  // ---------- C via Compiler Explorer ----------
  const C_PRELUDE = "#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n#include <unistd.h>\n#include <limits.h>\n#include <stdarg.h>\n#include <ctype.h>\n#include <fcntl.h>\n";
  const PUTCHAR = "int _putchar(char c)\n{\n\treturn (write(1, &c, 1));\n}\n";
  let cCompiler = null;
  async function godbolt(source, args, stdin) {
    const ids = cCompiler ? [cCompiler] : C_COMPILERS;
    let lastErr;
    for (const id of ids) {
      try {
        const r = await fetch(GODBOLT + id + "/compile", {
          method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            source, compiler: id, lang: "c", allowStoreCodeDebug: false,
            options: { userArguments: C_FLAGS, executeParameters: { args: args || [], stdin: stdin || "" }, compilerOptions: { executorRequest: true }, filters: { execute: true }, tools: [], libraries: [] },
          }),
        });
        if (r.status === 404) { lastErr = new Error("compiler " + id + " not found"); continue; }
        if (!r.ok) throw new Error("Compiler Explorer answered HTTP " + r.status);
        cCompiler = id;
        return await r.json();
      } catch (e) { lastErr = e; if (!/not found/.test(e.message)) break; }
    }
    throw lastErr;
  }
  const textOf = (arr) => (arr || []).map((x) => x.text).join("\n");
  function buildC(task, user, main) {
    const header = (task.header || "") + "\n";
    const cleaned = user.replace(/^\s*#\s*include\s*"[^"]*"\s*$/gm, "");
    const head = C_PRELUDE + header + (task.noPutchar ? "" : PUTCHAR);
    const src = head + "#line 1 \"" + (task.file || "main.c") + "\"\n" + cleaned + "\n" + (main ? "#line 1 \"test-main.c\"\n" + main : "");
    return src;
  }
  async function runC(task, code) {
    const results = [];
    for (const t of task.tests) {
      const src = buildC(task, code, task.mode === "prog" ? null : t.main);
      const res = await godbolt(src, t.args, t.stdin);
      if (!res.didExecute) {
        const err = textOf(res.buildResult && res.buildResult.stderr) || textOf(res.stderr) || "Compilation failed";
        results.push({ ok: false, label: t.label, got: "", expected: t.out, error: cleanGcc(err) });
        break; // no point running the rest
      }
      const got = textOf(res.stdout) + (res.stdout && res.stdout.length ? "\n" : "");
      const ok = cmpOut(got, t.out) && (t.code === undefined || res.code === t.code);
      results.push({ ok, label: t.label, got, expected: t.out, error: res.timedOut ? "Timed out (infinite loop?)" : textOf(res.stderr), exit: res.code, wantExit: t.code });
    }
    return results;
  }
  const cleanGcc = (s) => s.replace(/<source>/g, "file").replace(/\x1b\[[0-9;]*m/g, "");
  function cmpOut(got, want) {
    const g = norm(got).replace(/\n+$/, ""), w = norm(want).replace(/\n+$/, "");
    return g === w;
  }

  // ---------- Python via Pyodide (in a worker) ----------
  const PY_WORKER = `
    importScripts(${JSON.stringify(CDN.pyodide)} + "pyodide.js");
    const ready = loadPyodide({ indexURL: ${JSON.stringify(CDN.pyodide)} });
    const HARNESS = ${JSON.stringify([
      "import sys, io, os, runpy, traceback, importlib",
      "def __hydra_run(entry, argv, stdin):",
      "    for name in list(sys.modules):",
      "        f = getattr(sys.modules[name], '__file__', None) or ''",
      "        if f.startswith('/work/'):",
      "            del sys.modules[name]",
      "    os.chdir('/work')",
      "    if '/work' not in sys.path:",
      "        sys.path.insert(0, '/work')",
      "    importlib.invalidate_caches()",
      "    out, err = io.StringIO(), io.StringIO()",
      "    saved = (sys.stdout, sys.stderr, sys.stdin, sys.argv)",
      "    sys.stdout, sys.stderr, sys.stdin, sys.argv = out, err, io.StringIO(stdin), [entry] + list(argv)",
      "    code = 0",
      "    try:",
      "        runpy.run_path(entry, run_name='__main__')",
      "    except SystemExit as e:",
      "        code = e.code if isinstance(e.code, int) else (0 if e.code is None else 1)",
      "        if e.code is not None and not isinstance(e.code, int):",
      "            print(e.code, file=err)",
      "    except BaseException:",
      "        traceback.print_exc()",
      "        code = 1",
      "    finally:",
      "        sys.stdout, sys.stderr, sys.stdin, sys.argv = saved",
      "    return [out.getvalue(), err.getvalue(), code]",
    ].join("\n"))};
    let harnessLoaded = false;
    onmessage = async (e) => {
      const { id, files, entry, argv, stdin, packages } = e.data;
      try {
        const py = await ready;
        if (packages && packages.length) await py.loadPackage(packages);
        if (!harnessLoaded) { py.runPython(HARNESS); harnessLoaded = true; }
        const rmrf = (p) => { for (const f of py.FS.readdir(p)) { if (f === "." || f === "..") continue; const q = p + "/" + f; if (py.FS.isDir(py.FS.stat(q).mode)) { rmrf(q); py.FS.rmdir(q); } else py.FS.unlink(q); } };
        try { py.FS.mkdirTree("/work"); } catch (_) {}
        rmrf("/work");
        for (const name in files) {
          const dir = name.includes("/") ? "/work/" + name.slice(0, name.lastIndexOf("/")) : null;
          if (dir) py.FS.mkdirTree(dir);
          py.FS.writeFile("/work/" + name, files[name]);
        }
        const r = py.globals.get("__hydra_run")(entry, py.toPy(argv || []), stdin || "");
        const [out, err, code] = r.toJs(); r.destroy();
        postMessage({ id, out, err, code });
      } catch (err) { postMessage({ id, fatal: String(err && err.message || err) }); }
    };`;

  function makeWorkerRunner(source, timeoutMs, firstTimeoutMs) {
    let w = null, seq = 0, warmed = false;
    const start = () => { w = new Worker(URL.createObjectURL(new Blob([source], { type: "text/javascript" }))); warmed = false; };
    return function run(msg) {
      if (!w) start();
      const id = ++seq;
      return new Promise((resolve) => {
        const limit = warmed ? timeoutMs : firstTimeoutMs;
        const timer = setTimeout(() => { w.terminate(); w = null; resolve({ timeout: true }); }, limit);
        const onMsg = (e) => {
          if (e.data.id !== id) return;
          clearTimeout(timer); w.removeEventListener("message", onMsg); warmed = true; resolve(e.data);
        };
        w.addEventListener("message", onMsg);
        w.onerror = (e) => { clearTimeout(timer); w = null; resolve({ fatal: e.message || "Worker error" }); };
        w.postMessage(Object.assign({ id }, msg));
      });
    };
  }
  const pyRun = makeWorkerRunner(PY_WORKER, 10000, 90000);

  async function runPython(task, code) {
    const results = [];
    for (const t of task.tests) {
      const files = Object.assign({}, task.extraFiles || {}, { [task.file]: code });
      let entry = task.file;
      if (t.main) { files["__test_main__.py"] = t.main; entry = "__test_main__.py"; }
      const r = await pyRun({ files, entry, argv: t.args, stdin: t.stdin, packages: task.packages });
      if (r.timeout) { results.push({ ok: false, label: t.label, expected: t.out, got: "", error: "Timed out (infinite loop?)" }); break; }
      if (r.fatal) throw new Error(r.fatal);
      const ok = cmpOut(r.out, t.out) && (t.code === undefined || r.code === t.code);
      results.push({ ok, label: t.label, expected: t.out, got: r.out, error: r.err, exit: r.code, wantExit: t.code });
    }
    return results;
  }

  // ---------- JavaScript (Node-like) in a worker ----------
  // Turns the ES-module syntax ALX projects use (via Babel) into CommonJS for the worker.
  function esmToCjs(src) {
    const tail = [];
    let s = String(src).replace(/^#!.*/, "");
    s = s.replace(/^\s*import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/gm, "const $1 = require('$2');");
    s = s.replace(/^\s*import\s+(\w+)\s*,\s*\{([^}]*)\}\s*from\s+['"]([^'"]+)['"];?/gm, (m, d, names, p) => "const $$m = require('" + p + "'); const " + d + " = $$m.default !== undefined ? $$m.default : $$m; const {" + names.replace(/(\w+)\s+as\s+(\w+)/g, "$1: $2") + "} = $$m;");
    s = s.replace(/^\s*import\s+\{([^}]*)\}\s*from\s+['"]([^'"]+)['"];?/gm, (m, names, p) => "const {" + names.replace(/(\w+)\s+as\s+(\w+)/g, "$1: $2") + "} = require('" + p + "');");
    s = s.replace(/^\s*import\s+(\w+)\s+from\s+['"]([^'"]+)['"];?/gm, (m, d, p) => "const " + d + " = (function (m) { return m && m.default !== undefined ? m.default : m; })(require('" + p + "'));");
    s = s.replace(/^\s*import\s+['"]([^'"]+)['"];?/gm, "require('$1');");
    s = s.replace(/^export\s+default\s+(async\s+)?function\s*\*?\s*(\w+)/gm, (m, a, n) => { tail.push("module.exports.default = " + n + ";"); return (a || "") + "function " + n; });
    s = s.replace(/^export\s+default\s+class\s+(\w+)/gm, (m, n) => { tail.push("module.exports.default = " + n + ";"); return "class " + n; });
    s = s.replace(/^export\s+default\s+/gm, "module.exports.default = ");
    s = s.replace(/^export\s+(async\s+)?function\s*\*?\s*(\w+)/gm, (m, a, n) => { tail.push("module.exports." + n + " = " + n + ";"); return (a || "") + "function " + n; });
    s = s.replace(/^export\s+class\s+(\w+)/gm, (m, n) => { tail.push("module.exports." + n + " = " + n + ";"); return "class " + n; });
    s = s.replace(/^export\s+(const|let|var)\s+(\w+)/gm, (m, k, n) => { tail.push("module.exports." + n + " = " + n + ";"); return k + " " + n; });
    s = s.replace(/^export\s*\{([^}]*)\};?/gm, (m, names) => { names.split(",").map((x) => x.trim()).filter(Boolean).forEach((x) => { const [a, b] = x.split(/\s+as\s+/); tail.push("module.exports." + (b || a) + " = " + a + ";"); }); return ""; });
    return s + "\n" + tail.join("\n");
  }

  const JS_WORKER = `
    function inspect(v, depth, inner) {
      depth = depth || 0;
      if (typeof v === "string") return inner ? "'" + v.replace(/'/g, "\\\\'") + "'" : v;
      if (typeof v === "number") return Object.is(v, -0) ? "-0" : String(v);
      if (typeof v === "bigint") return v + "n";
      if (v === undefined) return "undefined";
      if (v === null) return "null";
      if (typeof v === "boolean") return String(v);
      if (typeof v === "symbol") return v.toString();
      if (typeof v === "function") return v.toString().startsWith("class") ? "[class " + (v.name || "(anonymous)") + "]" : "[Function: " + (v.name || "(anonymous)") + "]";
      if (v instanceof Error) return v.stack || String(v);
      if (depth > 2) return Array.isArray(v) ? "[Array]" : "[Object]";
      if (Array.isArray(v)) {
        if (!v.length) return "[]";
        const parts = v.map((x) => inspect(x, depth + 1, true));
        return "[ " + parts.join(", ") + " ]";
      }
      if (v instanceof Map) return "Map(" + v.size + ") {" + (v.size ? " " + [...v].map(([k, x]) => inspect(k, depth + 1, true) + " => " + inspect(x, depth + 1, true)).join(", ") + " " : "") + "}";
      if (v instanceof Set) return "Set(" + v.size + ") {" + (v.size ? " " + [...v].map((x) => inspect(x, depth + 1, true)).join(", ") + " " : "") + "}";
      if (v instanceof Promise) return "Promise { <pending> }";
      if (ArrayBuffer.isView(v)) return v.constructor.name + "(" + v.length + ") [ " + Array.from(v).join(", ") + " ]";
      const name = v.constructor && v.constructor !== Object ? v.constructor.name + " " : "";
      const keys = Object.keys(v);
      if (!keys.length) return name + "{}";
      return name + "{ " + keys.map((k) => (/^[A-Za-z_$][\\w$]*$/.test(k) ? k : "'" + k + "'") + ": " + inspect(v[k], depth + 1, true)).join(", ") + " }";
    }
    const esmToCjs = ${esmToCjs.toString()};
    onmessage = async (e) => {
      const { id, files, entry, argv } = e.data;
      let out = "";
      const fmt = (args) => args.map((a) => inspect(a)).join(" ");
      const con = { log: (...a) => { out += fmt(a) + "\\n"; }, error: (...a) => { out += fmt(a) + "\\n"; }, info: (...a) => { out += fmt(a) + "\\n"; }, warn: (...a) => { out += fmt(a) + "\\n"; } };
      let pending = 0;
      const _st = setTimeout;
      self.setTimeout = (fn, ms, ...rest) => { pending++; return _st(() => { pending--; try { fn(...rest); } catch (err) { out += (err.stack || err) + "\\n"; } }, ms); };
      const exitErr = {};
      const proc = { argv: ["/usr/bin/node", "/work/" + entry].concat(argv || []), env: {}, exit: (c) => { exitErr.code = c || 0; throw exitErr; }, stdout: { write: (s) => { out += s; return true; } }, stdin: null };
      const fsMem = Object.assign({}, files);
      const fs = {
        readFileSync: (p, enc) => { p = String(p).replace(/^\\.\\//, ""); if (!(p in fsMem)) { const er = new Error("ENOENT: no such file or directory, open '" + p + "'"); er.code = "ENOENT"; throw er; } return fsMem[p]; },
        writeFileSync: (p, d) => { fsMem[String(p).replace(/^\\.\\//, "")] = String(d); },
        existsSync: (p) => String(p).replace(/^\\.\\//, "") in fsMem,
        readFile: (p, enc, cb) => { if (typeof enc === "function") cb = enc; try { const d = fs.readFileSync(p); setTimeout(() => cb(null, d), 0); } catch (er) { setTimeout(() => cb(er), 0); } },
        writeFile: (p, d, enc, cb) => { if (typeof enc === "function") cb = enc; fs.writeFileSync(p, d); setTimeout(() => cb && cb(null), 0); },
      };
      fs.promises = { readFile: (p) => new Promise((res, rej) => fs.readFile(p, (er, d) => er ? rej(er) : res(d))) };
      const cache = {};
      function req(name) {
        if (name === "fs") return fs;
        if (name === "util") return { inspect: (v) => inspect(v) };
        let f = String(name).replace(/^\\.\\//, "");
        if (!(f in files) && (f + ".js") in files) f += ".js";
        if (!(f in files)) throw new Error("Cannot find module '" + name + "' (only your project files are available here)");
        if (cache[f]) return cache[f].exports;
        const module = { exports: {} }; cache[f] = module;
        const fn = new Function("module", "exports", "require", "console", "process", "__filename", "__dirname", esmToCjs(files[f]));
        fn(module, module.exports, req, con, proc, "/work/" + f, "/work");
        return module.exports;
      }
      try {
        req(entry);
      } catch (err) { if (err !== exitErr) out += (err && err.stack ? String(err.stack).split("\\n").slice(0, 3).join("\\n") : String(err)) + "\\n"; }
      const t0 = Date.now();
      await new Promise((r) => _st(r, 20));
      while (pending > 0 && Date.now() - t0 < 4000) await new Promise((r) => _st(r, 25));
      postMessage({ id, out, code: exitErr.code || 0 });
    };`;
  const jsRun = makeWorkerRunner(JS_WORKER, 6000, 6000);

  async function runJS(task, code) {
    const results = [];
    for (const t of task.tests) {
      const files = Object.assign({}, task.extraFiles || {}, { [task.file]: code });
      let entry = task.file;
      if (t.main) { files["__test_main__.js"] = t.main; entry = "__test_main__.js"; }
      const r = await jsRun({ files, entry, argv: t.args });
      if (r.timeout) { results.push({ ok: false, label: t.label, expected: t.out, got: "", error: "Timed out (infinite loop?)" }); break; }
      results.push({ ok: cmpOut(r.out, t.out), label: t.label, expected: t.out, got: r.out });
    }
    return results;
  }

  // ---------- SQL via sql.js ----------
  let sqlReady = null;
  function loadSql() {
    if (!sqlReady) sqlReady = loadScript(CDN.sqljs + "sql-wasm.js").then(() => window.initSqlJs({ locateFile: (f) => CDN.sqljs + f }));
    return sqlReady;
  }
  function execAll(SQL, setup, stmts, check) {
    const db = new SQL.Database();
    try {
      if (setup) db.exec(setup);
      let res = db.exec(stmts);
      if (check) res = db.exec(check);
      const last = res[res.length - 1];
      return { rows: last ? last.values : [], cols: last ? last.columns : [] };
    } finally { db.close(); }
  }
  const tableText = (r) => r.cols.length ? [r.cols.join("\t"), ...r.rows.map((x) => x.join("\t"))].join("\n") + "\n" : "(no rows)\n";
  async function runSQL(task, code) {
    const SQL = await loadSql();
    const results = [];
    for (const t of task.tests) {
      const want = execAll(SQL, t.setup || task.setup, task.sol, t.check || task.check);
      let got;
      try { got = execAll(SQL, t.setup || task.setup, code, t.check || task.check); }
      catch (e) { results.push({ ok: false, label: t.label, expected: tableText(want), got: "", error: "SQL error: " + e.message }); continue; }
      let a = got.rows.map((r) => JSON.stringify(r)), b = want.rows.map((r) => JSON.stringify(r));
      if (!task.ordered) { a = a.slice().sort(); b = b.slice().sort(); }
      results.push({ ok: a.length === b.length && a.every((x, i) => x === b[i]), label: t.label, expected: tableText(want), got: tableText(got) });
    }
    return results;
  }

  // ---------- Shell: pattern check ----------
  function shellNormalize(s) {
    return norm(s).split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#")).join("\n").replace(/[ \t]+/g, " ");
  }
  async function runShell(task, code) {
    const body = shellNormalize(code);
    const hasShebang = /^#!\/bin\/bash\s*$/m.test(norm(code).split("\n")[0] || "");
    const results = [];
    if (task.shebang !== false) results.push({ ok: hasShebang, label: "First line is #!/bin/bash", expected: "#!/bin/bash", got: (norm(code).split("\n")[0] || "") });
    const okBody = task.answers.some((re) => new RegExp("^(?:" + re + ")$", "s").test(body));
    results.push({ ok: okBody, label: "Command does what's asked", expected: task.sol.replace(/^#!\/bin\/bash\n/, ""), got: body, note: okBody ? "" : "This is checked against known-good answers, so a working but unusual command can still be rejected. Test it in a real terminal too." });
    return results;
  }

  // ---------- HTML/CSS: structure checks in a sandboxed frame ----------
  function runHTML(task, code, host) {
    return new Promise((resolve) => {
      let frame = host.querySelector("iframe.preview");
      if (!frame) { frame = document.createElement("iframe"); frame.className = "preview"; frame.title = "Preview"; host.appendChild(frame); }
      frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms");
      frame.onload = () => setTimeout(async () => {
        const d = frame.contentDocument, w = frame.contentWindow;
        const results = [];
        for (const [label, body] of task.checks) {
          let ok = false, error = "";
          try { ok = !!(await new Function("d", "w", "wait", "return (async () => {" + body + "})()")(d, w, (ms) => new Promise((r) => setTimeout(r, ms)))); } catch (e) { error = e.message; }
          results.push({ ok, label, error });
        }
        resolve(results);
      }, task.delay || 300);
      frame.srcdoc = code;
    });
  }

  // ---------- Regex: like ALX's  puts ARGV[0].scan(/your regex/).join ----------
  async function runRegex(task, code) {
    let src = code.trim().replace(/^\/(.*)\/[a-z]*$/s, "$1");
    let re;
    try { re = new RegExp(src, "g" + (task.flags || "")); } catch (e) { return [{ ok: false, label: "Valid regular expression", error: e.message }]; }
    return task.cases.map(([input, want]) => {
      const got = (input.match(re) || []).join("");
      return { ok: got === want, label: `scan(${JSON.stringify(input)})`, expected: want === "" ? "(no match)" : want, got: got === "" ? "(no match)" : got };
    });
  }

  const RUNNERS = { c: runC, python: runPython, js: runJS, sql: runSQL, shell: runShell, html: runHTML, regex: runRegex };
  const LANG_NAME = { c: "C", python: "Python", js: "JavaScript", sql: "SQL", shell: "Bash", html: "HTML/CSS", regex: "Regex" };

  /* ================= UI: quiz ================= */
  function quizHTML(pid, quiz) {
    const answers = P.quiz[pid] || {};
    const done = Object.keys(answers).length;
    const right = Object.entries(answers).filter(([i, a]) => quiz[i] && quiz[i][2] === a).length;
    return `<section class="card stack" data-quiz="${esc(pid)}">
      <div class="practice-head"><h3>Quiz questions</h3><span class="chip ${done === quiz.length ? (right === quiz.length ? "ok" : "warn") : ""}">${done === quiz.length ? `Score ${right}/${quiz.length}` : `${done}/${quiz.length} answered`}</span></div>
      ${quiz.map((q, i) => {
        const a = answers[i];
        const answered = a !== undefined;
        return `<div class="q">
          <div class="q-text"><span class="muted">Q${i + 1}.</span> ${q[0]}</div>
          <div class="q-opts">${q[1].map((o, j) => `<button class="opt ${answered ? (j === q[2] ? "right" : j === a ? "wrong" : "") : ""}" data-qa="${i}:${j}" ${answered ? "disabled" : ""}>${o}</button>`).join("")}</div>
          ${answered ? `<div class="q-why ${a === q[2] ? "ok" : "bad"}">${a === q[2] ? icon("check") + " Correct." : icon("x") + " Not quite."} ${q[3] || ""}</div>` : ""}
        </div>`;
      }).join("")}
      ${done ? `<div><button class="btn sm" data-quiz-reset="${esc(pid)}">Retake quiz</button></div>` : ""}
    </section>`;
  }

  /* ================= UI: tasks ================= */
  function taskId(pid, i) { return pid + "#" + i; }
  function taskHTML(pid, t, i) {
    const id = taskId(pid, i);
    const st = P.tasks[id] || {};
    const fileLabel = t.lang === "sql" ? (t.file || `${i}-query.sql`) : t.file || "";
    return `<section class="card task" id="task-${esc(id)}" data-task="${esc(id)}">
      <div class="practice-head"><h3>${i}. ${esc(t.t)}</h3>
        <div class="btn-row"><span class="chip">${LANG_NAME[t.lang]}</span>${t.adv ? `<span class="chip warn">advanced</span>` : ""}${st.passed ? `<span class="chip ok">${icon("check")} passed</span>` : st.tried ? `<span class="chip warn">not yet</span>` : ""}</div></div>
      <div class="task-body">${t.p}</div>
      ${t.header ? `<details class="small"><summary>Prototypes available (main.h)</summary><pre class="code">${esc(t.header.trim())}</pre></details>` : ""}
      ${(t.tests || []).some((x) => x.main) ? `<details class="small"><summary>Test file used by the checker</summary>${t.tests.filter((x) => x.main).map((x) => `<pre class="code">${esc(x.main.trim())}</pre><div class="muted small">Expected output:</div><pre class="code">${esc(x.out)}</pre>`).join("")}</details>` : ""}
      ${t.lang === "c" && t.mode === "prog" ? `<details class="small"><summary>How it's tested</summary>${t.tests.map((x) => `<pre class="code">$ ./a.out${(x.args || []).map((a) => " " + esc(a)).join("")}${x.stdin ? ` &lt;&lt;&lt; ${esc(JSON.stringify(x.stdin))}` : ""}\n${esc(x.out)}</pre>`).join("")}</details>` : ""}
      <div class="file-label mono">${esc(fileLabel)}</div>
      <textarea class="code-input" spellcheck="false" autocapitalize="off" autocomplete="off" data-editor="${esc(id)}" aria-label="Your code for task ${i}">${esc(st.code != null ? st.code : t.start || "")}</textarea>
      <div class="btn-row">
        <button class="btn primary" data-run="${esc(id)}">${icon("play")} Check my code</button>
        <button class="btn sm" data-reset-code="${esc(id)}">Reset</button>
        ${t.sol ? `<button class="btn sm" data-show-sol="${esc(id)}">${st.passed || (st.tries || 0) >= 3 ? "Show a solution" : "Show a solution (after 3 tries)"}</button>` : ""}
        <span class="muted small run-status" aria-live="polite"></span>
      </div>
      <div class="results"></div>
      ${t.lang === "html" ? `<div class="preview-host"></div>` : ""}
      <div class="sol"></div>
    </section>`;
  }

  function resultsHTML(results, lang) {
    const passed = results.filter((r) => r.ok).length;
    return `<div class="res-summary ${passed === results.length ? "ok" : "bad"}">${passed === results.length ? icon("check") + " All checks passed" : `${icon("x")} ${results.length - passed} of ${results.length} check${results.length > 1 ? "s" : ""} failed`}</div>` +
      results.map((r, k) => `<div class="res ${r.ok ? "ok" : "bad"}"><div class="res-title">${r.ok ? icon("check") : icon("x")} ${esc(r.label || "Check " + (k + 1))}</div>
        ${!r.ok && r.error ? `<pre class="code err">${esc(r.error)}</pre>` : ""}
        ${!r.ok && lang !== "html" && r.expected !== undefined ? `<div class="diff"><div><div class="muted small">Expected</div><pre class="code">${esc(r.expected)}</pre></div><div><div class="muted small">Got</div><pre class="code">${esc(r.got)}</pre></div></div>` : ""}
        ${!r.ok && r.wantExit !== undefined && r.exit !== r.wantExit ? `<div class="small">Exit status: expected ${r.wantExit}, got ${r.exit}</div>` : ""}
        ${r.note ? `<div class="small muted">${esc(r.note)}</div>` : ""}</div>`).join("");
  }

  const editors = {};
  function mountEditors(root, pid) {
    const ex = EX()[pid];
    root.querySelectorAll("[data-editor]").forEach((ta) => {
      const id = ta.dataset.editor, i = +id.split("#")[1];
      const t = ex.tasks[i];
      const ed = makeEditor(ta, t.lang);
      editors[id] = ed;
      let timer;
      ed.onChange(() => { clearTimeout(timer); timer = setTimeout(() => { P.tasks[id] = Object.assign(P.tasks[id] || {}, { code: ed.get() }); save(); }, 400); });
    });
  }

  async function runTask(id, root) {
    const [pid, i] = id.split("#");
    const t = EX()[pid].tasks[+i];
    const card = root.querySelector(`[data-task="${CSS.escape(id)}"]`);
    const status = card.querySelector(".run-status"), out = card.querySelector(".results");
    const code = editors[id] ? editors[id].get() : card.querySelector("textarea").value;
    P.tasks[id] = Object.assign(P.tasks[id] || {}, { code });
    status.textContent = { c: "Compiling on Compiler Explorer…", python: "Running Python (first run downloads ~10 MB)…", sql: "Running SQL…" }[t.lang] || "Checking…";
    card.querySelector("[data-run]").disabled = true;
    try {
      const results = await RUNNERS[t.lang](t, code, card.querySelector(".preview-host"));
      const ok = results.length > 0 && results.every((r) => r.ok);
      const st = P.tasks[id];
      st.tried = true; st.tries = (st.tries || 0) + 1; if (ok) st.passed = true;
      save();
      out.innerHTML = resultsHTML(results, t.lang);
      status.textContent = "";
      updateHead(card, st);
      const sc = root.querySelector(".practice-score"); if (sc) sc.outerHTML = scoreHTML(pid);
      document.dispatchEvent(new CustomEvent("practice-change"));
    } catch (e) {
      out.innerHTML = `<div class="res bad"><div class="res-title">Couldn't run the checker</div><pre class="code err">${esc(e.message)}</pre>
        <div class="small">${t.lang === "c" ? "The C checker uses the free Compiler Explorer service (godbolt.org). Check your internet connection, or test locally: <code>gcc -Wall -Werror -Wextra -pedantic -std=gnu89 *.c</code> using the test file above." : "Check your internet connection — the runner is downloaded the first time you use it."}</div></div>`;
      status.textContent = "";
    } finally { card.querySelector("[data-run]").disabled = false; }
  }
  function updateHead(card, st) {
    const row = card.querySelector(".practice-head .btn-row");
    row.querySelectorAll(".chip.ok,.chip.warn:not(:first-child)").forEach((c) => { if (/passed|not yet/.test(c.textContent)) c.remove(); });
    row.insertAdjacentHTML("beforeend", st.passed ? `<span class="chip ok">${icon("check")} passed</span>` : `<span class="chip warn">not yet</span>`);
    const sb = card.querySelector("[data-show-sol]");
    if (sb && (st.passed || st.tries >= 3)) sb.textContent = "Show a solution";
  }

  /* ================= Project practice page ================= */
  function stats(pid) {
    const ex = EX()[pid];
    if (!ex) return null;
    const quiz = ex.quiz || [], tasks = ex.tasks || [];
    const ans = P.quiz[pid] || {};
    const qRight = quiz.filter((q, i) => ans[i] === q[2]).length;
    const tPassed = tasks.filter((t, i) => (P.tasks[taskId(pid, i)] || {}).passed).length;
    const total = quiz.length + tasks.length;
    return { quiz: quiz.length, qRight, qDone: Object.keys(ans).length, tasks: tasks.length, tPassed, pct: total ? Math.round(((qRight + tPassed) / total) * 100) : 0 };
  }

  function projectPage(pid, project) {
    const ex = EX()[pid];
    if (!ex) return `<p class="lead">No practice for this project yet.</p>`;
    const s = stats(pid);
    const kinds = [...new Set((ex.tasks || []).map((t) => t.lang))];
    const notes = [];
    if (kinds.includes("c")) notes.push("C is compiled and run on <a href=\"https://godbolt.org\" target=\"_blank\" rel=\"noopener\">Compiler Explorer</a> with the ALX flags <code>" + C_FLAGS + "</code>, so your code must follow C89 rules (declare variables at the top of blocks, no <code>//</code> comments). You also get <code>_putchar</code> for free, like on ALX.");
    if (kinds.includes("python")) notes.push("Python runs in your browser with Pyodide (Python 3.12). The first run downloads it, which takes a few seconds.");
    if (kinds.includes("js")) notes.push("JavaScript runs in your browser with a small Node-style environment (<code>require</code>, <code>process.argv</code>, <code>console.log</code>, an in-memory <code>fs</code>).");
    if (kinds.includes("sql")) notes.push("SQL runs on SQLite in your browser. ALX uses MySQL, but these tasks use SQL that works in both. Your result is compared with a reference query on the same data.");
    if (kinds.includes("regex")) notes.push("Regex tasks are checked the way ALX does it: <code>puts ARGV[0].scan(/your regex/).join</code>. JavaScript and Ruby regexes share the syntax used here.");
    if (kinds.includes("shell")) notes.push("Bash answers are pattern-checked, because a real shell can't run in the browser. Practise them in a real terminal too.");
    return `${scoreHTML(pid)}
      ${notes.length ? `<div class="tip">${notes.join("<br>")}</div>` : ""}
      ${ex.quiz && ex.quiz.length ? quizHTML(pid, ex.quiz) : ""}
      ${(ex.tasks || []).length ? `<h2>Tasks</h2>` + ex.tasks.map((t, i) => taskHTML(pid, t, i)).join("") : ""}
      ${ex.manual ? `<h2>Practical work (check it yourself)</h2><div class="card"><p class="muted" style="margin-top:0">These need a real server or terminal, so tick them off yourself when done.</p>${ex.manual.map((m, i) => { const id = pid + "#m" + i; const d = (P.tasks[id] || {}).passed; return `<label class="check ${d ? "is-done" : ""}"><input type="checkbox" data-manual="${esc(id)}" ${d ? "checked" : ""}><span class="txt">${m}</span></label>`; }).join("")}</div>` : ""}`;
  }

  function scoreHTML(pid) {
    const s = stats(pid);
    return `<div class="practice-score card"><div><div class="big-title">${s.pct}%</div><div class="muted small">Quiz ${s.qRight}/${s.quiz} · Tasks ${s.tPassed}/${s.tasks}</div></div>
        <div class="bar" style="flex:1;min-width:140px"><span style="width:${s.pct}%"></span></div></div>`;
  }
  function refreshQuiz(root, qid) {
    const sec = root.querySelector("[data-quiz]");
    if (sec) sec.outerHTML = quizHTML(qid, EX()[qid].quiz);
    const sc = root.querySelector(".practice-score");
    if (sc && EX()[qid].tasks) sc.outerHTML = scoreHTML(qid);
    document.dispatchEvent(new CustomEvent("practice-change"));
  }

  function bindProject(root, pid) {
    mountEditors(root, pid);
    root.addEventListener("click", (e) => {
      const b = e.target.closest("[data-qa],[data-quiz-reset],[data-run],[data-reset-code],[data-show-sol]");
      if (!b) return;
      if (b.dataset.qa) {
        const [i, j] = b.dataset.qa.split(":").map(Number);
        (P.quiz[pid] = P.quiz[pid] || {})[i] = j; save(); refreshQuiz(root, pid);
      } else if (b.dataset.quizReset) { delete P.quiz[pid]; save(); refreshQuiz(root, pid); }
      else if (b.dataset.run) runTask(b.dataset.run, root);
      else if (b.dataset.resetCode) {
        const id = b.dataset.resetCode, t = EX()[pid].tasks[+id.split("#")[1]];
        if (confirm("Replace your code with the starter code?")) { editors[id].set(t.start || ""); P.tasks[id] = Object.assign(P.tasks[id] || {}, { code: t.start || "" }); save(); }
      } else if (b.dataset.showSol) {
        const id = b.dataset.showSol, t = EX()[pid].tasks[+id.split("#")[1]], st = P.tasks[id] || {};
        const box = root.querySelector(`[data-task="${CSS.escape(id)}"] .sol`);
        if (!st.passed && (st.tries || 0) < 3) { box.innerHTML = `<p class="small muted">Give it at least 3 real tries first — struggling is where the learning happens. Re-read the resources, use the test file, and print intermediate values.</p>`; return; }
        box.innerHTML = `<div class="muted small">One possible solution${st.passed ? "" : " (read it, close it, then write your own version from memory)"}:</div><pre class="code">${esc(t.sol)}</pre>`;
      }
    });
    root.addEventListener("change", (e) => {
      const m = e.target.dataset.manual;
      if (m) { P.tasks[m] = { passed: e.target.checked }; save(); e.target.closest(".check").classList.toggle("is-done", e.target.checked); document.dispatchEvent(new CustomEvent("practice-change")); }
    });
  }

  /* ================= Japanese: drawing pad ================= */
  const SAMPLES = 24;
  const strokeCache = {};
  function strokePoints(ch) {
    if (strokeCache[ch]) return strokeCache[ch];
    const d = (window.STROKES || {})[ch];
    if (!d) return null;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "0"); svg.setAttribute("height", "0"); svg.style.position = "absolute";
    document.body.appendChild(svg);
    const pts = d.map((pd) => {
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", pd); svg.appendChild(p);
      const L = p.getTotalLength(), arr = [];
      for (let i = 0; i < SAMPLES; i++) { const q = p.getPointAtLength((L * i) / (SAMPLES - 1)); arr.push([q.x, q.y]); }
      return { pts: arr, len: L };
    });
    svg.remove();
    return (strokeCache[ch] = pts);
  }
  function resample(points, n) {
    if (points.length < 2) return Array(n).fill(points[0] || [0, 0]);
    const segs = [0];
    for (let i = 1; i < points.length; i++) segs.push(segs[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
    const L = segs[segs.length - 1];
    if (L === 0) return Array(n).fill(points[0]);
    const out = []; let j = 1;
    for (let i = 0; i < n; i++) {
      const target = (L * i) / (n - 1);
      while (j < segs.length - 1 && segs[j] < target) j++;
      const t = (target - segs[j - 1]) / (segs[j] - segs[j - 1] || 1);
      out.push([points[j - 1][0] + (points[j][0] - points[j - 1][0]) * t, points[j - 1][1] + (points[j][1] - points[j - 1][1]) * t]);
    }
    return { pts: out, len: L };
  }
  function strokeScore(user, exp) {
    let d = 0, dr = 0;
    for (let i = 0; i < SAMPLES; i++) {
      d += Math.hypot(user[i][0] - exp[i][0], user[i][1] - exp[i][1]);
      dr += Math.hypot(user[SAMPLES - 1 - i][0] - exp[i][0], user[SAMPLES - 1 - i][1] - exp[i][1]);
    }
    return { avg: d / SAMPLES, rev: dr / SAMPLES };
  }

  function drawPad(host, ch, opts) {
    opts = opts || {};
    const strokes = (window.STROKES || {})[ch];
    if (!strokes) { host.innerHTML = `<p class="muted">No stroke data for ${esc(ch)}.</p>`; return; }
    const exp = strokePoints(ch);
    let next = 0, misses = 0, totalMisses = 0, outline = opts.outline !== false;
    host.innerHTML = `<div class="pad-wrap">
        <div class="pad" style="touch-action:none">
          <svg class="pad-svg" viewBox="0 0 109 109" aria-hidden="true">
            <line x1="54.5" y1="0" x2="54.5" y2="109" class="grid"/><line x1="0" y1="54.5" x2="109" y2="54.5" class="grid"/>
            <g class="outline">${strokes.map((d) => `<path d="${d}"/>`).join("")}</g>
            <g class="hint"></g><g class="ink"></g>
          </svg>
          <canvas class="pad-canvas"></canvas>
        </div>
        <div class="pad-side">
          <div class="pad-status" aria-live="polite">Stroke 1 of ${strokes.length}</div>
          <div class="btn-row">
            <button class="btn sm" data-pad="hint">${icon("hint")} Hint</button>
            <button class="btn sm" data-pad="outline">${outline ? "Hide" : "Show"} outline</button>
            <button class="btn sm" data-pad="animate">${icon("play")} Stroke order</button>
            <button class="btn sm" data-pad="restart">${icon("restart")} Restart</button>
          </div>
        </div></div>`;
    const svg = host.querySelector(".pad-svg"), cv = host.querySelector(".pad-canvas"), pad = host.querySelector(".pad");
    const status = host.querySelector(".pad-status");
    const outlineG = svg.querySelector(".outline"), inkG = svg.querySelector(".ink"), hintG = svg.querySelector(".hint");
    outlineG.style.display = outline ? "" : "none";
    const ctx = cv.getContext("2d");
    function size() {
      const r = pad.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
      cv.width = r.width * dpr; cv.height = r.height * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size();
    const toUnits = (e) => { const r = pad.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 109, ((e.clientY - r.top) / r.height) * 109]; };
    let cur = null;
    cv.addEventListener("pointerdown", (e) => {
      if (next >= strokes.length) return;
      cv.setPointerCapture(e.pointerId); cur = [toUnits(e)]; size();
      ctx.lineWidth = Math.max(4, pad.getBoundingClientRect().width / 30); ctx.lineCap = "round"; ctx.lineJoin = "round";
      ctx.strokeStyle = getComputedStyle(host).getPropertyValue("--text") || "#222";
      ctx.beginPath(); const r = pad.getBoundingClientRect(); ctx.moveTo(e.clientX - r.left, e.clientY - r.top);
    });
    cv.addEventListener("pointermove", (e) => {
      if (!cur) return; cur.push(toUnits(e));
      const r = pad.getBoundingClientRect(); ctx.lineTo(e.clientX - r.left, e.clientY - r.top); ctx.stroke();
    });
    const finish = () => {
      if (!cur) return;
      const pts = cur; cur = null; ctx.clearRect(0, 0, cv.width, cv.height);
      const u = resample(pts, SAMPLES), e = exp[next];
      const sc = strokeScore(u.pts, e.pts);
      const tol = outline ? 13 : 16;
      const shortStroke = e.len < 18;
      const startD = Math.hypot(u.pts[0][0] - e.pts[0][0], u.pts[0][1] - e.pts[0][1]);
      const ok = sc.avg < (shortStroke ? tol + 4 : tol) && startD < (shortStroke ? 22 : 24) && u.len > e.len * 0.35 && u.len < e.len * 2.6 + 10;
      if (ok) {
        inkG.insertAdjacentHTML("beforeend", `<path d="${strokes[next]}"/>`); hintG.innerHTML = ""; next++; misses = 0;
        if (next === strokes.length) {
          status.innerHTML = `<span class="ok-text">${icon("check")} Done!</span> ${totalMisses ? `${totalMisses} mistake${totalMisses > 1 ? "s" : ""}` : "Perfect — no mistakes"}`;
          opts.onDone && opts.onDone(totalMisses);
        } else status.textContent = `Stroke ${next + 1} of ${strokes.length}`;
      } else {
        misses++; totalMisses++;
        const why = sc.rev < sc.avg * 0.6 && sc.rev < tol ? "Wrong direction — strokes go top to bottom, left to right." : startD >= 24 ? "That stroke starts in a different place." : "Not quite — that's not the next stroke in the order.";
        status.innerHTML = `<span class="bad-text">${icon("x")}</span> ${why} (stroke ${next + 1} of ${strokes.length})`;
        if (misses >= 2) showHint();
      }
    };
    cv.addEventListener("pointerup", finish); cv.addEventListener("pointercancel", finish);
    function showHint() {
      hintG.innerHTML = `<path d="${strokes[next]}" pathLength="1" class="anim"/>`;
      const s = exp[next].pts[0];
      hintG.insertAdjacentHTML("beforeend", `<circle cx="${s[0]}" cy="${s[1]}" r="3.2"/>`);
    }
    host.addEventListener("click", (e) => {
      const b = e.target.closest("[data-pad]"); if (!b) return;
      const a = b.dataset.pad;
      if (a === "hint" && next < strokes.length) showHint();
      if (a === "outline") { outline = !outline; outlineG.style.display = outline ? "" : "none"; b.textContent = (outline ? "Hide" : "Show") + " outline"; }
      if (a === "restart") { next = 0; misses = 0; totalMisses = 0; inkG.innerHTML = ""; hintG.innerHTML = ""; status.textContent = `Stroke 1 of ${strokes.length}`; }
      if (a === "animate") {
        hintG.innerHTML = strokes.map((d, i) => `<path d="${d}" pathLength="1" class="anim" style="animation-delay:${i * 0.6}s"/>`).join("");
        setTimeout(() => { if (hintG.querySelector(".anim")) hintG.innerHTML = ""; }, strokes.length * 600 + 900);
      }
    });
  }

  /* ================= Japanese: day practice ================= */
  function seeded(seed) { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); }
  function shuffle(arr, rnd) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

  // Which characters does a given Japanese day drill?
  function jpPlan(dayIndex) {
    const J = window.JPDATA, days = window.JAPANESE.days, day = days[dayIndex];
    const rnd = seeded(dayIndex + 7);
    const hira = J.H, kt = J.toKata;
    const rowsFor = { 0: ["a", "ka", "sa"], 1: ["ta", "na"], 2: ["ha", "ma"], 3: ["ya", "ra", "wa"], 4: ["ga", "za", "da", "ba", "pa"] };
    const allBasic = ["a", "ka", "sa", "ta", "na", "ha", "ma", "ya", "ra", "wa"];
    const learnedRows = (k) => { const out = []; for (let i = 0; i <= Math.min(k, 4); i++) out.push(...rowsFor[i]); return out; };
    const kanaOf = (rows, kata) => rows.flatMap((r) => [...hira[r]]).map((c) => (kata ? kt(c) : c));
    let draw = [], quizPool = [], kind = "kana";
    if (dayIndex < 7) { // hiragana days
      const k = dayIndex;
      draw = k <= 4 ? kanaOf(rowsFor[k], false) : k === 5 ? ["ゃ", "ゅ", "ょ", "っ"] : shuffle(kanaOf(allBasic, false), rnd).slice(0, 10);
      quizPool = kanaOf(k <= 4 ? learnedRows(k) : learnedRows(4), false).map((c) => [c, J.kana[c]]);
      if (k >= 5) quizPool = quizPool.concat(Object.entries(J.combos).filter(([c]) => /[ぁ-ゖ]/.test(c)));
    } else if (dayIndex < 14) { // katakana days
      const k = dayIndex - 7;
      const map = { 0: ["a", "ka", "sa"], 1: ["ta", "na", "ha"], 2: ["ma", "ya", "ra", "wa"], 3: ["ga", "za", "da", "ba", "pa"] };
      draw = k <= 3 ? kanaOf(map[k], true).concat(k === 3 ? ["ー", "ッ"] : []) : k === 4 ? ["シ", "ツ", "ソ", "ン", "ノ", "メ"] : shuffle(kanaOf(allBasic, true), rnd).slice(0, 10);
      const learned = []; for (let i = 0; i <= Math.min(k, 3); i++) learned.push(...map[i]);
      quizPool = kanaOf(learned, true).map((c) => [c, J.kana[c]]);
    } else {
      kind = "kanji";
      const n5 = J.KANJI.slice(0, 103), n4 = J.KANJI.slice(103);
      const stage = day.stage;
      const stageDays = days.map((d, i) => [d, i]).filter(([d]) => d.stage === stage).map(([, i]) => i);
      const pos = stageDays.indexOf(dayIndex);
      let fresh = [], learned = [];
      if (/Starter/.test(stage)) { const a = Math.floor((pos * n5.length) / stageDays.length), b = Math.floor(((pos + 1) * n5.length) / stageDays.length); fresh = n5.slice(a, b); learned = n5.slice(0, b); }
      else if (/Elementary 1/.test(stage)) { const a = Math.floor((pos * n4.length) / stageDays.length), b = Math.floor(((pos + 1) * n4.length) / stageDays.length); fresh = n4.slice(a, b); learned = n5.concat(n4.slice(0, b)); }
      else { learned = J.KANJI; }
      const review = shuffle(learned.filter((k) => !fresh.includes(k)), rnd).slice(0, fresh.length ? 2 : 5);
      draw = fresh.concat(review).map((k) => k[0]);
      quizPool = learned.map((k) => [k[0], k[3]]);
      if (!learned.length) quizPool = J.KANJI.slice(0, 10).map((k) => [k[0], k[3]]);
    }
    // vocabulary grows with the day number
    const vocabN = Math.min(window.JPDATA.VOCAB.length, 15 + Math.max(0, dayIndex - 10) * 2);
    return { kind, draw, quizPool, vocab: window.JPDATA.VOCAB.slice(0, vocabN), rnd };
  }

  function makeJpQuiz(plan, dayIndex) {
    const rnd = seeded(dayIndex * 31 + 3);
    const qs = [];
    const pool = plan.quizPool;
    shuffle(pool, rnd).slice(0, 6).forEach(([c, ans]) => {
      const wrong = shuffle(pool.filter((p) => p[1] !== ans), rnd).slice(0, 3).map((p) => p[1]);
      const opts = shuffle([ans, ...wrong], rnd);
      qs.push([plan.kind === "kana" ? `What's the reading of <span class="jp big-char">${c}</span>?` : `What does <span class="jp big-char">${c}</span> mean?`, opts, opts.indexOf(ans)]);
    });
    if (dayIndex >= 6) shuffle(plan.vocab, rnd).slice(0, 4).forEach(([kana, kanji, meaning]) => {
      const wrong = shuffle(plan.vocab.filter((v) => v[2] !== meaning), rnd).slice(0, 3).map((v) => v[2]);
      const opts = shuffle([meaning, ...wrong], rnd);
      qs.push([`What does <span class="jp big-char">${kanji && dayIndex > 30 ? kanji : kana}</span>${kanji && dayIndex > 30 ? ` <span class="muted jp">(${kana})</span>` : ""} mean?`, opts, opts.indexOf(meaning)]);
    });
    return qs;
  }

  function jpPage(dayIndex) {
    const days = window.JAPANESE.days, day = days[dayIndex];
    if (!day) return `<p>Unknown day.</p>`;
    const plan = jpPlan(dayIndex);
    const st = P.jp[dayIndex] = P.jp[dayIndex] || { drawn: {} };
    const quiz = makeJpQuiz(plan, dayIndex);
    const qid = "jp:" + dayIndex;
    window.EX = window.EX || {}; window.EX[qid] = { quiz };
    const drawnCount = plan.draw.filter((c) => st.drawn[c]).length;
    return `<div class="crumbs"><a href="#japanese">Japanese</a> › ${esc(day.stage)}</div>
      <h1>${esc(day.title)}</h1><p class="lead">Day ${dayIndex + 1}. Draw each character stroke by stroke. The checker follows the official stroke order and direction. Then do the quick quiz.</p>
      <div class="practice-score card"><div><div class="big-title">${drawnCount}/${plan.draw.length}</div><div class="muted small">characters drawn</div></div><div class="bar" style="flex:1;min-width:140px"><span style="width:${Math.round((drawnCount / plan.draw.length) * 100)}%"></span></div></div>
      <h2>${icon("pen")} Draw</h2>
      <div class="char-tabs" role="tablist">${plan.draw.map((c, i) => `<button class="char-tab ${st.drawn[c] ? "done" : ""}" data-char="${i}" role="tab"><span class="jp">${c}</span></button>`).join("")}</div>
      <div class="card draw-card">
        <div class="draw-info"><div class="jp huge-char" data-cur-char></div><div><div class="big-title" data-cur-info></div><label class="check small"><input type="checkbox" data-recall> Recall mode (no outline — draw from memory)</label></div></div>
        <div data-pad-host></div>
        <div class="btn-row"><button class="btn sm" data-char-nav="-1">${icon("arrow-left")} Previous</button><button class="btn sm" data-char-nav="1">Next ${icon("arrow-right")}</button></div>
      </div>
      <p class="tip">Tip: use a finger or stylus on a phone or tablet. On a laptop, a mouse works fine.</p>
      <h2>${icon("quiz")} Quick quiz</h2>
      ${quizHTML(qid, quiz)}
      ${dayIndex >= 14 ? `<p class="tip">IRODORI's own exercises have answer keys in the free "Answers & scripts" PDFs. Check the listening and reading tasks there.</p>` : ""}`;
  }

  function bindJp(root, dayIndex) {
    const plan = jpPlan(dayIndex), J = window.JPDATA;
    const st = P.jp[dayIndex];
    let idx = Math.max(0, plan.draw.findIndex((c) => !st.drawn[c]));
    let recall = false;
    const info = (c) => {
      if (J.kana[c]) return "“" + J.kana[c] + "”";
      if (J.combos[c]) return "“" + J.combos[c] + "”";
      const k = J.KANJI.find((x) => x[0] === c);
      return k ? `${k[3]} <span class="muted small jp">${[k[1], k[2]].filter(Boolean).join(" · ")}</span>` : ({ "ゃ": "small ya", "ゅ": "small yu", "ょ": "small yo", "っ": "small tsu", "ッ": "small tsu", "ー": "long vowel mark" }[c] || "");
    };
    function show() {
      const c = plan.draw[idx];
      root.querySelector("[data-cur-char]").textContent = recall ? "?" : c;
      root.querySelector("[data-cur-info]").innerHTML = info(c);
      root.querySelectorAll(".char-tab").forEach((t, i) => t.classList.toggle("active", i === idx));
      drawPad(root.querySelector("[data-pad-host]"), c, {
        outline: !recall,
        onDone: (miss) => {
          st.drawn[c] = true;
          const cs = P.chars[c] = P.chars[c] || { n: 0, miss: 0 }; cs.n++; cs.miss += miss;
          save(); root.querySelectorAll(".char-tab")[idx].classList.add("done");
          const n = plan.draw.filter((x) => st.drawn[x]).length, sc = root.querySelector(".practice-score");
          if (sc) { sc.querySelector(".big-title").textContent = n + "/" + plan.draw.length; sc.querySelector(".bar span").style.width = Math.round((n / plan.draw.length) * 100) + "%"; }
          document.dispatchEvent(new CustomEvent("practice-change"));
          if (recall) root.querySelector("[data-cur-char]").textContent = c;
        },
      });
    }
    show();
    root.addEventListener("click", (e) => {
      const t = e.target.closest("[data-char],[data-char-nav],[data-qa],[data-quiz-reset]");
      if (!t) return;
      if (t.dataset.char !== undefined) { idx = +t.dataset.char; show(); }
      else if (t.dataset.charNav) { idx = (idx + +t.dataset.charNav + plan.draw.length) % plan.draw.length; show(); }
      else if (t.dataset.qa) { const [i, j] = t.dataset.qa.split(":").map(Number); const k = "jp:" + dayIndex; (P.quiz[k] = P.quiz[k] || {})[i] = j; save(); refreshQuiz(root, k); }
      else if (t.dataset.quizReset) { delete P.quiz["jp:" + dayIndex]; save(); refreshQuiz(root, "jp:" + dayIndex); }
    });
    root.addEventListener("change", (e) => { if (e.target.dataset.recall !== undefined) { recall = e.target.checked; show(); } });
  }

  function jpDayStats(dayIndex) {
    if (!window.JAPANESE.days[dayIndex] || !window.STROKES) return null;
    const plan = jpPlan(dayIndex), st = P.jp[dayIndex] || { drawn: {} };
    return { drawn: plan.draw.filter((c) => st.drawn[c]).length, total: plan.draw.length };
  }

  window.Practice = { projectPage, bindProject, stats, jpPage, bindJp, jpDayStats, drawPad, _P: () => P, _reload: loadP };
})();
