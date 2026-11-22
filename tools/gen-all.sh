#!/usr/bin/env bash
# 一键重新生成全部数据（题库 / 题解 / 课程 / 专题）
# 依赖：Node.js >= 18
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

node tools/gen.js            # 题库分片 + 索引 + 统计 + 面试 + 手册
node tools/gen-solutions.js  # 每道题一份题解（27,933 份）
node tools/gen-course.js     # 4 门语言课程 80 章 / 320 节微课
node tools/gen-algo.js       # 24 个算法专题

echo "完成：$(du -sh data | cut -f1) / $(ls data | wc -l) 个文件"
