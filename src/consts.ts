export const seriesNames: Record<string, string> = {
  idrac: "iDRAC / BMC シリーズ",
  network: "ネットワーク基礎シリーズ",
  vpn: "リモートアクセスVPN/L2TP・IPsecシリーズ",
  "modern-vpn": "現代的VPNプロトコル深掘りシリーズ",
  "site-to-site-vpn": "拠点間VPN(Site-to-Site VPN)シリーズ",
  linux: "Linux/OS基礎シリーズ",
  telephony: "電話網・アクセス回線シリーズ",
  api: "Web / API シリーズ",
  security: "セキュリティ基礎シリーズ",
  "handson-prep": "ハンズオン準備シリーズ",
  virtualization: "仮想化基盤シリーズ",
  "active-directory": "Active Directoryシリーズ",
  "windows-client": "Windowsクライアント運用シリーズ",
  "windows-server": "Windows Server運用シリーズ",
  storage: "ストレージ基礎シリーズ",
  "web-proxy": "Webプロキシ/キャッシュ基礎シリーズ",
  "aws-basics": "AWS基礎シリーズ",
  messaging: "メール基盤シリーズ",
  "protocol-fundamentals": "プロトコル基礎シリーズ",
  openshift: "OpenShiftシリーズ",
  ansible: "Ansibleシリーズ",
  dns: "DNSサーバー基礎シリーズ",
};

export const seriesNamesEn: Record<string, string> = {
  idrac: "iDRAC / BMC Series",
  network: "Networking Fundamentals Series",
  vpn: "Remote-Access VPN / L2TP-IPsec Series",
  "modern-vpn": "Modern VPN Protocol Deep-Dive Series",
  "site-to-site-vpn": "Site-to-Site VPN Series",
  linux: "Linux / OS Fundamentals Series",
  telephony: "Telephony & Access Network Series",
  api: "Web / API Series",
  security: "Security Fundamentals Series",
  "handson-prep": "Hands-On Prep Series",
  virtualization: "Virtualization Fundamentals Series",
  "active-directory": "Active Directory Series",
  "windows-client": "Windows Client Operations Series",
  "windows-server": "Windows Server Operations Series",
  storage: "Storage Fundamentals Series",
  "web-proxy": "Web Proxy / Caching Fundamentals Series",
  "aws-basics": "AWS Fundamentals Series",
  messaging: "Messaging Fundamentals Series",
  "protocol-fundamentals": "Protocol Fundamentals Series",
  openshift: "OpenShift Series",
  ansible: "Ansible Series",
  dns: "DNS Server Fundamentals Series",
};

// シリーズ内をさらに絞り込むためのサブカテゴリの表示名。
// キー(main/supplementary/handsonなど)は各記事のフロントマターのsubSeriesと対応する。
export const subSeriesNames: Record<string, string> = {
  main: "メイン記事",
  supplementary: "補足・深掘り記事",
  handson: "ハンズオン記事",
  lecture: "音声講義記事",
  audio: "音声復習記事",
};

export const subSeriesNamesEn: Record<string, string> = {
  main: "Main Articles",
  supplementary: "Supplementary Deep-Dives",
  handson: "Hands-On",
  lecture: "Audio Lecture",
  audio: "Audio Review",
};

export type Lang = "ja" | "en";

export const ui = {
  ja: {
    siteName: "上位1%シリーズ",
    tagline: "// infra engineering, deep-dive only",
    sitemap: "サイトマップ",
    quiz: "確認問題",
    search: "検索",
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
    search: "Search",
    langSwitchLabel: "日本語",
    publishedLabel: "Published",
    updatedLabel: "Updated",
    prevArticle: "← Previous article",
    nextArticle: "Next article →",
  },
} as const;
