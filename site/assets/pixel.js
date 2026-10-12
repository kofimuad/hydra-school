/* Procedural pixel-dither landscapes for page heroes (no image files needed). */
(function () {
  "use strict";
  function rng(seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  // smooth 1D value noise
  function noise1(r, n) { const v = Array.from({ length: n + 2 }, r); return (x) => { const i = Math.floor(x), f = x - i, t = f * f * (3 - 2 * f); return v[i % v.length] * (1 - t) + v[(i + 1) % v.length] * t; }; }
  function noise2(r) {
    const N = 64, g = Array.from({ length: N * N }, r);
    return (x, y) => {
      const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi;
      const a = g[((yi % N) * N + (xi % N)) | 0], b = g[((yi % N) * N + ((xi + 1) % N)) | 0];
      const c = g[(((yi + 1) % N) * N + (xi % N)) | 0], d = g[(((yi + 1) % N) * N + ((xi + 1) % N)) | 0];
      const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
      return (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
    };
  }
  const THEMES = {
    // black / orange / yellow mountains on a pale blue dotted sky (home)
    mountains: { sky: "#c9d6eb", skyDot: "#e3eaf5", land: [["#111111", 0.44], ["#ff4d00", 0.27], ["#e5e21c", 0.23], ["#2fd96b", 0.03], ["#f4efd6", 0.03]], cloud: "#f3eed3", base: 0.8, height: 0.42 },
    // green / yellow hills, blue sky with pink & cream clouds (Japanese)
    hills: { sky: "#2f9bf0", skyDot: "#8cc8f7", land: [["#c6e019", 0.42], ["#1fd16a", 0.3], ["#e9f07a", 0.16], ["#f6c6d8", 0.06], ["#0fa04d", 0.06]], cloud: "#fbe0ea", cloud2: "#fbf3d6", base: 0.68, height: 0.3 },
  };
  const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  function paint(canvas, theme, seed) {
    const T = THEMES[theme] || THEMES.mountains;
    const rect = canvas.getBoundingClientRect();
    const CELL = 5; // css px per pixel-art cell
    const W = Math.max(40, Math.ceil(rect.width / CELL)), H = Math.max(30, Math.ceil(rect.height / CELL));
    const S = 2; // each cell drawn as 2x2 sub-pixels → halftone dots
    canvas.width = W * S; canvas.height = H * S;
    const ctx = canvas.getContext("2d"), img = ctx.createImageData(W * S, H * S), r = rng(seed || 7);
    const n1 = noise1(r, 64), n2 = noise1(r, 64), tex = noise2(r), big = noise2(r), cl = noise2(r);
    const sky = hex(T.sky), skyDot = hex(T.skyDot), cloud = hex(T.cloud), cloud2 = T.cloud2 ? hex(T.cloud2) : cloud;
    const land = T.land.map(([c, w]) => [hex(c), w]);
    const cum = []; let acc = 0; for (const [, w] of land) cum.push((acc += w));
    const pick = (v) => { for (let i = 0; i < cum.length; i++) if (v <= cum[i]) return land[i][0]; return land[land.length - 1][0]; };
    const white = [255, 255, 255];
    const put = (x, y, c, dotted) => {
      for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
        const cc = dotted && (sx + sy) % 2 === 1 ? mix(c, white, 0.28) : c;
        const i = ((y * S + sy) * W * S + (x * S + sx)) * 4;
        img.data[i] = cc[0]; img.data[i + 1] = cc[1]; img.data[i + 2] = cc[2]; img.data[i + 3] = 255;
      }
    };
    for (let x = 0; x < W; x++) {
      const u = x / W;
      // broad peaks, higher towards the edges like the reference
      const peaks = 0.6 * n1(u * 3.2) + 0.3 * n2(u * 9) + 0.1 * n1(u * 31 + 5);
      const edge = Math.pow(Math.abs(u - 0.5) * 2, 2) * 0.18;
      const ridge = H * (T.base - T.height * (peaks - 0.35) - edge);
      for (let y = 0; y < H; y++) {
        if (y < ridge) {
          const cv = cl(x / 16, y / 6);
          if (cv > 0.8 && y > 2) put(x, y, cv > 0.88 ? cloud2 : cloud, false);
          else put(x, y, (x + y) % 3 === 0 ? skyDot : sky, true);
        } else {
          let v = 0.55 * tex(x / 6, y / 4) + 0.45 * big(x / 22, y / 14);
          v = Math.min(0.999, Math.max(0, (v - 0.18) * 1.5));
          if (r() < 0.22) v = r(); // speckle
          let c = pick(v);
          // soft clouds hugging the base of the mountains
          if (theme === "mountains" && y > H - 6 && cl(x / 10, y / 3 + 40) > 0.64) c = cloud;
          put(x, y, c, true);
        }
      }
    }
    ctx.putImageData(img, 0, 0);
  }
  window.PixelArt = { paint, paintAll(root) { (root || document).querySelectorAll("canvas[data-pixel]").forEach((c) => paint(c, c.dataset.pixel, +c.dataset.seed || 7)); } };
  let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(() => window.PixelArt.paintAll(), 200); });
})();
