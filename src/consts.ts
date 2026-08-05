export const seriesNames: Record<string, string> = {
  idrac: "iDRAC / BMC シリーズ",
  network: "ネットワーク基礎シリーズ",
  vpn: "VPN/L2TP・IPsecシリーズ",
  telephony: "電話網・アクセス回線シリーズ",
  api: "Web / API シリーズ",
  security: "セキュリティ基礎シリーズ",
};

export const seriesNamesEn: Record<string, string> = {
  idrac: "iDRAC / BMC Series",
  network: "Networking Fundamentals Series",
  vpn: "VPN / L2TP-IPsec Series",
  telephony: "Telephony & Access Network Series",
  api: "Web / API Series",
  security: "Security Fundamentals Series",
};

export type Lang = "ja" | "en";

export const ui = {
  ja: {
    siteName: "上位1%シリーズ",
    tagline: "// infra engineering, deep-dive only",
    sitemap: "サイトマップ",
    quiz: "確認問題",
    langSwitchLabel: "EN",
    publishedLabel: "公開",
    updatedLabel: "更新",
    prevArticle: "← 前の記事",
    nextArticle: "次の記事 →",
  },
  en: {
    siteName: "Top 1% Series",
    tagline: "// infra engineering, deep-dive only",
    sitemap: "Sitemap",
    quiz: "Quiz",
    langSwitchLabel: "日本語",
    publishedLabel: "Published",
    updatedLabel: "Updated",
    prevArticle: "← Previous article",
    nextArticle: "Next article →",
  },
} as const;
