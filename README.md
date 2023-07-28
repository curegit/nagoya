# Nagoya

**Nagoya（名古屋）** は、静的サイトジェネレーター **Hugo** 用の日本語テーマです。
日本語のユーザーに最適化されて設計されており、i18n（国際化対応）は提供していません。

デモサイト: <https://curegit.github.io/nagoya-example/>

デモサイトのソース: <https://github.com/curegit/nagoya-example>

## サムネイル画像の設定方法

Hugo 自体の挙動に似せており、フロントマターの `images` の値があればそれをサムネイルとして使用します。
それがなければ、フォルダ内でファイル名に feature, cover, thumbnail が含まれる画像がサムネイルとして使われます。

## Taxonomies（タグやカテゴリ）

このテーマでは tag と archive のみが特別扱いされます。

- tag は独自のアイコンで表示されます
- 各記事のメタタグのキーワードは設定された tag を基に自動的に設定されます
- archive を有効化すると、年別にグループ化された全記事一覧ページが生成されます
- archive の値は `date` から自動で設定されるため、各記事で archives パラメータを設定する必要はありません

なお、Taxonomy を日本語化するためには、該当するセクション（archives や categories）に `_index.md` ファイルを作成し、その中で `title` パラメータを設定してください。

### 設定例

```toml
[taxonomies]
  category = "categories"
  tag = "tags"
  archive = "archives"
```

## サイトパラメータ

以下は、`hugo.toml` に設定できるサイト全体に効果がある `params` です。

| キー             | 型              | 説明                                                           |
| ---------------- | --------------- | -------------------------------------------------------------- |
| `author`         | String          | サイト全体の著者名を指定します                                 |
| `description`    | String          | サイトの概要を設定します                                       |
| `keywords`       | Array of String | サイト全体のキーワードを設定します                             |
| `showLastmod`    | Boolean         | 各記事の最終更新日を表示するか否かを設定します                 |
| `treeRoot`       | String          | サイドバーのセクションナビゲーションの起点を指定します         |
| `newNum`         | Integer         | サイドバーに表示する最新記事の数を設定します                   |
| `relatedNum`     | Integer         | 各記事下部に表示する関連記事の数を設定します                   |
| `randomNum`      | Integer         | 各記事下部に表示するランダム記事の数を設定します               |
| `shuffleSeeAlso` | Boolean         | 関連記事とランダム記事の順序をシャッフルするか否かを設定します |

## ページパラメータ

フロントマターの `params` に設定できるものとして以下があります。

| キー          | 型              | 説明                                                                 |
| ------------- | --------------- | -------------------------------------------------------------------- |
| `author`      | String          | 明示的にこのページの著者名を設定し、サイト全体の著者名を上書きします |
| `description` | String          | Hugo の Summary の代わりに、手動で記事の説明を上書きします           |
| `keywords`    | Array of String | このページのキーワードを設定し、タグによるキーワードを上書きします   |
| `lang`        | String          | このページの言語を明示し、サイト全体の言語設定を上書きします         |
| `pin`         | Boolean         | このページへのリンクをサイドバーにピン留めします                     |
| `page`        | Boolean         | このページを記事ではなく、固定ページとして扱います                   |

## その他備考

- Hugo の Menu Templates は使用しません

## ライセンス

[MIT](LICENSE)
