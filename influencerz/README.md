# インフルエンサーZ株式会社 データ管理システム

## 🌟 システム概要

このシステムは以下の3つの主要モジュールで構成された、モダンで使いやすいWebインターフェースです：

1. **支社長データベース** - 47都道府県の支社長情報を管理
2. **提案資料作成システム** - クライアント向け提案資料を自動生成
3. **レポート生成システム** - SNS情報の月次レポートを自動生成

## 🚀 クイックスタート

### Webインターフェースを使用する場合

1. **メインダッシュボードを開く**
   ```
   システム/index.html
   ```
   ブラウザでこのファイルを開くと、美しいダッシュボードが表示されます。

2. **各モジュールにアクセス**
   - ダッシュボードから各システムのカードをクリック
   - または直接各モジュールの `index.html` を開く

### コマンドラインを使用する場合

## 1. 支社長データベース

### 使用方法

```bash
cd 支社長データベース
python cli.py add 沖縄県 "山田太郎" "経歴情報" "背景情報"
python cli.py get 沖縄県
python cli.py list
python cli.py export
```

### データ構造

- 都道府県（47都道府県）
- 支社長名
- 経歴
- 背景
- 実績
- 連絡先情報

## 2. 提案資料作成システム

### 使用方法

```bash
cd 提案資料作成システム
python create_proposal.py
```

### 機能

- クライアント情報に基づいた提案資料の自動生成
- 既存の提案資料をテンプレートとして活用
- JSON形式とMarkdown形式で出力

### キャプテンズグループ様向け提案資料

キャプテンズグループ様向けの提案資料は以下のコマンドで作成できます：

```bash
python create_proposal.py
```

生成される内容：
- アカウント方向性
- 投稿内容プラン
- 参考アカウント
- 運用プラン
- 費用

## 3. レポート生成システム

### 使用方法

```python
from report_generator import SNSReportGenerator

generator = SNSReportGenerator()

# クライアントを追加
client_id = generator.add_client(
    client_name="キャプテンズグループ",
    company_url="https://www.captains-g.co.jp/",
    industry="ホテル・リゾート"
)

# SNSアカウントを追加
account_id = generator.add_sns_account(
    client_id=client_id,
    platform="Instagram",
    account_name="captain_yoshiji",
    account_url="https://www.instagram.com/captain_yoshiji/"
)

# 月次データを追加
generator.add_sns_data(
    account_id=account_id,
    report_date="2025-09",
    followers=5000,
    engagement_rate=3.5,
    reach=15000
)

# レポートを生成
report = generator.generate_monthly_report("キャプテンズグループ", 2025, 9)
generator.save_report(report)
```

## ディレクトリ構造

```
システム/
├── 支社長データベース/
│   ├── database.py
│   ├── cli.py
│   └── branch_managers.db
├── 提案資料作成システム/
│   ├── proposal_generator.py
│   └── create_proposal.py
├── レポート生成システム/
│   ├── report_generator.py
│   └── sns_reports.db
└── README.md
```

## 必要なライブラリ

```bash
pip install sqlite3  # Python標準ライブラリ
```

## データ保存場所

- 支社長データベース: `支社長データベース/branch_managers.db`
- レポートデータベース: `レポート生成システム/sns_reports.db`
- 提案資料: `../資料/01_提案資料/`
- 月次レポート: `../資料/04_月次レポート/`

