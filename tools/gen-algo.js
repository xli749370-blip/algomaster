/* ============================================================
   算法专题生成器
   输入：tools/algo-kb-1.js / -2 / -3  +  tools/algo-figs.js
   输出：js/data-algorithms.js（window.ALGOS 由 const 声明，与旧结构一致）
   ============================================================ */
const fs = require("fs");
const path = require("path");
const FIGS = require("./algo-figs");

const ROOT = path.resolve(__dirname, "..");
const KB = [
  require("./algo-kb-1"),
  require("./algo-kb-2"),
  require("./algo-kb-3"),
].flat();

const esc = (s) =>
  String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* 迷你标记：`code` / **加粗** */
function mk(s) {
  if (s == null) return "";
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}

function codeBlock(code, lang) {
  const body = esc(String(code).replace(/^\n+|\n+$/g, ""));
  return `<span class="code-lang">${esc(lang || "cpp")}</span>\n<pre><code>${body}</code></pre>`;
}

function table(rows) {
  if (!rows || !rows.length) return "";
  const [head, ...rest] = rows;
  // 列数 ≥ 5 的表格在手机上必然挤压：改为横向滑动，并给出提示
  const wide = head.length >= 5;
  return (
    `<div class="tbl-wrap${wide ? " tbl-wide" : ""}"><table><tr>${head.map((h) => `<th>${mk(h)}</th>`).join("")}</tr>` +
    rest.map((r) => `<tr>${r.map((c) => `<td>${mk(c)}</td>`).join("")}</tr>`).join("") +
    `</table></div>` +
    (wide ? `<div class="tbl-hint">左右滑动查看完整表格</div>` : "")
  );
}

function render(a, idx) {
  const out = [];
  const secs = a.sections || [];

  out.push(`<div class="ch-head">`);
  out.push(`<div class="ch-kicker">专题 ${String(idx + 1).padStart(2, "0")} · ${esc(a.cat)}</div>`);
  out.push(`<h1 class="ch-title">${mk(a.title)}</h1>`);
  out.push(`<p class="ch-sub">${mk(a.desc)}</p>`);
  out.push(
    `<div class="ch-meta"><span>${secs.length} 节</span><span>约 ${a.mins || 25} 分钟</span><span>${(a.goals || []).length} 个目标</span></div>`
  );
  out.push(`</div>`);

  if (a.goals && a.goals.length) {
    out.push(`<div class="goal-card"><b>学完这个专题你能</b><ul>`);
    a.goals.forEach((g) => out.push(`<li>${mk(g)}</li>`));
    out.push(`</ul></div>`);
  }

  if (secs.length > 1) {
    out.push(`<div class="sec-toc"><b>专题目录</b><div class="sec-toc-list">`);
    secs.forEach((s, si) =>
      out.push(`<button class="toc-item" onclick="App.jumpSec('alg-${si}')"><i>${si + 1}</i>${mk(s.t)}</button>`)
    );
    out.push(`</div></div>`);
  }

  secs.forEach((s, si) => {
    out.push(`<section class="mic" id="alg-${si}">`);
    out.push(`<h2><span class="mic-no">${si + 1}</span>${mk(s.t)}</h2>`);
    if (s.lead) out.push(`<p class="mic-lead">${mk(s.lead)}</p>`);
    (s.body || []).forEach((p) => out.push(`<p>${mk(p)}</p>`));
    if (s.fig) {
      const svg = FIGS.get(s.fig);
      if (svg) out.push(svg);
      else console.warn(`  ⚠ 未知图示 key: ${s.fig}（${a.id}）`);
    }
    if (s.code) out.push(codeBlock(s.code, s.lang));
    if (s.cap) out.push(`<p class="code-cap">${mk(s.cap)}</p>`);
    if (s.table) out.push(table(s.table));
    if (s.pts && s.pts.length) {
      out.push(`<ul class="pt-list">`);
      s.pts.forEach((p) => out.push(`<li>${mk(p)}</li>`));
      out.push(`</ul>`);
    }
    if (s.pit) out.push(`<div class="warn-box">⚠️ <b>容易踩的坑</b>：${mk(s.pit)}</div>`);
    out.push(`</section>`);
  });

  if (a.sum) out.push(`<div class="tip-box">📌 <b>一句话记住</b>：${mk(a.sum)}</div>`);
  return out.join("\n");
}

/* ---------- 校验 ---------- */
function validate() {
  const ids = new Set();
  let bad = 0;
  KB.forEach((a) => {
    if (!a.id) { console.error("✗ 缺少 id:", a.title); bad++; return; }
    if (ids.has(a.id)) { console.error("✗ id 重复:", a.id); bad++; }
    ids.add(a.id);
    if (!a.sections || !a.sections.length) { console.error("✗ 无正文:", a.id); bad++; }
    (a.sections || []).forEach((s) => {
      if (s.fig && !FIGS.has(s.fig)) { console.error(`✗ ${a.id} 引用了不存在的图示 ${s.fig}`); bad++; }
      if (!s.lead && !(s.body && s.body.length) && !s.code && !s.table) {
        console.error(`✗ ${a.id} 的「${s.t}」没有内容`); bad++;
      }
    });
  });
  return { bad, count: KB.length };
}

function main() {
  const { bad, count } = validate();
  if (bad) { console.error(`\n校验失败 ${bad} 处，已中止`); process.exit(1); }

  const htmls = KB.map((a, i) => ({
    id: a.id, cat: a.cat, title: a.title, diff: a.diff, desc: a.desc,
    mins: a.mins || 25,
    secs: (a.sections || []).length,
    figs: (a.sections || []).filter((s) => s.fig).length,
    codes: (a.sections || []).filter((s) => s.code).length,
    html: render(a, i),
  }));
  const js =
    `/* ============ 算法专题数据（由 tools/gen-algo.js 生成，勿手改） ============\n` +
    `   ${count} 个专题 · 结构: ALGOS = [{id, cat, title, diff, desc, mins, html}] */\n` +
    `const ALGOS = ${JSON.stringify(htmls, null, 0)};\n`;
  fs.writeFileSync(path.join(ROOT, "js/data-algorithms.js"), js);

  const bytes = Buffer.byteLength(js, "utf8");
  const figs = KB.reduce((n, a) => n + (a.sections || []).filter((s) => s.fig).length, 0);
  const codes = KB.reduce((n, a) => n + (a.sections || []).filter((s) => s.code).length, 0);
  console.log(`✓ js/data-algorithms.js  ${count} 专题 / ${figs} 张图 / ${codes} 段代码 / ${(bytes / 1024).toFixed(0)} KB`);
  KB.forEach((a, i) => {
    const len = htmls[i].html.length;
    console.log(`   ${String(i + 1).padStart(2)} ${a.id.padEnd(16)} ${String(a.sections.length).padStart(2)} 节  ${String(len).padStart(6)}B  ${a.title}`);
  });
}

main();
