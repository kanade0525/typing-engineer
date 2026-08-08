import { LESSONS, findLesson, nextLesson } from './lessons.js';
import { typeMap } from './highlight.js';
import { TypingEngine, countKeystrokes } from './engine.js';
import { Preview } from './preview.js';
import { Clicker } from './sound.js';
import { getBest, saveBest } from './storage.js';

const $ = (id) => document.getElementById(id);

const el = {
  home: $('screenHome'),
  play: $('screenPlay'),
  lessonList: $('lessonList'),
  fileName: $('fileName'),
  lessonLabel: $('lessonLabel'),
  lessonSub: $('lessonSub'),
  code: $('code'),
  preview: $('preview'),
  previewHint: $('previewHint'),
  previewLive: $('previewLive'),
  previewTitle: $('previewTitle'),
  statWpm: $('statWpm'),
  statAcc: $('statAcc'),
  statTime: $('statTime'),
  progressFill: $('progressFill'),
  progressNum: $('progressNum'),
  toast: $('toast'),
  result: $('result'),
  resultEyebrow: $('resultEyebrow'),
  resultTitle: $('resultTitle'),
  resultWpm: $('resultWpm'),
  resultBest: $('resultBest'),
  resultAcc: $('resultAcc'),
  resultTime: $('resultTime'),
  resultKeys: $('resultKeys'),
  resultMiss: $('resultMiss'),
  resultWeak: $('resultWeak'),
  btnSound: $('btnSound'),
  soundIco: $('soundIco'),
  btnRetry: $('btnRetry'),
  btnBack: $('btnBack'),
  btnNext: $('btnNext'),
  btnAgain: $('btnAgain'),
  btnHome: $('btnHome'),
};

const clicker = new Clicker();
const preview = new Preview(el.preview);

let state = 'home'; // 'home' | 'play' | 'result'
let lesson = null;
let engine = null;
let spans = [];
let rows = [];
let lineOf = [];
let cursorSpan = null;
let paintedTo = 0;
let lastLine = -1;
let previewQueued = false;
let activeRow = null;
let ticker = null;
let toastTimer = null;
let liveTimer = null;

// ---------------------------------------------------------------- 一覧

function levelDots(n) {
  return '●'.repeat(n) + '○'.repeat(Math.max(0, 4 - n));
}

function renderHome() {
  const frag = document.createDocumentFragment();

  for (const l of LESSONS) {
    const best = getBest(l.id);
    const lines = l.code.replace(/\n$/, '').split('\n').length;
    const keys = countKeystrokes(l.code);

    const card = document.createElement('button');
    card.type = 'button';
    card.className = `lesson lesson--${l.lang}`;
    card.dataset.id = l.id;

    const head = document.createElement('span');
    head.className = 'lesson__head';
    head.innerHTML =
      `<span class="lesson__lang">${l.lang.toUpperCase()}</span>` +
      `<span class="lesson__level" title="難しさ ${l.level}/4">${levelDots(l.level)}</span>`;

    const title = document.createElement('span');
    title.className = 'lesson__title';
    title.textContent = l.title;

    const sub = document.createElement('span');
    sub.className = 'lesson__sub';
    sub.textContent = l.subtitle;

    const note = document.createElement('span');
    note.className = 'lesson__note';
    note.textContent = l.note;

    const meta = document.createElement('span');
    meta.className = 'lesson__meta';
    meta.innerHTML =
      `<span>${lines} 行</span><span class="dot">·</span><span>${keys} 打</span>` +
      (best ? `<span class="lesson__best">自己ベスト ${best.wpm} wpm</span>` : '');

    card.append(head, title, sub, note, meta);
    frag.append(card);
  }

  el.lessonList.replaceChildren(frag);
}

el.lessonList.addEventListener('click', (e) => {
  const card = e.target.closest('.lesson');
  if (card) start(card.dataset.id);
});

// ---------------------------------------------------------------- 課題の組み立て

function newRow(i) {
  const row = document.createElement('div');
  row.className = 'row';
  const num = document.createElement('span');
  num.className = 'row__num';
  num.textContent = String(i + 1);
  const src = document.createElement('span');
  src.className = 'row__src';
  row.append(num, src);
  return { el: row, src };
}

function buildCode() {
  const code = lesson.code;
  const types = typeMap(code, lesson.lang);
  const frag = document.createDocumentFragment();

  spans = new Array(code.length);
  lineOf = new Array(code.length);
  rows = [];

  let line = 0;
  let row = newRow(line);

  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    const s = document.createElement('span');
    s.className = `c t-${types[i]}`;
    spans[i] = s;
    lineOf[i] = line;

    if (ch === '\n') {
      s.classList.add('nl');
      s.textContent = ' ';
      row.src.append(s);
      frag.append(row.el);
      rows.push(row);
      line++;
      row = newRow(line);
    } else {
      s.textContent = ch;
      row.src.append(s);
    }
  }

  frag.append(row.el);
  rows.push(row);
  el.code.replaceChildren(frag);
}

// ---------------------------------------------------------------- 進み具合の反映

function paintProgress() {
  for (let i = paintedTo; i < engine.index; i++) spans[i]?.classList.add('is-done');
  for (let i = engine.index; i < paintedTo; i++) spans[i]?.classList.remove('is-done');
  paintedTo = engine.index;

  if (cursorSpan) cursorSpan.classList.remove('is-cur');
  cursorSpan = spans[engine.index] || null;
  if (cursorSpan) {
    cursorSpan.classList.add('is-cur');
    const line = lineOf[engine.index];
    if (line !== lastLine) {
      activeRow?.classList.remove('is-active');
      activeRow = rows[line]?.el || null;
      activeRow?.classList.add('is-active');
      activeRow?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      lastLine = line;
    }
  }
}

/** プレビュー側の見出し（<title>）と、まだ何も出ていないときの案内 */
function syncPreviewChrome() {
  el.previewTitle.textContent = preview.title;
  el.previewHint.hidden = preview.hasContent();
}

function queuePreview() {
  if (previewQueued) return;
  previewQueued = true;
  requestAnimationFrame(() => {
    previewQueued = false;
    if (engine) preview.render(engine.typed);
  });
}

function updateStats() {
  el.statWpm.textContent = String(engine.wpm);
  el.statAcc.textContent = String(engine.accuracy);
  el.statTime.textContent = engine.elapsed.toFixed(1);
  const pct = Math.round(engine.progress * 100);
  el.progressFill.style.width = `${pct}%`;
  el.progressNum.textContent = `${pct}%`;
}

function flashError() {
  if (!cursorSpan) return;
  cursorSpan.classList.remove('is-err');
  void cursorSpan.offsetWidth; // アニメーションを打ち直すために一度読む
  cursorSpan.classList.add('is-err');
}

function showToast(text) {
  el.toast.textContent = text;
  el.toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.toast.hidden = true;
  }, 2600);
}

// ---------------------------------------------------------------- 開始・終了

function start(id) {
  const next = findLesson(id);
  if (!next) return;

  lesson = next;
  engine = new TypingEngine(lesson.code);
  spans = [];
  rows = [];
  paintedTo = 0;
  lastLine = -1;
  cursorSpan = null;
  activeRow = null;

  el.fileName.textContent = lesson.file;
  el.lessonLabel.textContent = lesson.title;
  el.lessonSub.textContent = lesson.subtitle;
  el.result.hidden = true;
  el.toast.hidden = true;
  el.code.classList.remove('is-done');

  buildCode();
  preview.mount(lesson);
  preview.render(engine.typed);
  syncPreviewChrome();

  el.home.hidden = true;
  el.play.hidden = false;
  state = 'play';

  paintProgress();
  updateStats();

  clearInterval(ticker);
  ticker = setInterval(() => {
    if (engine.startedAt != null && !engine.finished) updateStats();
  }, 90);
}

function finish() {
  clearInterval(ticker);
  ticker = null;
  state = 'result';

  preview.render(engine.typed);
  preview.seal();
  updateStats();
  clicker.done();
  el.code.classList.add('is-done');
  if (cursorSpan) cursorSpan.classList.remove('is-cur');

  const record = { wpm: engine.wpm, accuracy: engine.accuracy, at: new Date().toISOString() };
  const updated = saveBest(lesson.id, record);

  el.resultTitle.textContent = lesson.title;
  el.resultEyebrow.textContent = `${lesson.file} — できあがり`;
  el.resultWpm.textContent = String(engine.wpm);
  el.resultAcc.textContent = `${engine.accuracy}%`;
  el.resultTime.textContent = `${engine.elapsed.toFixed(1)}s`;
  el.resultKeys.textContent = String(engine.strokes);
  el.resultMiss.textContent = String(engine.misses);
  el.resultBest.hidden = !updated;

  const weak = engine.weakKeys(3);
  if (weak.length) {
    el.resultWeak.hidden = false;
    el.resultWeak.replaceChildren(
      document.createTextNode('つまずいた字　'),
      ...weak.map(({ key, count }) => {
        const wrap = document.createElement('span');
        wrap.className = 'result__weakone';
        const k = document.createElement('kbd');
        k.textContent = key === ' ' ? '␣' : key;
        wrap.append(k);
        if (count > 1) {
          const n = document.createElement('small');
          n.textContent = `×${count}`;
          wrap.append(n);
        }
        return wrap;
      })
    );
  } else {
    el.resultWeak.hidden = true;
  }

  el.result.hidden = false;
  el.btnNext.focus();
}

function goHome() {
  clearInterval(ticker);
  ticker = null;
  state = 'home';
  engine = null;
  el.result.hidden = true;
  el.play.hidden = true;
  el.home.hidden = false;
  renderHome();
}

// ---------------------------------------------------------------- 打鍵

function handle(ch) {
  const r = engine.input(ch);
  if (r.ok) {
    clicker.hit();
    paintProgress();
    queuePreview();
    updateStats();
    if (r.finished) finish();
  } else {
    clicker.miss();
    flashError();
    updateStats();
  }
}

window.addEventListener('keydown', (e) => {
  if (state !== 'play') {
    if (state === 'result' && e.key === 'Escape') {
      e.preventDefault();
      goHome();
    }
    return;
  }
  if (e.metaKey || e.ctrlKey || e.altKey) return; // ブラウザ側の操作は邪魔しない

  if (e.key === 'Escape') {
    e.preventDefault();
    goHome();
    return;
  }

  // 日本語入力のままだと文字が届かない
  if (e.isComposing || e.keyCode === 229 || e.key === 'Process') {
    e.preventDefault();
    showToast('日本語入力になっています。英数に切り替えてください');
    return;
  }

  let ch = null;
  if (e.key === 'Enter') ch = '\n';
  else if (e.key === 'Tab' || e.key === 'Backspace') {
    e.preventDefault(); // フォーカスを飛ばさない／前のページに戻らない
    return;
  } else if (e.key.length === 1) ch = e.key;
  else return;

  e.preventDefault();
  handle(ch);
});

// ---------------------------------------------------------------- 操作

preview.onPaint = () => {
  syncPreviewChrome();
  el.previewLive.classList.add('is-on');
  clearTimeout(liveTimer);
  liveTimer = setTimeout(() => el.previewLive.classList.remove('is-on'), 260);
};

function syncSoundButton() {
  el.btnSound.setAttribute('aria-pressed', String(clicker.enabled));
  el.soundIco.textContent = clicker.enabled ? '♪' : '×';
}

el.btnSound.addEventListener('click', () => {
  clicker.toggle();
  syncSoundButton();
});
el.btnRetry.addEventListener('click', () => start(lesson.id));
el.btnBack.addEventListener('click', goHome);
el.btnAgain.addEventListener('click', () => start(lesson.id));
el.btnHome.addEventListener('click', goHome);
el.btnNext.addEventListener('click', () => {
  const n = nextLesson(lesson.id);
  if (n) start(n.id);
});

syncSoundButton();
renderHome();
