# 坐坐正

一个可部署到 GitHub Pages 的移动端 Web App，帮助家长在孩子写字前进行一次温和的本机坐姿检查，并提供轻量写字陪伴与本地趋势记录。

> 这是书写习惯辅助工具，不提供医疗诊断、治疗、近视预防或脊柱矫正建议。

## 功能

- 10 秒坐姿检测：使用浏览器本地 MediaPipe Pose Landmarker，输出头部、肩部、躯干、桌距位置的“良好 / 建议调整 / 暂无法判断”。
- 检测报告、本次建议、5 / 10 / 15 分钟写字陪伴，以及最近 7 天的本地趋势。
- 握笔检测 Beta：使用本地 Hand Landmarker 检查手部是否完整入镜。
- 所有记录只保存在浏览器 `localStorage`；不保存视频、照片、截图或人体关键点。
- 离开检测页面、关闭摄像头或卸载组件时，摄像头 track 会被停止。

## 本地运行

需要 Node.js 20 或更新版本。

```bash
pnpm install
pnpm run dev
```

浏览器打开 Vite 显示的本地地址。摄像头只可在 `localhost` 或 HTTPS 页面中使用。

## 构建

```bash
pnpm run typecheck
pnpm run build
```

构建产物位于 `dist/`。本项目使用 Hash Router，因此 GitHub Pages 刷新任意页面不会 404。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个空仓库，建议仓库名：`zuozuozheng`。
2. 上传本项目的全部源码文件（见下方清单），不要上传 `node_modules/` 或 `dist/`。
3. 打开仓库 **Settings → Pages**，在 **Build and deployment** 中选择 **GitHub Actions**。
4. 将代码推送至 `main` 分支。GitHub Actions 会自动类型检查、构建并发布 `dist/`。
5. Actions 成功后，在仓库 **Settings → Pages** 查看网站地址。

### 要上传到仓库的文件

上传这些内容：

```text
.github/workflows/deploy-pages.yml
src/
index.html
package.json
pnpm-lock.yaml
pnpm-workspace.yaml
tsconfig.json
tsconfig.app.json
vite.config.ts
.gitignore
.npmrc
CNAME.example
README.md
```

不要上传：`node_modules/`、`dist/`、任何 `.env` 文件、照片、视频或摄像头数据。

## 自定义域名与 HTTPS

1. 将 `CNAME.example` 复制为 `CNAME`，把其中的 `app.yourdomain.com` 改成自己的真实域名后提交。
2. 在域名 DNS 中按 GitHub Pages 官方文档添加对应记录。
3. 在仓库 **Settings → Pages** 填入相同的域名，等待验证后打开 **Enforce HTTPS**。

未使用自定义域名时不需要提交 `CNAME`。

## 模型资源和隐私

MediaPipe 的 WASM 与模型默认从 Google/JSDelivr 的公开静态地址加载：它们只提供程序文件，不会接收摄像头视频帧、截图或关键点。若需要离线或内网部署，可下载这些公开模型文件到 `public/models/`，再在 `src/lib/mediapipe.ts` 中把两个 `modelAssetPath` 改为相对路径。

第一版不需要个人服务器、API 代理、数据库、登录或 API Key。GitHub Pages 的静态前端对公众可见，因此不要把任何密钥写入项目。

## 已知准确性限制

- 单目移动摄像头只能做相对姿势的辅助提示，不能可靠测量厘米距离，也不能提供医学判断。
- “桌距位置 / 前倾”在桌面或上半身不可见时会诚实显示为“暂无法判断”。
- 光线过暗、遮挡、多人入镜或手机角度不合适时，模型可能要求重新取景。
