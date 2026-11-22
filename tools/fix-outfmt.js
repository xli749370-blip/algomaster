// 修正题面「输出格式」一行：原模板把样例值硬拼成「-599 的形式（见样例）」，
// 读起来像病句。这里按真实样例输出的形状（单整数 / 一行多值 / 多行）自动生成描述。
// 用法：node tools/fix-outfmt.js
const fs = require("fs");
const path = require("path");

const DATA = path.join(__dirname, "..", "data");
const RE = /\n\n输出格式：\n[\s\S]*$/;

function outSpec(sample) {
  const out = String(sample == null ? "" : sample);
  const lines = out.trim().split("\n");
  const single = lines.length === 1;
  const parts = single ? lines[0].trim().split(/\s+/).filter(Boolean) : [];

  if (single && /^-?\d+$/.test(parts[0]) && parts.length === 1) {
    return `输出一个整数（样例 1 输出 ${parts[0]}）。`;
  }
  if (single && parts.length > 1 && parts.every((p) => /^-?\d+$/.test(p))) {
    return `输出一行，共 ${parts.length} 个整数，用单个空格分隔（样例 1 见下）。`;
  }
  if (single && parts.length === 1) {
    const v = parts[0].length > 24 ? parts[0].slice(0, 24) + "…" : parts[0];
    return `输出一行结果（样例 1 输出 ${v}）。`;
  }
  if (single) {
    return `输出一行，包含用单个空格分隔的 ${parts.length} 个值（样例 1 见下）。`;
  }
  return `输出 ${lines.length} 行，每行一个结果（样例 1 见下）。`;
}

let files = 0, changed = 0, bytes = 0;
const list = fs.readdirSync(DATA).filter((f) => /^problems-\d+\.js$/.test(f));
for (const f of list) {
  const p = path.join(DATA, f);
  const src = fs.readFileSync(p, "utf8");
  const i = src.indexOf("= [") + 2;   // 注意别取到 PROBLEM_SHARDS[0] 里的方括号
  if (i < 2) continue;
  const head = src.slice(0, i);
  const arr = JSON.parse(src.slice(i).replace(/;\s*$/, ""));
  let dirty = false;
  for (const q of arr) {
    if (!q || typeof q.desc !== "string") continue;
    if (!RE.test(q.desc)) continue;
    const spec = outSpec(q.samples && q.samples[0] && q.samples[0].output);
    const next = q.desc.replace(RE, `\n\n输出格式：\n${spec}`);
    if (next !== q.desc) { q.desc = next; dirty = true; changed++; }
  }
  if (dirty) {
    const out = head + JSON.stringify(arr) + ";\n";
    fs.writeFileSync(p, out);
    bytes += Buffer.byteLength(out);
  }
  files++;
}
console.log(`扫描 ${files} 个分片，修正 ${changed} 道题面`);
