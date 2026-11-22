#!/usr/bin/env bash
# ============================================================
# 构建安卓 APK（全量内嵌资源，离线可用）
#
# 依赖：
#   - JDK 17（javac / keytool）
#   - Android SDK：build-tools（aapt2 / d8 / zipalign / apksigner）+ 任一 platforms/android-XX
#   - python3 或 zip 命令（用于把 classes.dex 塞进包）
#
# 用法：
#   bash tools/build-apk.sh                # 输出到 build/algomaster.apk
#   bash tools/build-apk.sh /tmp/app.apk   # 指定输出路径
#
# 环境变量：
#   ANDROID_HOME / ANDROID_SDK_ROOT  SDK 根目录（找不到时按常见路径猜）
#   JAVA_HOME                        JDK 目录
#   APK_KEYSTORE / APK_KS_PASS / APK_KEY_ALIAS 签名材料
#                                    （缺省用 android/debug.keystore，没有就自动生成）
#
# 注意：所有 aapt2 / javac / d8 调用都用「仓库内的相对路径」。
#       Windows 下 aapt2 无法处理带中文的绝对路径参数，必须这样绕开。
# ============================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_ABS="${1:-$ROOT/build/algomaster.apk}"
case "$OUT_ABS" in
  /*|[A-Za-z]:*) ;;
  *) OUT_ABS="$ROOT/$OUT_ABS" ;;
esac

say() { printf '\033[36m[apk]\033[0m %s\n' "$*"; }
die() { printf '\033[31m[apk] %s\033[0m\n' "$*" >&2; exit 1; }

cd "$ROOT"
[ -f index.html ] || die "请在仓库根目录执行"
if [ -z "$(ls data/problems-*.js 2>/dev/null | head -1)" ]; then
  die "缺少题库分片，先执行：bash tools/gen-all.sh"
fi

# ---------- 1. 定位工具链 ----------
SDK="${ANDROID_HOME:-${ANDROID_SDK_ROOT:-}}"
if [ -z "$SDK" ] || [ ! -d "$SDK/build-tools" ]; then
  for c in "$HOME/Android/Sdk" "$HOME/Library/Android/sdk" \
           "${LOCALAPPDATA:-}/Android/Sdk" /c/android-build/sdk /usr/lib/android-sdk; do
    if [ -n "$c" ] && [ -d "$c/build-tools" ]; then SDK="$c"; break; fi
  done
fi
[ -n "${SDK:-}" ] && [ -d "$SDK/build-tools" ] || die "找不到 Android SDK，请设置 ANDROID_HOME"

BT="$(ls -d "$SDK"/build-tools/*/ 2>/dev/null | sort -V | tail -1)"
BT="${BT%/}"
AJ="$(ls "$SDK"/platforms/android-*/android.jar 2>/dev/null | sort -V | tail -1)"
[ -n "$BT" ] || die "build-tools 目录为空"
[ -n "$AJ" ] || die "platforms/android-XX/android.jar 不存在（用 sdkmanager 装一个 platform）"

# Windows 下工具带 .exe/.bat 后缀（.bat 在 git bash 里没有 x 位，用 -f 判断）
pick() { for n in "$@"; do [ -f "$BT/$n" ] && { echo "$BT/$n"; return; }; done; echo ""; }
AAPT2="$(pick aapt2 aapt2.exe)"
D8="$(pick d8 d8.bat)"
ZIPALIGN="$(pick zipalign zipalign.exe)"
APKSIGNER="$(pick apksigner apksigner.bat)"
[ -n "$AAPT2" ] && [ -n "$D8" ] && [ -n "$ZIPALIGN" ] && [ -n "$APKSIGNER" ] \
  || die "build-tools 里缺少 aapt2 / d8 / zipalign / apksigner"

JAVAC="${JAVA_HOME:+$JAVA_HOME/bin/javac}"; [ -x "${JAVAC:-}" ] || JAVAC="$(command -v javac || true)"
KEYTOOL="${JAVA_HOME:+$JAVA_HOME/bin/keytool}"; [ -x "${KEYTOOL:-}" ] || KEYTOOL="$(command -v keytool || true)"
[ -n "$JAVAC" ] || die "找不到 javac（需要 JDK 17）"
say "build-tools=$(basename "$BT")  $("$JAVAC" -version 2>&1 | head -1)"

PY=""
for c in python3 python; do command -v "$c" >/dev/null 2>&1 && { PY="$c"; break; }; done
command -v zip >/dev/null 2>&1 && HAVE_ZIP=1 || HAVE_ZIP=0
[ -n "$PY" ] || [ "$HAVE_ZIP" = 1 ] || die "需要 python3 或 zip 之一"

# ---------- 2. 准备 assets ----------
W="build/.work"
A="$W/assets"
rm -rf "$W"
mkdir -p "$A" "$W/gen" "$W/classes" "$W/dex"
say "收集站点资源 → assets"
cp index.html manifest.json sw.js "$A/"
cp -r css js data icons "$A/"
say "assets: $(find "$A" -type f | wc -l) 个文件 / $(du -sh "$A" | cut -f1)"

# ---------- 3. 编译资源 ----------
say "aapt2 compile"
"$AAPT2" compile --dir android/res -o "$W/res.zip"
say "aapt2 link（含 assets，压包较慢）"
"$AAPT2" link -o "$W/base.apk" -I "$AJ" \
  --manifest android/AndroidManifest.xml \
  -R "$W/res.zip" --java "$W/gen" -A "$A" --auto-add-overlay

# ---------- 4. 编译 Java ----------
say "javac"
"$JAVAC" -encoding UTF-8 -nowarn -source 8 -target 8 \
  -bootclasspath "$AJ" -classpath "$AJ" -d "$W/classes" \
  $(find android/src "$W/gen" -name '*.java')

# ---------- 5. dex ----------
say "d8"
"$D8" --release --min-api 21 --lib "$AJ" --output "$W/dex" $(find "$W/classes" -name '*.class')

# ---------- 6. 打包 + 对齐 + 签名 ----------
say "注入 classes.dex"
if [ "$HAVE_ZIP" = 1 ]; then
  ( cd "$W/dex" && zip -X -q ../base.apk classes.dex )
else
  "$PY" - "$W/base.apk" "$W/dex/classes.dex" <<'PYEOF'
import sys, zipfile
apk, dex = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(apk, "a", zipfile.ZIP_DEFLATED) as z:
    z.write(dex, "classes.dex")
PYEOF
fi

say "zipalign"
"$ZIPALIGN" -f -p 4 "$W/base.apk" "$W/aligned.apk"

KS="${APK_KEYSTORE:-android/debug.keystore}"
if [ ! -f "$KS" ]; then
  say "生成调试签名 android/debug.keystore（口令 android，仅本地测试用；上架请换正式证书并妥善保管）"
  [ -n "$KEYTOOL" ] || die "找不到 keytool"
  "$KEYTOOL" -genkeypair -v -keystore "$KS" -storepass android -keypass android \
    -alias androiddebugkey -keyalg RSA -keysize 2048 -validity 10000 \
    -dname "CN=AlgoMaster, OU=App, O=AlgoMaster, L=CN, ST=CN, C=CN" >/dev/null 2>&1
fi

say "apksigner"
mkdir -p "$(dirname "$OUT_ABS")"
OUT_REL="${OUT_ABS#"$ROOT"/}"
"$APKSIGNER" sign \
  --ks "$KS" --ks-pass "pass:${APK_KS_PASS:-android}" --key-pass "pass:${APK_KS_PASS:-android}" \
  --ks-key-alias "${APK_KEY_ALIAS:-androiddebugkey}" \
  --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true \
  --out "$OUT_REL" "$W/aligned.apk"

"$APKSIGNER" verify "$OUT_REL" >/dev/null && say "签名校验通过"
say "完成：$OUT_ABS（$(du -h "$OUT_REL" | cut -f1)）"
