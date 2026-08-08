import { LESSONS, findLesson, nextLesson, lessonsByGroup } from './lessons.js';
import { typeMap } from './highlight.js';
import { TypingEngine, countKeystrokes } from './engine.js';
import { Preview } from './preview.js';
import { Clicker } from './sound.js';
import { getBest, saveBest, getStats, recordRun } from './storage.js';
import { TROPHIES } from './trophies.js';
import { Rain, Rabbit } from './matrix.js';

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
  statBestWrap: $('statBestWrap'),
  statBest: $('statBest'),
  statDelta: $('statDelta'),
  progressGhost: $('progressGhost'),
  count: $('count'),
  ready: $('ready'),
  readyFile: $('readyFile'),
  readyTitle: $('readyTitle'),
  readyMeta: $('readyMeta'),
  countNum: $('countNum'),
  resultVs: $('resultVs'),
  startSub: $('startSub'),
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
  resultGain: $('resultGain'),
  resultEarned: $('resultEarned'),
  tokenTotal: $('tokenTotal'),
  tally: $('tally'),
  tip: $('tip'),
  btnStart: $('btnStart'),
  trophies: $('trophies'),
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
const rain = new Rain($('rain'));
const rabbit = new Rabbit($('rabbit'));
let flavorOn = false;

/** 降る字と白ウサギ。一覧にいるときだけ動かす */
function syncFlavor() {
  const want = state === 'home';
  if (want === flavorOn) return;
  flavorOn = want;
  if (want) {
    rain.start();
    rabbit.start();
  } else {
    rain.stop();
    rabbit.stop();
  }
}

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
let phase = 'ready'; // 'ready' → 'count' → 'play'
let counting = false;
let countTimer = null;
let bestSeconds = null;

// ---------------------------------------------------------------- 一覧

function levelDots(n) {
  return '●'.repeat(n) + '○'.repeat(Math.max(0, 4 - n));
}

function lessonCard(l) {
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
  return card;
}

function renderShelf() {
  const s = getStats();

  el.tokenTotal.textContent = s.tokens.toLocaleString('en');

  const rows = [
    ['CLEAR', `${s.runs}`],
    ['総打鍵', s.keys.toLocaleString('en')],
    ['ベスト', `${s.bestWpm} wpm`],
    ['連続', `${s.streak} 日`],
  ];
  el.tally.replaceChildren(
    ...rows.map(([k, v]) => {
      const wrap = document.createElement('div');
      const dt = document.createElement('dt');
      dt.textContent = k;
      const dd = document.createElement('dd');
      dd.textContent = v;
      wrap.append(dt, dd);
      return wrap;
    })
  );

  el.trophies.replaceChildren(
    ...TROPHIES.map((t) => {
      const got = Boolean(s.earned[t.id]);
      const chip = document.createElement('span');
      chip.className = `trophy${got ? ' is-got' : ''}`;
      chip.title = got ? `${t.hint}（${s.earned[t.id]}）` : t.hint;

      const name = document.createElement('b');
      name.textContent = got ? t.name : 'LOCKED';
      const hint = document.createElement('small');
      hint.textContent = t.hint;

      chip.append(name, hint);
      return chip;
    })
  );
}

function renderHome() {
  const frag = document.createDocumentFragment();

  for (const group of lessonsByGroup()) {
    const section = document.createElement('section');
    section.className = 'group';

    const head = document.createElement('h2');
    head.className = 'group__name';
    head.innerHTML = `${group.name}<span class="group__count">${group.items.length}</span>`;

    const grid = document.createElement('div');
    grid.className = 'lessons';
    for (const l of group.items) grid.append(lessonCard(l));

    section.append(head, grid);
    frag.append(section);
  }

  el.lessonList.replaceChildren(frag);
  renderShelf();
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

  if (bestSeconds == null || engine.startedAt == null) return;

  // 自分の最速が今どこを走っているか
  el.progressGhost.style.left = `${Math.min(100, (engine.elapsed / bestSeconds) * 100)}%`;

  // 同じ進み具合に最速が着いていた時刻との差
  const d = engine.elapsed - bestSeconds * engine.progress;
  el.statDelta.textContent = `${d >= 0 ? '+' : ''}${d.toFixed(1)}`;
  el.statDelta.className = `delta ${d < 0 ? 'is-ahead' : 'is-behind'}`;
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

/** Space を押すまで待つ。押されてからカウントダウンに入る */
function showReady() {
  phase = 'ready';
  const best = getBest(lesson.id);
  el.readyFile.textContent = lesson.file;
  el.readyTitle.textContent = lesson.title;
  el.readyMeta.textContent =
    `${countKeystrokes(lesson.code)} 打` +
    (best && best.seconds != null ? `　ベスト ${best.seconds.toFixed(1)} 秒` : '');
  el.ready.hidden = false;
}

function beginRun() {
  if (phase !== 'ready') return;
  el.ready.hidden = true;
  phase = 'count';
  runCountdown(() => {
    phase = 'play';
    engine.begin();
    clearInterval(ticker);
    ticker = setInterval(() => {
      if (engine.startedAt != null && !engine.finished) updateStats();
    }, 90);
  });
}

/** 3 → 2 → 1 → スタート。ここが無いと、いつ計り始めたのか分からない */
function runCountdown(done) {
  const steps = ['3', '2', '1', 'スタート'];
  let i = 0;
  counting = true;
  el.count.hidden = false;

  const show = () => {
    const last = i === steps.length - 1;
    el.countNum.textContent = steps[i];
    el.count.classList.toggle('is-go', last);
    el.countNum.classList.remove('is-pop');
    void el.countNum.offsetWidth; // アニメーションを打ち直す
    el.countNum.classList.add('is-pop');
    if (last) clicker.go();
    else clicker.count();

    i++;
    countTimer = setTimeout(
      i < steps.length
        ? show
        : () => {
            el.count.hidden = true;
            counting = false;
            done();
          },
      last ? 420 : 600
    );
  };
  show();
}

function stopCountdown() {
  clearTimeout(countTimer);
  countTimer = null;
  counting = false;
  el.count.hidden = true;
  el.ready.hidden = true;
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

  stopCountdown();
  const best = getBest(lesson.id);
  bestSeconds = best && best.seconds != null ? best.seconds : null;
  el.statBestWrap.hidden = bestSeconds == null;
  el.progressGhost.hidden = bestSeconds == null;
  if (bestSeconds != null) {
    el.statBest.textContent = `${bestSeconds.toFixed(1)}s`;
    el.progressGhost.style.left = '0%';
    el.statDelta.textContent = '';
  }

  el.fileName.textContent = lesson.file;
  el.lessonLabel.textContent = lesson.title;
  el.lessonSub.textContent = lesson.subtitle;
  el.result.hidden = true;
  el.toast.hidden = true;
  el.tip.hidden = false;
  el.code.classList.remove('is-done');

  buildCode();
  preview.mount(lesson);
  preview.render(engine.typed);
  syncPreviewChrome();

  el.home.hidden = true;
  el.play.hidden = false;
  state = 'play';
  syncFlavor();

  paintProgress();
  updateStats();

  clearInterval(ticker);
  showReady();
}

function finish() {
  clearInterval(ticker);
  ticker = null;
  state = 'result';
  phase = 'done';

  preview.render(engine.typed);
  preview.seal();
  updateStats();
  clicker.done();
  el.code.classList.add('is-done');
  if (cursorSpan) cursorSpan.classList.remove('is-cur');

  const seconds = Number(engine.elapsed.toFixed(2));
  const record = {
    wpm: engine.wpm,
    accuracy: engine.accuracy,
    seconds,
    at: new Date().toISOString(),
  };
  const updated = saveBest(lesson.id, record);
  const { gained, earned, stats } = recordRun({
    lessonId: lesson.id,
    keys: engine.index,
    accuracy: engine.accuracy,
    wpm: engine.wpm,
    misses: engine.misses,
  });

  el.resultTitle.textContent = lesson.title;
  el.resultEyebrow.textContent = `CLEAR — ${lesson.file}`;
  el.resultWpm.textContent = `${engine.wpm} wpm`;
  el.resultAcc.textContent = `${engine.accuracy}%`;
  el.resultTime.textContent = engine.elapsed.toFixed(1);

  if (updated && bestSeconds != null) {
    el.resultVs.hidden = false;
    el.resultVs.className = 'result__vs is-ahead';
    el.resultVs.textContent = `これまでの最速より ${(bestSeconds - seconds).toFixed(1)} 秒 速い`;
  } else if (bestSeconds != null) {
    el.resultVs.hidden = false;
    el.resultVs.className = 'result__vs is-behind';
    el.resultVs.textContent = `自己ベスト ${bestSeconds.toFixed(1)} 秒まで あと ${(seconds - bestSeconds).toFixed(1)} 秒`;
  } else {
    el.resultVs.hidden = true;
  }
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

  el.resultGain.hidden = false;
  el.resultGain.replaceChildren(
    Object.assign(document.createElement('b'), { textContent: `SCORE +${gained}` }),
    Object.assign(document.createElement('small'), {
      textContent: `打鍵 × 正確さ × 速さ　／　累計 ${stats.tokens.toLocaleString('en')}`,
    })
  );

  if (earned.length) {
    el.resultEarned.hidden = false;
    el.resultEarned.replaceChildren(
      ...earned.map((t) => {
        const chip = document.createElement('span');
        chip.className = 'trophy trophy--new is-got';
        const name = document.createElement('b');
        name.textContent = t.name;
        const small = document.createElement('small');
        small.textContent = t.hint;
        chip.append(name, small);
        return chip;
      })
    );
  } else {
    el.resultEarned.hidden = true;
  }

  el.result.hidden = false;
  el.btnNext.focus();
}

function goHome() {
  clearInterval(ticker);
  ticker = null;
  stopCountdown();
  state = 'home';
  engine = null;
  el.result.hidden = true;
  el.play.hidden = true;
  el.home.hidden = false;
  renderHome();
  syncFlavor();
}

// ---------------------------------------------------------------- 打鍵

function handle(ch) {
  const r = engine.input(ch);
  if (r.ignored) {
    clicker.hit(); // 自動で埋めた分をなぞっただけ。数えない
    return;
  }
  if (r.ok) {
    clicker.hit();
    el.tip.hidden = true;
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
  if (phase === 'ready') {
    e.preventDefault();
    if (e.key === ' ' || e.key === 'Enter') beginRun();
    return;
  }
  if (counting) {
    e.preventDefault(); // 「スタート」が出るまでは受け取らない
    return;
  }

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
el.btnStart.addEventListener('click', () => start(LESSONS[0].id));
el.ready.addEventListener('click', beginRun);
el.startSub.textContent = `${LESSONS[0].title} · ${countKeystrokes(LESSONS[0].code)} 打`;
el.btnNext.addEventListener('click', () => {
  const n = nextLesson(lesson.id);
  if (n) start(n.id);
});

syncFlavor();
syncSoundButton();
renderHome();
