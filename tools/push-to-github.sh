#!/usr/bin/env bash
# 把本地仓库推到 GitHub：设置 remote、填好 README 里的仓库地址、推送 main
#
# 用法：
#   bash tools/push-to-github.sh <github用户名> [仓库名]
#   bash tools/push-to-github.sh <github用户名> [仓库名] --ssh    # 用 SSH 方式
#   bash tools/push-to-github.sh <github用户名> [仓库名] --dry    # 只做准备，不推送
#
# 前提：已在 GitHub 网页上建好同名空仓库（不勾 README / .gitignore / LICENSE）
set -e

NAME="${1:-}"
REPO="${2:-algomaster}"
MODE="https"
for a in "$@"; do
  case "$a" in
    --ssh) MODE="ssh" ;;
    --dry) DRY="1" ;;
  esac
done

if [ -z "$NAME" ]; then
  echo "用法: bash tools/push-to-github.sh <github用户名> [仓库名] [--ssh|--dry]" >&2
  exit 1
fi

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ "$MODE" = "ssh" ]; then
  URL="git@github.com:${NAME}/${REPO}.git"
else
  URL="https://github.com/${NAME}/${REPO}.git"
fi

echo "==> 目标仓库: $URL"

# 1) 设置 remote（已存在则覆盖）
if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$URL"
else
  git remote add origin "$URL"
fi
echo "==> remote 已设置"

# 2) README 里的占位符换成真实用户名/仓库名
if grep -q "<your-name>" README.md 2>/dev/null; then
  python - <<PY
import io
p = "README.md"
s = io.open(p, encoding="utf-8").read()
s2 = s.replace("https://github.com/<your-name>/algomaster.git",
               "https://github.com/${NAME}/${REPO}.git")
io.open(p, "w", encoding="utf-8", newline="\n").write(s2)
print("==> README 仓库地址已填入")
PY
  git add README.md
  git -c core.hooksPath=/dev/null commit -q -m "docs: 填入仓库地址" || true
fi

if [ "$DRY" = "1" ]; then
  echo "==> --dry 模式，到此为止。确认无误后去掉 --dry 重跑即可推送。"
  git remote -v
  exit 0
fi

# 3) 推送
echo "==> 开始推送（HTTPS 方式会要求输入用户名和 Personal Access Token）"
git push -u origin main

echo ""
echo "完成。接下来去网页上做两件事："
echo "  1) 仓库右侧 About 齿轮 → 填描述、加 topics、勾选 Releases"
echo "  2) Releases → Draft a new release → Tag v2.0.0 → 上传 download/algomaster.apk"
