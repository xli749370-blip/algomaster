#!/usr/bin/env bash
# 一键重新生成全部数据（题库 / 题解 / 课程 / 专题）
# 依赖：Node.js >= 18
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

# 题库题数：与 README / Release 标注一致。可用 PROBLEMS=xxxxx bash tools/gen-all.sh 覆盖
PROBLEMS="${PROBLEMS:-27933}"
export PROBLEMS

node tools/gen.js --count "$PROBLEMS"   # 题库分片 + 索引 + 统计 + 面试 + 手册
node tools/fix-outfmt.js                # 题面「输出格式」重写成通顺句式（幂等）
node tools/gen-solutions.js             # 每道题一份题解
node tools/gen-course.js                # 4 门语言课程 80 章 / 320 节微课
node tools/gen-algo.js                  # 24 个算法专题

echo "完成：$(du -sh data | cut -f1) / $(ls data | wc -l) 个文件"

# 自检：题数与题解分片必须对得上，避免生成出「缩水题库」
node -e '
const fs = require("fs");
const s = fs.readFileSync("data/problems-index.js", "utf8");
const n = JSON.parse(s.slice(s.indexOf("["), s.lastIndexOf("]") + 1)).length;
const sols = fs.readdirSync("data").filter(f => /^sol-\d+\.js$/.test(f)).length;
console.log("题库题数:", n, "| 题解分片:", sols);
if (n !== Number(process.env.PROBLEMS || 27933)) {
  console.error("题库题数与预期不一致，检查 tools/gen.js --count 参数");
  process.exit(1);
}
'
