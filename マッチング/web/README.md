# マッチングシステム Webページ

参加者の一覧ページと詳細ページのHTMLです。

---

## 📁 フォルダ構成

```
web/
├── README.md（このファイル）
├── index.html（参加者一覧ページ）
├── css/
│   └── style.css（共通スタイル）
├── images/（参加者の写真を配置）
│   ├── sample-person.jpg（提供された写真をここに配置）
│   ├── tanaka.jpg
│   ├── sato.jpg
│   ├── suzuki.jpg
│   ├── yamada.jpg
│   └── takahashi.jpg
└── pages/（参加者詳細ページ）
    └── sample-person.html（サンプル詳細ページ）
```

---

## 🎨 デザインの特徴

### ✨ モダンで美しいUI
- グラデーションを使った洗練されたヘッダー
- カードデザインによる見やすいレイアウト
- ホバーエフェクトによる直感的な操作感

### 📱 レスポンシブ対応
- PC、タブレット、スマートフォンに対応
- 画面サイズに応じて自動的にレイアウト調整

### 🎯 使いやすい機能
- 業種・スキルでのフィルタリング
- カードをクリックして詳細ページへ遷移
- 一覧と詳細のスムーズな行き来

---

## 🖼️ 画像の配置方法

### 提供された写真を配置する

1. **写真を保存**
   - 提供された写真を `images/sample-person.jpg` として保存

2. **他の参加者の写真を追加**（オプション）
   - 田中太郎：`images/tanaka.jpg`
   - 佐藤花子：`images/sato.jpg`
   - 鈴木一郎：`images/suzuki.jpg`
   - 山田美咲：`images/yamada.jpg`
   - 高橋健：`images/takahashi.jpg`

3. **写真がない場合**
   - デフォルトでグラデーション背景が表示されます
   - 後から写真を追加すれば自動的に表示されます

---

## 🚀 使い方

### ローカルで表示

1. **ブラウザで開く**
   ```bash
   # web/index.html をブラウザで開く
   open index.html
   # または
   open web/index.html
   ```

2. **Live Serverで開く**（VS Code / Cursor）
   - `index.html` を右クリック
   - 「Open with Live Server」を選択

### ページの操作

#### 一覧ページ（index.html）
- **フィルタリング**：業種やスキルで絞り込み
- **カードクリック**：詳細ページへ遷移
- **レスポンシブ**：画面サイズに応じて1列〜3列に変化

#### 詳細ページ（pages/sample-person.html）
- **プロフィール表示**：サイドバーに基本情報
- **詳細情報**：スキル、興味、目標、課題など
- **戻るボタン**：一覧ページへ戻る

---

## ✏️ カスタマイズ方法

### 1. 参加者情報の編集

#### 一覧ページ（index.html）
各参加者のカード部分を編集：

```html
<div class="participant-card" data-industry="it" data-skill="engineering" onclick="location.href='pages/tanaka.html'">
    <img src="images/tanaka.jpg" alt="田中太郎" class="card-image">
    <div class="card-content">
        <div class="card-header">
            <h3 class="card-name">田中太郎</h3>
            <span class="card-role">CTO</span>
        </div>
        <p class="card-company">IT・Webサービス / 社員50名</p>
        <p class="card-description">説明文...</p>
        <div class="card-tags">
            <span class="tag skill">スキル名</span>
            <span class="tag interest">興味</span>
        </div>
    </div>
</div>
```

#### 詳細ページ（pages/sample-person.html）
各セクションの内容を編集：
- 基本情報
- スキル
- 興味・関心
- 目標
- 課題
など

### 2. 色の変更（css/style.css）

#### メインカラー
```css
/* グラデーション */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* ボタン・リンク */
color: #667eea;
```

#### タグの色
```css
.tag.skill {
    background: #e8f5e9;
    color: #2e7d32;
}

.tag.interest {
    background: #fff3e0;
    color: #f57c00;
}
```

### 3. 新しい参加者の追加

1. **一覧ページに追加**
   - `index.html` にカードを追加

2. **詳細ページを作成**
   - `pages/sample-person.html` をコピー
   - 内容を編集して保存

3. **写真を配置**
   - `images/` に写真を追加

---

## 🎨 デザインシステム

### カラーパレット
- **プライマリ**：`#667eea`（青紫）
- **セカンダリ**：`#764ba2`（紫）
- **成功**：`#2e7d32`（緑）
- **警告**：`#f57c00`（オレンジ）
- **背景**：`#f5f7fa`（ライトグレー）
- **テキスト**：`#333`（ダークグレー）

### タイポグラフィ
- **フォント**：システムフォント（Hiragino Sans, Meiryo等）
- **見出し**：太字、サイズ大
- **本文**：通常、行間1.6

### スペーシング
- **セクション間**：2.5rem
- **カード間**：2rem
- **要素間**：1rem

---

## 📊 既存データとの連携

### マークダウンファイルからHTMLへの変換

既存の参加者データ（`.md`ファイル）を参照して、HTMLを更新できます：

```
参考ファイル：
- ../参加者データ/参加者リスト.md
- ../参加者データ/個別/*.md
```

Cursorに以下のように指示：
```
@田中太郎.md @sample-person.html
田中太郎のマークダウンファイルの内容を、HTMLページに反映してください
```

---

## 🌐 本番公開

### GitHub Pagesで公開

1. **リポジトリにpush**
   ```bash
   git add .
   git commit -m "Add matching web pages"
   git push
   ```

2. **GitHub Pagesを有効化**
   - リポジトリの Settings → Pages
   - Source: `main` ブランチ、`/web` フォルダ
   - Save

3. **URLにアクセス**
   - `https://ユーザー名.github.io/リポジトリ名/web/`

### Netlify / Vercelで公開

1. **サービスにサインアップ**
2. **リポジトリを連携**
3. **公開ディレクトリを `web/` に設定**
4. **デプロイ**

---

## 💡 今後の拡張アイデア

### 機能追加
- [ ] マッチング結果の表示ページ
- [ ] 参加者同士のメッセージ機能
- [ ] お気に入り機能
- [ ] マッチングスコアの可視化

### デザイン改善
- [ ] ダークモード対応
- [ ] アニメーション追加
- [ ] 印刷用スタイル
- [ ] アクセシビリティ向上

### データ連携
- [ ] JSONファイルからの動的読み込み
- [ ] マッチング基準.mdcとの連携
- [ ] リアルタイム更新

---

## 📝 注意事項

- 写真は個人情報のため、公開時は本人の許可を得てください
- 実際の運用では、データベースやAPIとの連携を検討してください
- パスワード保護やアクセス制限が必要な場合は、別途実装してください

---

## 🎯 完成イメージ

### 一覧ページ
- 美しいグラデーションヘッダー
- カード型レイアウトで5名の参加者を表示
- フィルタリング機能で絞り込み
- カードクリックで詳細ページへ

### 詳細ページ
- 左サイドバーに写真と基本情報
- 右メインエリアに詳細情報
- スキル、興味、目標、課題などを網羅
- 「一覧に戻る」「マッチング」ボタン

---

このHTMLページを使って、参加者のマッチングをより視覚的に、使いやすく実現しましょう！

