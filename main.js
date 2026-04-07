function main(params) {
  if (!params.proxies || params.proxies.length === 0) return params;

  // --- 1. 资源定义与自定义配置 ---
  const TEST_URL = "http://www.gstatic.com/generate_204";
  const TEST_INTERVAL = 60; 
  const RULE_BASE = "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/";

  const ICON_BASE = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/";
  const ICON = {
    GLOBAL: ICON_BASE + "Global.png",
    AUTO: ICON_BASE + "Auto.png",
    MANUAL: ICON_BASE + "Static.png",
    AI: ICON_BASE + "ChatGPT.png",
    HK: ICON_BASE + "Hong_Kong.png",
    TW: ICON_BASE + "Taiwan.png",
    SG: ICON_BASE + "Singapore.png",
    JP: ICON_BASE + "Japan.png",
    US: ICON_BASE + "United_States.png",
    KR: ICON_BASE + "Korea.png",
    UK: ICON_BASE + "United_Kingdom.png",
    DE: ICON_BASE + "Germany.png",
    FR: ICON_BASE + "France.png",
    CA: ICON_BASE + "Canada.png",
    AU: ICON_BASE + "Australia.png",
    RU: ICON_BASE + "Russia.png",
    IN: ICON_BASE + "India.png",
    NL: ICON_BASE + "Netherlands.png",
    TR: ICON_BASE + "Turkey.png",
    BR: ICON_BASE + "Brazil.png",
    OTHER: ICON_BASE + "Airport.png"
  };

  const allProxyNames = params.proxies.map(e => e.name);

  // --- 2. 注入 Rule Providers (白名单模式必需) ---
  params["rule-providers"] = {
    "reject": { type: "http", behavior: "domain", url: RULE_BASE + "reject.txt", path: "./ruleset/reject.yaml", interval: 86400 },
    "icloud": { type: "http", behavior: "domain", url: RULE_BASE + "icloud.txt", path: "./ruleset/icloud.yaml", interval: 86400 },
    "apple": { type: "http", behavior: "domain", url: RULE_BASE + "apple.txt", path: "./ruleset/apple.yaml", interval: 86400 },
    "google": { type: "http", behavior: "domain", url: RULE_BASE + "google.txt", path: "./ruleset/google.yaml", interval: 86400 },
    "proxy": { type: "http", behavior: "domain", url: RULE_BASE + "proxy.txt", path: "./ruleset/proxy.yaml", interval: 86400 },
    "direct": { type: "http", behavior: "domain", url: RULE_BASE + "direct.txt", path: "./ruleset/direct.yaml", interval: 86400 },
    "private": { type: "http", behavior: "domain", url: RULE_BASE + "private.txt", path: "./ruleset/private.yaml", interval: 86400 },
    "cncidr": { type: "http", behavior: "ipcidr", url: RULE_BASE + "cncidr.txt", path: "./ruleset/cncidr.yaml", interval: 86400 },
    "lancidr": { type: "http", behavior: "ipcidr", url: RULE_BASE + "lancidr.txt", path: "./ruleset/lancidr.yaml", interval: 86400 },
    "telegramcidr": { type: "http", behavior: "ipcidr", url: RULE_BASE + "telegramcidr.txt", path: "./ruleset/telegramcidr.yaml", interval: 86400 },
    "applications": { type: "http", behavior: "classical", url: RULE_BASE + "applications.txt", path: "./ruleset/applications.yaml", interval: 86400 }
  };

  // --- 3. DNS 配置 (保持不变) ---
  params.dns = {
    "enable": true, "device-network": true, "ipv6": false, "enhanced-mode": "fake-ip", "fake-ip-range": "198.18.0.1/16",
    "default-nameserver": ["223.5.5.5", "119.29.29.29", "1.1.1.1"],
    "nameserver": [
      "223.5.5.5", "223.6.6.6", "119.29.29.29", "180.76.76.76",
      "tls://dns.alidns.com", "https://dns.alidns.com/dns-query", "https://doh.pub/dns-query"
    ],
    "fallback": [
      "https://dns.google/dns-query", "https://cloudflare-dns.com/dns-query",
      "https://dns.quad9.net/dns-query", "tls://8.8.8.8", "tls://1.1.1.1", "tls://dns.quad9.net"
    ],
    "fallback-filter": { "geoip": true, "geoip-code": "CN", "ipcidr": ["240.0.0.0/4"] },
    "nameserver-policy": {
      "geosite:cn": "https://dns.alidns.com/dns-query",
      "domain:sub.datapipe.top,suc-store.usuc.cc,sub-aylz.koyeb.app": "119.29.29.29"
    }
  };

  // --- 4. 动态区域识别 (核心逻辑完全保留) ---
  const regionConfigs = [
    { name: "香港", regex: /港|香港|🇭🇰|HK|Hong Kong/, icon: ICON.HK },
    { name: "台湾", regex: /台|台湾|新北|彰化|TW|Taiwan|🇹🇼/, icon: ICON.TW },
    { name: "新加坡", regex: /新加坡|狮城|SG|Singapore|🇸🇬/, icon: ICON.SG },
    { name: "日本", regex: /日本|🇯🇵|JP|Japan/, icon: ICON.JP },
    { name: "美国", regex: /美|美国|🇺🇸|US|United States/, icon: ICON.US },
    { name: "韩国", regex: /韩|韩国|🇰🇷|KR|Korea/, icon: ICON.KR },
    { name: "英国", regex: /英国|🇬🇧|UK|United Kingdom/, icon: ICON.UK },
    { name: "德国", regex: /德|德国|🇩🇪|DE|Germany/, icon: ICON.DE },
    { name: "法国", regex: /法|法国|🇫🇷|FR|France/, icon: ICON.FR },
    { name: "加拿大", regex: /加拿大|🇨🇦|CA|Canada/, icon: ICON.CA },
    { name: "澳洲", regex: /澳|澳大利亚|🇦🇺|AU|Australia/, icon: ICON.AU },
    { name: "俄罗斯", regex: /俄|俄罗斯|🇷🇺|RU|Russia/, icon: ICON.RU },
    { name: "印度", regex: /印|印度|🇮🇳|IN|India/, icon: ICON.IN },
    { name: "荷兰", regex: /荷|荷兰|🇳🇱|NL|Netherlands/, icon: ICON.NL },
    { name: "土耳其", regex: /土|土耳其|🇹🇷|TR|Turkey/, icon: ICON.TR },
    { name: "巴西", regex: /巴西|🇧🇷|BR|Brazil/, icon: ICON.BR }
  ];

  let assignedProxies = new Set();
  const activeRegionGroups = [];

  regionConfigs.forEach(r => {
    const matched = params.proxies.filter(p => r.regex.test(p.name)).map(p => p.name);
    if (matched.length > 0) {
      activeRegionGroups.push({
        name: r.name, type: "url-test", icon: r.icon, interval: TEST_INTERVAL, url: TEST_URL, tolerance: 50, proxies: matched
      });
      matched.forEach(name => assignedProxies.add(name));
    }
  });

  const otherProxies = allProxyNames.filter(name => !assignedProxies.has(name));
  if (otherProxies.length > 0) {
    activeRegionGroups.push({
      name: "其他", type: "url-test", icon: ICON.OTHER, interval: TEST_INTERVAL, url: TEST_URL, tolerance: 50, proxies: otherProxies
    });
  }

  // --- 5. AI 分组逻辑：排除港、中、其他分组中的节点 (完全保留并优化) ---
  const aiProxies = params.proxies
    .filter(p => !/港|香港|HK|CN|中国|Direct/i.test(p.name) && !otherProxies.includes(p.name))
    .map(p => p.name);

  // --- 6. 策略组组装 ---
  const nodeSelect = {
    name: "节点选择",
    type: "select",
    proxies: ["自动选择", ...activeRegionGroups.map(g => g.name), "手动选择", "DIRECT"],
    icon: ICON.GLOBAL
  };

  const aiGroup = {
    name: "AI 工具",
    type: "url-test",
    proxies: aiProxies.length > 0 ? aiProxies : ["自动选择"],
    icon: ICON.AI,
    interval: TEST_INTERVAL,
    url: TEST_URL
  };

  const autoSelect = { name: "自动选择", type: "url-test", proxies: allProxyNames, icon: ICON.AUTO, interval: TEST_INTERVAL, url: TEST_URL };
  const manualSelect = { name: "手动选择", type: "select", proxies: allProxyNames, icon: ICON.MANUAL };

  params["proxy-groups"] = [
    nodeSelect, autoSelect, manualSelect, aiGroup, ...activeRegionGroups
  ];

  // --- 7. 路由规则 (白名单模式 + AI 专项逻辑) ---
  params.rules = [
    "DOMAIN,sub.datapipe.top,DIRECT",
    "DOMAIN,suc-store.usuc.cc,DIRECT",
    "DOMAIN,sub-aylz.koyeb.app,DIRECT",
    "DOMAIN,ghfast.top,DIRECT",
    "DOMAIN,wget.la,DIRECT",
    "DOMAIN,hk.gh-proxy.org,DIRECT",
    "DOMAIN,hub.glowp.xyz,DIRECT",
    "DOMAIN,gh.catmak.name,DIRECT",
    "DOMAIN,fastly.jsdelivr.net,DIRECT",
    "DOMAIN,cdn.jsdelivr.net,DIRECT",
    "DOMAIN,cdn.gh-proxy.org,DIRECT",
    "DOMAIN,g.blfrp.cn,DIRECT",
    "RULE-SET,applications,DIRECT",
    "DOMAIN,clash.razord.top,DIRECT",
    "DOMAIN,yacd.haishan.me,DIRECT",
    "RULE-SET,private,DIRECT",
    "RULE-SET,reject,REJECT",
    "RULE-SET,icloud,DIRECT",
    "RULE-SET,apple,DIRECT",
    
    // AI 专项：在白名单 general 规则之前拦截
    "GEOSITE,openai,AI 工具",
    "DOMAIN-SUFFIX,chatgpt.com,AI 工具",
    "DOMAIN-SUFFIX,gemini.google.com,AI 工具",
    "DOMAIN-KEYWORD,generativelanguage,AI 工具",
    "GEOSITE,anthropic,AI 工具",
    "DOMAIN-SUFFIX,claude.ai,AI 工具",

    "RULE-SET,google,节点选择",
    "RULE-SET,proxy,节点选择",
    "RULE-SET,direct,DIRECT",
    "RULE-SET,lancidr,DIRECT",
    "RULE-SET,cncidr,DIRECT",
    "RULE-SET,telegramcidr,节点选择",
    "GEOIP,LAN,DIRECT",
    "GEOIP,CN,DIRECT",
    "MATCH,节点选择"
  ];

  return params;
}
