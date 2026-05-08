# 🚀 Mihomo Dynamic Overseer (Whitelist Edition)
**Powered by Disneys**

这是一个基于 Mihomo (Meta) 内核的高性能动态覆写脚本。本项目抛弃了传统的“全代理”黑名单思维，全面拥抱 **白名单模式 (Whitelist Mode)**，旨在为开发者提供一个零维护、极速响应且节点利用率最大化的网络环境。

---

## 🛠️ 核心架构逻辑 (Traffic Pipeline)

流量进入内核后，脚本将按以下优先级进行严格审计与分流：

1.  **基础设施层 (Infrastructure)**: 订阅服务器域名、Dashboard 域名强制直连（DIRECT）。
2.  **系统与局部层 (Private/System)**: 局域网（LAN）、系统级应用（Applications）、私有地址强制直连。
3.  **安全过滤层 (Security)**: 基于 Loyalsoldier 的 `reject` 规则集实时拦截广告与追踪。
4.  **业务专项层 (Business Critical)**: 
    * **AI 工具**: 优先探测 OpenAI/Claude/Gemini，强制导流至专属 `AI 工具` 分组。
    * **Apple/iCloud**: 优化苹果服务访问体验，默认直连。
5.  **白名单代理层 (Proxy Whitelist)**: 仅当域名命中 `google`、`telegram` 或 `proxy` 规则集时，才触发代理逻辑。
6.  **合规直连层 (Domestic Bypass)**: 命中 `cncidr`、`GEOIP CN` 或 `direct` 规则集时，强制直连。
7.  **最终兜底 (Final Match)**: 未命中任何已知规则的流量走 `节点选择`（通常为国外未知流量）。

---

## ✨ 核心技术特性

### 1. 🤖 智能 AI 节点清洗算法
脚本内置了严格的 AI 节点过滤逻辑。通过 JS 实时计算，`AI 工具` 策略组会自动剔除以下不合规节点，确保 ChatGPT 等服务不被封禁：
* **地理排除**: 排除包含 `港、香港、HK、CN、中国` 字样的节点。
* **逻辑排除**: 排除所有落入 `其他` 分组的未识别节点。
* **系统排除**: 排除 `Direct` 等虚拟节点。

### 2. 🌍 15+ 国家/地区动态识别
利用高性能正则表达式，自动扫描订阅中的节点名称，动态生成以下策略组并配以高品质彩色图标：
`香港`、`台湾`、`新加坡`、`日本`、`美国`、`韩国`、`英国`、`德国`、`法国`、`加拿大`、`澳洲`、`俄罗斯`、`印度`、`土耳其`、`巴西`。

### 3. 🛰️ 远程 Rule-Providers 联动
完全同步 [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules) 仓库，采用 `behavior: domain/ipcidr/classical` 三重匹配引擎，每天自动静默更新规则，告别本地 GEO 数据库陈旧的问题。

### 4. ⚡ 极简分组设计
移除了冗余的 `流媒体`、`广告拦截` 策略组，回归“节点选择”为核心的扁平化结构，降低内核内存占用，提升切换速度。

---

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
