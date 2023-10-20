# Nagoya

**Nagoya (名古屋)** は、静的サイトジェネレーター **Hugo** 用の日本語ブログテーマです。
日本語のユーザーに最適になるよう設計されています。

デモサイト: <https://curegit.github.io/nagoya-example/>

デモサイトのソース: <https://github.com/curegit/nagoya-example>

## 主要機能

- レスポンシブデザイン
- サムネイル画像
- ディレクトリツリーによる整理
- テキストマッチングによる記事の簡易全文検索
- 数式レンダリング (KaTeX)
- ダイアグラム表示 (Mermaid)
- パンくずリスト
- Open Graph Protocol
- 構造化データマークアップ (microdata)

## 提供しない機能

- i18n（国際化対応）
- ソーシャルメディアのリンク表示

## インストール

Git submodule による導入を推奨します。

```sh
git submodule add --name nagoya https://github.com/curegit/nagoya.git themes/nagoya
```

## サムネイル画像の設定方法

Hugo 自体の挙動に似せており、フロントマターの `images` の値があればそれをサムネイルとして使用します。
それがなければ、バンドル内でファイル名に feature, cover, thumbnail が含まれる画像がサムネイルとして使われます。

## Taxonomies（タグやカテゴリ）

このテーマでは tag と archive と search が特別扱いされます。

- tag は独自のアイコンで表示されます
- 各記事のメタタグのキーワードは設定された tag を基に自動的に設定されます
- archive を有効化すると、年別にグループ化された全記事一覧ページが生成されます
- archive の値は `date` から自動で計算されるため、各記事で archives パラメータを設定する必要はありません
- search を有効化すると、テキストマッチングによる記事の簡易全文検索機能 (Web Worker を使用) が利用できます
- search と archive は、独自に動的なタームページを提供するので、各記事でのタームパラメータの設定は無効です

なお、Taxonomy を日本語化するためには、該当するセクション（archives や categories）に `_index.md` ファイルを作成し、その中で `title` パラメータを設定してください。

### 設定例

```toml
[taxonomies]
  category = "categories"
  tag = "tags"
  archive = "archives"
  search = "search"
```

## サイトパラメータ

以下は、`hugo.toml` に設定できるサイト全体に効果がある `params` です。

| キー             | 型              | 説明                                                           |
| ---------------- | --------------- | -------------------------------------------------------------- |
| `author`         | String          | サイト全体の著者名を指定します                                 |
| `authorLink`     | String          | 著者ページまたはメールアドレスのハイパーリンクを設定します     |
| `description`    | String          | サイトの概要を設定します                                       |
| `keywords`       | Array of String | サイト全体のキーワードを設定します                             |
| `showAuthor`     | Boolean         | 著者情報を記事に表示するか否かを設定します                     |
| `showLastmod`    | Boolean         | 各記事の最終更新日を表示するか否かを設定します                 |
| `treeRoot`       | String          | サイドバーのセクションナビゲーションの起点を指定します         |
| `sidebarSearch`  | Boolean         | サイドバーに検索ボックスを表示するか否かを設定します           |
| `newNum`         | Integer         | サイドバーに表示する最新記事の数を設定します                   |
| `relatedNum`     | Integer         | 各記事下部に表示する関連記事の数を設定します                   |
| `randomNum`      | Integer         | 各記事下部に表示するランダム記事の数を設定します               |
| `shuffleSeeAlso` | Boolean         | 関連記事とランダム記事の順序をシャッフルするか否かを設定します |
| `showHeaderText` | Boolean         | ヘッダーにサイトの概要テキストを表示するか否かを設定します     |
| `headerText`     | String          | ヘッダーのサイト概要テキストを手動設定します                   |
| `maxConcurrency` | Integer         | 検索機能で使う Web Worker の最大数を指定します                 |

## ページパラメータ

フロントマターの `params` に設定できるものとして以下があります。

| キー          | 型              | 説明                                                                 |
| ------------- | --------------- | -------------------------------------------------------------------- |
| `author`      | String          | 明示的にこのページの著者名を設定し、サイト全体の著者名を上書きします |
| `authorLink`  | String          | 著者ページまたはメールアドレスのハイパーリンクを設定します           |
| `description` | String          | Hugo の Summary の代わりに、手動で記事の説明を上書きします           |
| `keywords`    | Array of String | このページのキーワードを設定し、タグによるキーワードを上書きします   |
| `lang`        | String          | このページの言語を明示し、サイト全体の言語設定を上書きします         |
| `pin`         | Boolean         | このページへのリンクをサイドバーにピン留めします                     |
| `page`        | Boolean         | このページを記事ではなく、固定ページとして扱います                   |

## 記事内汎用スタイリング

コンテンツ内で使用できるスタイリング用ユーティリティがいくつかあります。

| セレクタ    | 説明                                                      |
| ----------- | --------------------------------------------------------- |
| `.red`      | 赤字にします                                              |
| `.bordered` | 要素に枠を付けます（`figure` 要素の場合は中身に付けます） |

## その他備考

- Hugo の Menu Templates 機能は使用していません。
  該当部分のパーシャルレイアウトを上書きしてメニューを作成します。
- CDN 経由で読み込まれるリソースを事前バンドルする場合は、リソースをダウンロードして配置し、読み込み部分のパーシャルレイアウトを上書きしてください。
- トップページ内容の始まり部分は、コンテンツルートの `_index.md` で制御できます。
  タイトルを空にすることもできます。

## ライセンス

[MIT](LICENSE)
