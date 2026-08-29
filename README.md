# 瞄瞄工厂 MMGC · 官方落地页

静态官网，部署于 GitHub Pages，自定义域名 **https://miaomiaoai.cc**。

## 技术
- 纯静态（HTML + CSS + 原生 JS），无构建步骤，直接作为站点根发布。
- 社交分享配图：`ogp/ogp.png`（1200×630）。
- 版本与下载信息：`data/releases.json`，由 `js/main.js` 动态渲染。

## 下载链接约定
安装包托管于腾讯云 COS（香港桶 `lhcos-2d450-1317071874`，默认域名腾讯已备案，国内可直接下载）：

```
https://lhcos-2d450-1317071874.cos.ap-hongkong.myqcloud.com/dl/MMGC-Setup-v<版本>.exe
```

发布新版本时，把安装包上传到该桶的 `dl/` 前缀（对象设公有读、存储类型 STANDARD），并更新 `data/releases.json` 即可，落地页自动生效。

> 注：香港桶为跨境下载，国内速度不及大陆桶 / 备案后 CDN；后续若 `miaomiaoai.cc` 完成 ICP 备案，可把 `dl.miaomiaoai.cc` 绑腾讯云 CDN 回源该桶以提速。

## 本地预览
直接用浏览器打开 `index.html` 即可；或 `python -m http.server` 起本地服务。

## 部署
推送 `main` 分支即触发 GitHub Pages 自动发布（Settings → Pages → Source: main 分支根目录）。
