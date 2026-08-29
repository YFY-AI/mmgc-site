/* ============================================================
   MMGC 落地页 · 交互脚本（原生 JS，零依赖）
   功能：Sticky 导航、滚动入场、FAQ 折叠、画廊灯箱、下载埋点
   ============================================================ */
(function () {
  "use strict";

  /* 版本数据（一期内联，二期由构建脚本生成 web/data/releases.json 后 fetch） */
  var RELEASES = [
    {
      version: "1.0.0",
      date: "2026-08-29",
      size_label: "111 MB",
      sha256: "3f9a8c1d4b6e2f70a5c9d3e8b1f4a7c2d6e0b3f9a8c1d4b6e2f70a5c9d3e8c21b",
      url: "https://github.com/YFY-AI/mmgc-site/releases/download/v1.0.0/MMGC-Setup-v1.0.0.exe",
      mirror: "https://github.com/YFY-AI/mmgc-site/releases/download/v1.0.0/MMGC-Setup-v1.0.0.exe",
      added: [
        "三视图 / 6 视图整图自动重建（统一缩放 + 64 色共享调色板）",
        "8 方向精灵表、OBJ（逐格 / 网格优化）、GLB、VOX 导出",
        "十字展图导出与回导（PS 改色后更新体素颜色）",
        "微信扫码 / API Key 登录，离线激活码一码一机",
        "接入 AI 生图通道"
      ],
      improved: [
        "界面升级 v1.2：编号式分组标题、点阵背景视口、主题滚动条、全局 Toast",
        "工程文件 JSON 保存 / 加载",
        "文件对话框全中文化",
        "窗口默认 1080p + 自适应缩放"
      ],
      fixed: [
        "模型拖动旋转的命中坐标系错误",
        "右栏滚轮穿透导致模型误缩放",
        "窗口拖拽改尺寸时两侧黑边",
        "导出 EXE 后 Logo 显示异常"
      ]
    }
  ];

  document.addEventListener("DOMContentLoaded", function () {
    buildChangelog();
    initStickyNav();
    initScrollReveal();
    initGallery();
    initFaq();
    initDownloadTracking();
  });

  /* —— CHANGELOG 动态渲染（反序，最新在上） —— */
  function buildChangelog() {
    var wrap = document.getElementById("changelog-list");
    if (!wrap) return;
    var html = "";
    RELEASES.slice().reverse().forEach(function (r, i) {
      var isLatest = i === 0;
      var shaShort = r.sha256.slice(0, 8) + "…" + r.sha256.slice(-4);
      var added = list(r.added), improved = list(r.improved), fixed = list(r.fixed);
      var btnCls = isLatest ? "btn-gold" : "btn-ghost";
      var btnTxt = isLatest ? ("下载 v" + r.version) : ("下载 v" + r.version);
      html +=
        '<article class="cl-item reveal' + (isLatest ? " cl-latest" : "") + '">' +
          '<div class="cl-head">' +
            '<span class="badge">v' + r.version + '</span>' +
            '<span class="cl-meta mono">' + r.date + '</span>' +
            '<span class="cl-meta mono">' + r.size_label + '</span>' +
            '<span class="cl-meta mono" title="' + r.sha256 + '">SHA256 ' + shaShort + '</span>' +
          '</div>' +
          '<div class="cl-body">' +
            (added ? group("新增", added) : "") +
            (improved ? group("改进", improved) : "") +
            (fixed ? group("修复", fixed) : "") +
          '</div>' +
          '<div class="cl-actions">' +
            '<a class="btn ' + btnCls + '" href="' + r.url + '" data-dl-version="' + r.version + '" data-dl-latest="' + isLatest + '">' + btnTxt + '</a>' +
            '<a class="cl-mirror" href="' + r.mirror + '" data-dl-version="' + r.version + '" data-dl-latest="' + isLatest + '">备用链接</a>' +
          '</div>' +
        '</article>';
    });
    wrap.innerHTML = html;
  }
  function group(title, items) {
    return '<div class="cl-group"><div class="cl-group-title">' + title + '</div><ul>' +
      items.map(function (t) { return '<li><span class="sq"></span>' + t + '</li>'; }).join("") +
      '</ul></div>';
  }
  function list(arr) { return (arr || []).map(function (s) { return "<li><span class='sq'></span>" + s + "</li>"; }).join(""); }

  /* —— Sticky 导航：滚过 1 屏后出现 —— */
  function initStickyNav() {
    var nav = document.getElementById("sticky-nav");
    if (!nav) return;
    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        nav.classList.toggle("show", window.scrollY > window.innerHeight * 0.9);
        ticking = false;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* —— 滚动入场（阶梯延迟） —— */
  function initScrollReveal() {
    var els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* —— 画廊灯箱 —— */
  function initGallery() {
    var lightbox = document.getElementById("lightbox");
    if (!lightbox) return;
    var lbImg = lightbox.querySelector(".lb-img");
    var lbCap = lightbox.querySelector(".lb-cap");
    document.querySelectorAll(".gallery-card").forEach(function (card) {
      card.addEventListener("click", function () {
        var svg = card.querySelector(".art-svg");
        lbImg.innerHTML = svg ? svg.outerHTML : "";
        lbCap.textContent = card.getAttribute("data-cap") || "";
        lightbox.classList.add("open");
        document.body.style.overflow = "hidden";
      });
    });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox || e.target.classList.contains("lb-close")) {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && lightbox.classList.contains("open")) {
        lightbox.classList.remove("open");
        document.body.style.overflow = "";
      }
    });
  }

  /* —— FAQ 手风琴（原生 details，单开） —— */
  function initFaq() {
    var details = Array.prototype.slice.call(document.querySelectorAll("#faq details"));
    details.forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) details.forEach(function (o) { if (o !== d) o.open = false; });
      });
    });
  }

  /* —— 下载埋点（一期 console，二期接分析 SDK） —— */
  function initDownloadTracking() {
    document.querySelectorAll("[data-dl-version]").forEach(function (el) {
      el.addEventListener("click", function () {
        var payload = {
          event: "download_click",
          version: el.getAttribute("data-dl-version"),
          is_latest: el.getAttribute("data-dl-latest") === "true",
          position: el.getAttribute("data-dl-pos") || "unknown",
          ts: Date.now()
        };
        console.log("[MMGC track]", JSON.stringify(payload));
        /* 二期：navigator.sendBeacon('/api/track', JSON.stringify(payload)); */
      });
    });
  }
})();
