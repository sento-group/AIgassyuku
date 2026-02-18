---
title: "Claude Skill 作成 & 改善ワークショップ"
date: 2026-02-19
---
# Claude Skill — 自分だけの「指示書」をAIに焼き込む

> 60分後には、業務に合ったオリジナルSkillを設計し、Claudeに登録して使い始められるようになります。

---

## まずは体感してください

前回の授業で、Claude Desktopアプリにはサンプルスキル（pptx、canvas-designなど）が入っていることを紹介しました。トグルをオンにするだけで使えて便利でしたよね。

でもこんな場面はありませんか？

> 「毎回、自社のフォーマットに直してる…」
> 「うちのトーンに合わない出力が出てくる…」
> 「前回と同じ指示を、また最初から書いてる…」

今日紹介するのは、**自分の業務に合ったSkillを作る方法**です。

サンプルスキルが「既製品のアプリ」なら、今日作るのは**「自分専用にカスタムしたアプリ」**です。

---

## 1. Skillとは何か

### AIに「指示書」を覚えさせる仕組み

Skillとは、Claudeに特定のタスクの進め方を教える**指示書**です。

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"
skinparam rectangle {
  RoundCorner 15
}

rectangle "スマホ + アプリ" as phone #E3F2FD {
  card "📱 スマホ本体" as iphone
  card "📷 カメラアプリ" as cam
  card "🎵 音楽アプリ" as music
  card "📊 表計算アプリ" as sheet
  iphone --> cam
  iphone --> music
  iphone --> sheet
}

rectangle "Claude + Skill" as claude #E8F5E9 {
  card "🤖 Claude本体" as ai
  card "🎨 canvas-design\nポスター作成" as cd
  card "📊 pptx\nスライド作成" as pptx
  card "🏗️ lp-creator\n自作スキル" as lp
  ai --> cd
  ai --> pptx
  ai --> lp
}

@enduml
```

|          | スマホのアプリ            | Claude Skills              |
| -------- | ------------------------- | -------------------------- |
| 本体     | iPhone / Android          | Claude                     |
| 既製品   | App Storeのアプリ         | サンプルスキル（Anthropic公式） |
| 自作     | ショートカット等で自動化  | **自分でSKILL.mdを書く**   |
| 動き方   | タップして起動            | Claudeが自動で判断して起動 |

Skillがあると、毎回「フォントはNoto Sansで、余白は多めで、CTAは1つにして…」と細かく指示しなくても、**品質のばらつきを大幅に減らせます**。

### Skillの正体

Skillの実体は、`SKILL.md`というテキストファイル1枚です。ここに「いつ発動するか」「どんな手順で作るか」「品質基準は何か」が書かれています。プログラミングの知識は不要で、日本語の文章で書けます。

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"
skinparam rectangle {
  RoundCorner 10
}

rectangle "Skillのフォルダ構成" as folder #FFFDE7 {
  card "📄 SKILL.md" as skill #FFF9C4
  note right of skill : ← これが本体（必須）\n発動条件、手順、品質基準を記述
  card "📁 scripts/" as scripts
  note right of scripts : 自動処理用スクリプト（任意）
  card "📁 references/" as refs
  note right of refs : 参考資料（任意）
  card "📁 assets/" as assets
  note right of assets : テンプレートや素材（任意）
}

@enduml
```

実際にFinderで見ると、こんな構造になっています：

![Skillのフォルダ構成（Finder）](../image/MarketPlaceClaude/スクリーンショット%202026-02-18%2022.06.40.png)
*lp-creatorスキルのフォルダ。SKILL.md（本体）+ assets / references / scripts の4構成*

### Skillはどうやって発動するのか

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"
skinparam activity {
  RoundCorner 15
}

start
:あなたが「LP作って」と依頼;
:Claudeが登録済みの全Skillの\n**説明文（description）**を確認;
if (依頼内容にマッチするSkillがある？) then (yes)
  :該当SkillのSKILL.mdを読み込む;
  :Skillの手順・品質基準に従って作業;
else (no)
  :汎用知識で対応;
endif
:成果物を出力;
stop

@enduml
```

「このSkillを使って」と指定する必要はなく、**ふつうに依頼するだけ**でClaudeが適切なSkillを選んでくれます。

逆に言えば、説明文がしっかり書かれていないと、使ってほしい場面で発動しないことがあります。

> **▶ やってみよう（2分）**
> サンプルスキルの中身を1つ覗いてみましょう。
> 1. 設定 > 機能 > スキル > **サンプルスキル** タブを開く
> 2. 気になるスキル（例：`canvas-design`）をクリック
> 3. SKILL.mdの中身を眺めて、「設計思想」「制作プロセス」「品質基準」がどう書かれているか観察する

---

## 2. なぜ自分のSkillを作るのか

Claudeには最初からサンプルスキル（docx、pdf、pptx、canvas-designなど）が入っています。でもこれらは**汎用的**です。

自分のSkillを作るメリット：

- **業務に特化した指示を焼き込める** — 自社のトーン、フォーマット、品質基準を毎回伝えなくて済む
- **属人化を防げる** — 「あの人が作ると良いけど、他の人だと微妙」がなくなる
- **改善を蓄積できる** — 「前回こう直した」が次回からデフォルトになる

| 比較 | サンプルスキル | 自作スキル |
|------|---------------|-----------|
| 例 | pptx（スライド作成） | 自社提案書スキル |
| 品質基準 | 一般的なベストプラクティス | **自社のトーン・フォーマット・必須セクション** |
| 改善 | Anthropicが更新 | **自分で育てる** |
| 使い分け | 汎用タスク | 繰り返し発生する業務固有タスク |

---

## 3. Skill作成から改善までの全体フロー

今日お伝えするのは、以下の**6ステップの改善ループ**です。今日の授業では①〜④を実際にやり、⑤⑥は持ち帰り課題です。

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"
skinparam activity {
  RoundCorner 15
}

|メイン|
start
:① 設計\n何を・誰に・いつ発動するか決める;
:② 作成\nSkill CreatorでSKILL.mdを書く;
:③ テスト\n実際のプロンプトで試す → 修正;
:④ 登録\nClaudeにアップロード;
:⑤ 実戦\n日常業務で使う;
:⑥ 改善\nImproveモードで比較テスト;
:②に戻る\n（改善 or 新しいSkillの作成へ）;

stop

@enduml
```

⑥の改善から②の作成に戻り、繰り返すことでSkillが育っていきます。以下、各ステップを順に見ていきます。

---

## ステップ① 設計（5分）

Skillを書き始める前に、4つの問いに答えます。

| 問い | 例（LP制作スキルの場合） |
|------|--------------------------|
| **何をするSkillか？** | ランディングページをHTML1枚で生成する |
| **いつ発動するか？** | 「LP作って」「登録ページほしい」と言われたとき |
| **入力は何か？** | プロダクト名、ターゲット、トーンなどの情報 |
| **出力は何か？** | レスポンシブ対応のHTMLファイル1枚 |

**「いつ発動するか」を日本語で具体的に書く**のがポイント。「ランディングページ」だけでなく「LP」「登録ページ」「プロダクトのページ作って」など、ユーザーが実際に使いそうな言い回しを幅広く含めておくと発動精度が上がります。

> **▶ やってみよう（5分）**
> 自分が作りたいSkillを1つ決めて、4つの問いに答えてください。メモ帳やチャットの入力欄に書き出すだけでOKです。
>
> 迷ったら以下から選んでください：
>
> | テーマ | 何をする | いつ発動 | 入力 | 出力 |
> |--------|----------|----------|------|------|
> | **LP制作** | HTMLでLP生成 | 「LP作って」 | プロダクト名、ターゲット | HTML1枚 |
> | **議事録整形** | メモを構造化 | 「議事録まとめて」 | 雑なメモ | 日時・参加者・決定事項のMD |
> | **SNS投稿文** | 投稿文3パターン | 「SNS用に書いて」 | 商品情報 | 140字以内 × 3本 |
>
> 書けたら次へ進みましょう。

---

## ステップ② 作成（20分）

### 2-1. 設定画面を開く

Claude Desktop アプリで **Skill Creator** を有効にします。

> **▶ 一緒にやりましょう** — 以下の手順を、自分のClaude Desktopアプリで同時に進めてください。

**1. 設定を開く**

画面左下の自分のアイコンをクリック → メニューから「設定」を選択。

![設定メニュー](../image/MarketPlaceClaude/スクリーンショット%202026-02-18%2021.53.22.png)
*設定画面の左メニュー。「機能」を選ぶ*

**2. 「スキル」セクションを見つける**

設定 > 機能 を開くと、下にスクロールしたところに「スキル」セクションが表示されます。

![スキルセクション](../image/MarketPlaceClaude/スクリーンショット%202026-02-18%2021.53.34.png)
*「あなたのスキル」と「サンプルスキル」の2つのタブがある。右上の「＋追加」から自作スキルもアップロードできる*

**3. Skill Creator をオンにする**

「サンプルスキル」タブから **skill-creator** を探してトグルをオン（青）にします。

![skill-creatorをオンに](../image/MarketPlaceClaude/スクリーンショット%202026-02-18%2021.53.49.png)
*skill-creatorのトグルをオンにすると「チャットで試す」ボタンが出現。これをクリックするとすぐにSkill作成を始められる*

### 2-2. Claudeに依頼する

**「チャットで試す」をクリック**して、新しいチャットを開いてください。

Skill Creatorはスキルを作るための**専用スキル**です。開いたら、ステップ①で考えた内容を伝えます。

> **▶ やってみよう（15分）**
> 「チャットで試す」をクリックしたら、以下のようにClaudeに伝えてください。ステップ①で決めたテーマに合わせて書き換えてOKです。
>
> **LP制作を選んだ人：**
> ```
> LP制作用のSkillを作りたい。ランディングページをHTML1ファイルで
> 生成するもの。日本語で作って
> ```
>
> **議事録整形を選んだ人：**
> ```
> 議事録を整形するSkillを作りたい。雑なメモから
> 日時・参加者・議題・決定事項・TODOの構造に整形するもの。
> 日本語で作って
> ```
>
> **SNS投稿文を選んだ人：**
> ```
> SNS投稿文を作るSkillを作りたい。商品情報から
> X（Twitter）向けの140字以内の投稿文を3パターン
> 生成するもの。日本語で作って
> ```
>
> Claudeが追加の質問をしてきます。**自分の業務に合わせて答えてください**。分からない質問は「おまかせで」と答えてOKです。
>
> Claudeがフォルダ構造とSKILL.mdを生成するまで待ちましょう。

### 2-3. SKILL.mdの読み方

Claudeが生成したSKILL.mdの中身を確認しましょう。大きく2つのパートで構成されています。

**ヘッダー（名前と説明文）**:
```yaml
---
name: lp-creator
description: |
  コンバージョン最適化されたランディングページを
  単体HTMLとして生成する。「LP作って」「登録ページほしい」
  などで発動すること。
---
```

`name` はSkillの識別名。`description` がClaudeに「いつこのSkillを使うか」を教える説明文です。ここが発動のトリガーになるため、丁寧に書く価値があります。

**本文（指示内容）**: Claudeへの手順書を文章で記述します。

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"

map "SKILL.mdに含めるべき内容" as skillmap {
  設計思想 => なぜこのやり方なのか、理由を書く
  制作プロセス => ステップごとの手順
  品質基準 => 配色、フォント、レスポンシブなどの具体的なルール
  よくある失敗パターン => やってはいけないことを明記
}

@enduml
```

### 書き方のコツ：「ルール」より「理由」

「CTAは1つにすること」とだけ書くのと、「CTAが複数あると訪問者が迷い、どれもクリックされなくなる。だからCTAは1つに絞る」と書くのでは、Claudeの判断力が変わります。

理由が書いてあると、Claudeは例外的なケース（たとえば「買う」と「デモを見る」の2つが必要な場合）でも、意図を理解した上で柔軟に判断できます。ルールだけだと機械的に従うか、無視するかの二択になりがちです。

> **▶ チェックポイント**
> ここまでで、Claudeが SKILL.md を生成してくれているはずです。
> - [ ] SKILL.mdが表示されている
> - [ ] description（説明文）に、自分が使いそうな言い回しが含まれている
> - [ ] 本文に「設計思想」と「制作プロセス」が書かれている
>
> まだの人はClaudeの質問に答え終わるまで進めてください。できた人は次のステップへ。

---

## ステップ③ テスト実行（10分）

作ったSkillが実際に使えるか、**同じチャットの中でそのまま**試してみます。

> **▶ やってみよう（10分）**
> Claudeに以下のように伝えて、作ったSkillをテスト実行してください。
>
> **LP制作の人：**
> ```
> 作ったスキルを試したい。
> 「AIノートアプリのウェイトリストLPを作って」
> ```
>
> **議事録整形の人：**
> ```
> 作ったスキルを試したい。以下のメモを整形して。
>
> きのうの打ち合わせ 田中さんと鈴木さん
> 新機能のリリース日3月末に決定
> デザインは来週までに鈴木さんが出す
> 予算は50万以内 承認済み
> 次回は来週水曜
> ```
>
> **SNS投稿文の人：**
> ```
> 作ったスキルを試したい。以下の商品情報からSNS投稿文を作って。
>
> 商品名：スマートノート Pro
> 特徴：手書きメモを即座にデジタル化、AI要約機能付き
> 価格：4,980円
> ターゲット：ビジネスパーソン
> ```
>
> 出力を見て、以下を確認してください：
> - [ ] 意図したトーン・フォーマットになっているか？
> - [ ] 品質基準（SKILL.mdに書いた内容）が反映されているか？
> - [ ] 「ここ毎回直したくなるな」というポイントはあるか？
>
> **気になる点があったら、Claudeにそのまま伝えてSKILL.mdを修正してもらいましょう。**
> 例：「見出しが長すぎるので、8語以内にするルールを追加して」

---

## ステップ④ 登録（5分）

完成したSkillをClaudeに登録し、次回以降のセッションでも使えるようにします。

> **▶ やってみよう（5分）**
> テスト結果に満足したら、以下の手順で登録してください。

### 手順

**1. パッケージ化を依頼する**

Claudeに「Skillをパッケージ化して」と伝えてください。アップロード用のファイルが生成されます。

![生成されたスキルファイル](../image/MarketPlaceClaude/スクリーンショット%202026-02-18%2021.54.17.png)
*生成されたlp-creatorスキル。「フォルダで表示」で中身を確認、「Claudeで開く」ですぐに使える*

**2. 設定からアップロードする**

設定 > 機能 > スキル > **「＋追加」** をクリックすると、以下のダイアログが表示されます。

![新しいスキルダイアログ](../image/MarketPlaceClaude/スクリーンショット%202026-02-18%2022.06.19.png)
*3つの方法でスキルを追加できる。今回は「スキルをアップロード」を選ぶ。.zip、.skill、.mdファイルに対応*

**「スキルをアップロード」** を選んで、先ほど生成されたファイルをアップロードします。

**3. 登録を確認する**

「あなたのスキル」タブに登録されたことを確認してください。

登録後は、新しい会話を始めても自動的にSkillが読み込まれます。

### 登録したSkillの中身を確認する

Claudeの画面からSkillの中身を直接確認できます。

![SKILL.mdの中身](../image/MarketPlaceClaude/スクリーンショット%202026-02-18%2021.54.32.png)
*SKILL.mdビューア。左にフォルダ構成（SKILL.md、assets、references、scripts）、右に説明文と設計思想が表示される。「自分のスキルにコピー」でカスタマイズの起点にもできる*

> **▶ チェックポイント**
> - [ ] 「あなたのスキル」タブに自分のSkillが表示されている
> - [ ] クリックしてSKILL.mdの中身が確認できる
>
> ここまでできたら、**新しいチャットを開いて**、Skillを指定せずにいつも通り依頼してみてください。自動でSkillが発動するはずです。

---

## ステップ⑤ 実戦で使う（持ち帰り）

登録が完了すれば、特別な操作は不要です。普通にClaudeに依頼するだけで、あなたの依頼内容に合ったSkillが自動的に発動します。

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"
skinparam sequence {
  ArrowColor #333333
  LifeLineBorderColor #333333
  ParticipantBorderColor #333333
}

actor "あなた" as user
participant "Claude" as claude
database "登録済みSkill\n（lp-creator等）" as skills

user -> claude : 「新製品のLP作って」
claude -> skills : 依頼内容とdescriptionを照合
skills --> claude : lp-creatorがマッチ
claude -> claude : SKILL.mdの手順に従い作成
claude --> user : 自社基準に沿ったHTMLを出力

@enduml
```

もしSkillが発動しなかった場合：
- Skillの説明文（description）に書かれている言い回しと、依頼文が合っていない可能性 → 説明文にバリエーションを追加
- 明示的に「lp-creatorスキルを使って」と指定することもできる

---

## ステップ⑥ 改善する（持ち帰り）

実際に使っていると「ここ毎回直すんだよな」というパターンが出てきます。そこでSkill Creatorの**改善機能（Improveモード）**を使います。

> 「lp-creatorスキルを改善したい。ヒーローの見出しがいつも長すぎる」

### 改善の流れ

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"
skinparam activity {
  RoundCorner 15
}

start
:現行Skill(v0)でテスト実行;
:出力を採点;
:改善版(v1)を自動作成;
:v0の出力 vs v1の出力を比較\n（どちらが新しいか**隠した状態**で\n純粋に品質だけで判定）;
if (v1が勝った？) then (yes)
  :v1を採用;
  if (まだ改善の余地がある？) then (yes)
    :v2を自動作成して再比較;
  else (no)
    :最良バージョンで確定;
  endif
else (no)
  :v0を維持;
endif
stop

@enduml
```

ポイントは「**どちらが新しいか隠して比較する**」こと。人間もAIも「新しい方が良いはず」と思いがちですが、実際には改善のつもりが改悪になることもあります。どちらがどのバージョンか分からない状態で比較することで、この思い込みを排除できます。

---

## 5. 複数Skillを作るときのコツ

### 作る順番の考え方

**「頻度 × 手間」が大きいものから**作ります。

| タスク | 頻度 | 毎回の手間 | 優先度 |
|--------|------|------------|--------|
| 提案書のMD作成 | 週2回 | 30分 | ★★★ 高 |
| イベントアイキャッチ画像 | 月2回 | 20分 | ★★ 中 |
| 議事録の構造化 | 週3回 | 15分 | ★★★ 高 |
| SNS投稿画像 | 毎日 | 10分 | ★★★ 高 |

全部一気に作るのではなく、**2〜3個作って実戦投入し、フィードバックを回してから次に進む**のが結果的に速いです。

### 既存スキルと被らないようにする

Claudeにはサンプルスキルがすでに入っています。自分のSkillを作るときは「汎用スキルではカバーできない、自分の業務固有のルール」を入れることに集中します。

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"

rectangle "❌ 被りやすい例" as bad #FFEBEE {
  card "自作：Word文書を作るSkill" as bad1
  card "既存：docxスキル（同じ機能）" as bad2
  bad1 -[#red]-> bad2 : 重複
}

rectangle "✅ 正しい使い分け" as good #E8F5E9 {
  card "自作：自社フォーマットの\n提案書を作るSkill" as good1
  card "既存：docxスキル" as good2
  good1 -[#green]-> good2 : 補完関係\n（構成・トーン・\n必須セクションが独自）
}

@enduml
```

---

## 気をつけること

### 1. 「コード実行とファイル作成」をオンに

スキルを使うには設定画面で **「コード実行とファイル作成」** が有効になっている必要があります。オフだとスキルが動きません。

### 2. descriptionが発動の命

Skillが発動しない原因の大半は、descriptionに書かれた言い回しとユーザーの依頼文がマッチしていないことです。ユーザーが使いそうな言い回しを**なるべく多く**含めましょう。

### 3. Skillは「知識」であって「魔法」ではない

Skillはあくまで「こうやれ」という知識を与えるものです。指示が曖昧だと結果も曖昧になります。**Skillの力を最大限引き出すには、自分が何を求めているかを明確にすること**が大事です。

---

## まとめ：Skill改善の永続ループ

```plantuml
@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Noto Sans JP"
skinparam activity {
  RoundCorner 15
  BackgroundColor #FFFFFF
}

|改善ループ|

start

#E3F2FD:① 設計
何を・誰に・いつ発動するか決める;

#E8F5E9:② 作成
Skill CreatorでSKILL.mdを書く;

#FFF9C4:③ テスト
実際のプロンプトで試す → 修正;

#F3E5F5:④ 登録
Settings > 機能 > スキル > ＋追加;

#FFE0B2:⑤ 実戦
日常業務で使う;

#FFCDD2:⑥ 改善
Improveモードで比較テスト;

note right
  ⑥から②に戻り
  繰り返すことで
  Skillが育つ
end note

stop

@enduml
```

### 今日やったこと

1. Skillは `SKILL.md` — プロの判断基準・ベストプラクティスが書かれたテキストファイル
2. サンプルスキルは汎用、**自作スキルで業務固有のルールを焼き込む**
3. Skill Creatorに頼めば対話形式でSkillが作れる
4. **実際にSkillを1つ作って、テストして、登録した**

### 次のアクション（持ち帰り課題）

- [ ] 登録したSkillを実務で3回以上使ってみる
- [ ] 「毎回直す」ポイントをメモしておく
- [ ] メモが溜まったらImproveモードで改善する：「〇〇スキルを改善したい。△△が毎回□□になる」
- [ ] 「頻度 × 手間」が大きい業務を洗い出し、次に作るSkillを決める

---

*ソース: AI部 Claude Skills授業*
