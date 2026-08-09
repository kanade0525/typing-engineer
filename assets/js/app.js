import { LESSONS, SERIES, findLesson, nextLesson, lessonsByGroup, blocksOf } from './lessons.js';
import { typeMap } from './highlight.js';
import { TypingEngine, countKeystrokes } from './engine.js';
import { Preview } from './preview.js';
import { Clicker } from './sound.js';
import { getBest, saveBest, getStats, recordRun } from './storage.js';
import { TROPHIES } from './trophies.js';
import { Rain, Rabbit } from './matrix.js';
import { renderMypage } from './mypage.js';
import { initTone } from './tone.js';
import { rankOf } from './trophies.js';

const $ = (id) => document.getElementById(id);

const el = {
  home: $('screenHome'),
  play: $('screenPlay'),
  mypageScreen: $('screenMypage'),
  mypage: $('mypage'),
  nav: $('nav'),
  navRank: $('navRank'),
  navScore: $('navScore'),
  lessonList: $('lessonList'),
  fileName: $('fileName'),
  lessonLabel: $('lessonLabel'),
  lessonSub: $('lessonSub'),
  code: $('code'),
  preview: $('preview'),
  previewHint: $('previewHint'),
  previewLive: $('previewLive'),
  previewTitle: $('previewTitle'),
  previewGoal: $('previewGoal'),
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
  progressLine: $('progressLine'),
  progressKeys: $('progressKeys'),
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
  homeRank: $('homeRank'),
  tip: $('tip'),
  btnStart: $('btnStart'),
  btnSound: $('btnSound'),
  btnGoal: $('btnGoal'),
  soundIco: $('soundIco'),
  btnRetry: $('btnRetry'),
  btnBack: $('btnBack'),
  btnNext: $('btnNext'),
  btnAgain: $('btnAgain'),
  btnHome: $('btnHome'),
  btnShare: $('btnShare'),
  btnCopy: $('btnCopy'),
  btnSave: $('btnSave'),
  btnPlay: $('btnPlay'),
};

const clicker = new Clicker();
const preview = new Preview(el.preview);
const rain = new Rain($('rain'));
const rabbit = new Rabbit($('rabbit'));
let flavorOn = false;

/** Matrix の飾り。緑を選んで一覧にいるときだけ */
function syncFlavor() {
  const want =
    state === 'home' && !el.home.hidden && document.documentElement.dataset.tone === 'green';
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
let jsTimer = null;
let showingGoal = false;
let activeRow = null;
let totalLines = 1;
let ticker = null;
let toastTimer = null;
let liveTimer = null;
let phase = 'ready'; // 'ready' → 'count' → 'play'
let counting = false;
let countTimer = null;
let bestSeconds = null;
let lastResult = null;
let lastLesson = null;

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
  const got = TROPHIES.filter((t) => s.earned[t.id]).length;

  el.tokenTotal.textContent = s.tokens.toLocaleString('en');
  el.homeRank.textContent = rankOf(s.tokens).name;

  const rows = [
    ['CLEAR', `${s.runs}`],
    ['アチーブメント', `${got} / ${TROPHIES.length}`],
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
}

/** 作品の札。章はその中の段取りとして並べる */
function seriesCard(b) {
  const card = document.createElement('article');
  card.className = `series series--${b.items[0].lang}`;

  const keys = b.items.reduce((n, l) => n + countKeystrokes(l.code), 0);
  const cleared = b.items.filter((l) => getBest(l.id)).length;

  const head = document.createElement('header');
  head.className = 'series__head';
  head.innerHTML =
    `<span class="lesson__lang">${b.items[0].lang.toUpperCase()}</span>` +
    `<span class="series__n">全 ${b.items.length} 章 · ${keys.toLocaleString('en')} 打</span>`;

  const title = document.createElement('h3');
  title.className = 'series__title';
  title.textContent = b.headline;

  const goal = document.createElement('p');
  goal.className = 'series__goal';
  goal.textContent = b.goal;

  const steps = document.createElement('ol');
  steps.className = 'steps';
  for (const l of b.items) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `step${getBest(l.id) ? ' is-cleared' : ''}`;
    btn.dataset.id = l.id;
    btn.innerHTML =
      `<span class="step__name">${l.title}</span>` +
      `<span class="step__keys">${countKeystrokes(l.code)} 打</span>`;
    li.append(btn);
    steps.append(li);
  }

  const foot = document.createElement('p');
  foot.className = 'series__foot';
  foot.textContent = cleared === b.items.length ? '全章クリア' : `クリア ${cleared} / ${b.items.length}`;

  card.append(head, title, goal, steps, foot);
  return card;
}

function renderHome() {
  const frag = document.createDocumentFragment();

  for (const group of lessonsByGroup()) {
    const blocks = blocksOf(group.items);
    const isSeries = blocks.every((b) => b.series);

    const section = document.createElement('section');
    section.className = 'group';

    const head = document.createElement('h2');
    head.className = 'group__name';
    const count = isSeries ? `${blocks.length} 作品` : `${group.items.length}`;
    head.innerHTML = `${group.name}<span class="group__count">${count}</span>`;

    const grid = document.createElement('div');
    grid.className = isSeries ? 'lessons lessons--series' : 'lessons';
    for (const b of blocks) grid.append(b.series ? seriesCard(b) : lessonCard(b.items[0]));

    section.append(head, grid);
    frag.append(section);
  }

  el.lessonList.replaceChildren(frag);
  renderShelf();
}

el.lessonList.addEventListener('click', (e) => {
  const card = e.target.closest('.lesson, .step');
  if (card) location.hash = `#/play/${card.dataset.id}`;
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
  totalLines = rows.length;
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

/** 出来上がりを右に出す。何を作るのか分からないまま打ち始めるのは辛い */
function showGoal(on) {
  showingGoal = on;
  el.btnGoal.setAttribute('aria-pressed', String(on));
  el.previewGoal.hidden = !on;
  el.previewHint.hidden = true;
  preview.mount(lesson);
  preview.render(on ? lesson.code : engine ? engine.typed : '');
  if (!on) syncPreviewChrome();
}

/** プレビュー側の見出し（<title>）と、まだ何も出ていないときの案内 */
function syncPreviewChrome() {
  el.previewTitle.textContent = preview.title;
  el.previewHint.hidden = preview.hasContent();
}

function queuePreview() {
  if (showingGoal) return;

  // JS は文法が通るまで走らせない。途中の状態を流しても意味が無いし、
  // 一字ごとに動かすと遊べたものではない。打つ手が止まったら流す。
  if (lesson.lang === 'js') {
    clearTimeout(jsTimer);
    jsTimer = setTimeout(() => {
      const text = engine.typed;
      try {
        new Function(text); // 走らせずに文法だけ見る
      } catch {
        return;
      }
      preview.render(text);
    }, 420);
    return;
  }

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

  const line = (lineOf[Math.min(engine.index, lineOf.length - 1)] ?? 0) + 1;
  el.progressLine.textContent = `${line} / ${totalLines} 行`;
  el.progressKeys.textContent = engine.finished
    ? 'できあがり'
    : `残り ${engine.remaining} 打`;

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
  const s = lesson.series ? SERIES[lesson.series] : null;
  el.readyFile.textContent = s ? `${s.name} — ${lesson.file}` : lesson.file;
  el.readyTitle.textContent = lesson.title;
  el.readyMeta.textContent =
    `${countKeystrokes(lesson.code)} 打` +
    (best && best.seconds != null ? `　ベスト ${best.seconds.toFixed(1)} 秒` : '');
  el.ready.hidden = false;
}

function beginRun() {
  if (phase !== 'ready') return;
  el.ready.hidden = true;
  showGoal(false); // ここから自分で組み上げる
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
  clearTimeout(jsTimer);
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
  const series = lesson.series ? SERIES[lesson.series] : null;
  el.lessonLabel.textContent = series ? `${series.name} ／ ${lesson.title}` : lesson.title;
  el.lessonSub.textContent = lesson.subtitle;
  el.result.hidden = true;
  el.toast.hidden = true;
  el.tip.hidden = false;
  el.code.classList.remove('is-done');

  buildCode();
  showGoal(true); // 待っているあいだは出来上がりを見せる

  el.home.hidden = true;
  el.mypageScreen.hidden = true;
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

  clearTimeout(jsTimer);
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
    seconds,
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

  lastLesson = lesson;
  lastResult = {
    id: lesson.id,
    title: lesson.title,
    seconds,
    wpm: engine.wpm,
    accuracy: engine.accuracy,
  };

  el.btnPlay.hidden = lesson.lang !== 'js';
  el.result.hidden = false;
  el.btnNext.focus();
}

function leavePlay() {
  clearInterval(ticker);
  ticker = null;
  stopCountdown();
  engine = null;
  el.result.hidden = true;
  el.play.hidden = true;
}

function goHome() {
  location.hash = '#/';
}

const SITE = 'Typing Engineer';

/** 画面が変わったら題も変える。履歴とタブで何を見ていたか分かるように */
function setTitle(path) {
  if (path.startsWith('/play/')) {
    const l = findLesson(decodeURIComponent(path.slice(6)));
    document.title = l ? `${l.title} — ${SITE}` : SITE;
  } else if (path === '/mypage') {
    document.title = `マイページ — ${SITE}`;
  } else {
    document.title = `${SITE} — 打つほど、ページができあがる`;
  }
}

function syncNav(path) {
  const s = getStats();
  const rank = rankOf(s.tokens);
  el.navRank.textContent = rank.name;
  el.navScore.textContent = `SCORE ${s.tokens.toLocaleString('en')}`;
  el.nav.hidden = path.startsWith('/play/');
  for (const a of el.nav.querySelectorAll('[data-nav]')) {
    a.classList.toggle('is-on', a.dataset.nav === path);
  }
}

function showHome() {
  leavePlay();
  state = 'home';
  el.mypageScreen.hidden = true;
  el.home.hidden = false;
  renderHome();
  syncFlavor();
}

function showMypage() {
  leavePlay();
  state = 'home'; // 打鍵は受け取らない
  el.home.hidden = true;
  el.mypageScreen.hidden = false;
  renderMypage(el.mypage, () => route());
  syncFlavor();
  window.scrollTo(0, 0);
}

/** 画面は URL で決まる。戻るボタンと共有が効くようにするため */
function route() {
  const path = (location.hash || '#/').slice(1) || '/';
  syncNav(path);
  setTitle(path);

  if (path.startsWith('/play/')) {
    const id = decodeURIComponent(path.slice(6));
    if (findLesson(id)) {
      el.mypageScreen.hidden = true;
      start(id);
      return;
    }
    location.replace('#/');
    return;
  }

  if (path === '/mypage') {
    showMypage();
    return;
  }
  showHome();
}

window.addEventListener('hashchange', route);

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

/** 同じ列の上下の行で、いちばん近いカードを探す */
function cardAbove(cards, i, dir) {
  if (i < 0) return 0;
  const here = cards[i].getBoundingClientRect();
  const rows = cards.filter((c) => {
    const b = c.getBoundingClientRect();
    return dir > 0 ? b.top > here.top + 4 : b.top < here.top - 4;
  });
  if (!rows.length) return i;

  const tops = rows.map((c) => c.getBoundingClientRect().top);
  const target = dir > 0 ? Math.min(...tops) : Math.max(...tops);
  const row = rows.filter((c) => Math.abs(c.getBoundingClientRect().top - target) < 4);

  let best = row[0];
  let near = Infinity;
  for (const c of row) {
    const d = Math.abs(c.getBoundingClientRect().left - here.left);
    if (d < near) {
      near = d;
      best = c;
    }
  }
  return cards.indexOf(best);
}

/** 一覧は矢印キーで選べる。Enter は button が自分で受ける */
function homeKeys(e) {
  if (el.home.hidden) return;
  const cards = [...el.lessonList.querySelectorAll('.lesson')];
  if (!cards.length) return;

  const i = cards.indexOf(document.activeElement);
  let to = -1;
  if (e.key === 'ArrowRight') to = i < 0 ? 0 : Math.min(cards.length - 1, i + 1);
  else if (e.key === 'ArrowLeft') to = i <= 0 ? 0 : i - 1;
  else if (e.key === 'ArrowDown') to = cardAbove(cards, i, 1);
  else if (e.key === 'ArrowUp') to = cardAbove(cards, i, -1);
  else return;

  e.preventDefault();
  cards[to].focus();
  cards[to].scrollIntoView({ block: 'nearest' });
}

window.addEventListener('keydown', (e) => {
  if (state === 'home' && !e.metaKey && !e.ctrlKey && !e.altKey) {
    homeKeys(e);
    return;
  }
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
el.btnGoal.addEventListener('click', () => showGoal(!showingGoal));
el.btnRetry.addEventListener('click', () => start(lesson.id));
el.btnBack.addEventListener('click', goHome);
el.btnAgain.addEventListener('click', () => start(lesson.id));
el.btnHome.addEventListener('click', goHome);

/** 結果を外へ。端末が持っていれば共有画面、無ければ X の投稿画面を開く。
    どちらも最後に人が押さないと出ていかない */
el.btnShare.addEventListener('click', () => {
  if (!lastResult) return;
  const url = `${location.origin}${location.pathname}#/play/${lastResult.id}`;
  const text =
    `Typing Engineer で「${lastResult.title}」を ` +
    `${lastResult.seconds.toFixed(1)}秒・正確さ ${lastResult.accuracy}% でクリアしました。`;

  // どちらに行くかはここで決め切る。await を挟んでから window.open を呼ぶと
  // 「利用者の操作ではない」と見なされて塞がれる。
  const payload = { title: SITE, text, url };
  if (typeof navigator.share === 'function' && (navigator.canShare?.(payload) ?? true)) {
    // 閉じられた（AbortError）ときは何もしない。X を勝手に開かない
    navigator.share(payload).catch(() => {});
    return;
  }

  window.open(
    `https://x.com/intent/post?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    '_blank',
    'noopener'
  );
});
el.btnStart.addEventListener('click', () => {
  location.hash = `#/play/${LESSONS[0].id}`;
});
el.ready.addEventListener('click', beginRun);
el.startSub.textContent = `${LESSONS[0].title} · ${countKeystrokes(LESSONS[0].code)} 打`;
el.btnNext.addEventListener('click', () => {
  const n = nextLesson(lesson.id);
  if (n) location.hash = `#/play/${n.id}`;
});

/** 打ち終えたコードを、そのままブラウザで開ける一枚にする */
function buildPage(l) {
  if (l.lang === 'js') {
    return (
      `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n` +
      `<title>${l.title}</title>\n<style>\n${l.styles || ''}</style>\n</head>\n<body>\n` +
      `${l.scaffold || ''}\n<script>\n${l.base || ''}\n${l.code}<\/script>\n</body>\n</html>\n`
    );
  }
  if (l.lang !== 'css') return l.code;
  return (
    `<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n` +
    `<title>${l.title}</title>\n<style>\n${l.base || ''}${l.code}</style>\n</head>\n<body>\n` +
    `${l.scaffold || ''}\n</body>\n</html>\n`
  );
}

function flash(btn, text) {
  const was = btn.textContent;
  btn.textContent = text;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = was;
    btn.disabled = false;
  }, 1600);
}

/** 打ち上げたものを実際に触る。焦点を中へ移すので、打鍵はこちらに届かなくなる */
el.btnPlay.addEventListener('click', () => {
  el.result.hidden = true;
  el.preview.focus();
});

el.btnCopy.addEventListener('click', async () => {
  if (!lastLesson) return;
  try {
    await navigator.clipboard.writeText(lastLesson.code);
    flash(el.btnCopy, 'コピーしました');
  } catch {
    flash(el.btnCopy, 'コピーできませんでした');
  }
});

el.btnSave.addEventListener('click', () => {
  if (!lastLesson) return;
  const name = lastLesson.lang === 'css' ? `${lastLesson.id}.html` : lastLesson.file;
  const url = URL.createObjectURL(new Blob([buildPage(lastLesson)], { type: 'text/html' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  flash(el.btnSave, `${name} を保存`);
});

initTone(syncFlavor);
syncSoundButton();
route();
