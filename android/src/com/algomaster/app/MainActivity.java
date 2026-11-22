package com.algomaster.app;

import android.app.Activity;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * 算法大师 · 安卓外壳（全量内嵌版）
 *
 * 与上一版的区别：站点全部资源（index.html / css / js / data / icons）打进 assets，
 * 通过 shouldInterceptRequest 把 https://appassets.androidplatform.net/ 映射到 assets 目录。
 * 这样页面仍在 https 安全来源下，localStorage、相对路径懒加载、history 都正常，
 * 首次打开不需要联网，断网全功能可用。
 *
 * 返回逻辑：物理返回键交给网页的 App.hardwareBack() 决定（关弹层 / 回上一页 / 确认退出）。
 * 退出：网页通过 AndroidShell.exitApp() 让原生把任务切到后台。
 */
public class MainActivity extends Activity {

    /** 虚拟域名：仅用于提供安全来源，所有请求都在 shouldInterceptRequest 里被本地资源截获 */
    private static final String HOST = "appassets.androidplatform.net";
    private static final String ORIGIN = "https://" + HOST;
    private static final String START_URL = ORIGIN + "/";
    private static final String BG = "#0b0e13";

    public class ShellBridge {
        @JavascriptInterface
        public boolean isShell() { return true; }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() { moveTaskToBack(true); }
            });
        }
    }

    private WebView web;
    private boolean dead = false;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);

        try {
            getWindow().setStatusBarColor(Color.parseColor(BG));
            getWindow().setNavigationBarColor(Color.parseColor(BG));
        } catch (Throwable ignored) { }

        web = new WebView(this);
        web.setLayoutParams(new ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        web.setBackgroundColor(Color.parseColor(BG));

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setSupportZoom(false);
        s.setBuiltInZoomControls(false);
        s.setDisplayZoomControls(false);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setGeolocationEnabled(false);
        s.setMediaPlaybackRequiresUserGesture(true);
        try {
            s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        } catch (Throwable ignored) { }

        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest req) {
                if (req == null || req.getUrl() == null) return null;
                String h = req.getUrl().getHost();
                if (h == null || !HOST.equalsIgnoreCase(h)) return null;
                return serve(req.getUrl());
            }

            @Override
            @SuppressWarnings("deprecation")
            public WebResourceResponse shouldInterceptRequest(WebView v, String url) {
                Uri u = Uri.parse(url);
                if (u.getHost() == null || !HOST.equalsIgnoreCase(u.getHost())) return null;
                return serve(u);
            }
        });
        web.setWebChromeClient(new WebChromeClient());
        web.addJavascriptInterface(new ShellBridge(), "AndroidShell");

        setContentView(web);

        if (state != null) {
            web.restoreState(state);
        } else {
            web.loadUrl(START_URL);
        }
    }

    /* ---------------- 本地资源服务 ---------------- */

    private WebResourceResponse serve(Uri uri) {
        String path = uri.getPath();
        if (path == null || path.length() == 0 || "/".equals(path)) path = "/index.html";
        if (path.endsWith("/")) path = path + "index.html";
        String rel = path.startsWith("/") ? path.substring(1) : path;
        if (rel.contains("..")) return text(403, "Forbidden", "forbidden");

        InputStream in = null;
        try {
            in = getAssets().open(rel);
        } catch (Throwable e) {
            return text(404, "Not Found", "not found");
        }

        String mime = mimeOf(rel);
        WebResourceResponse r = new WebResourceResponse(mime, charsetOf(mime), in);
        if (Build.VERSION.SDK_INT >= 21) {
            Map<String, String> h = new HashMap<String, String>();
            h.put("Cache-Control", rel.startsWith("data/")
                    ? "public, max-age=31536000, immutable"
                    : "public, max-age=0, must-revalidate");
            h.put("Access-Control-Allow-Origin", "*");
            r.setResponseHeaders(h);
        }
        return r;
    }

    private WebResourceResponse text(int code, String reason, String body) {
        WebResourceResponse r = new WebResourceResponse("text/plain", "utf-8",
                new ByteArrayInputStream(body.getBytes()));
        if (Build.VERSION.SDK_INT >= 21) r.setStatusCodeAndReasonPhrase(code, reason);
        return r;
    }

    private static String mimeOf(String rel) {
        String p = rel.toLowerCase(Locale.US);
        if (p.endsWith(".html") || p.endsWith(".htm")) return "text/html";
        if (p.endsWith(".js") || p.endsWith(".mjs")) return "application/javascript";
        if (p.endsWith(".css")) return "text/css";
        if (p.endsWith(".json") || p.endsWith(".webmanifest")) return "application/json";
        if (p.endsWith(".svg")) return "image/svg+xml";
        if (p.endsWith(".png")) return "image/png";
        if (p.endsWith(".jpg") || p.endsWith(".jpeg")) return "image/jpeg";
        if (p.endsWith(".webp")) return "image/webp";
        if (p.endsWith(".ico")) return "image/x-icon";
        if (p.endsWith(".woff2")) return "font/woff2";
        if (p.endsWith(".woff")) return "font/woff";
        if (p.endsWith(".ttf")) return "font/ttf";
        if (p.endsWith(".txt") || p.endsWith(".md")) return "text/plain";
        return "application/octet-stream";
    }

    private static String charsetOf(String mime) {
        if (mime.startsWith("text/") || mime.contains("javascript") || mime.contains("json")) {
            return "utf-8";
        }
        return null;
    }

    /**
     * 物理返回键：先问网页。
     * 网页返回 "handled" 表示它已经处理；其余情况直接把任务切到后台，回到手机主屏。
     */
    @Override
    public void onBackPressed() {
        if (web == null || dead) {
            moveTaskToBack(true);
            return;
        }
        try {
            web.evaluateJavascript(
                    "(function(){try{return (window.App&&App.hardwareBack)?App.hardwareBack():'exit';}"
                            + "catch(e){return 'exit';}})()",
                    new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String v) {
                            String r = v == null ? "exit" : v.replace("\"", "").trim();
                            if (!"handled".equals(r)) moveTaskToBack(true);
                        }
                    });
        } catch (Throwable t) {
            moveTaskToBack(true);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        if (web != null) web.saveState(out);
    }

    @Override
    protected void onDestroy() {
        dead = true;
        if (web != null) {
            web.loadUrl("about:blank");
            web.destroy();
            web = null;
        }
        super.onDestroy();
    }
}
