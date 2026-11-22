/* ============================================================
   SVG 图解引擎（构建期使用）
   —— 画布宽按「手机正文宽度」设计（340），桌面端限宽放大，
      两种场景下文字都是 12–16px 的可读尺寸。
   —— 颜色全部走 CSS 变量，深/浅主题自动适配。
   用法：
     const F = require("./figs");
     F.arr({ vals:[3,1,4,1,5], ptrs:[{i:0,label:"L"},{i:4,label:"R"}] })
     F.tree({ levels:[[1],[2,3],[4,5,6,7]] })
     F.grid({ rows:[["0","1"]], head:["","a","b"] })
     F.pipe({ steps:["预处理","编译"] })
   ============================================================ */

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const CW = 340;            // 设计宽度（≈ 手机正文宽度）
const FS = 13;             // 基准字号
const PAD = 6;

function wrap(inner, { h, cap, label, cls }) {
  return (
    `<figure class="fig${cls ? " " + cls : ""}">` +
    (label ? `<div class="fig-label">${esc(label)}</div>` : "") +
    `<div class="fig-canvas"><svg viewBox="0 0 ${CW} ${h}" role="img" preserveAspectRatio="xMidYMid meet">` +
    defs() + inner + `</svg></div>` +
    (cap ? `<figcaption>${esc(cap)}</figcaption>` : "") +
    `</figure>`
  );
}

const txt = (x, y, s, o = {}) =>
  `<text x="${Math.round(x * 10) / 10}" y="${Math.round(y * 10) / 10}" class="f-t${o.cls ? " " + o.cls : ""}"` +
  ` text-anchor="${o.anchor || "middle"}" dominant-baseline="${o.base || "central"}"` +
  ` font-size="${o.size || FS}">${esc(s)}</text>`;

const box = (x, y, w, h, o = {}) =>
  `<rect x="${Math.round(x * 10) / 10}" y="${Math.round(y * 10) / 10}" width="${Math.round(w * 10) / 10}" height="${Math.round(h * 10) / 10}"` +
  ` rx="${o.rx == null ? 6 : o.rx}" class="f-box${o.cls ? " " + o.cls : ""}"/>`;

const line = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${Math.round(x1)}" y1="${Math.round(y1)}" x2="${Math.round(x2)}" y2="${Math.round(y2)}"` +
  ` class="f-line${o.cls ? " " + o.cls : ""}"` +
  (o.dash ? ` stroke-dasharray="${o.dash}"` : "") +
  (o.arrow ? ` marker-end="url(#f-ar${o.cls === "f-hi" ? "2" : "1"})"` : "") + `/>`;

const defs = () =>
  `<defs>` +
  `<marker id="f-ar1" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">` +
  `<path d="M0,0 L10,5 L0,10 z" class="f-arrow-head"/></marker>` +
  `<marker id="f-ar2" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">` +
  `<path d="M0,0 L10,5 L0,10 z" class="f-arrow-head f-acc"/></marker>` +
  `</defs>`;

/* ============================================================
   1. 数组格子：值 / 下标 / 指针 / 区间
   ============================================================ */
function arr(o = {}) {
  const vals = o.vals || [];
  const n = Math.max(vals.length, 1);
  const gap = n > 9 ? 3 : 5;
  const cell = Math.min(o.cell || 46, Math.floor((CW - 2 * PAD - gap * (n - 1)) / n));
  const totalW = n * cell + (n - 1) * gap;
  const x0 = (CW - totalW) / 2;
  const spans = o.spans || [];
  const ptrs = o.ptrs || [];
  const top = spans.length ? 34 : 14;
  const bh = o.h || 38;
  const cellBottom = top + bh;
  const idxY = cellBottom + 11;
  const arrowTop = cellBottom + 20;
  const arrowBot = cellBottom + 44;
  const labelY = cellBottom + 54;
  let s = "";

  spans.forEach((sp) => {
    const x1 = x0 + sp.from * (cell + gap) - 2;
    const x2 = x0 + sp.to * (cell + gap) + cell + 2;
    s += `<rect x="${x1}" y="10" width="${x2 - x1}" height="20" rx="10" class="f-span ${sp.cls || ""}"/>`;
    s += txt((x1 + x2) / 2, 20.5, sp.label || "", { size: 11.5, cls: sp.txtCls || "f-acc" });
  });

  vals.forEach((v, i) => {
    const x = x0 + i * (cell + gap);
    const mk = (o.marks || []).find((m) => m.i === i);
    s += box(x, top, cell, bh, { cls: mk ? mk.cls || "f-hi" : "" });
    s += txt(x + cell / 2, top + bh / 2 + 0.5, v, { size: cell > 34 ? 15 : 13 });
    if (o.idx !== false) s += txt(x + cell / 2, idxY, i, { size: 10.5, cls: "f-mute" });
  });

  ptrs.forEach((p) => {
    const x = x0 + p.i * (cell + gap) + cell / 2;
    s += line(x, arrowBot, x, arrowTop, { arrow: true, cls: p.cls || "f-acc" });
    s += txt(x, labelY, p.label, { size: 12, cls: p.cls || "f-acc" });
  });

  const h = cellBottom + (ptrs.length ? 62 : o.idx === false ? 14 : 22) + (o.foot || 0);
  return wrap(s, { h, cap: o.cap, label: o.label });
}

/* ============================================================
   2. 方块序列：链表 / 栈 / 队列
   ============================================================ */
function blocks(o = {}) {
  const items = o.items || [];
  const n = Math.max(items.length, 1);
  let s = "";

  if (o.kind === "stack") {
    const bw = 150, bh = 34, gap = 6;
    const x0 = (CW - bw) / 2;
    const top = 20;
    items.forEach((v, i) => {
      const y = top + i * (bh + gap);
      s += box(x0, y, bw, bh, { cls: i === items.length - 1 ? "f-hi" : "" });
      s += txt(x0 + bw / 2, y + bh / 2 + 0.5, v, { size: 14 });
      if (i === 0) s += txt(x0 - 8, y + bh / 2, "底", { size: 10.5, cls: "f-mute", anchor: "end" });
    });
    s += txt(x0 + bw + 8, top + (items.length - 1) * (bh + gap) + bh / 2, "顶 →", { size: 10.5, cls: "f-mute", anchor: "start" });
    return wrap(s, { h: top + n * (bh + gap) + 12, cap: o.cap, label: o.label });
  }

  const gap = 12;
  const cell = Math.min(o.cell || 56, Math.floor((CW - 2 * PAD - gap * (n - 1)) / n));
  const totalW = n * cell + (n - 1) * gap;
  const x0 = (CW - totalW) / 2;
  const top = o.ptrs && o.ptrs.length ? 34 : 16;
  const bh = 36;
  items.forEach((v, i) => {
    const x = x0 + i * (cell + gap);
    s += box(x, top, cell, bh, { cls: o.mark && o.mark.includes(i) ? "f-hi" : "" });
    s += txt(x + cell / 2, top + bh / 2 + 0.5, v, { size: 14 });
    if (i < n - 1) s += line(x + cell + 1, top + bh / 2, x + cell + gap - 2, top + bh / 2, { arrow: true });
    else if (o.kind === "list") s += txt(x + cell / 2, top + bh + 12, "NULL", { size: 10, cls: "f-mute" });
  });
  (o.ptrs || []).forEach((p) => {
    const x = x0 + p.i * (cell + gap) + cell / 2;
    s += line(x, top - 12, x, top - 2, { arrow: true, cls: p.cls || "f-acc" });
    s += txt(x, top - 20, p.label, { size: 11.5, cls: p.cls || "f-acc" });
  });
  return wrap(s, { h: top + bh + 28, cap: o.cap, label: o.label });
}

/* ============================================================
   3. 二叉树
   ============================================================ */
function tree(o = {}) {
  const levels = o.levels || [];
  const R = 17;
  const rowH = 54;
  const top = 22;
  const pos = [];
  levels.forEach((row, d) => {
    const slotW = (CW - 2 * PAD) / Math.max(row.length, 1);
    row.forEach((v, i) => {
      pos.push(v === "-" || v == null ? null : { x: PAD + slotW * i + slotW / 2, y: top + d * rowH });
    });
  });
  let s = "";
  for (let k = 0; k < pos.length; k++) {
    const p = pos[k];
    if (!p) continue;
    [2 * k + 1, 2 * k + 2].forEach((ci) => {
      const c = pos[ci];
      if (c) s += line(p.x, p.y + R + 1, c.x, c.y - R - 1);
    });
  }
  const hl = o.hl || [];
  const flat = levels.flat();
  pos.forEach((p, k) => {
    if (!p) return;
    s += `<circle cx="${p.x}" cy="${p.y}" r="${R}" class="f-node${hl.includes(k) ? " f-hi" : ""}"/>`;
    s += txt(p.x, p.y + 0.5, flat[k], { size: 13 });
  });
  return wrap(s, { h: top + (levels.length - 1) * rowH + R + 16, cap: o.cap, label: o.label });
}

/* ============================================================
   4. 分层图（BFS / 递归树）
   ============================================================ */
function layers(o = {}) {
  const L = o.layers || [];
  const R = o.r || 16;
  const rowH = o.rowH || 58;
  const top = 22;
  const pos = L.map((row, d) =>
    row.map((nd, i) => {
      const span = (CW - 2 * PAD) / Math.max(row.length, 1);
      const obj = typeof nd === "string" ? { l: nd } : nd;
      return { x: PAD + span * i + span / 2, y: top + d * rowH, label: obj.l, cls: obj.cls || "" };
    })
  );
  let s = "";
  (o.edges || []).forEach(([a, b]) => {
    const p = pos[a[0]] && pos[a[0]][a[1]];
    const q = pos[b[0]] && pos[b[0]][b[1]];
    if (p && q) s += line(p.x, p.y + R + 1, q.x, q.y - R - 1, { arrow: true });
  });
  pos.flat().forEach((p) => {
    s += `<circle cx="${p.x}" cy="${p.y}" r="${R}" class="f-node ${p.cls}"/>`;
    s += txt(p.x, p.y + 0.5, p.label, { size: p.label.length > 3 ? 9.5 : 12.5 });
  });
  return wrap(s, { h: top + (L.length - 1) * rowH + R + 16, cap: o.cap, label: o.label });
}

/* ============================================================
   5. 二维表格（DP / 矩阵）
   ============================================================ */
function grid(o = {}) {
  const rows = o.rows || [];
  const head = o.head || [];
  const cols = Math.max(head.length, ...rows.map((r) => r.length));
  const labelW = o.headCol ? 34 : 0;
  const avail = CW - 2 * PAD - labelW;
  const cw = Math.min(o.cw || 52, Math.floor(avail / Math.max(cols, 1)));
  const ch = o.ch || 28;
  const left = PAD + labelW + (avail - cw * cols) / 2;
  const top = head.some(Boolean) ? 30 : 14;
  const hl = o.hl || [];
  let s = "";

  head.forEach((t, c) => {
    if (!t) return;
    s += txt(left + c * cw + cw / 2, top - 16, t, { size: 10.5, cls: "f-mute" });
  });
  rows.forEach((row, r) => {
    if (o.headCol && o.headCol[r] != null) {
      s += txt(left - 6, top + r * ch + ch / 2, o.headCol[r], { size: 10.5, cls: "f-mute", anchor: "end" });
    }
    for (let c = 0; c < cols; c++) {
      const v = row[c];
      const on = hl.some((x) => x[0] === r && x[1] === c);
      s += `<rect x="${left + c * cw + 1}" y="${top + r * ch + 1}" width="${cw - 2}" height="${ch - 2}" rx="4" class="f-cell${on ? " f-hi" : ""}"/>`;
      if (v != null && v !== "") s += txt(left + c * cw + cw / 2, top + r * ch + ch / 2 + 0.5, v, { size: 12.5 });
    }
  });
  return wrap(s, { h: top + rows.length * ch + 16, cap: o.cap, label: o.label });
}

/* ============================================================
   6. 横向流程管道
   ============================================================ */
function pipe(o = {}) {
  const steps = o.steps || [];
  const n = Math.max(steps.length, 1);
  const gap = 16;
  const bw = Math.min(o.bw || 76, Math.floor((CW - 2 * PAD - gap * (n - 1)) / n));
  const bh = o.bh || 48;
  const totalW = n * bw + (n - 1) * gap;
  const x0 = (CW - totalW) / 2;
  const top = 14;
  let s = "";
  steps.forEach((st, i) => {
    const x = x0 + i * (bw + gap);
    const label = typeof st === "string" ? st : st.t;
    const sub = typeof st === "string" ? "" : st.sub;
    s += box(x, top, bw, bh, { cls: i === 0 ? "f-hi" : "" });
    s += txt(x + bw / 2, top + (sub ? bh / 2 - 7 : bh / 2), label, { size: 12.5 });
    if (sub) s += txt(x + bw / 2, top + bh / 2 + 9, sub, { size: 9.5, cls: "f-mute" });
    if (i < n - 1) s += line(x + bw + 2, top + bh / 2, x + bw + gap - 2, top + bh / 2, { arrow: true });
  });
  return wrap(s, { h: top + bh + (o.cap ? 18 : 12), cap: o.cap, label: o.label });
}

/* ============================================================
   7. 复杂度增长曲线（统一归一化，标签错开）
   ============================================================ */
function curve(o = {}) {
  const curves = o.curves || [];
  const W = CW - 2 * PAD - 30;
  const H = 170;
  const x0 = PAD + 24;
  const y0 = 16;
  const samples = 48;
  let s = "";
  s += line(x0, y0, x0, y0 + H, { arrow: true });
  s += line(x0, y0 + H, x0 + W, y0 + H, { arrow: true });
  s += txt(x0 - 4, y0 + 2, "耗时", { size: 9.5, cls: "f-mute", anchor: "end" });
  s += txt(x0 + W, y0 + H + 12, "输入规模 n", { size: 9.5, cls: "f-mute", anchor: "end" });

  // 每条曲线各自归一化：形状差异比绝对高度更重要（否则 n 与 log n 会挤成一条）
  const series = curves.map((c, idx) => {
    const pts = [];
    for (let i = 0; i <= samples; i++) {
      const t = i / samples;
      pts.push([t, Math.max(0, c.f(t))]);
    }
    return { c, pts, max: Math.max(...pts.map((p) => p[1])) || 1, idx };
  });

  const DASH = ["", "5 4", "2 3", "8 4 2 4"];
  series.forEach((sr) => {
    const yOf = (v) => y0 + H - (v / sr.max) * (H - 16);
    const d = sr.pts.map(([t, v], i) => `${i ? "L" : "M"}${(x0 + t * W).toFixed(1)},${yOf(v).toFixed(1)}`).join(" ");
    s += `<path d="${d}" fill="none" class="f-curve ${sr.c.cls || ""}" stroke-width="2.2"` +
      (DASH[sr.idx % 4] ? ` stroke-dasharray="${DASH[sr.idx % 4]}"` : "") + `/>`;
  });

  // 图例放在坐标轴下方（2 列），彻底避免标签重叠
  const lgTop = y0 + H + 20;
  const lgH = Math.ceil(series.length / 2) * 18;
  series.forEach((sr, i) => {
    const r = Math.floor(i / 2), c = i % 2;
    const lx = PAD + c * ((CW - 2 * PAD) / 2);
    const ly = lgTop + r * 18;
    s += `<line x1="${lx}" y1="${ly}" x2="${lx + 20}" y2="${ly}" class="f-curve ${sr.c.cls || ""}" stroke-width="2.4"` +
      (DASH[i % 4] ? ` stroke-dasharray="${DASH[i % 4]}"` : "") + `/>`;
    s += txt(lx + 26, ly, sr.c.name, { size: 11, anchor: "start" });
  });
  return wrap(s, { h: lgTop + lgH + 6, cap: o.cap, label: o.label });
}

/* ============================================================
   8. 哈希桶（兼容 {i, items} 与 [i, items] 两种写法）
   ============================================================ */
function buckets(o = {}) {
  const raw = o.buckets || [];
  const bs = raw.map((b, i) =>
    Array.isArray(b) ? { i: b[0], items: b[1] || [] } : { i: b.i == null ? i : b.i, items: b.items || [] }
  );
  const n = Math.max(bs.length, 1);
  const gap = 8;
  const bw = Math.min(46, Math.floor((CW - 2 * PAD - gap * (n - 1)) / n));
  const totalW = n * bw + (n - 1) * gap;
  const x0 = (CW - totalW) / 2;
  const top = 12;
  let s = "";
  bs.forEach((b, i) => {
    const x = x0 + i * (bw + gap);
    s += box(x, top, bw, 18, { cls: "f-hi" });
    s += txt(x + bw / 2, top + 9.5, b.i, { size: 10.5, cls: "f-acc" });
    (b.items || []).forEach((kv, k) => {
      const y = top + 36 + k * 30;
      s += line(x + bw / 2, k === 0 ? top + 18 : y - 22, x + bw / 2, y - 2, { arrow: true });
      const on = o.hit != null && String(kv[0]) === String(o.hit);
      s += box(x, y, bw, 24, { cls: on ? "f-hi" : "" });
      s += txt(x + bw / 2, y + 12.5, (kv[0] == null ? "" : kv[0]) + (kv[1] == null ? "" : ":" + kv[1]), { size: 11.5 });
    });
  });
  const maxLen = Math.max(1, ...bs.map((b) => (b.items || []).length));
  return wrap(s, { h: top + 36 + maxLen * 30 + 8, cap: o.cap, label: o.label });
}

/* ============================================================
   9. 内存布局
   ============================================================ */
function mem(o = {}) {
  const cells = o.cells || [];
  const n = Math.max(cells.length, 1);
  const gap = 3;
  const cell = Math.min(o.cell || 54, Math.floor((CW - 2 * PAD - gap * (n - 1)) / n));
  const totalW = n * cell + (n - 1) * gap;
  const x0 = (CW - totalW) / 2;
  const hasPtr = !!o.ptr;
  const hasName = cells.some((c) => c.name);
  const top = 26;                                   // 地址在 top-10，留够上方余量
  const bh = 34;
  let s = "";
  cells.forEach((c, i) => {
    const x = x0 + i * (cell + gap);
    s += txt(x + cell / 2, top - 10, c.addr, { size: 9, cls: "f-mute" });
    s += box(x, top, cell, bh, { cls: c.cls || "" });
    s += txt(x + cell / 2, top + bh / 2 + 0.5, c.val, { size: 13 });
    if (c.name) s += txt(x + cell / 2, top + bh + 11, c.name, { size: 9.5, cls: "f-mute" });
  });
  // 指针画在「变量名下方」，向上指向格子：不与会与地址标签争位置
  let ptrFoot = 0;
  if (hasPtr) {
    const x = x0 + o.ptr.i * (cell + gap) + cell / 2;
    const nameBottom = top + bh + (hasName ? 18 : 0);
    s += line(x, nameBottom + 30, x, nameBottom + 4, { arrow: true, cls: "f-acc" });
    s += txt(x, nameBottom + 40, o.ptr.label || "p", { size: 11, cls: "f-acc" });
    ptrFoot = 48;
  }
  return wrap(s, { h: top + bh + (hasName ? 18 : 0) + ptrFoot + 12, cap: o.cap, label: o.label });
}

/* ============================================================
   10. 排序每趟
   ============================================================ */
function passes(o = {}) {
  const list = o.passes || [];
  const maxN = Math.max(...list.map((p) => p.vals.length), 1);
  const left = 44;
  const gap = 4;
  const cell = Math.min(o.cell || 38, Math.floor((CW - left - PAD - gap * (maxN - 1)) / maxN));
  const rowH = 44;
  let s = "";
  list.forEach((p, r) => {
    const y = 10 + r * rowH;
    s += txt(left - 8, y + 15, p.tag || "", { size: 9.5, cls: "f-mute", anchor: "end" });
    p.vals.forEach((v, i) => {
      const x = left + i * (cell + gap);
      const on = (p.mark || []).includes(i);
      s += box(x, y, cell, 30, { cls: on ? "f-hi" : "" });
      s += txt(x + cell / 2, y + 15.5, v, { size: 12.5 });
    });
  });
  return wrap(s, { h: 10 + list.length * rowH + 6, cap: o.cap, label: o.label });
}

/* ============================================================
   11. 图例
   ============================================================ */
function legend(o = {}) {
  const items = o.items || [];
  const perRow = Math.min(items.length, 2);
  const cw = (CW - 2 * PAD) / Math.max(perRow, 1);
  const rows = Math.ceil(items.length / perRow);
  let s = "";
  items.forEach((it, i) => {
    const r = Math.floor(i / perRow), c = i % perRow;
    const x = PAD + c * cw, y = 12 + r * 26;
    s += `<rect x="${x}" y="${y}" width="16" height="16" rx="4" class="f-box ${it.cls || ""}"/>`;
    s += txt(x + 23, y + 8.5, it.text, { size: 11.5, anchor: "start" });
  });
  return wrap(s, { h: 12 + rows * 26 + 4, cap: o.cap, label: o.label });
}

module.exports = { arr, blocks, tree, layers, grid, pipe, curve, buckets, mem, passes, legend, CW };
