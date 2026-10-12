import { createHash, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";

const N = 16384, R = 8, P = 1, KEYLEN = 64;
const scrypt = (pw, salt) => new Promise((ok, bad) =>
  scryptCb(pw, salt, KEYLEN, { N, r: R, p: P, maxmem: 64 * 1024 * 1024 }, (e, k) => (e ? bad(e) : ok(k))));

export const sha256 = (s) => createHash("sha256").update(String(s)).digest("hex");
export const token = (bytes = 32) => randomBytes(bytes).toString("base64url");

export async function hashPassword(pw) {
  const salt = randomBytes(16);
  const key = await scrypt(pw.normalize("NFKC"), salt);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64url")}$${key.toString("base64url")}`;
}

export async function verifyPassword(pw, stored) {
  // Always do the work, even for unknown users, so response time doesn't reveal which emails exist.
  const parts = (stored || "").split("$");
  const salt = parts.length === 6 ? Buffer.from(parts[4], "base64url") : randomBytes(16);
  const key = await scrypt(pw.normalize("NFKC"), salt);
  if (parts.length !== 6) return false;
  const want = Buffer.from(parts[5], "base64url");
  return want.length === key.length && timingSafeEqual(want, key);
}
