// 题型模板自检：每个模板跑 N 组随机数据，校验 solve 与 outputText 一致、无 NaN/undefined、四语言代码齐全
const { TYPES_A } = require("./types-a");
const { TYPES_B } = require("./types-b");
const { TYPES_C } = require("./types-c");
const { TYPES_D } = require("./types-d");
const { TYPES_E } = require("./types-e");
const { TYPES_F } = require("./types-f");
const { TYPES_G } = require("./types-g");

const TYPES = [...TYPES_A, ...TYPES_B, ...TYPES_C, ...TYPES_D, ...TYPES_E, ...TYPES_F, ...TYPES_G];
const N = 300;

function rng(seed) {
  let a = seed >>> 0;
  return {
    next() { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; },
    int(n) { return Math.floor(this.next() * n); }
  };
}

let fail = 0, checked = 0;
const seenKeys = new Set();

for (const t of TYPES) {
  const errs = [];
  if (seenKeys.has(t.key)) errs.push(`key 重复: ${t.key}`);
  seenKeys.add(t.key);
  for (const f of ["title", "desc", "gen", "solve", "inputText", "outputText"]) {
    if (typeof t[f] !== "function") errs.push(`缺少 ${f}()`);
  }
  if (!t.code || ["cpp", "py", "java", "c"].some(k => !t.code[k] || t.code[k].length < 20)) errs.push("四语言代码不全");
  if (!Array.isArray(t.points) || t.points.length < 2) errs.push("要点不足");

  const r = rng(1000 + TYPES.indexOf(t));
  for (let i = 0; i < N && !errs.length; i++) {
    try {
      const p = t.gen(r);
      const a = String(t.solve(p));
      const b = String(t.outputText(p));
      const it = String(t.inputText(p));
      const ti = String(t.title(p));
      const de = String(t.desc(p));
      checked++;
      if (a !== b) errs.push(`第 ${i} 组 solve≠outputText: ${JSON.stringify(a)} vs ${JSON.stringify(b)}`);
      if (a === "" || a === "undefined" || /NaN|Infinity/.test(a)) errs.push(`第 ${i} 组输出异常: ${a}`);
      if (!it || /undefined|NaN/.test(it)) errs.push(`第 ${i} 组输入异常`);
      if (!ti || /undefined|NaN/.test(ti)) errs.push(`第 ${i} 组标题异常: ${ti}`);
      if (!de || /undefined|NaN/.test(de)) errs.push(`第 ${i} 组描述异常: ${de.slice(0, 90)}`);
    } catch (e) {
      errs.push(`第 ${i} 组抛错: ${e.message}`);
    }
  }
  if (errs.length) { fail++; console.log(`✗ ${t.key} (${t.cat})`); errs.slice(0, 3).forEach(e => console.log("   ", e)); }
}

console.log(`\n模板总数 ${TYPES.length}，抽样 ${checked} 组，失败 ${fail} 个`);
const cats = {};
TYPES.forEach(t => cats[t.cat] = (cats[t.cat] || 0) + 1);
console.log("分类分布:", Object.entries(cats).map(([k, v]) => `${k}${v}`).join(" "));
process.exit(fail ? 1 : 0);
