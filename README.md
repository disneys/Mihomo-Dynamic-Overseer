# 🚀 Mihomo Dynamic Overseer

一个基于 JavaScript 的高级 Mihomo (Clash Meta) 配置文件覆写脚本。旨在通过动态逻辑实现节点的自动化分类、智能测速，并集成高可用的全协议 DNS 调度引擎。

## ✨ 核心特性

- **⚡ 顶级 DNS 调度**：内置双栈 DNS 引擎。
  - **国内直连**：集成阿里/腾讯等权威提供商，支持 UDP、DoH、DoT、TLS 全协议解析，首包毫秒级响应。
  - **海外防污染**：自动切换 Google/Cloudflare/Quad9 加密 DNS，配合 `fake-ip` 模式，彻底杜绝 DNS 劫持。
- **📂 自动化动态分组**：通过高性能正则引擎自动识别全球 16+ 主流国家节点，配置动态伸缩，无需手动维护。
- **🛡️ 零丢弃机制**：引入“其他”分组收底逻辑。确保任何非标准命名的节点都能被捕获，100% 覆盖你的订阅节点。
- **🤖 AI 专属优化**：智能平铺非港节点并自动测速，秒级切换，确保 ChatGPT/Claude/Gemini 等服务稳定可用。
- **🚫 广告强力拦截**：内置 `category-ads-all` 规则集，在请求阶段即刻阻断广告，节省流量并提升加载速度。
- **🔗 订阅自我保护**：预置订阅转换域名白名单。即使节点全线失效，依然能保证订阅更新通道畅通无阻。
- **🎨 视觉美化**：预设稳定且风格统一的彩色图标集（Qure 定制版），适配全平台 UI 界面。

## 🛠️ 如何使用

推荐使用 **远程脚本导入** 方式，以便于后续自动同步更新。

### 1. 选择脚本链接（任选其一）

- **GitHub 原地址（推荐）**:  
  `https://raw.githubusercontent.com/disneys/Mihomo-Dynamic-Overseer/main/main.js`
- **jsDelivr 镜像 (加速)**:  
  `https://fastly.jsdelivr.net/gh/disneys/Mihomo-Dynamic-Overseer@main/main.js`
- **GHFast 镜像 (加速)**:  
  `https://ghfast.top/https://raw.githubusercontent.com/disneys/Mihomo-Dynamic-Overseer/main/main.js`

### 2. 配置客户端

- **Clash Verge Rev**: 进入 `配置` -> `右键点击你的订阅` -> `编辑覆写` -> `脚本` -> `添加` -> 选择 `远程链接` -> 粘贴上述任一链接。
- **Mihomo Party**: 进入 `覆写` -> `添加脚本` -> `远程链接` -> 粘贴上述任一链接并保存。
- **其他客户端**: 在对应的 `Script` 或 `Override` 模块中引用该远程链接即可。

### 3. 生效配置

保存并刷新/更新你的订阅，即可看到整洁、智能且高效的节点分组。

## ⚠️ 技术要求

- **内核要求**：必须配合 **Mihomo (Meta) 内核** 使用，以支持 `GEOSITE` 语法及高级 DNS 策略。
- **隐私建议**：脚本默认配置 `no-resolve`，建议保持开启以保护内网解析隐私。

## 🤝 贡献与反馈

如果你发现了新的节点命名规律、图标失效（404）或有更好的 DNS 提供商建议，欢迎提交 Pull Request 或 Issue！

---
Made with ❤️ by **Disneys**