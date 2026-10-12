/*
 * Japanese track – 1 hour per day, beginner → JLPT N5/N4.
 *
 * Every day has the same three blocks:
 *   15 min  Anki review (Kaishi 1.5k deck, 10 new cards/day once you know kana)
 *   30 min  the main lesson for the day (below)
 *   15 min  listening / reading for fun (comprehensible input)
 */

const J = {
  tofuguH: ["Tofugu – Learn Hiragana (mnemonic guide)", "https://www.tofugu.com/japanese/learn-hiragana/"],
  tofuguK: ["Tofugu – Learn Katakana", "https://www.tofugu.com/japanese/learn-katakana/"],
  realkana: ["Real Kana – drill kana", "https://realkana.com/"],
  anki: ["Anki (free flashcard app)", "https://apps.ankiweb.net/"],
  kaishi: ["Kaishi 1.5k – beginner vocabulary deck for Anki", "https://github.com/donkuri/kaishi"],
  irodori: ["IRODORI – free Japan Foundation course (PDF + audio)", "https://www.irodori.jpf.go.jp/en/"],
  irodoriOnline: ["IRODORI online course", "https://irodori-online.jpf.go.jp/"],
  nhk: ["NHK World – Easy Japanese (48 free lessons)", "https://www.nhk.or.jp/lesson/en/"],
  taekim: ["Tae Kim's Guide to Japanese grammar", "https://guidetojapanese.org/learn/"],
  cij: ["Comprehensible Japanese (free videos)", "https://cijapanese.com/"],
  cijYT: ["Comprehensible Japanese on YouTube", "https://www.youtube.com/@cijapanese"],
  misa: ["Japanese Ammo with Misa (grammar videos)", "https://www.youtube.com/@JapaneseAmmowithMisa"],
  jisho: ["Jisho – dictionary", "https://jisho.org/"],
  newsEasy: ["NHK News Web Easy (simple news)", "https://www3.nhk.or.jp/news/easy/"],
  jlpt: ["JLPT official sample questions", "https://www.jlpt.jp/e/samples/forlearners.html"],
};

const JP_RESOURCES = [
  { group: "Writing system", items: [J.tofuguH, J.tofuguK, J.realkana] },
  { group: "Main course", items: [J.irodori, J.irodoriOnline, J.nhk] },
  { group: "Vocabulary", items: [J.anki, J.kaishi, J.jisho] },
  { group: "Grammar", items: [J.taekim, J.misa] },
  { group: "Listening & reading", items: [J.cij, J.cijYT, J.newsEasy] },
  { group: "Testing yourself", items: [J.jlpt] },
];

function buildJapaneseDays() {
  const days = [];
  const add = (stage, title, tasks, res = []) => days.push({ stage, title, tasks, res });

  // ---- Stage 1: kana (2 weeks) ----
  const kanaH = [
    ["Install Anki on phone/PC. Hiragana あ い う え お and か-row", "Learn か き く け こ, さ し す せ そ"],
    ["Hiragana た-row and な-row", "Write each one 5× while saying it aloud"],
    ["Hiragana は-row and ま-row", "Drill everything so far on Real Kana for 10 min"],
    ["Hiragana や ゆ よ, ら-row, わ を ん", "You now know all 46 basic hiragana"],
    ["Dakuten & handakuten: が ざ だ ば ぱ…", "Drill on Real Kana"],
    ["Combos (きゃ しゅ ちょ…) and small っ", "Read 10 simple words on Jisho aloud"],
    ["Hiragana review day: full Real Kana drill until 90%+", "Download the Kaishi 1.5k deck; do your first 10 cards"],
  ];
  kanaH.forEach(([a, b], i) => add("Kana", `Hiragana day ${i + 1}`, [a, b], [J.tofuguH, J.realkana, i >= 6 ? J.kaishi : J.anki]));
  const kanaK = [
    ["Katakana ア-row, カ-row, サ-row", "Notice which look like their hiragana twins"],
    ["Katakana タ-row, ナ-row, ハ-row", "Drill on Real Kana (katakana mode)"],
    ["Katakana マ-row, ヤ-row, ラ-row, ワ ヲ ン", "All 46 basic katakana done"],
    ["Dakuten, combos, small ッ and the long-vowel mark ー", "Read loanwords: コーヒー, テレビ, パソコン"],
    ["Confusing pairs: シ/ツ, ソ/ン", "Real Kana drill until 90%+"],
    ["Extended katakana for foreign sounds: ファ ティ ウィ", "Write your own name in katakana"],
    ["Full kana review", "Watch your first Comprehensible Japanese ‘complete beginner’ video"],
  ];
  kanaK.forEach(([a, b], i) => add("Kana", `Katakana day ${i + 1}`, [a, b], [J.tofuguK, J.realkana, i === 6 ? J.cijYT : J.kaishi]));

  // ---- Stage 2-4: IRODORI Starter (A1), Elementary 1 & 2 (A2) ----
  let nhkLesson = 1;
  const book = (stage, name, perLesson, extra) => {
    for (let l = 1; l <= 18; l++) {
      for (let p = 1; p <= perLesson; p++) {
        const tasks = [];
        if (p === 1) tasks.push(`${name} Lesson ${l}: read the Can-do goals, then do Part 1 (listen to every audio track twice)`);
        else if (p === perLesson) tasks.push(`${name} Lesson ${l}: finish the lesson, do the review/self-check, shadow one dialogue out loud`);
        else tasks.push(`${name} Lesson ${l}: next part — listen, read the script, repeat the key phrases aloud`);
        const res = [J.irodori];
        if (p === perLesson && nhkLesson <= 48) {
          tasks.push(`Listening: NHK Easy Japanese – Lesson ${nhkLesson}`);
          res.push(J.nhk);
          nhkLesson++;
        } else if (extra && p === 2) {
          tasks.push(extra(l));
          res.push(stage.includes("Elementary 1") ? J.taekim : J.newsEasy);
        } else {
          tasks.push("Listening: one Comprehensible Japanese video at your level");
          res.push(J.cij);
        }
        add(stage, `${name} L${l} · day ${p}/${perLesson}`, tasks, res);
      }
    }
  };
  book("IRODORI Starter (A1)", "Irodori Starter", 4);
  // Checkpoint
  add("Checkpoint: N5 sample test", "JLPT N5 sample test", ["Do the official JLPT N5 sample questions", "Note your weak spots; add missed words to Anki"], [J.jlpt]);
  book("IRODORI Elementary 1 (A2)", "Irodori Elementary 1", 5,
    (l) => `Grammar: read the matching section of Tae Kim's guide (≈ chapter ${Math.min(l, 18)}) for anything that confused you`);
  add("Checkpoint: N5 review", "JLPT N5 review", ["Redo the N5 sample questions", "Read 1 NHK News Web Easy article with Jisho"], [J.jlpt, J.newsEasy]);
  book("IRODORI Elementary 2 (A2)", "Irodori Elementary 2", 5,
    () => "Reading: one NHK News Web Easy article (look up words on Jisho)");
  add("Checkpoint: N4 sample test", "JLPT N4 sample test", ["Do the official JLPT N4 sample questions", "Celebrate — you've finished A2!"], [J.jlpt]);
  return days;
}

window.JAPANESE = { days: buildJapaneseDays(), resources: JP_RESOURCES };
