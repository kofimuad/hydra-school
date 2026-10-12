/* Practice for the Frontend specialization (HTML/CSS, responsive, accessibility, React, Redux). */
(function () {
  const EX = (window.EX = window.EX || {});
  const html = (t, file, p, start, sol, checks, extra) => Object.assign({ t, lang: "html", file, p, start, sol, checks }, extra || {});
  const doc = (head, body) => `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Practice</title>\n${head || ""}</head>\n<body>\n${body || ""}\n</body>\n</html>\n`;
  const css = (rules) => `  <style>\n${rules}\n  </style>\n`;
  const REACT = '  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js"></script>\n  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"></script>\n  <script src="https://unpkg.com/@babel/standalone@7.24.7/babel.min.js"></script>\n';
  const reactDoc = (code) => doc(REACT, `  <div id="root"></div>\n  <script type="text/babel">\n${code}\n  </script>`);
  const style = (sel, prop) => `const el = d.querySelector(${JSON.stringify(sel)}); return el && w.getComputedStyle(el)[${JSON.stringify(prop)}]`;

  /* ---------------- HTML advanced ---------------- */
  EX["fe-00"] = {
    quiz: [
      ["Which element should wrap the main navigation links?", ["&lt;div class=\"nav\"&gt;", "&lt;nav&gt;", "&lt;menu&gt;", "&lt;header&gt; only"], 1],
      ["How many &lt;main&gt; elements may a page have (visible)?", ["As many as you like", "One", "Zero", "Two"], 1],
      ["Which attribute provides alternative text for an image?", ["title", "alt", "src", "aria-image"], 1],
      ["What is semantic HTML?", ["HTML with CSS", "Using elements that describe their meaning (header, article, footer…)", "HTML without JavaScript", "Minified HTML"], 1],
      ["Which tag defines a table header cell?", ["&lt;td&gt;", "&lt;th&gt;", "&lt;thead&gt; only", "&lt;tr&gt;"], 1],
    ],
    tasks: [
      html("Semantic page skeleton", "0-index.html", "<p>Build a page with semantic structure: a <code>&lt;header&gt;</code> containing an <code>&lt;h1&gt;</code> and a <code>&lt;nav&gt;</code> with at least 3 links; a <code>&lt;main&gt;</code> containing at least 2 <code>&lt;article&gt;</code> elements, each with an <code>&lt;h2&gt;</code>; and a <code>&lt;footer&gt;</code>. Set <code>lang=\"en\"</code> on <code>&lt;html&gt;</code>.</p>",
        doc("", "  <!-- your page here -->"),
        doc("", "  <header>\n    <h1>Holberton School</h1>\n    <nav>\n      <a href=\"#home\">Home</a>\n      <a href=\"#courses\">Courses</a>\n      <a href=\"#contact\">Contact</a>\n    </nav>\n  </header>\n  <main>\n    <article><h2>Low-level</h2><p>C and Unix.</p></article>\n    <article><h2>Web</h2><p>HTML, CSS, JS.</p></article>\n  </main>\n  <footer>Holberton School © 2024</footer>"),
        [["html has lang=\"en\"", "return d.documentElement.lang === 'en';"], ["header contains h1 and nav", "return !!d.querySelector('header h1') && !!d.querySelector('header nav');"], ["nav has at least 3 links", "return d.querySelectorAll('nav a[href]').length >= 3;"], ["main has at least 2 articles with an h2", "const a = d.querySelectorAll('main article'); return a.length >= 2 && [...a].every((x) => x.querySelector('h2'));"], ["there is one footer", "return d.querySelectorAll('footer').length === 1;"]]),
      html("A data table", "1-table.html", "<p>Create a table with a <code>&lt;caption&gt;</code>, a <code>&lt;thead&gt;</code> with three <code>&lt;th scope=\"col\"&gt;</code> headers (<code>Name</code>, <code>Project</code>, <code>Score</code>), and a <code>&lt;tbody&gt;</code> with at least 2 rows.</p>",
        doc("", ""),
        doc("", "  <table>\n    <caption>Scores</caption>\n    <thead><tr><th scope=\"col\">Name</th><th scope=\"col\">Project</th><th scope=\"col\">Score</th></tr></thead>\n    <tbody>\n      <tr><td>Bob</td><td>printf</td><td>98</td></tr>\n      <tr><td>Ann</td><td>shell</td><td>100</td></tr>\n    </tbody>\n  </table>"),
        [["table has a caption", "return !!d.querySelector('table > caption');"], ["three column headers with scope=col in thead", "const th = d.querySelectorAll('thead th[scope=col]'); return th.length === 3 && [...th].map((x) => x.textContent.trim()).join() === 'Name,Project,Score';"], ["tbody has at least 2 rows", "return d.querySelectorAll('tbody tr').length >= 2;"]]),
    ],
  };
  EX["fe-01"] = {
    quiz: [
      ["Which DevTools panel shows every request a page makes?", ["Elements", "Network", "Sources", "Application"], 1],
      ["Where can you see and edit the CSS rules applied to an element?", ["Console", "Elements → Styles", "Network", "Memory"], 1],
      ["What does Lighthouse audit?", ["Only JavaScript errors", "Performance, accessibility, best practices and SEO", "Git history", "Server logs"], 1],
      ["How do you pause JavaScript on a line?", ["alert()", "Set a breakpoint in Sources (or write <code>debugger;</code>)", "console.log", "Reload"], 1],
    ],
    tasks: [],
    manual: ["Run a Lighthouse audit on a site you like and write down 3 improvements", "Find the slowest network request on a news website and its size", "Change the colours of a page live with the Styles panel"],
  };
  EX["fe-02"] = {
    quiz: [
      ["Which selector has the highest specificity?", ["p", ".intro", "#main", "*"], 2],
      ["What does <code>box-sizing: border-box</code> change?", ["Nothing", "Width/height include padding and border", "Removes margins", "Makes it a flex box"], 1],
      ["Which value takes an element out of the normal flow and positions it relative to its nearest positioned ancestor?", ["static", "relative", "absolute", "sticky"], 2],
      ["What does <code>::before</code> create?", ["A sibling element", "A pseudo-element as the first child of the element", "A parent", "A new stylesheet"], 1],
    ],
    tasks: [
      html("Style a card", "0-card.html", "<p>Style the <code>.card</code> element: <code>box-sizing: border-box</code>, a width of <code>300px</code>, padding of <code>16px</code>, a <code>1px solid</code> border and <code>border-radius: 8px</code>. Make <code>.card h2</code> use <code>font-size: 24px</code>.</p>",
        doc(css("    /* your CSS */"), "  <div class=\"card\">\n    <h2>Card title</h2>\n    <p>Some text.</p>\n  </div>"),
        doc(css("    .card { box-sizing: border-box; width: 300px; padding: 16px; border: 1px solid #ccc; border-radius: 8px; }\n    .card h2 { font-size: 24px; }"), "  <div class=\"card\">\n    <h2>Card title</h2>\n    <p>Some text.</p>\n  </div>"),
        [[".card uses border-box and is 300px wide (including padding/border)", "const el = d.querySelector('.card'); return w.getComputedStyle(el).boxSizing === 'border-box' && Math.round(el.getBoundingClientRect().width) === 300;"], [".card has 16px padding", `${style(".card", "paddingTop")} === '16px' && w.getComputedStyle(el).paddingLeft === '16px';`], [".card has a 1px solid border and 8px radius", "const s = w.getComputedStyle(d.querySelector('.card')); return s.borderTopWidth === '1px' && s.borderTopStyle === 'solid' && s.borderTopLeftRadius === '8px';"], [".card h2 is 24px", `${style(".card h2", "fontSize")} === '24px';`]]),
      html("Center things", "1-center.html", "<p>Center the <code>.box</code> both horizontally and vertically inside <code>.wrapper</code> (which is 300px tall), using flexbox or grid.</p>",
        doc(css("    .wrapper { height: 300px; background: #eee; }\n    .box { width: 100px; height: 100px; background: tomato; }"), "  <div class=\"wrapper\"><div class=\"box\"></div></div>"),
        doc(css("    .wrapper { height: 300px; background: #eee; display: flex; justify-content: center; align-items: center; }\n    .box { width: 100px; height: 100px; background: tomato; }"), "  <div class=\"wrapper\"><div class=\"box\"></div></div>"),
        [["The box is centred", "const W = d.querySelector('.wrapper').getBoundingClientRect(), B = d.querySelector('.box').getBoundingClientRect(); return Math.abs((B.left + B.width / 2) - (W.left + W.width / 2)) < 2 && Math.abs((B.top + B.height / 2) - (W.top + W.height / 2)) < 2;"]]),
    ],
  };
  EX["fe-03"] = {
    quiz: [
      ["What does mobile-first mean?", ["Only mobile is supported", "Write base styles for small screens, then add media queries for larger ones", "Use apps instead of websites", "Test on mobile last"], 1],
      ["Which meta tag makes mobile browsers use the device width?", ["&lt;meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"&gt;", "&lt;meta mobile=\"yes\"&gt;", "&lt;meta charset=\"mobile\"&gt;", "&lt;meta width=\"100%\"&gt;"], 0],
      ["Which media query targets screens at least 768px wide?", ["@media (max-width: 768px)", "@media (min-width: 768px)", "@media screen 768", "@media (width > 768)only"], 1],
      ["Why use relative units like rem or %?", ["They're shorter", "Layouts adapt to screen sizes and user font settings", "Browsers require them", "They're faster"], 1],
    ],
    tasks: [
      html("Responsive columns", "0-responsive.html", "<p>Make <code>.cols</code> show its children in one column on small screens and in a <strong>row</strong> (side by side) when the screen is at least <code>600px</code> wide. Include the viewport meta tag. (The checker reads your stylesheet and tests the layout in a wide preview.)</p>",
        doc("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" + css("    .cols > div { padding: 10px; background: #ddd; }\n    /* your CSS */"), "  <div class=\"cols\"><div>One</div><div>Two</div><div>Three</div></div>"),
        doc("  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" + css("    .cols > div { padding: 10px; background: #ddd; }\n    .cols { display: flex; flex-direction: column; }\n    @media (min-width: 600px) {\n      .cols { flex-direction: row; }\n    }"), "  <div class=\"cols\"><div>One</div><div>Two</div><div>Three</div></div>"),
        [["The viewport meta tag is present", "const m = d.querySelector('meta[name=viewport]'); return !!m && /width=device-width/.test(m.content);"], ["A min-width: 600px media query exists", "return [...d.styleSheets].some((s) => [...s.cssRules].some((r) => r.media && /min-width:\\s*600px/.test(r.media.mediaText)));"], ["At this (wide) width, the items sit side by side", "const k = d.querySelectorAll('.cols > div'); return w.innerWidth < 600 || Math.abs(k[0].getBoundingClientRect().top - k[1].getBoundingClientRect().top) < 2;"]]),
    ],
  };
  EX["fe-flex"] = {
    quiz: [
      ["Which property puts flex items in a column?", ["flex-wrap: column", "flex-direction: column", "align-items: column", "display: column"], 1],
      ["Which property spaces items along the main axis?", ["align-items", "justify-content", "align-content", "gap only"], 1],
      ["What does <code>flex: 1</code> do on an item?", ["Fixes its width to 1px", "Lets it grow to fill available space equally with others", "Hides it", "Makes it the first item"], 1],
      ["What's the main difference between Flexbox and Grid?", ["None", "Flexbox is one-dimensional (row OR column); Grid is two-dimensional", "Grid is older", "Flexbox only works vertically"], 1],
    ],
    tasks: [
      html("Navigation bar", "0-flexbox.html", "<p>Make <code>nav</code> a flex container: the logo on the left and the links on the right (<code>justify-content: space-between</code>), vertically centred (<code>align-items: center</code>). The links inside <code>.links</code> must also be in a row with a gap.</p>",
        doc(css("    /* your CSS */"), "  <nav>\n    <div class=\"logo\">Logo</div>\n    <div class=\"links\"><a href=\"#\">One</a><a href=\"#\">Two</a><a href=\"#\">Three</a></div>\n  </nav>"),
        doc(css("    nav { display: flex; justify-content: space-between; align-items: center; padding: 10px; }\n    .links { display: flex; gap: 12px; }"), "  <nav>\n    <div class=\"logo\">Logo</div>\n    <div class=\"links\"><a href=\"#\">One</a><a href=\"#\">Two</a><a href=\"#\">Three</a></div>\n  </nav>"),
        [["nav is a flex container with space-between", "const s = w.getComputedStyle(d.querySelector('nav')); return s.display === 'flex' && s.justifyContent === 'space-between' && s.alignItems === 'center';"], ["The links are on the right", "const n = d.querySelector('nav').getBoundingClientRect(), l = d.querySelector('.links').getBoundingClientRect(); return n.right - l.right < 30;"], [".links is a row with a gap", "const s = w.getComputedStyle(d.querySelector('.links')); return s.display === 'flex' && parseFloat(s.columnGap) > 0;"]]),
      html("Grid gallery", "1-grid.html", "<p>Make <code>.gallery</code> a CSS grid with <strong>3 equal columns</strong> and a gap of <code>10px</code>.</p>",
        doc(css("    .gallery div { background: #ccc; height: 60px; }\n    /* your CSS */"), "  <div class=\"gallery\">" + "<div></div>".repeat(6) + "</div>"),
        doc(css("    .gallery div { background: #ccc; height: 60px; }\n    .gallery { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }"), "  <div class=\"gallery\">" + "<div></div>".repeat(6) + "</div>"),
        [[".gallery is a grid with a 10px gap", "const s = w.getComputedStyle(d.querySelector('.gallery')); return s.display === 'grid' && s.columnGap === '10px';"], ["There are 3 equal columns", "const k = [...d.querySelectorAll('.gallery div')].map((x) => x.getBoundingClientRect()); return Math.abs(k[0].top - k[2].top) < 1 && k[3].top > k[0].top && Math.abs(k[0].width - k[1].width) < 1;"]]),
    ],
  };
  EX["fe-sass"] = {
    quiz: [
      ["What is a Sass variable?", ["$primary: #ff4d00;", "--primary: #ff4d00;", "@primary = #ff4d00", "var primary"], 0],
      ["What is a mixin?", ["A colour function", "A reusable block of styles you @include", "A media query", "An import"], 1],
      ["What does nesting <code>.nav { a { color: red; } }</code> compile to?", [".nav, a { color: red }", ".nav a { color: red; }", "a.nav { color: red }", "Error"], 1],
      ["Can browsers read .scss files directly?", ["Yes", "No — they must be compiled to CSS", "Only Chrome", "Only with a meta tag"], 1],
      ["What does <code>@each $c in red, blue { .#{$c} { color: $c; } }</code> generate?", ["Nothing", "Two classes .red and .blue with their colours", "A loop at runtime", "One class"], 1],
    ],
    tasks: [],
    manual: ["Install Sass (<code>npm i -g sass</code>) and compile a file with variables, nesting, a mixin and an @each loop", "Rebuild one of your CSS projects with partials (_variables.scss, _buttons.scss)"],
  };
  EX["fe-a11y"] = {
    quiz: [
      ["What minimum contrast ratio does WCAG AA require for normal text?", ["2:1", "3:1", "4.5:1", "7:1"], 2],
      ["When should you use ARIA?", ["Always, on every element", "When native HTML can't express the role/state — first choice is semantic HTML", "Never", "Only for images"], 1],
      ["How should a decorative image be marked?", ["alt=\"image\"", "alt=\"\" (empty)", "No alt", "aria-hidden=false"], 1],
      ["Why must every interactive element be reachable with the keyboard?", ["SEO", "Many users can't use a mouse (screen readers, motor impairments)", "It's faster", "Browsers require it"], 1],
    ],
    tasks: [
      html("Fix the accessibility issues", "0-a11y.html", "<p>This page has problems. Fix them: the page needs a language; the logo image needs alternative text <code>Holberton logo</code>; the decorative divider image must have an empty alt; the search input needs a <code>&lt;label&gt;</code> linked with <code>for</code>/<code>id</code>; and the clickable <code>div</code> must become a real <code>&lt;button&gt;</code>.</p>",
        "<!DOCTYPE html>\n<html>\n<head>\n  <meta charset=\"UTF-8\">\n  <title>A11y</title>\n</head>\n<body>\n  <img src=\"logo.png\" class=\"logo\">\n  <img src=\"divider.png\" class=\"divider\">\n  <input type=\"search\" id=\"q\" placeholder=\"Search\">\n  <div class=\"go\" onclick=\"search()\">Go</div>\n</body>\n</html>\n",
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <title>A11y</title>\n</head>\n<body>\n  <img src=\"logo.png\" class=\"logo\" alt=\"Holberton logo\">\n  <img src=\"divider.png\" class=\"divider\" alt=\"\">\n  <label for=\"q\">Search</label>\n  <input type=\"search\" id=\"q\" placeholder=\"Search\">\n  <button type=\"button\" class=\"go\">Go</button>\n</body>\n</html>\n",
        [["html has a lang attribute", "return !!d.documentElement.getAttribute('lang');"], ["The logo has alt=\"Holberton logo\"", "return d.querySelector('img.logo').getAttribute('alt') === 'Holberton logo';"], ["The divider has an empty alt", "return d.querySelector('img.divider').getAttribute('alt') === '';"], ["The search input has a label", "const i = d.querySelector('input#q'); return !!i && (i.labels && i.labels.length > 0);"], ["\"Go\" is a real button", "const b = d.querySelector('.go'); return !!b && b.tagName === 'BUTTON';"]]),
    ],
  };
  EX["fe-forms"] = {
    quiz: [
      ["Why shouldn't placeholders replace labels?", ["They're ugly", "They disappear when typing and are poorly read by assistive tech", "They're not valid HTML", "They slow the page"], 1],
      ["Which input type shows an email keyboard on phones and validates format?", ["type=\"text\"", "type=\"email\"", "type=\"mail\"", "type=\"address\""], 1],
      ["Which attribute makes a field mandatory?", ["mandatory", "required", "needed", "validate"], 1],
    ],
    tasks: [
      html("Sign-up form", "0-form.html", "<p>Create a <code>&lt;form&gt;</code> with: an email field (<code>type=\"email\"</code>, <code>name=\"email\"</code>, required), a password field (<code>name=\"password\"</code>, required, <code>minlength=\"8\"</code>), each with a linked <code>&lt;label&gt;</code>, and a submit button.</p>",
        doc("", "  <form>\n  </form>"),
        doc("", "  <form>\n    <label for=\"email\">E-mail address</label>\n    <input type=\"email\" id=\"email\" name=\"email\" required>\n    <label for=\"password\">Password</label>\n    <input type=\"password\" id=\"password\" name=\"password\" required minlength=\"8\">\n    <button type=\"submit\">Continue</button>\n  </form>"),
        [["Email field: type=email, required, labelled", "const i = d.querySelector('form input[name=email]'); return !!i && i.type === 'email' && i.required && i.labels.length > 0;"], ["Password field: required, minlength 8, labelled", "const i = d.querySelector('form input[name=password]'); return !!i && i.type === 'password' && i.required && i.minLength === 8 && i.labels.length > 0;"], ["There's a submit button", "const b = d.querySelector('form button, form input[type=submit]'); return !!b && (b.type === 'submit');"], ["The form is invalid when empty", "return !d.querySelector('form').checkValidity();"], ["…and valid when filled correctly", "d.querySelector('[name=email]').value = 'a@b.co'; d.querySelector('[name=password]').value = '12345678'; return d.querySelector('form').checkValidity();"]]),
    ],
  };

  /* ---------------- React ---------------- */
  EX["re-00"] = {
    quiz: [
      ["What does Webpack do?", ["Runs tests", "Bundles modules (JS, CSS, images) into files for the browser", "Serves APIs", "Formats code"], 1],
      ["What is a loader in Webpack?", ["A plugin for HTML", "A transform applied to files of a type (e.g. babel-loader for .js, css-loader)", "The dev server", "An entry point"], 1],
      ["What's the entry point?", ["The output folder", "The file Webpack starts building the dependency graph from", "The HTML file", "node_modules"], 1],
      ["What does webpack-dev-server add?", ["Minification", "A local server with live/hot reloading", "TypeScript", "Tests"], 1],
    ],
    tasks: [],
    manual: ["Create a Webpack project with an entry, an output in <code>public/</code>, css-loader/style-loader and image loading", "Add webpack-dev-server with hot reloading and code splitting with source maps"],
  };
  EX["re-01"] = {
    quiz: [
      ["What is JSX?", ["A new language", "Syntax that looks like HTML and compiles to React.createElement calls", "A CSS framework", "A test runner"], 1],
      ["Why use <code>className</code> instead of <code>class</code> in JSX?", ["Typo in React", "class is a reserved word in JavaScript", "className is faster", "It's optional"], 1],
      ["How do you render a component into #root (React 18)?", ["ReactDOM.render(&lt;App /&gt;)", "ReactDOM.createRoot(document.getElementById('root')).render(&lt;App /&gt;)", "React.mount('#root')", "document.root = App"], 1],
      ["What must a component return?", ["A string only", "JSX (or null)", "An HTML file", "A promise"], 1],
    ],
    tasks: [
      html("Hello React (the Holberton dashboard header)", "App.js", "<p>Write a component <code>App</code> that renders a <code>div.App-header</code> containing an <code>img</code> with <code>alt=\"Holberton logo\"</code> and an <code>h1</code> with <code>School dashboard</code>, then a <code>div.App-body</code> with a <code>p</code>: <code>Login to access the full dashboard</code>. Render it into <code>#root</code>.</p>",
        reactDoc("    function App() {\n      return (\n        <div className=\"App\">\n        </div>\n      );\n    }\n\n    ReactDOM.createRoot(document.getElementById('root')).render(<App />);"),
        reactDoc("    function App() {\n      return (\n        <div className=\"App\">\n          <div className=\"App-header\">\n            <img src=\"logo.png\" alt=\"Holberton logo\" />\n            <h1>School dashboard</h1>\n          </div>\n          <div className=\"App-body\">\n            <p>Login to access the full dashboard</p>\n          </div>\n        </div>\n      );\n    }\n\n    ReactDOM.createRoot(document.getElementById('root')).render(<App />);"),
        [["Header has the logo and the h1", "await wait(300); const h = d.querySelector('#root .App-header'); return !!h && h.querySelector('img').alt === 'Holberton logo' && h.querySelector('h1').textContent === 'School dashboard';"], ["Body has the login paragraph", "const p = d.querySelector('#root .App-body p'); return !!p && p.textContent === 'Login to access the full dashboard';"]], { delay: 1500 }),
    ],
    manual: ["Set up create-react-app (or Vite) and write Jest + Enzyme/RTL tests for App"],
  };
  EX["re-02"] = {
    quiz: [
      ["Are props mutable inside the child component?", ["Yes", "No — props are read-only", "Only strings", "Only with useState"], 1],
      ["Why does each item in a list need a <code>key</code>?", ["For CSS", "So React can tell which items changed, were added or removed", "It's for SEO", "It's optional decoration"], 1],
      ["What is a Fragment (<code>&lt;&gt;…&lt;/&gt;</code>) for?", ["Styling", "Grouping children without adding an extra DOM node", "Lazy loading", "Error handling"], 1],
      ["How do you give a prop a default value in a function component?", ["defaultProps or a default in destructuring: ({ isLoggedIn = false })", "props.default", "useDefault()", "You can't"], 0],
    ],
    tasks: [
      html("Notifications list (props + lists)", "Notifications.js", "<p>Write a <code>NotificationItem</code> component taking <code>type</code> and <code>value</code> props and rendering an <code>&lt;li data-notification-type={type}&gt;</code>. Then a <code>Notifications</code> component that receives a <code>list</code> prop (array of <code>{ id, type, value }</code>) and renders a <code>&lt;ul&gt;</code> of NotificationItem (with keys). If the list is empty, render <code>&lt;li&gt;No new notification for now&lt;/li&gt;</code> instead.</p>",
        reactDoc("    const listNotifications = [\n      { id: 1, type: 'default', value: 'New course available' },\n      { id: 2, type: 'urgent', value: 'New resume available' },\n    ];\n\n    // write NotificationItem and Notifications here\n\n    ReactDOM.createRoot(document.getElementById('root')).render(\n      <div>\n        <div id=\"full\"><Notifications list={listNotifications} /></div>\n        <div id=\"empty\"><Notifications list={[]} /></div>\n      </div>\n    );"),
        reactDoc("    const listNotifications = [\n      { id: 1, type: 'default', value: 'New course available' },\n      { id: 2, type: 'urgent', value: 'New resume available' },\n    ];\n\n    function NotificationItem({ type, value }) {\n      return <li data-notification-type={type}>{value}</li>;\n    }\n\n    function Notifications({ list = [] }) {\n      return (\n        <ul>\n          {list.length === 0\n            ? <li>No new notification for now</li>\n            : list.map((n) => <NotificationItem key={n.id} type={n.type} value={n.value} />)}\n        </ul>\n      );\n    }\n\n    ReactDOM.createRoot(document.getElementById('root')).render(\n      <div>\n        <div id=\"full\"><Notifications list={listNotifications} /></div>\n        <div id=\"empty\"><Notifications list={[]} /></div>\n      </div>\n    );"),
        [["The full list renders 2 items with their types", "await wait(300); const li = d.querySelectorAll('#full li'); return li.length === 2 && li[1].getAttribute('data-notification-type') === 'urgent' && li[0].textContent === 'New course available';"], ["The empty list shows the fallback message", "const li = d.querySelectorAll('#empty li'); return li.length === 1 && li[0].textContent === 'No new notification for now';"]], { delay: 1500 }),
    ],
  };
  EX["re-03"] = {
    quiz: [
      ["What's a higher-order component (HOC)?", ["A component with many children", "A function that takes a component and returns a new, enhanced component", "A class component", "A context provider"], 1],
      ["Which lifecycle method runs after the first render of a class component?", ["componentWillMount", "componentDidMount", "render", "constructor"], 1],
      ["What's the hook equivalent of componentDidMount + componentWillUnmount?", ["useState", "useEffect with an empty dependency array (and a cleanup function)", "useMemo", "useRef"], 1],
      ["What does a PureComponent / React.memo avoid?", ["Errors", "Re-rendering when props haven't changed", "State", "Keys"], 1],
    ],
    tasks: [],
    manual: ["Convert App to a class component and add a keyboard shortcut (Ctrl+h) that logs out", "Write a <code>WithLogging</code> HOC and a <code>BodySectionWithMarginBottom</code> component, with tests"],
  };
  EX["re-04"] = {
    quiz: [
      ["What does Aphrodite generate from <code>StyleSheet.create</code>?", ["Inline styles", "Unique CSS classes injected into the page", "A CSS file", "Nothing"], 1],
      ["How do you write a style object in React inline styles?", ["style=\"color: red\"", "style={{ color: 'red' }}", "css={red}", "class={{color}}"], 1],
      ["Can plain inline styles contain media queries?", ["Yes", "No — you need CSS or a CSS-in-JS library", "Only in Chrome", "Only with !important"], 1],
    ],
    tasks: [],
    manual: ["Move the dashboard styles to Aphrodite, make it responsive under 900px, and animate the notifications menu"],
  };
  EX["re-05"] = {
    quiz: [
      ["How do you update state in a function component?", ["this.state.x = 1", "Call the setter from useState, e.g. setCount(c =&gt; c + 1)", "Reassign the variable", "setState in render"], 1],
      ["Why use the functional form <code>setCount(c =&gt; c + 1)</code>?", ["It's shorter", "It always uses the latest state when updates are batched", "It's required", "It avoids re-rendering"], 1],
      ["What problem does Context solve?", ["Styling", "Passing data deeply without prop drilling", "Routing", "Testing"], 1],
      ["What is a controlled input?", ["An input with a ref", "An input whose value comes from state and changes via onChange", "A disabled input", "An input inside a form"], 1],
    ],
    tasks: [
      html("Counter with state", "Counter.js", "<p>Write a <code>Counter</code> component with a <code>span.count</code> showing the current count (starting at 0) and two buttons: <code>button.inc</code> (+1) and <code>button.reset</code> (back to 0). Use <code>useState</code>.</p>",
        reactDoc("    const { useState } = React;\n\n    function Counter() {\n      return <div></div>;\n    }\n\n    ReactDOM.createRoot(document.getElementById('root')).render(<Counter />);"),
        reactDoc("    const { useState } = React;\n\n    function Counter() {\n      const [count, setCount] = useState(0);\n      return (\n        <div>\n          <span className=\"count\">{count}</span>\n          <button className=\"inc\" onClick={() => setCount((c) => c + 1)}>+1</button>\n          <button className=\"reset\" onClick={() => setCount(0)}>Reset</button>\n        </div>\n      );\n    }\n\n    ReactDOM.createRoot(document.getElementById('root')).render(<Counter />);"),
        [["Starts at 0", "await wait(300); return d.querySelector('.count').textContent === '0';"], ["Clicking +1 three times shows 3", "for (let i = 0; i < 3; i++) d.querySelector('.inc').click(); await wait(100); return d.querySelector('.count').textContent === '3';"], ["Reset goes back to 0", "d.querySelector('.reset').click(); await wait(100); return d.querySelector('.count').textContent === '0';"]], { delay: 1500 }),
      html("Controlled login form", "Login.js", "<p>Write a <code>Login</code> component with a controlled email input (<code>input#email</code>), a controlled password input (<code>input#password</code>) and a submit <code>input#submit</code> (type submit) that is <strong>disabled until both fields are non-empty</strong>. On submit (prevent the default), replace the form by <code>&lt;p className=\"welcome\"&gt;Welcome {email}&lt;/p&gt;</code>.</p>",
        reactDoc("    const { useState } = React;\n\n    function Login() {\n      return <form></form>;\n    }\n\n    ReactDOM.createRoot(document.getElementById('root')).render(<Login />);"),
        reactDoc("    const { useState } = React;\n\n    function Login() {\n      const [email, setEmail] = useState('');\n      const [password, setPassword] = useState('');\n      const [loggedIn, setLoggedIn] = useState(false);\n      if (loggedIn) return <p className=\"welcome\">Welcome {email}</p>;\n      return (\n        <form onSubmit={(e) => { e.preventDefault(); setLoggedIn(true); }}>\n          <label htmlFor=\"email\">Email</label>\n          <input id=\"email\" type=\"email\" value={email} onChange={(e) => setEmail(e.target.value)} />\n          <label htmlFor=\"password\">Password</label>\n          <input id=\"password\" type=\"password\" value={password} onChange={(e) => setPassword(e.target.value)} />\n          <input id=\"submit\" type=\"submit\" value=\"OK\" disabled={!email || !password} />\n        </form>\n      );\n    }\n\n    ReactDOM.createRoot(document.getElementById('root')).render(<Login />);"),
        [["Submit is disabled at first", "await wait(300); return d.querySelector('#submit').disabled === true;"],
         ["Typing in both fields enables submit", "const set = (el, v) => { const s = Object.getOwnPropertyDescriptor(w.HTMLInputElement.prototype, 'value').set; s.call(el, v); el.dispatchEvent(new w.Event('input', { bubbles: true })); }; set(d.querySelector('#email'), 'me@alx.com'); set(d.querySelector('#password'), 'secret12'); await wait(100); return d.querySelector('#submit').disabled === false;"],
         ["Submitting shows the welcome message", "d.querySelector('#submit').click(); await wait(150); const p = d.querySelector('.welcome'); return !!p && p.textContent === 'Welcome me@alx.com';"]], { delay: 1500 }),
    ],
  };
  EX["re-06"] = {
    quiz: [
      ["What does <code>Map({a: 1}).set('a', 2)</code> do to the original Map in Immutable.js?", ["Changes it", "Nothing — it returns a new Map", "Throws", "Deletes 'a'"], 1],
      ["Which function converts nested JS objects into Immutable structures?", ["Immutable.from", "fromJS", "toImmutable", "Map.deep"], 1],
      ["Why use immutable data in React/Redux?", ["Smaller bundles", "Cheap change detection (compare references) and no accidental mutation", "It's required by React", "Faster networking"], 1],
    ],
    tasks: [
      { t: "Immutable updates without a library", lang: "js", file: "setIn.js", p: "<p>The idea behind Immutable.js in plain JS: write <code>export default function setIn(obj, path, value)</code> that returns a <strong>new</strong> object with <code>value</code> set at the nested <code>path</code> (array of keys), copying only the objects along the path. The original must not change, and untouched branches must be shared (same reference).</p>",
        start: "export default function setIn(obj, path, value) {\n}\n",
        sol: "export default function setIn(obj, path, value) {\n  if (path.length === 0) return value;\n  const [key, ...rest] = path;\n  const child = obj !== undefined && obj !== null ? obj[key] : undefined;\n  return { ...obj, [key]: setIn(child === undefined ? {} : child, rest, value) };\n}\n",
        tests: [{ main: "import setIn from './setIn';\n\nconst state = { user: { name: 'Ann', address: { city: 'Accra' } }, courses: { c: true } };\nconst next = setIn(state, ['user', 'address', 'city'], 'Lagos');\nconsole.log(next.user.address.city, state.user.address.city);\nconsole.log(next !== state, next.user !== state.user, next.courses === state.courses);\nconsole.log(JSON.stringify(setIn({}, ['a', 'b'], 1)));\n", out: "Lagos Accra\ntrue true true\n{\"a\":{\"b\":1}}\n" }] },
    ],
    manual: ["Use Immutable.js: <code>fromJS</code>, <code>getIn</code>, <code>Map.merge</code>, <code>List.concat</code>, <code>Seq</code> filters"],
  };
  const REDUCER_SOL = "export const MARK_AS_READ = 'MARK_AS_READ';\nexport const FETCH_SUCCESS = 'FETCH_NOTIFICATIONS_SUCCESS';\n\nexport const initialState = { filter: 'DEFAULT', notifications: [] };\n\nexport default function notificationReducer(state = initialState, action) {\n  switch (action.type) {\n    case FETCH_SUCCESS:\n      return { ...state, notifications: action.data.map((n) => ({ ...n, isRead: false })) };\n    case MARK_AS_READ:\n      return { ...state, notifications: state.notifications.map((n) => (n.id === action.index ? { ...n, isRead: true } : n)) };\n    case 'SET_TYPE_FILTER':\n      return { ...state, filter: action.filter };\n    default:\n      return state;\n  }\n}\n";
  EX["re-07"] = {
    quiz: [
      ["What is a Redux action?", ["A function that changes state", "A plain object describing what happened, with a type", "A component", "A reducer"], 1],
      ["What is an action creator?", ["A reducer", "A function returning an action object", "A middleware", "A store"], 1],
      ["Why normalize state (with normalizr)?", ["Smaller code", "Store each entity once by id, avoiding duplication and deep nesting", "Required by React", "For styling"], 1],
      ["What does redux-thunk allow?", ["Synchronous actions only", "Action creators that return functions (for async work like fetch)", "Multiple stores", "Time travel"], 1],
    ],
    tasks: [
      { t: "Action creators", lang: "js", file: "uiActionCreators.js", p: "<p>Write action creators: <code>login(email, password)</code> → <code>{ type: 'LOGIN', user: { email, password } }</code>; <code>logout()</code> → <code>{ type: 'LOGOUT' }</code>; <code>markAsRead(index)</code> → <code>{ type: 'MARK_AS_READ', index }</code>. Export them as named exports.</p>",
        start: "export function login(email, password) {\n}\n",
        sol: "export function login(email, password) {\n  return { type: 'LOGIN', user: { email, password } };\n}\n\nexport function logout() {\n  return { type: 'LOGOUT' };\n}\n\nexport function markAsRead(index) {\n  return { type: 'MARK_AS_READ', index };\n}\n",
        tests: [{ main: "import { login, logout, markAsRead } from './uiActionCreators';\n\nconsole.log(JSON.stringify(login('a@b.co', 'pw')));\nconsole.log(JSON.stringify(logout()));\nconsole.log(JSON.stringify(markAsRead(1)));\n", out: "{\"type\":\"LOGIN\",\"user\":{\"email\":\"a@b.co\",\"password\":\"pw\"}}\n{\"type\":\"LOGOUT\"}\n{\"type\":\"MARK_AS_READ\",\"index\":1}\n" }] },
      { t: "Normalize data by hand", lang: "js", file: "notifications.js", p: "<p>Without normalizr, write <code>export default function normalize(list)</code> that turns an array of <code>{ id, author: { id, name }, text }</code> into <code>{ entities: { users: { [id]: user }, messages: { [id]: { id, author: authorId, text } } }, result: [ids…] }</code>.</p>",
        start: "export default function normalize(list) {\n}\n",
        sol: "export default function normalize(list) {\n  const users = {};\n  const messages = {};\n  for (const m of list) {\n    users[m.author.id] = m.author;\n    messages[m.id] = { id: m.id, author: m.author.id, text: m.text };\n  }\n  return { entities: { users, messages }, result: list.map((m) => m.id) };\n}\n",
        tests: [{ main: "import normalize from './notifications';\n\nconst n = normalize([\n  { id: 'm1', author: { id: 'u1', name: 'Ann' }, text: 'hi' },\n  { id: 'm2', author: { id: 'u1', name: 'Ann' }, text: 'yo' },\n]);\nconsole.log(JSON.stringify(n.result), Object.keys(n.entities.users).length, n.entities.messages.m2.author);\n", out: "[\"m1\",\"m2\"] 1 u1\n" }] },
    ],
  };
  EX["re-08"] = {
    quiz: [
      ["What must a reducer never do?", ["Return state", "Mutate its arguments or have side effects", "Use switch", "Handle unknown actions"], 1],
      ["What should a reducer return for an unknown action?", ["undefined", "The current state unchanged", "An error", "The initial state always"], 1],
      ["What's a selector?", ["A CSS selector", "A function that reads/derives data from the state", "An action", "A middleware"], 1],
    ],
    tasks: [
      { t: "Notification reducer", lang: "js", file: "notificationReducer.js", p: "<p>Write a reducer with initial state <code>{ filter: 'DEFAULT', notifications: [] }</code> handling: <code>FETCH_NOTIFICATIONS_SUCCESS</code> (store <code>action.data</code>, adding <code>isRead: false</code> to each), <code>MARK_AS_READ</code> (set <code>isRead: true</code> on the notification whose id is <code>action.index</code>), <code>SET_TYPE_FILTER</code> (set <code>filter</code>). Never mutate the state.</p>",
        start: "export const initialState = { filter: 'DEFAULT', notifications: [] };\n\nexport default function notificationReducer(state = initialState, action) {\n  return state;\n}\n",
        sol: REDUCER_SOL,
        tests: [{ main: "import notificationReducer from './notificationReducer';\n\nlet s = notificationReducer(undefined, {});\nconsole.log(JSON.stringify(s));\nconst s1 = notificationReducer(s, { type: 'FETCH_NOTIFICATIONS_SUCCESS', data: [{ id: 1, value: 'a' }, { id: 2, value: 'b' }] });\nconsole.log(JSON.stringify(s1.notifications));\nconst s2 = notificationReducer(s1, { type: 'MARK_AS_READ', index: 2 });\nconsole.log(s2.notifications[1].isRead, s1.notifications[1].isRead, s2 !== s1);\nconsole.log(notificationReducer(s2, { type: 'SET_TYPE_FILTER', filter: 'URGENT' }).filter);\nconsole.log(notificationReducer(s2, { type: 'UNKNOWN' }) === s2);\n", out: "{\"filter\":\"DEFAULT\",\"notifications\":[]}\n[{\"id\":1,\"value\":\"a\",\"isRead\":false},{\"id\":2,\"value\":\"b\",\"isRead\":false}]\ntrue false true\nURGENT\ntrue\n" }] },
      { t: "Selectors", lang: "js", file: "notificationSelector.js", p: "<p>Write selectors: <code>filterTypeSelected(state)</code> returns the filter; <code>getNotifications(state)</code> returns the notifications; <code>getUnreadNotifications(state)</code> returns only the unread ones.</p>",
        start: "export const filterTypeSelected = (state) => {};\n",
        sol: "export const filterTypeSelected = (state) => state.filter;\nexport const getNotifications = (state) => state.notifications;\nexport const getUnreadNotifications = (state) => state.notifications.filter((n) => !n.isRead);\n",
        tests: [{ main: "import { filterTypeSelected, getNotifications, getUnreadNotifications } from './notificationSelector';\n\nconst state = { filter: 'URGENT', notifications: [{ id: 1, isRead: true }, { id: 2, isRead: false }, { id: 3, isRead: false }] };\nconsole.log(filterTypeSelected(state), getNotifications(state).length, getUnreadNotifications(state).map((n) => n.id).join(','));\n", out: "URGENT 3 2,3\n" }] },
    ],
  };
  EX["re-09"] = {
    quiz: [
      ["What does <code>&lt;Provider store={store}&gt;</code> do?", ["Creates the store", "Makes the store available to every component below it", "Logs actions", "Persists state"], 1],
      ["Which hook reads data from the store?", ["useDispatch", "useSelector", "useStore only", "useReducer"], 1],
      ["What does combineReducers do?", ["Merges actions", "Builds one root reducer from several slice reducers", "Combines stores", "Runs reducers in parallel"], 1],
    ],
    tasks: [],
    manual: ["Connect the dashboard to Redux with Provider/connect (or hooks), combineReducers and Redux DevTools", "Fetch notifications asynchronously with a thunk and show a loading state"],
  };
})();
