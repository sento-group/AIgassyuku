# 📁 Webappフォルダ構造ガイド

## 🎯 最適化後の構造

```
webapp/
├── index.html                      # 🚪 エントリーポイント（ランディングページ）
├── README.md                       # 📖 メインドキュメント（統合版）
│
├── pages/                          # 📄 HTMLページ
│   ├── dashboard.html              # メインダッシュボード（旧dashboard-v2.html）
│   ├── availability-submit.html    # 稼働日提出画面
│   ├── kpi-dashboard.html          # KPI管理画面
│   └── performance.html            # 実績管理画面
│
├── assets/                         # 🎨 静的リソース
│   ├── css/                        # スタイルシート
│   │   ├── dashboard-v2.css        # メインダッシュボード用
│   │   ├── dashboard-extended.css  # 拡張スタイル
│   │   ├── performance.css         # 実績管理用
│   │   └── style.css              # 共通スタイル
│   │
│   ├── js/                         # JavaScript
│   │   ├── dashboard-v2.js         # メインダッシュボードロジック
│   │   ├── dashboard-v2-extended.js # カレンダー・分析機能
│   │   ├── dashboard-extended.js   # 拡張機能（旧版）
│   │   ├── performance.js          # 実績管理ロジック
│   │   └── script.js              # 共通スクリプト
│   │
│   └── data/                       # データファイル
│       ├── data-100.js            # メインデータ（100名分）
│       └── data.js                # 参考データ（3名分）
│
└── docs/                           # 📚 ドキュメント
    ├── QUICKSTART.md               # クイックスタートガイド
    ├── CHANGELOG.md                # 変更履歴
    └── STRUCTURE.md                # このファイル
```

---

## 🔗 相互リンクマップ

### エントリーポイント（index.html）
```
index.html
  ├─→ pages/dashboard.html
  ├─→ pages/availability-submit.html
  ├─→ pages/kpi-dashboard.html
  └─→ pages/performance.html
```

### メインダッシュボード（pages/dashboard.html）
```
pages/dashboard.html
  ├─→ availability-submit.html
  ├─→ performance.html
  ├─→ kpi-dashboard.html
  ├─→ ../assets/css/dashboard-v2.css
  ├─→ ../assets/js/dashboard-v2.js
  ├─→ ../assets/js/dashboard-v2-extended.js
  └─→ ../assets/data/data-100.js
```

### 稼働日提出（pages/availability-submit.html）
```
pages/availability-submit.html
  └─→ dashboard.html (戻るボタン)
```

### KPI管理（pages/kpi-dashboard.html）
```
pages/kpi-dashboard.html
  └─→ dashboard.html (戻るボタン)
```

### 実績管理（pages/performance.html）
```
pages/performance.html
  ├─→ dashboard.html (戻るボタン)
  ├─→ ../assets/css/style.css
  ├─→ ../assets/css/dashboard-extended.css
  ├─→ ../assets/css/performance.css
  ├─→ ../assets/js/performance.js
  └─→ ../assets/data/data-100.js
```

---

## 📝 パス参照ルール

### HTMLページからAssetsへの参照

**pages/フォルダ内のHTMLファイルから:**
```html
<!-- CSS -->
<link rel="stylesheet" href="../assets/css/dashboard-v2.css">

<!-- JavaScript -->
<script src="../assets/js/dashboard-v2.js"></script>

<!-- データ -->
<script src="../assets/data/data-100.js"></script>
```

### ページ間のナビゲーション

**pages/フォルダ内での移動（同じディレクトリ）:**
```html
<a href="dashboard.html">ダッシュボード</a>
<a href="availability-submit.html">稼働日提出</a>
```

**index.htmlからpages/への移動:**
```html
<a href="pages/dashboard.html">メインダッシュボード</a>
```

---

## 🎯 最適化によって解決された問題

### ✅ 解決された問題

1. **READMEファイルの乱立**
   - Before: 6つのREADMEファイルが存在
   - After: 1つの統合README + docsフォルダに整理

2. **ファイル構造の混乱**
   - Before: すべてのファイルがルートディレクトリに配置
   - After: pages/, assets/, docs/に論理的に分離

3. **旧バージョンとの混在**
   - Before: dashboard.html と dashboard-v2.html が共存
   - After: 最新版のみを残し、わかりやすい名前に統一

4. **相互リンクの不整合**
   - Before: パス参照が不明確
   - After: 相対パスで統一、すべてのリンクが機能

5. **エントリーポイントの不明確さ**
   - Before: どのファイルから開始すべきか不明
   - After: index.htmlをランディングページとして作成

---

## 📊 ファイル数の変化

### Before（最適化前）
```
Root: 23ファイル（HTML, CSS, JS, MD混在）
```

### After（最適化後）
```
Root: 2ファイル（index.html, README.md）
pages/: 4ファイル
assets/css/: 4ファイル
assets/js/: 5ファイル
assets/data/: 2ファイル
docs/: 3ファイル
```

---

## 🔧 メンテナンスガイド

### 新しいページを追加する場合

1. **HTMLファイルを作成**
   ```bash
   touch pages/new-feature.html
   ```

2. **Assets参照を設定**
   ```html
   <link rel="stylesheet" href="../assets/css/new-feature.css">
   <script src="../assets/js/new-feature.js"></script>
   ```

3. **ナビゲーションリンクを追加**
   - `index.html`にカードを追加
   - `pages/dashboard.html`のサイドバーにリンクを追加

### 新しいスタイルを追加する場合

```bash
# CSSファイルを作成
touch assets/css/new-style.css

# HTMLから参照
<link rel="stylesheet" href="../assets/css/new-style.css">
```

### 新しいデータを追加する場合

```bash
# データファイルを作成
touch assets/data/new-data.js

# JavaScriptから参照
<script src="../assets/data/new-data.js"></script>
```

---

## 🚀 デプロイ時の注意点

### 相対パスの維持

このフォルダ構造は相対パスで設計されています。デプロイ時にフォルダ構造を維持してください。

### サーバー設定

静的ホスティングの場合、`index.html`がルートで自動的に読み込まれます。

### CDN/外部リソース

以下のCDNを使用しています（インターネット接続が必要）:
- Google Fonts (Noto Sans JP)
- Font Awesome
- Chart.js

---

## 📚 関連ドキュメント

- [README.md](../README.md) - メインドキュメント
- [QUICKSTART.md](./QUICKSTART.md) - クイックスタート
- [CHANGELOG.md](./CHANGELOG.md) - 変更履歴

---

**🌊 Lit Ship - 楽しみの波紋を広げ、世の中を明るく照らす**

© 2025 Lit Ship Inc.

