import { db } from "./store.mjs";
import { sha256 } from "./crypto.mjs";

// Fixed-window counters, one blob per (rule, client). Old windows are overwritten, so keys don't pile up.
export const RULES = {
  auth: { limit: 10, windowSec: 15 * 60 },    // sign-in / sign-up attempts per IP
  email: { limit: 8, windowSec: 15 * 60 },    // failed sign-ins per email address
  oauth: { limit: 20, windowSec: 15 * 60 },
  write: { limit: 300, windowSec: 10 * 60 },  // progress saves
  api: { limit: 600, windowSec: 10 * 60 },    // everything else
};

// Returns 0 when allowed, otherwise the number of seconds until the window resets.
export async function hit(rule, who, now = Date.now()) {
  const { limit, windowSec } = RULES[rule];
  const store = await db();
  const window = Math.floor(now / 1000 / windowSec);
  const key = `rl/${rule}/${sha256(who)}`;
  const cur = await store.get(key);
  const count = cur && cur.w === window ? cur.n : 0;
  if (count >= limit) return (window + 1) * windowSec - Math.floor(now / 1000);
  await store.set(key, { w: window, n: count + 1 });
  return 0;
}

export async function peek(rule, who, now = Date.now()) {
  const { limit, windowSec } = RULES[rule];
  const window = Math.floor(now / 1000 / windowSec);
  const cur = await (await db()).get(`rl/${rule}/${sha256(who)}`);
  return cur && cur.w === window && cur.n >= limit ? (window + 1) * windowSec - Math.floor(now / 1000) : 0;
}

export async function reset(rule, who) {
  await (await db()).del(`rl/${rule}/${sha256(who)}`);
}
