# 🐉 Hydra School

A day-by-day study planner for the **ALX / Holberton School software engineering curriculum** and a **beginner Japanese** track.

- **Coding: 2 hours a day.** You get a dated session every study day, covering Foundations (shell, Git, C, data structures, Python, SQL, JavaScript, DevOps, the AirBnB clone and a portfolio project), then the **Backend**, **Machine Learning**, **Low-level & Algorithms** and **Frontend** specializations, in an order you choose.
- **Japanese: 1 hour a day.** Kana first, then the Japan Foundation's free IRODORI course (A1 → A2), with Anki vocabulary and listening practice.
- Each project shows what you'll learn, free resources, and a link to a public repo whose README lists the real tasks.
- Progress is saved in your browser (localStorage). Use **Settings → Export progress** to back it up or move it to another device.

## Practice (quizzes and auto-checked tasks)

Every project has a **Practice** page, modelled on the ALX intranet: quiz questions first, then tasks you solve in an in-browser code editor and check with one click.

| Language | How it's checked |
| --- | --- |
| C | Compiled and run on [Compiler Explorer](https://godbolt.org) with the ALX flags `-Wall -Werror -Wextra -pedantic -std=gnu89`, then compared with the expected output of a test `main.c` |
| Python | Runs in your browser with [Pyodide](https://pyodide.org). NumPy is available for the ML projects |
| JavaScript | Runs in a Web Worker with a small Node-like environment: `require`, `process.argv`, an in-memory `fs`, and ES-module `import`/`export` |
| SQL | Runs on SQLite in your browser ([sql.js](https://sql.js.org)). Your result is compared with a reference query on the same data |
| HTML / CSS / jQuery / React | Rendered in a sandboxed frame, then checked by inspecting the page (elements, computed styles, clicks) |
| Regex | Checked like ALX: `puts ARGV[0].scan(/regex/).join` |
| Bash | Pattern-checked against known-good answers, since a real shell can't run in a browser |

Things that need a real server, such as Nginx, MySQL replication or Docker, are a checklist you tick off yourself. A solution can be revealed after 3 attempts.

**Japanese drills:** for every day of the plan, you draw that day's kana or kanji stroke by stroke with a finger, stylus or mouse. The checker follows the official stroke order and direction, with hint, outline, recall and stroke-order animation modes. A short reading and vocabulary quiz follows.

Totals: 694 quiz questions and 422 auto-checked tasks across all 199 projects. Every reference solution was run through its own checker before publishing.

## Using it

Open `index.html` in a browser. There's no build step and nothing to install.

### Publish it free with GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*, then pick **Branch:** `main` and the `/ (root)` folder. Click **Save**.
3. After a minute the site is live at `https://<your-username>.github.io/hydra-school/`.

## Pages

| Page | What it's for |
| --- | --- |
| **Today** | Today's coding session and Japanese lesson, with resources and a "mark done" button. Tells you when you're behind and can shift the plan to start from today. |
| **Schedule** | Week-by-week calendar of every session, with checkboxes. |
| **Curriculum** | Every project grouped by track, with objectives, resources, task links, sessions and progress. |
| **Practice** | Quizzes and auto-checked tasks for every project, plus a score for each one. |
| **Japanese** | The daily routine, the stages, and all the free resources. |
| **Settings** | Start date, rest days, specialization order and on/off, theme, backup and restore. |

## Editing the curriculum

- `assets/curriculum.js` holds the projects and tracks. Change `days` to give a project more or fewer sessions.
- `assets/japanese.js` holds the Japanese plan.

Progress is stored against each project `id`, so don't rename ids after you've started.

## Credits

The curriculum order follows the ALX Software Engineering programme, which is built on Holberton School's. The official project pages are behind the ALX/Holberton intranet login, so task lists link to public student repos instead (for example [micahondiwa](https://github.com/micahondiwa), [ngugimuchangi](https://github.com/ngugimuchangi), [bagoviggo](https://github.com/bagoviggo), [edward0rtiz](https://github.com/edward0rtiz) and [allelomorph](https://github.com/allelomorph)). Try each task yourself before you read anyone's solution.

Japanese stroke-order data: [KanjiVG](https://kanjivg.tagaini.net) © Ulrich Apel, CC BY-SA 3.0 (`assets/jp/strokes.js` is derived from it and shared under the same licence).
