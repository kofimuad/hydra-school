# 🐉 Hydra School

A day-by-day study planner for the **ALX / Holberton School software engineering curriculum** and a **beginner Japanese** track.

- **Pick your path when you sign up:** programming and Japanese, programming only, or Japanese only. Your plan starts on the day you sign up. You can change the path later in **Settings**.
- **Coding: 2 hours a day.** You get a dated session every study day, covering Foundations (shell, Git, C, data structures, Python, SQL, JavaScript, DevOps, the AirBnB clone and a portfolio project), then the **Backend**, **Machine Learning**, **Low-level & Algorithms** and **Frontend** specializations, in an order you choose.
- **Japanese: 1 hour a day.** Kana first, then the Japan Foundation's free IRODORI course (A1 → A2), with Anki vocabulary and listening practice.
- Each project shows what you'll learn, free resources, and a link to a public repo whose README lists the real tasks.
- Progress is saved in your browser. **Create an account** (email and password, GitHub or Google) to keep it on the server and use it on any device. Your plan, ticks, quiz answers, drawings and code all sync.

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

## Accounts and sync

The site is static (`site/`) with one Netlify Function (`netlify/functions/api.mjs`) serving `/api/*`. Data is stored in [Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/), so there's no database to set up.

- **Sign in:** email and password (hashed with scrypt), or GitHub / Google OAuth. Sessions are random tokens in an `HttpOnly`, `Secure`, `SameSite=Lax` cookie, stored hashed on the server and valid for 60 days.
- **Sync:** the app still works from localStorage. When you're signed in, every change is sent to your account a couple of seconds later. If two devices change things at the same time, the copies are merged so no ticks or passed tasks are lost. Progress you made as a guest is added to your account the first time you sign in.
- **Security:** rate limits per IP (10 sign-in attempts per 15 minutes) and per email (8 failed attempts per 15 minutes), plus limits on saves and other calls. Writes need a custom header and a same-origin request, which blocks cross-site request forgery. OAuth uses a `state` check, and PKCE for Google. A GitHub or Google login is never attached automatically to an existing password account; connect it from **Settings** while signed in instead.
- There is no "forgot password" yet because that needs an email service.

### Setting up on Netlify

1. Deploy the repo. `netlify.toml` already sets the publish folder (`site`) and the functions folder. Netlify Blobs needs no setup.
2. For **GitHub sign-in**, create an OAuth app at *GitHub → Settings → Developer settings → OAuth Apps*.
   - Homepage URL: `https://<your-site>.netlify.app`
   - Callback URL: `https://<your-site>.netlify.app/api/auth/github/callback`
3. For **Google sign-in**, create an *OAuth client ID* (type: Web application) in Google Cloud Console → APIs & Services → Credentials.
   - Authorised redirect URI: `https://<your-site>.netlify.app/api/auth/google/callback`
   - Set up the OAuth consent screen with the `openid`, `email` and `profile` scopes.
4. In Netlify, open **Site configuration → Environment variables** and add `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. Then redeploy. A provider's button only appears once both of its variables are set.

### Running locally

```sh
npm install
npm test          # API tests (in-memory store, mocked OAuth)
npx netlify dev   # site + functions on http://localhost:8888
```

You can also open `site/index.html` directly. Everything works except accounts, and progress stays in the browser.

## Pages

| Page | What it's for |
| --- | --- |
| **Today** | Today's coding session and Japanese lesson, with resources and a "mark done" button. Tells you when you're behind and can shift the plan to start from today. |
| **Schedule** | Week-by-week calendar of every session, with checkboxes. |
| **Curriculum** | Every project grouped by track, with objectives, resources, task links, sessions and progress. |
| **Practice** | Quizzes and auto-checked tasks for every project, plus a score for each one. |
| **Japanese** | The daily routine, the stages, and all the free resources. |
| **Settings** | Learning path, account (log out, connect GitHub/Google, password, delete), start date, rest days, specialization order and on/off, theme, backup and restore. |
| **Log in / Sign up** | Email and password, or GitHub / Google. |

## Editing the curriculum

- `site/assets/curriculum.js` holds the projects and tracks. Change `days` to give a project more or fewer sessions.
- `site/assets/japanese.js` holds the Japanese plan.

Progress is stored against each project `id`, so don't rename ids after you've started.

## Credits

The curriculum order follows the ALX Software Engineering programme, which is built on Holberton School's. The official project pages are behind the ALX/Holberton intranet login, so task lists link to public student repos instead (for example [micahondiwa](https://github.com/micahondiwa), [ngugimuchangi](https://github.com/ngugimuchangi), [bagoviggo](https://github.com/bagoviggo), [edward0rtiz](https://github.com/edward0rtiz) and [allelomorph](https://github.com/allelomorph)). Try each task yourself before you read anyone's solution.

Japanese stroke-order data: [KanjiVG](https://kanjivg.tagaini.net) © Ulrich Apel, CC BY-SA 3.0 (`site/assets/jp/strokes.js` is derived from it and shared under the same licence).
