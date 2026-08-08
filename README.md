# Typing Engineer

HTML と CSS を一字ずつ打つタイピング練習。
**打った分だけ、右側のプレビューがその場で組み上がっていきます。**

<https://kanade0525.github.io/typing-engineer/>

---

## 何が見えるのか

| 題材 | プレビューの動き |
| --- | --- |
| HTML | 打った所までを `document.write` で継ぎ足す。ブラウザが実際にページを読み込むときと同じ流し込みなので、閉じタグを打つ前でも途中まで形になる |
| CSS | 土台の HTML は置いたまま `<style>` の中身だけ差し替える。ちらつかず、アニメーションも動いたまま |

`<head>` を打っている間はまだ画面に何も出ないので、そのあいだは
プレビュー欄の見出しに `<title>` が出ます。

## 遊び方

1. **英数入力に切り替える。** 日本語入力のままだと打鍵が届きません（気づけるよう画面に出ます）
2. 課題を選んで、上から順に打つ
3. **行頭のインデントと行末の空白は自動で送られます。** 改行は <kbd>Enter</kbd>
4. 間違えるとカーソルは進みません。正しい字を打つまで止まります

<kbd>Esc</kbd> で一覧に戻ります。自己ベストは手元のブラウザにだけ残ります。

## 手元で動かす

```sh
npm run dev     # http://localhost:8000/
```

依存パッケージはありません。`npm install` も要りません。
ES モジュールを使っているので `file://` で直接開いても動かない、それだけの理由で
サーバーを一本置いてあります。

## 構成

```
index.html
assets/css/app.css
assets/js/
  app.js         画面の組み立てと打鍵の受け取り
  engine.js      打鍵の判定と集計（DOM も音も知らない）
  preview.js     打った所までを描く
  highlight.js   HTML / CSS の色分け（依存なしの字句解析）
  lessons.js     題材
  sound.js       打鍵音（音声ファイルは持たず合成する）
  storage.js     自己ベスト
scripts/dev-server.mjs
```

### 題材を足す

`assets/js/lessons.js` に一つ足すだけです。**`code` は必ず ASCII だけで書きます。**
日本語が混ざると IME が要り、打鍵を受け取れなくなります。

```js
{
  id: 'css-gradient',
  lang: 'css',        // 'html' か 'css'
  file: 'hero.css',
  level: 3,           // 1〜4
  title: '背景をぼかす',
  subtitle: 'グラデーション',
  note: '一覧のカードに出る一行。',
  scaffold: '<div class="hero">Hello</div>',  // lang: 'css' のときだけ
  code: '.hero {\n  background: linear-gradient(...);\n}\n',
}
```

## 外部に依存しない

フォントも CDN もアイコン配信も使っていません。ネットワークへ出ていく通信はゼロです。

2020 年の版は Heroku・Font Awesome・期限付きの署名付き S3 URL に寄りかかっていて、
Heroku の無料プランが終わった時点で丸ごと動かなくなりました。同じ壊れ方をしないよう、
外に置いたものは持ち込んでいません。

## 2020 年の版から変わったところ

- **公開先** Heroku（消滅）→ GitHub Pages。サーバーは要らなくなりました
- **打つ字** `&lt;` `&gt;` という実体参照を打たせ `keyCode` で分岐していたのをやめ、
  `<` `>` をそのまま打ちます
- **プレビュー** 新設。これが今回の主題です
- **単位** 1 行ずつ → ファイル 1 本を通しで
- **見た目** 黒地に緑一色 → エディタ風の配色と、打った所だけ色が点く表示

## 支える

役に立ったら [GitHub Sponsors](https://github.com/sponsors/kanade0525) からどうぞ。

## ライセンス

MIT
