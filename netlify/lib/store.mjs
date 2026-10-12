// Key-value storage on Netlify Blobs. Tests swap in an in-memory store with useStore().
let backend = null;

export function memoryStore() {
  const m = new Map();
  return {
    async get(key) { return m.has(key) ? JSON.parse(m.get(key)) : null; },
    async set(key, value, opts = {}) {
      if (opts.onlyIfNew && m.has(key)) return { modified: false };
      m.set(key, JSON.stringify(value));
      return { modified: true };
    },
    async del(key) { m.delete(key); },
    _map: m,
  };
}

export function useStore(store) { backend = store; }

export async function db() {
  if (backend) return backend;
  const { getStore } = await import("@netlify/blobs");
  const s = getStore({ name: "hydra", consistency: "strong" });
  backend = {
    get: (key) => s.get(key, { type: "json" }),
    set: (key, value, opts = {}) => s.setJSON(key, value, opts.onlyIfNew ? { onlyIfNew: true } : {}),
    del: (key) => s.delete(key),
  };
  return backend;
}
