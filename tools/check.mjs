#!/usr/bin/env node
/*
 * npm run check
 *
 * 二段構え。
 *   1. 題材データの検査（ブラウザ要らず）
 *   2. 描画してからの検査（既定の見た目が残っていないか、どの色でも字が読めるか）
 *
 * 2 を作った理由。リンクに text-decoration の指定が無く、ブラウザ既定の下線が
 * 全部に出ていたのを長いあいだ取り逃していた。既定値はエラーを出さないし、
 * 動きも壊さない。撮った画像も「機能が正しく見えるか」で読んでいて気づけなかった。
 * この種類は computed style を実測して不変条件を置くしか捕まえようがない。
 *
 * 依存パッケージは足さない。Chrome を起動して DevTools Protocol を直に叩く。
 */
import { spawn } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const fails = [];
const ng = (where, msg) => fails.push(`${where}: ${msg}`);

// ---------------------------------------------------------------- 1. 題材データ

const { LESSONS, GROUPS, lessonsByGroup } = await import(join(ROOT, 'assets/js/lessons.js'));
const { countKeystrokes } = await import(join(ROOT, 'assets/js/engine.js'));

// 配色の一覧は tone.js から読む。ここに直書きすると必ずズレて、
// 足した色が検査されないまま緑になる
const { TONES } = await import(join(ROOT, 'assets/js/tone.js'));
const { SERIES } = await import(join(ROOT, 'assets/js/lessons.js'));
const { TROPHIES } = await import(join(ROOT, 'assets/js/trophies.js'));
const { DICT } = await import(join(ROOT, 'assets/js/i18n.js'));

const LANGS = new Set(['html', 'css', 'js', 'yaml', 'ruby']);

// 題材に要る項目。README の「題材を足す」の例も同じ一覧で検査するので、
// ここを増やせば例に書き足すまで検査が落ちる
const REQUIRED_KEYS = ['id', 'group', 'lang', 'file', 'level', 'title', 'subtitle', 'note', 'code'];

const seen = new Set();

for (const l of LESSONS) {
  const at = `題材 ${l.id || '(id なし)'}`;
  for (const key of REQUIRED_KEYS) {
    if (!l[key]) ng(at, `${key} が無い`);
  }
  if (seen.has(l.id)) ng(at, 'id が重複している');
  seen.add(l.id);

  if (!GROUPS.includes(l.group)) ng(at, `分類 "${l.group}" が GROUPS に無い`);
  if (!LANGS.has(l.lang)) ng(at, `lang "${l.lang}" は知らない`);

  // 打つ字は ASCII だけ。日本語が混ざると IME が要り、打鍵を受け取れない
  const bad = [...(l.code || '')].filter((c) => c.charCodeAt(0) > 126 || c.charCodeAt(0) < 9);
  if (bad.length) ng(at, `code に ASCII でない字がある: ${JSON.stringify(bad.slice(0, 5).join(''))}`);

  if (l.lang === 'js' && !l.scaffold) ng(at, 'js なのに scaffold が無い');
  if (l.lang === 'css' && !l.scaffold) ng(at, 'css なのに scaffold が無い');

  const keys = countKeystrokes(l.code || '');
  if (keys < 120) ng(at, `短すぎる（${keys} 打）`);
  if (keys > 1200) ng(at, `長すぎる（${keys} 打）`);

  // 題は「何をする単元か」を言う。動詞ひとつでは言えていない
  if (/^(動かす|並べる|整える|描く|書く|消す|保存する|追加する)$/.test(l.title)) {
    ng(at, `題 "${l.title}" が何をする単元か言えていない`);
  }
}

for (const g of lessonsByGroup()) {
  if (!g.items.length) ng(`分類 ${g.name}`, '中身が無い');
}

// ---------------------------------------------------------------- 訳の抜け
//
// 片方の言語にしか無い鍵は、その言語で日本語がそのまま出る。
// 気づきにくいので、機械に数えさせる。

for (const l of LESSONS) {
  for (const k of ['title', 'subtitle', 'note']) {
    if (!l.en?.[k]) ng(`訳 ${l.id}`, `en.${k} が無い`);
  }
}
for (const [id, s] of Object.entries(SERIES)) {
  for (const k of ['name', 'headline', 'goal']) {
    if (!s.en?.[k]) ng(`訳 作品 ${id}`, `en.${k} が無い`);
  }
}
for (const tr of TROPHIES) {
  for (const k of ['name', 'hint']) {
    if (!tr.en?.[k]) ng(`訳 ${tr.id}`, `en.${k} が無い`);
  }
}

const ja = new Set(Object.keys(DICT.ja));
const en = new Set(Object.keys(DICT.en));
for (const k of ja) if (!en.has(k)) ng('訳', `"${k}" が英語に無い`);
for (const k of en) if (!ja.has(k)) ng('訳', `"${k}" が日本語に無い`);
for (const g of GROUPS) if (!ja.has(`group.${g}`)) ng('訳', `分類 "${g}" の名前が無い`);

// 画面に付けた印が、辞書にあるか
const html = readFileSync(join(ROOT, 'index.html'), 'utf8');
for (const m of html.matchAll(/data-i18n(?:-html)?="([^"]+)"/g)) {
  if (!ja.has(m[1])) ng('訳', `画面の印 "${m[1]}" が辞書に無い`);
}
for (const m of html.matchAll(/data-i18n-attr="[^:]+:([^"]+)"/g)) {
  if (!ja.has(m[1])) ng('訳', `画面の印 "${m[1]}" が辞書に無い`);
}

// ---------------------------------------------------------------- README と実装のズレ
//
// README は実装より先に古くなる。ただし古さの全部が害ではないので、
// 「書いてあるとおりに手を動かすと壊れる」種類だけを見張る。
// 文章の良し悪しは見ない。
//
// これを足したのは、分類を日本語から id に改めたときに README の例が
// '王道パターン' のまま残り、README を写して題材を足すと GROUPS に
// 無い分類になる状態を取り逃したから。

const readme = readFileSync(join(ROOT, 'README.md'), 'utf8');

// (1) 数。README には一度だけ書き、実際の数と突き合わせる
for (const [what, re, actual] of [
  ['題材', /^(\d+)\s*本[。、]/m, LESSONS.length],
  ['配色', /配色は\s*(\d+)\s*種/, TONES.length],
  ['アチーブメント', /アチーブメントは\s*(\d+)\s*個/, TROPHIES.length],
]) {
  const m = readme.match(re);
  if (!m) ng('README', `${what}の数が書かれていない`);
  else if (Number(m[1]) !== actual) {
    ng('README', `${what}の数が食い違う（README ${m[1]} / 実際 ${actual}）`);
  }
}

// (2) 構成の一覧。assets/js に足したファイルが載っていないと、
//     どこに何があるかを README から辿れない
const structure = readme.match(/##\s*構成\s*\n+```\n([\s\S]*?)```/);
if (!structure) ng('README', '構成の一覧が見つからない');
else {
  const listed = structure[1];
  const real = readdirSync(join(ROOT, 'assets/js')).filter((n) => n.endsWith('.js'));
  for (const f of real) if (!listed.includes(f)) ng('README', `構成に ${f} が無い`);
  for (const m of listed.matchAll(/^\s+(\S+\.js)\b/gm)) {
    if (!real.includes(m[1])) ng('README', `構成の ${m[1]} は実在しない`);
  }
}

// (3) 「題材を足す」の例。これを写して題材を足す人がいるので、
//     例そのものが上の検査を通る形でなければ意味がない
const sample = readme.match(/###\s*題材を足す[\s\S]*?```js\n([\s\S]*?)```/);
if (!sample) ng('README', '題材を足す例が見つからない');
else {
  const src = sample[1];
  for (const k of REQUIRED_KEYS) {
    if (!new RegExp(`^\\s*${k}:`, 'm').test(src)) ng('README', `題材を足す例に ${k} が無い`);
  }
  // en が無い例を写すと、訳の検査で落ちる
  if (!/^\s*en:\s*\{/m.test(src)) ng('README', '題材を足す例に en が無い');

  // 値も、注釈に並べた選択肢も、実装が受け取れる字であること
  for (const [field, allowed] of [['group', GROUPS], ['lang', [...LANGS]]]) {
    const line = src.split('\n').find((l) => l.trim().startsWith(`${field}:`));
    if (!line) continue; // 上で報告済み
    for (const m of line.matchAll(/'([^']*)'/g)) {
      if (!allowed.includes(m[1])) ng('README', `題材を足す例の ${field} "${m[1]}" は実装に無い`);
    }
  }
}

console.log(`題材 ${LESSONS.length} 本・分類 ${GROUPS.length} 個を検査`);

// ---------------------------------------------------------------- 2. 描画

function findChrome() {
  const cands = [process.env.CHROME, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'];
  const cache = join(process.env.HOME || '', 'Library/Caches/ms-playwright');
  if (existsSync(cache)) {
    for (const d of readdirSync(cache).filter((n) => n.startsWith('chromium-'))) {
      cands.push(join(cache, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'));
    }
  }
  cands.push(
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium'
  );
  return cands.filter(Boolean).find((p) => existsSync(p));
}

const chromeBin = findChrome();
if (!chromeBin && process.env.CI) {
  // CI で黙って飛ばすと、緑なのに何も見ていない状態になる。それが一番まずい
  ng('描画', 'Chrome が見つからない（CI では飛ばさず落とす）');
} else if (!chromeBin) {
  console.log('Chrome が見つからないので描画の検査は飛ばす（CHROME= で場所を渡せる）');
} else {
  const PORT = 8791;
  const server = spawn(process.execPath, [join(ROOT, 'scripts/dev-server.mjs')], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: 'ignore',
  });

  const chrome = spawn(
    chromeBin,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${mkdtempSync(join(tmpdir(), 'te-'))}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-gpu',
      // CI の入れ物では砂場が作れないことがある
      ...(process.env.CI ? ['--no-sandbox', '--disable-dev-shm-usage'] : []),
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] }
  );

  const stop = () => {
    chrome.kill();
    server.kill();
  };

  try {
    const wsBrowser = await new Promise((res, rej) => {
      let buf = '';
      const timer = setTimeout(() => rej(new Error('Chrome が起動しない')), 20000);
      chrome.stderr.on('data', (d) => {
        buf += d;
        const m = buf.match(/ws:\/\/\S+/);
        if (m) {
          clearTimeout(timer);
          res(m[0]);
        }
      });
    });

    const port = new URL(wsBrowser).port;
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    const page = targets.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));

    let id = 0;
    const waiting = new Map();
    ws.onmessage = (e) => {
      const m = JSON.parse(e.data);
      if (m.id && waiting.has(m.id)) {
        waiting.get(m.id)(m);
        waiting.delete(m.id);
      }
    };
    const send = (method, params = {}) =>
      new Promise((r) => {
        const i = ++id;
        waiting.set(i, r);
        ws.send(JSON.stringify({ id: i, method, params }));
      });

    const evaluate = async (expression) => {
      const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.text);
      return r.result?.result?.value;
    };

    // 読み込みで落ちたら、その中身を後で読めるように控えておく
    await send('Page.addScriptToEvaluateOnNewDocument', {
      source: 'addEventListener("error", (e) => { window.__err = String(e.message); });',
    });
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/` });

    let drawn = 0;
    for (let i = 0; i < 60; i++) {
      drawn = await evaluate('document.querySelectorAll(".lesson, .series").length').catch(() => 0);
      if (drawn > 0) break;
      await new Promise((r) => setTimeout(r, 200));
    }

    // 画面が出ているかを先に見る。これが無いと、真っ白でも下の検査は通ってしまう
    if (!drawn) {
      const why = await evaluate('window.__err || "(見当たらない)"').catch(() => '(読めない)');
      ng('描画', `一覧に札が一枚も出ていない。読み込みで落ちている疑い: ${why}`);
    }

    const tones = JSON.stringify(TONES.map((t) => [t.id, t.family]));
    const found = await evaluate(`${String(browserChecks)};browserChecks(${tones})`);
    for (const f of found) ng('描画', f);

    // 英語にしたときに日本語が残っていないか。
    // 訳を足し忘れると、その場所だけ日本語のまま出る
    await evaluate('document.querySelector(\'[data-lang-set="en"]\').click()');
    await new Promise((r) => setTimeout(r, 400));
    const left = await evaluate(`(${String(japaneseLeft)})()`);
    for (const s of left) ng('訳', `英語なのに日本語が残っている: ${JSON.stringify(s)}`);
    await evaluate('document.querySelector(\'[data-lang-set="ja"]\').click()');

    console.log('描画の検査を実行');
  } catch (e) {
    ng('描画', `検査できなかった: ${e.message}`);
  } finally {
    stop();
  }
}

// ---------------------------------------------------------------- 判定

if (fails.length) {
  console.error(`\n落ちた検査 ${fails.length} 件\n`);
  for (const f of fails) console.error('  ' + f);
  process.exit(1);
}
console.log('\nすべて通った');

// ---------------------------------------------------------------- 画面側で走る検査

function browserChecks(tones) {
  const out = [];

  // (1) リンクにブラウザ既定の下線が出ていないか。
  //     見出しやカードごと <a> で囲っているので、打ち消し忘れると線だらけになる
  for (const a of document.querySelectorAll('a')) {
    if (a.closest('.credit')) continue; // ここだけは狙って線を引いている
    const line = getComputedStyle(a).textDecorationLine;
    if (line !== 'none') out.push(`<a class="${a.className || '(なし)'}"> に ${line} が出ている`);
  }

  // (2) ボタンに既定の見た目が残っていないか
  for (const b of document.querySelectorAll('button')) {
    const s = getComputedStyle(b);
    if (s.cursor !== 'pointer') out.push(`<button ${b.id || b.className}> の cursor が ${s.cursor}`);
    if (s.borderRadius === '0px') out.push(`<button ${b.id || b.className}> に角丸が無い`);
  }

  // (3) どの色でも字が読めるか。
  //     地の色との対比を実測する。黒と決め打ちにすると、地が黒でないテーマで甘くなる
  const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const lum = (css) => {
    const ch = css.startsWith('color(')
      ? css.match(/[-\d.]+/g).map(Number)
      : css.match(/[\d.]+/g).slice(0, 3).map((v) => Number(v) / 255);
    const [r, g, b] = ch.map(lin);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const value = (name) => {
    const p = document.createElement('span');
    p.style.color = `var(${name})`;
    document.body.append(p);
    const c = getComputedStyle(p).color;
    p.remove();
    return c;
  };

  const BODY = ['--pending', '--fg', '--fg-mid', '--fg-dim'];
  const CODE = [
    '--tok-tag', '--tok-attr', '--tok-string', '--tok-text', '--tok-punct',
    '--tok-doctype', '--tok-atrule', '--tok-selector', '--tok-prop',
    '--tok-value', '--tok-number', '--tok-keyword', '--tok-fn',
  ];

  const wasTone = document.documentElement.dataset.tone;
  const wasFam = document.documentElement.dataset.family;
  for (const [tone, family] of tones) {
    document.documentElement.dataset.tone = tone;
    document.documentElement.dataset.family = family;
    const bg = lum(value('--bg'));
    const ratio = (name) => {
      const [hi, lo] = [lum(value(name)), bg].sort((a, b) => b - a);
      return (hi + 0.05) / (lo + 0.05);
    };
    for (const name of [...BODY, ...CODE]) {
      const r = ratio(name);
      if (r < 4.5) out.push(`${tone} の ${name} が地に対して ${r.toFixed(2)}:1（4.5 未満）`);
    }
    // 注釈は控えめでよい。ただし読めなくなる手前まで
    const c = ratio('--tok-comment');
    if (c < 3) out.push(`${tone} の --tok-comment が地に対して ${c.toFixed(2)}:1（3.0 未満）`);
  }
  document.documentElement.dataset.tone = wasTone;
  document.documentElement.dataset.family = wasFam;

  // (4) 横に溢れていないか
  if (document.documentElement.scrollWidth > window.innerWidth + 1) {
    out.push(`横に溢れている（${document.documentElement.scrollWidth} > ${window.innerWidth}）`);
  }

  return out;
}

/** 英語のときに残っている日本語を拾う（画面側で走る） */
function japaneseLeft() {
  const out = new Set();
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walk.nextNode()) {
    const n = walk.currentNode;
    if (n.parentElement.closest('.langs, #peek, script, style')) continue;
    const s = n.textContent.trim();
    if (s && /[\u3040-\u30ff\u4e00-\u9faf]/.test(s)) out.add(s.slice(0, 40));
  }
  return [...out];
}
