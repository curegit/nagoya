# Nagoya

**Nagoya（名古屋）** は、静的サイトジェネレーター **Hugo** 用の日本語テーマです。
日本語のユーザーに最適化されて設計されており、i18n（国際化対応）は提供していません。

## サムネイル画像の設定方法

Hugo 自体の挙動に似せており、フロントマターの `images` の値があればそれをサムネイルとして使用します。
それがなければ、フォルダ内でファイル名に feature, cover, thumbnail が含まれる画像がサムネイルとして使われます。

`hugo.toml` で全体的な `images` を設定することも可能で、記事で画像が設定されていない場合に限り、この設定が適用されます。

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

`hugo.toml` に設定できるサイトグローバルの `params` として以下があります。

| キー             | 型            | 説明                                               |
| ---------------- | ------------- | -------------------------------------------------- |
| `author`         | String        | 著者名                                             |
| `description`    | String        | サイトの説明                                       |
| `keywords`       | Array[String] | サイトのキーワード                                 |
| `showLastmod`    | Boolean       | 記事の最終更新日を表示するか                       |
| `treeRoot`       | String        | サイドバーのセクションナビゲーションの根を指定する |
| `newNum`         | Integer       | サイドバーの最新記事の表示数                       |
| `relatedNum`     | Integer       |                                                    |
| `randomNum`      | Integer       |                                                    |
| `shuffleSeeAlso` | Boolean       |                                                    |

## ページパラメータ

フロントマターの `params` に設定できるものとして以下があります。

- author
- description
- keywords
- lang
- pin
- page

## `hugo.toml` の例

```
title = "blog"
paginate = 5
languageCode = "ja"
DefaultContentLanguage = "ja"
# enableInlineShortcodes = true
```

## 備考

- Hugo の Menu Templates は使用しません

## ライセンス

[MIT License](LICENSE)
