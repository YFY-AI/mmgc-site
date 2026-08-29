# 瞄瞄工厂 MMGC · 官方落地页

静态官网，部署于 GitHub Pages，自定义域名 **https://miaomiaoai.cc**。

## 技术
- 纯静态（HTML + CSS + 原生 JS），无构建步骤，直接作为站点根发布。
- 社交分享配图：`ogp/ogp.png`（1200×630）。
- 版本与下载信息：`data/releases.json`，由 `js/main.js` 动态渲染。

## 下载链接约定
安装包通过本仓库的 **GitHub Releases** 分发：

```
https://github.com/YFY-AI/mmgc-site/releases/download/v<版本>/MMGC-Setup-v<版本>.exe
```

发布新版本时，上传对应 Release 资产并更新 `data/releases.json` 即可，落地页自动生效。

## 本地预览
直接用浏览器打开 `index.html` 即可；或 `python -m http.server` 起本地服务。

## 部署
推送 `main` 分支即触发 GitHub Pages 自动发布（Settings → Pages → Source: main 分支根目录）。
