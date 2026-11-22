/* ============================================================
   课程内容生成器
   输入：tools/kb/<lang>-<part>.js  （每语言 20 章，每章 4 微课）
   输出：data/course-index.js（目录）+ data/course-<lang>.js（正文）
   ============================================================ */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const KBDIR = path.join(__dirname, "kb");
const FIGMAP = require("./figmap");
const OUT = path.join(ROOT, "data");

const LANGS = [
  { key: "cpp", name: "C++ 从零到精通", cls: "lang-cpp", icon: "🔷" },
  { key: "py", name: "Python 全栈基础", cls: "lang-py", icon: "🐍" },
  { key: "java", name: "Java 体系精讲", cls: "lang-java", icon: "☕" },
  { key: "c", name: "C 语言底层之旅", cls: "lang-c", icon: "🔧" },
];

/* ---------- 迷你标记：`code` / **加粗** ---------- */
function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function mk(s) {
  if (s == null) return "";
  return esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
function codeBlock(code, lang) {
  const body = esc(String(code).replace(/^\n+|\n+$/g, ""));
  return `<span class="code-lang">${esc(lang || "code")}</span>\n<pre><code>${body}</code></pre>`;
}
function table(rows) {
  if (!rows || !rows.length) return "";
  const head = rows[0];
  const rest = rows.slice(1);
  // 列数 ≥ 5 的表格在手机上必然挤压：改为横向滑动，并给出提示
  const wide = head.length >= 5;
  return (
    `<div class="tbl-wrap${wide ? " tbl-wide" : ""}"><table><tr>${head.map((h) => `<th>${mk(h)}</th>`).join("")}</tr>` +
    rest.map((r) => `<tr>${r.map((c) => `<td>${mk(c)}</td>`).join("")}</tr>`).join("") +
    `</table></div>` +
    (wide ? `<div class="tbl-hint">左右滑动查看完整表格</div>` : "")
  );
}

/* ---------- 单章渲染 ---------- */
function renderChapter(ch, lname, ci, langKey) {
  const num = ci + 1;
  const mic = ch.mic || [];
  const out = [];

  out.push(`<div class="ch-head">`);
  out.push(`<div class="ch-kicker">第 ${num} 章 · ${esc(lname)}</div>`);
  out.push(`<h1 class="ch-title">${mk(ch.t)}</h1>`);
  out.push(`<p class="ch-sub">${mk(ch.sub)}</p>`);
  out.push(
    `<div class="ch-meta"><span>${mic.length} 节微课</span><span>约 ${ch.mins || 40} 分钟</span><span>${(ch.goals || []).length} 个学习目标</span></div>`
  );
  out.push(`</div>`);

  // 学习目标
  if (ch.goals && ch.goals.length) {
    out.push(`<div class="goal-card"><b>学完这一章你能</b><ul>`);
    ch.goals.forEach((g) => out.push(`<li>${mk(g)}</li>`));
    out.push(`</ul></div>`);
  }

  // 知识地图
  if (ch.map && ch.map.length) {
    out.push(`<h3>知识地图</h3>`);
    out.push(table(ch.map));
  }

  // 章内目录
  if (mic.length > 1) {
    out.push(`<div class="sec-toc"><b>本章目录</b><div class="sec-toc-list">`);
    mic.forEach((m, mi) =>
      out.push(`<button class="toc-item" onclick="App.jumpSec('sec-${ci}-${mi}')"><i>${num}.${mi + 1}</i>${mk(m.t)}</button>`)
    );
    out.push(`</div></div>`);
  }

  // 微课
  mic.forEach((m, mi) => {
    out.push(`<section class="mic" id="sec-${ci}-${mi}">`);
    out.push(`<h2><span class="mic-no">${num}.${mi + 1}</span>${mk(m.t)}</h2>`);
    if (m.lead) out.push(`<p class="mic-lead">${mk(m.lead)}</p>`);
    (m.body || []).forEach((p) => out.push(`<p>${mk(p)}</p>`));
    const figKey = `${langKey}-${ci}-${mi}`;
    if (FIGMAP[figKey]) out.push(FIGMAP[figKey]());
    if (m.code) out.push(codeBlock(m.code, m.lang));
    if (m.cap) out.push(`<p class="code-cap">${mk(m.cap)}</p>`);
    if (m.table) out.push(table(m.table));
    if (m.pts && m.pts.length) {
      out.push(`<ul class="pt-list">`);
      m.pts.forEach((p) => out.push(`<li>${mk(p)}</li>`));
      out.push(`</ul>`);
    }
    if (m.pit) out.push(`<div class="warn-box">⚠️ <b>容易踩的坑</b>：${mk(m.pit)}</div>`);
    out.push(`</section>`);
  });

  // 面试问答
  if (ch.qa && ch.qa.length) {
    out.push(`<h3>面试 / 笔试里的问法</h3>`);
    ch.qa.forEach(([q, a]) => out.push(`<div class="qa-item"><b>${mk(q)}</b><p>${mk(a)}</p></div>`));
  }

  // 总结
  if (ch.sum) out.push(`<div class="tip-box">📌 <b>一句话记住</b>：${mk(ch.sum)}</div>`);

  return out.join("\n");
}

/* ---------- 主流程 ---------- */
function main() {
  if (!fs.existsSync(KBDIR)) {
    console.error("缺少 tools/kb 目录");
    process.exit(1);
  }
  const files = fs.readdirSync(KBDIR).filter((f) => f.endsWith(".js")).sort();
  const data = {};
  for (const f of files) {
    const lang = f.split("-")[0];
    const arr = require(path.join(KBDIR, f));
    if (!Array.isArray(arr)) throw new Error(f + " 必须导出数组");
    (data[lang] = data[lang] || []).push(...arr);
  }

  const index = { order: [], langs: {}, generated: new Date().toISOString().slice(0, 10) };
  let totalCh = 0,
    totalMic = 0,
    totalBytes = 0;

  for (const L of LANGS) {
    const chs = data[L.key];
    if (!chs || !chs.length) {
      console.warn("跳过空语言：" + L.key);
      continue;
    }
    const body = {};
    chs.forEach((ch, ci) => {
      body[ci] = renderChapter(ch, L.name, ci, L.key);
      totalMic += (ch.mic || []).length;
      totalBytes += Buffer.byteLength(body[ci], "utf8");
    });
    totalCh += chs.length;

    const js =
      `/* ${L.name} · 章节正文（${chs.length} 章 / ${chs.reduce((s, c) => s + (c.mic || []).length, 0)} 节微课） */\n` +
      `window.COURSE_BODY=window.COURSE_BODY||{};window.COURSE_BODY[${JSON.stringify(L.key)}]=` +
      JSON.stringify(body) +
      `;\n`;
    fs.writeFileSync(path.join(OUT, `course-${L.key}.js`), js);

    index.order.push(L.key);
    index.langs[L.key] = {
      name: L.name,
      cls: L.cls,
      icon: L.icon,
      desc: `${chs.length} 章 · ${chs.reduce((s, c) => s + (c.mic || []).length, 0)} 节微课 · ${chs
        .map((c) => c.mic.length)
        .reduce((a, b) => a + b, 0)} 个拆解示范`,
      chapters: chs.map((c) => ({
        t: c.t,
        sub: c.sub,
        mins: c.mins || 40,
        mic: (c.mic || []).length,
        kw: c.kw || "",
        goals: c.goals || [],
      })),
    };
    console.log(`✓ course-${L.key}.js  ${chs.length} 章 / ${chs.reduce((s, c) => s + (c.mic || []).length, 0)} 微课 / ${(fs.statSync(path.join(OUT, `course-${L.key}.js`)).size / 1024).toFixed(0)} KB`);
  }

  // 重建 desc 文案（放入章数与微课数）
  fs.writeFileSync(path.join(OUT, "course-index.js"), `/* 课程目录：4 门语言 / ${totalCh} 章 / ${totalMic} 节微课 */\nwindow.COURSE_INDEX = ${JSON.stringify(index, null, 0)};\n`);
  console.log(`\n目录：${totalCh} 章 / ${totalMic} 节微课，正文合计 ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
}

main();
