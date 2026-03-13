function main(params) {
  if (!params.proxies || params.proxies.length === 0) return params;

  // --- 1. 资源定义 ---
  const ICON_BASE = "https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/";
  const ICON = {
    GLOBAL: ICON_BASE + "Global.png",
    AUTO: ICON_BASE + "Auto.png",
    MANUAL: ICON_BASE + "Static.png",
    AI: ICON_BASE + "ChatGPT.png",
    MEDIA: ICON_BASE + "Streaming.png",
    STEAM: ICON_BASE + "Steam.png",
    ADS: ICON_BASE + "Advertising.png",
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

  // --- 2. 动态区域配置 ---
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
        name: r.name,
        type: "url-test",
        icon: r.icon,
        interval: 300,
        tolerance: 50,
        proxies: matched
      });
      matched.forEach(name => assignedProxies.add(name));
    }
  });

  const otherProxies = allProxyNames.filter(name => !assignedProxies.has(name));
  if (otherProxies.length > 0) {
    activeRegionGroups.push({
      name: "其他",
      type: "url-test",
      icon: ICON.OTHER,
      interval: 300,
      tolerance: 50,
      proxies: otherProxies
    });
  }

  // --- 3. 构建策略组 ---
  const adsGroup = {
    name: "广告拦截",
    type: "select",
    proxies: ["REJECT", "DIRECT"],
    icon: ICON.ADS
  };

  const aiProxies = params.proxies
    .filter(p => !/港|香港|HK|CN|中国|Direct/i.test(p.name))
    .map(p => p.name);

  const aiGroup = {
    name: "AI 工具",
    type: "url-test",
    proxies: aiProxies.length > 0 ? aiProxies : ["自动选择"],
    icon: ICON.AI,
    interval: 300
  };

  const nodeSelect = {
    name: "节点选择",
    type: "select",
    proxies: ["自动选择", ...activeRegionGroups.map(g => g.name), "手动选择", "DIRECT"],
    icon: ICON.GLOBAL
  };

  const autoSelect = {
    name: "自动选择",
    type: "url-test",
    proxies: allProxyNames,
    icon: ICON.AUTO,
    interval: 300
  };

  const manualSelect = {
    name: "手动选择",
    type: "select",
    proxies: allProxyNames,
    icon: ICON.MANUAL
  };

  const steamGroup = {
    name: "Steam",
    type: "select",
    proxies: ["DIRECT", "节点选择", "自动选择"],
    icon: ICON.STEAM
  };

  // --- 4. 组装配置 ---
  params["proxy-groups"] = [
    nodeSelect,
    autoSelect,
    manualSelect,
    aiGroup,
    { name: "流媒体", type: "url-test", proxies: allProxyNames, icon: ICON.MEDIA, interval: 300 },
    steamGroup,
    adsGroup,
    ...activeRegionGroups
  ];

  // --- 5. 路由分流规则 ---
  params.rules = [
    // 订阅地址直连 (防止节点失效无法更新)
    "DOMAIN,sub.datapipe.top,DIRECT",
    "DOMAIN,suc-store.usuc.cc,DIRECT",

    "GEOSITE,category-ads-all,广告拦截",
    "IP-CIDR,127.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,10.0.0.0/8,DIRECT,no-resolve",
    "IP-CIDR,172.16.0.0/12,DIRECT,no-resolve",
    "IP-CIDR,192.168.0.0/16,DIRECT,no-resolve",
    "DOMAIN-SUFFIX,local,DIRECT",
    "GEOSITE,steam,Steam",
    "DOMAIN-SUFFIX,steamcommunity.com,Steam",
    "GEOSITE,openai,AI 工具",
    "DOMAIN-SUFFIX,chatgpt.com,AI 工具",
    "DOMAIN-SUFFIX,gemini.google.com,AI 工具",
    "DOMAIN-KEYWORD,generativelanguage,AI 工具",
    "GEOSITE,anthropic,AI 工具",
    "DOMAIN-SUFFIX,claude.ai,AI 工具",
    "GEOSITE,youtube,流媒体",
    "GEOSITE,netflix,流媒体",
    "GEOSITE,disney,流媒体",
    "GEOSITE,cn,DIRECT",
    "GEOIP,cn,DIRECT",
    "MATCH,节点选择"
  ];

  return params;
}