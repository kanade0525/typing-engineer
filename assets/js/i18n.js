// 日本語と英語。既定は日本語。
//
// 画面の固定文言は data-i18n（文字だけ）と data-i18n-html（中に印がある場合）で
// 印を付け、ここから流し込む。動く文言は t() を呼ぶ。
// 課題・作品・アチーブメントの文言はそれぞれのデータが en を持っている。
//
// 鍵の抜けは npm run check が拾う。片方の言語にしか無い鍵は落とす。

const KEY = 'typing-engineer:lang';
export const LANGS = [
  { id: 'ja', name: '日本語' },
  { id: 'en', name: 'English' },
];

const JA = {
  'meta.title': 'Typing Engineer — 打つほど、ページができあがる',
  'meta.desc': 'HTML と CSS を打つと、右側のページがその場で組み上がる。タイムを競うタイピングゲーム。',
  'meta.mypage': 'マイページ — Typing Engineer',

  'nav.stages': 'ステージ',
  'nav.mypage': 'マイページ',

  'home.tagline': '打つほど、ページができあがる。',
  'home.creed': '自分でコードを書かなくてもプロダクトが出来上がる時代に、私はコーディングをしたいのです',
  'home.lead':
    'HTML と CSS を一字ずつ打つと、右側のページがその場で組み上がります。<b>打ち終わるまでのタイムを競うゲーム</b>です。自分の最速と競えます。',
  'home.start': '▶ スタート',
  'home.warn': '<kbd>英数</kbd> に切り替えてから始めてください。<b>日本語入力のままだと打鍵が届きません。</b>',
  'home.how1': '上から一字ずつ打つ',
  'home.how2': '改行は <kbd>Enter</kbd>。行頭の字下げは自動',
  'home.how3': '間違えるとカーソルは止まる',
  'home.keys': '一覧は <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> で選び、<kbd>Enter</kbd> で始められます。',

  'shelf.head': 'あなたの記録',
  'shelf.lead':
    'クリアするたびにスコアが入ります。<b>打鍵数 × 正確さ × 速さ</b>で決まるので、速いだけでも正確なだけでも伸びません。記録は<b>このブラウザ</b>にだけ残り、サーバーには送っていません。',
  'shelf.rank': 'ランク',
  'shelf.go': 'マイページで詳しく見る →',

  'bar.goal': '完成形',
  'bar.sound': '打鍵音',
  'bar.retry': 'やり直す',
  'bar.back': '一覧へ',

  'tip.body':
    '上から一字ずつ。改行は <kbd>Enter</kbd>。行頭の字下げと<b>色の値</b>は自動で埋まります（<code>#</code> や <code>rgba(</code> を打った時点で）。間違えるとカーソルは止まります。',
  'ready.key': '<kbd>Space</kbd> を押すと始まります',
  'preview.hint': '打ち始めると、ここに組み上がっていきます',
  'preview.title': 'プレビュー',

  'result.clear': 'CLEAR',
  'result.sec': '秒',
  'result.best': '自己ベスト更新',
  'result.wpm': '速さ',
  'result.acc': '正確さ',
  'result.keys': '打鍵',
  'result.miss': 'ミス',
  'result.play': '遊ぶ',
  'result.share': '結果を共有',
  'result.copy': 'コードをコピー',
  'result.save': 'ページを保存',
  'result.next': '次の課題へ',
  'result.again': 'もう一度',
  'result.home': '一覧へ',
  'result.formula': '打鍵 × 正確さ × 速さ',
  'result.total': '累計',
  'result.weak': 'つまずいた字　',
  'result.copied': 'コピーしました',
  'result.copyfail': 'コピーできませんでした',
  'result.vsFaster': 'これまでの最速より {n} 秒 速い',
  'result.vsSlower': '自己ベスト {best} 秒まで あと {n} 秒',

  'play.lines': '{now} / {all} 行',
  'play.left': '残り {n} 打',
  'play.done': 'できあがり',
  'play.ime': '日本語入力になっています。英数に切り替えてください',
  'play.count.go': 'スタート',

  'card.lines': '{n} 行',
  'card.keys': '{n} 打',
  'card.best': '自己ベスト {n} wpm',
  'card.level': '難しさ {n}/4',
  'series.total': '全 {n} 章 · {k} 打',
  'series.cleared': 'クリア {done} / {all}',
  'series.allDone': '全章クリア',
  'group.works': '{n} 作品',

  'my.clear': 'CLEAR',
  'my.stages': 'ステージ制覇',
  'my.keys': '総打鍵',
  'my.fastest': '最速',
  'my.bestAcc': '最高正確さ',
  'my.streak': '連続',
  'my.perfect': 'ノーミス',
  'my.since': 'はじめた日',
  'my.days': '{n} 日',
  'my.times': '{n} 回',
  'my.top': '最上位です',
  'my.toNext': '次の {name} まで あと {n}',
  'my.stageTable': 'ステージ別の記録',
  'my.trophies': 'アチーブメント',
  'my.history': '最近の記録',
  'my.noHistory': 'まだ記録がありません。一本クリアするとここに残ります。',
  'my.storage': '記録の置き場所',
  'my.storageLead':
    '記録は <b>このブラウザの localStorage</b> にだけ保存しています。サーバーには何も送っていません。別の端末やブラウザからは見えません。履歴を消すと一緒に消えます。',
  'my.export': '記録を書き出す（JSON）',
  'my.import': '記録を読み込む（JSON）',
  'my.wipe': 'すべて消す',
  'my.wipeAsk': 'スコア・ベストタイム・アチーブメントをすべて消します。元に戻せません。よろしいですか。',
  'my.importAsk': 'いまの記録を、読み込んだ内容で置き換えます。元に戻せません。よろしいですか。',
  'my.importFail': '読み込めませんでした。',
  'my.chapters': '{done} / {all} 章',
  'my.locked': 'LOCKED',
  'my.got': '取得 {date}',

  'th.stage': 'ステージ',
  'th.best': 'ベスト',
  'th.when': '日時',
  'th.verb': 'Verb',

  'share.text': 'Typing Engineer で「{title}」を {sec}秒・正確さ {acc}% でクリアしました。',

  'group.visual': '見た目が変わる',
  'group.patterns': '王道パターン',
  'group.apps': 'アプリを写経する',
  'group.games': 'ゲームを写経する',
  'group.config': '設定ファイルを書く',
  'group.basics': 'HTML から CSS へ',

  'tone.editor': 'エディタ配色',
  'tone.phosphor': '単色の燐光',
  'tone.vivid': 'カラフル',
  'tone.green': 'グリーン',
  'tone.amber': 'アンバー',
  'tone.cyan': 'シアン',
  'tone.magenta': 'マゼンタ',
  'tone.mono': 'モノクロ',
};

const EN = {
  'meta.title': 'Typing Engineer — the page builds as you type',
  'meta.desc': 'Type HTML and CSS and watch the page assemble itself on the right. A typing game against the clock.',
  'meta.mypage': 'My page — Typing Engineer',

  'nav.stages': 'Stages',
  'nav.mypage': 'My page',

  'home.tagline': 'The page builds as you type.',
  'home.creed':
    'In an age where products get built without writing the code yourself, I still want to write code',
  'home.lead':
    'Type HTML and CSS one character at a time and the page on the right assembles itself. <b>It is a race against the clock</b> — your own best time.',
  'home.start': '▶ Start',
  'home.warn':
    'Switch your keyboard to <kbd>direct input</kbd> first. <b>Keystrokes will not reach the page while an IME is active.</b>',
  'home.how1': 'Type from the top, one character at a time',
  'home.how2': '<kbd>Enter</kbd> for a newline. Indentation is filled in for you',
  'home.how3': 'A wrong key does not move the cursor',
  'home.keys': 'Pick a stage with <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> and start with <kbd>Enter</kbd>.',

  'shelf.head': 'Your record',
  'shelf.lead':
    'Every clear earns a score. It is <b>keystrokes × accuracy × speed</b>, so neither speed nor accuracy alone will carry you. Records stay <b>in this browser only</b> — nothing is sent to a server.',
  'shelf.rank': 'Rank',
  'shelf.go': 'See the details on my page →',

  'bar.goal': 'Goal',
  'bar.sound': 'Key sound',
  'bar.retry': 'Retry',
  'bar.back': 'Stages',

  'tip.body':
    'Type from the top. <kbd>Enter</kbd> for a newline. Indentation and <b>colour values</b> are filled in for you (the moment you type <code>#</code> or <code>rgba(</code>). A wrong key does not move the cursor.',
  'ready.key': 'Press <kbd>Space</kbd> to begin',
  'preview.hint': 'Start typing and it will take shape here',
  'preview.title': 'Preview',

  'result.clear': 'CLEAR',
  'result.sec': 'sec',
  'result.best': 'New personal best',
  'result.wpm': 'Speed',
  'result.acc': 'Accuracy',
  'result.keys': 'Keys',
  'result.miss': 'Misses',
  'result.play': 'Play it',
  'result.share': 'Share',
  'result.copy': 'Copy the code',
  'result.save': 'Save as a page',
  'result.next': 'Next stage',
  'result.again': 'Again',
  'result.home': 'Stages',
  'result.formula': 'keys × accuracy × speed',
  'result.total': 'total',
  'result.weak': 'Tripped on　',
  'result.copied': 'Copied',
  'result.copyfail': 'Could not copy',
  'result.vsFaster': '{n} seconds faster than your best',
  'result.vsSlower': '{n} seconds off your best of {best}',

  'play.lines': 'line {now} / {all}',
  'play.left': '{n} keys left',
  'play.done': 'done',
  'play.ime': 'An IME is active. Switch to direct input.',
  'play.count.go': 'GO',

  'card.lines': '{n} lines',
  'card.keys': '{n} keys',
  'card.best': 'best {n} wpm',
  'card.level': 'difficulty {n}/4',
  'series.total': '{n} chapters · {k} keys',
  'series.cleared': 'cleared {done} / {all}',
  'series.allDone': 'All chapters cleared',
  'group.works': '{n} projects',

  'my.clear': 'CLEAR',
  'my.stages': 'Stages cleared',
  'my.keys': 'Total keys',
  'my.fastest': 'Fastest',
  'my.bestAcc': 'Best accuracy',
  'my.streak': 'Streak',
  'my.perfect': 'Flawless',
  'my.since': 'Started on',
  'my.days': '{n} days',
  'my.times': '{n}',
  'my.top': 'Top rank',
  'my.toNext': '{n} to go until {name}',
  'my.stageTable': 'Record by stage',
  'my.trophies': 'Achievements',
  'my.history': 'Recent runs',
  'my.noHistory': 'Nothing yet. Clear a stage and it will show up here.',
  'my.storage': 'Where your record lives',
  'my.storageLead':
    'Records are kept <b>in this browser’s localStorage</b> only. Nothing is sent to a server. They are not visible from another device or browser, and clearing your history clears them too.',
  'my.export': 'Export (JSON)',
  'my.import': 'Import (JSON)',
  'my.wipe': 'Erase everything',
  'my.wipeAsk': 'This erases every score, best time and achievement. It cannot be undone. Continue?',
  'my.importAsk': 'This replaces your current record with the file. It cannot be undone. Continue?',
  'my.importFail': 'Could not read the file.',
  'my.chapters': '{done} / {all} chapters',
  'my.locked': 'LOCKED',
  'my.got': 'earned {date}',

  'th.stage': 'Stage',
  'th.best': 'Best',
  'th.when': 'When',
  'th.verb': 'Verb',

  'share.text': 'Cleared “{title}” on Typing Engineer in {sec}s with {acc}% accuracy.',

  'group.visual': 'Make it look right',
  'group.patterns': 'Everyday patterns',
  'group.apps': 'Copy out an app',
  'group.games': 'Copy out a game',
  'group.config': 'Write config files',
  'group.basics': 'From HTML to CSS',

  'tone.editor': 'Editor themes',
  'tone.phosphor': 'Single-hue phosphor',
  'tone.vivid': 'Colourful',
  'tone.green': 'Green',
  'tone.amber': 'Amber',
  'tone.cyan': 'Cyan',
  'tone.magenta': 'Magenta',
  'tone.mono': 'Monochrome',
};

export const DICT = { ja: JA, en: EN };

let lang = 'ja';

export function currentLang() {
  return lang;
}

export function t(key, vars) {
  let s = DICT[lang][key] ?? DICT.ja[key] ?? key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, v);
  return s;
}

/** 課題・作品・アチーブメントは、それぞれのデータが en を持っている */
export function pick(obj, key) {
  if (lang === 'en' && obj?.en?.[key]) return obj.en[key];
  return obj?.[key] ?? '';
}

function applyStatic() {
  document.documentElement.lang = lang;
  document.title = t('meta.title');
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.setAttribute('content', t('meta.desc'));

  for (const n of document.querySelectorAll('[data-i18n]')) n.textContent = t(n.dataset.i18n);
  for (const n of document.querySelectorAll('[data-i18n-html]')) n.innerHTML = t(n.dataset.i18nHtml);
  for (const n of document.querySelectorAll('[data-i18n-attr]')) {
    const [attr, key] = n.dataset.i18nAttr.split(':');
    n.setAttribute(attr, t(key));
  }
}

export function setLang(id, redraw = () => {}) {
  lang = DICT[id] ? id : 'ja';
  try {
    localStorage.setItem(KEY, lang);
  } catch {
    /* 残せなくても切り替えは効く */
  }
  for (const b of document.querySelectorAll('[data-lang-set]')) {
    b.setAttribute('aria-pressed', String(b.dataset.langSet === lang));
  }
  applyStatic();
  redraw();
  return lang;
}

export function initLang(redraw) {
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    /* 既定で動く */
  }
  setLang(DICT[saved] ? saved : 'ja', redraw);
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-lang-set]');
    if (b) setLang(b.dataset.langSet, redraw);
  });
}
