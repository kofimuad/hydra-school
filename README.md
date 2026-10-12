# 🐉 Hydra School

A day-by-day study planner for the **ALX / Holberton School software engineering curriculum** and a **beginner Japanese** track.

- **Coding: 2 hours a day.** You get a dated session every study day, covering Foundations (shell, Git, C, data structures, Python, SQL, JavaScript, DevOps, the AirBnB clone and a portfolio project), then the **Backend**, **Machine Learning**, **Low-level & Algorithms** and **Frontend** specializations, in an order you choose.
- **Japanese: 1 hour a day.** Kana first, then the Japan Foundation's free IRODORI course (A1 → A2), with Anki vocabulary and listening practice.
- Each project shows what you'll learn, free resources, and a link to a public repo whose README lists the real tasks.
- Progress is saved in your browser (localStorage). Use **Settings → Export progress** to back it up or move it to another device.

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
| **Japanese** | The daily routine, the stages, and all the free resources. |
| **Settings** | Start date, rest days, specialization order and on/off, theme, backup and restore. |

## Editing the curriculum

- `assets/curriculum.js` holds the projects and tracks. Change `days` to give a project more or fewer sessions.
- `assets/japanese.js` holds the Japanese plan.

Progress is stored against each project `id`, so don't rename ids after you've started.

## Credits

The curriculum order follows the ALX Software Engineering programme, which is built on Holberton School's. The official project pages are behind the ALX/Holberton intranet login, so task lists link to public student repos instead (for example [micahondiwa](https://github.com/micahondiwa), [ngugimuchangi](https://github.com/ngugimuchangi), [bagoviggo](https://github.com/bagoviggo), [edward0rtiz](https://github.com/edward0rtiz) and [allelomorph](https://github.com/allelomorph)). Try each task yourself before you read anyone's solution.
