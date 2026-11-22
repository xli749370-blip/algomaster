#!/usr/bin/env node
/** 结构守卫：不启浏览器，校验生成产物的规模与完整性。
 *  适合放进 CI：生成完立刻跑，几秒内发现「题库缩水 / 课程缺章 / 病句回流」。
 *  用法：node tools/check-structure.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const DATA = path.join(ROOT, "data");
let fails = 0;

function ok(name, cond, extra) {
  if (cond) console.log("PASS  " + name + (extra ? "  " + extra : ""));
  else { fails++; console.log("FAIL  " + name + (extra ? "  " + extra : "")); }
}

function need(file) {
  const p = path.join(DATA, file);
  if (!fs.existsSync(p)) { fails++; console.log("FAIL  缺少文件 " + file); return null; }
  return fs.readFileSync(p, "utf8");
}

const ctx = { window: {} };
vm.createContext(ctx);
const run = (file) => {
  const src = need(file);
  if (src == null) return false;
  try { vm.runInContext(src, ctx); return true; } catch (e) {
    fails++; console.log("FAIL  " + file + " 执行异常: " + e.message); return false;
  }
};

/* ---------- 题库 ---------- */
const EXPECT_PROBLEMS = Number(process.env.PROBLEMS || 27933);
let index = [];
if (run("problems-index.js")) index = ctx.window.PROBLEM_INDEX || [];
ok("题库题数", index.length === EXPECT_PROBLEMS, index.length + " / 期望 " + EXPECT_PROBLEMS);

const shardCount = index.length ? Math.max(...index.map((x) => x[4])) + 1 : 0;
ok("题库分片数", shardCount > 0 && fs.existsSync(path.join(DATA, `problems-${String(shardCount - 1).padStart(3, "0")}.js`)), shardCount + " 片");
ok("分片编号连续", index.every((x) => x[4] >= 0 && x[4] < shardCount));
ok("索引字段完整", index.every((x) => Array.isArray(x) && x.length === 5 && x[0] && x[1]));

const solShards = fs.readdirSync(DATA).filter((f) => /^sol-\d+\.js$/.test(f)).length;
ok("题解分片数", solShards === shardCount, solShards + " / 题库 " + shardCount);

const statsSrc = need("stats.js");
if (statsSrc) {
  vm.runInContext(statsSrc, ctx);
  const st = ctx.window.CONTENT_STATS || {};
  ok("统计口径与索引一致", st.problems === index.length, "stats=" + st.problems + " index=" + index.length);
}

/* ---------- 题面质量 ---------- */
let badOutfmt = 0, sampled = 0;
const sampleEvery = Math.max(1, Math.floor(shardCount / 30));
for (let i = 0; i < shardCount; i += sampleEvery) {
  const f = path.join(DATA, `problems-${String(i).padStart(3, "0")}.js`);
  if (!fs.existsSync(f)) continue;
  const src = fs.readFileSync(f, "utf8");
  sampled++;
  badOutfmt += (src.match(/的形式（见样例）/g) || []).length;
}
ok("题面无「…的形式（见样例）」病句", badOutfmt === 0, "抽查 " + sampled + " 片，命中 " + badOutfmt);

/* ---------- 课程 ---------- */
const LANGS = ["cpp", "py", "java", "c"];
if (run("course-index.js")) {
  const ci = ctx.window.COURSE_INDEX || {};
  const order = ci.order || [];
  ok("课程门数", order.length === LANGS.length, order.join(" / "));

  let chapters = 0, secs = 0, thin = 0;
  for (const l of LANGS) {
    if (!run(`course-${l}.js`)) continue;
    const body = (ctx.window.COURSE_BODY || {})[l] || {};
    const list = (ci.langs && ci.langs[l] && ci.langs[l].chapters) || [];
    chapters += list.length;
    for (const k of Object.keys(body)) {
      const html = body[k];
      secs += (html.match(/<h2>/g) || []).length;
      if (html.length < 2000) thin++;
    }
  }
  ok("课程章数", chapters === 80, chapters + " 章");
  ok("微课节数", secs === 320, secs + " 节");
  ok("无过短章节（<2KB）", thin === 0, thin + " 章过短");
}

/* ---------- 算法专题 ---------- */
const algoPath = path.join(ROOT, "js", "data-algorithms.js");
if (fs.existsSync(algoPath)) {
  vm.runInContext(fs.readFileSync(algoPath, "utf8"), ctx);
  const algos = vm.runInContext("typeof ALGOS !== 'undefined' ? ALGOS : []", ctx);
  ok("算法专题数", algos.length === 24, algos.length + " 个");
  const noFig = algos.filter((a) => !/<svg|<div class="fig/.test(a.html || "")).length;
  ok("专题均含图解", noFig === 0, noFig ? noFig + " 个缺图" : "全部有图");
} else {
  fails++; console.log("FAIL  缺少 js/data-algorithms.js（先跑 tools/gen-algo.js）");
}

/* ---------- 面试题库 ---------- */
if (run("interview-index.js")) {
  const ii = ctx.window.INTERVIEW_INDEX || {};
  ok("面试条目数", ii.total === 576, ii.total + " 条");
  let items = [];
  for (let i = 0; i < (ii.shards || 0); i++) {
    if (!run(`interview-${String(i).padStart(3, "0")}.js`)) break;
    const sh = (ctx.window.INTERVIEW_SHARDS || {})[i] || [];
    items = items.concat(sh);
  }
  const bases = items.filter((x) => !/^(换个问法：|追问（)/.test(x.q)).length;
  ok("面试主问题数", bases === 72, bases + " 组（追问 " + (items.length - bases) + "）");
}

/* ---------- 手册 ---------- */
for (const l of LANGS) run(`manual-${l}.js`);
{
  const manuals = ctx.window.MANUAL_DATA || {};
  const n = Object.keys(manuals).length;
  ok("手册语言数", n === LANGS.length, n + " 门");
  const empty = Object.values(manuals).filter((m) => !m.entries || m.entries.length < 20).length;
  ok("手册条目充足（>=20 条/门）", empty === 0, empty ? empty + " 门偏少" : "OK");
}

console.log("\n失败项: " + fails);
process.exit(fails ? 1 : 0);
