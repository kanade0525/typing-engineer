// マイページ。記録がどこに何として残っているかを、隠さず全部出す。
//
// サーバーは無い。だから「サーバーに残っているのだろう」と思わせないよう、
// 置き場所（localStorage の鍵）まで書いて、持ち出しと消去の手段も並べる。

import { LESSONS, findLesson, lessonsByGroup } from './lessons.js';
import { TROPHIES, rankOf } from './trophies.js';
import { getBest, getStats, exportAll, clearAll, importAll, STORAGE_KEYS } from './storage.js';

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}/${p(d.getMonth() + 1)}/${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

function summary(s) {
  const rank = rankOf(s.tokens);
  const box = el('section', 'card card--rank');

  const head = el('div', 'rank');
  head.append(el('b', 'rank__name', rank.name), el('span', 'rank__score', `SCORE ${s.tokens.toLocaleString('en')}`));
  box.append(head);

  if (rank.next) {
    const need = rank.next.at - s.tokens;
    const span = rank.next.at - rank.at;
    const bar = el('div', 'rank__bar');
    const fill = el('i');
    fill.style.width = `${Math.max(2, Math.min(100, ((s.tokens - rank.at) / span) * 100))}%`;
    bar.append(fill);
    box.append(bar, el('p', 'rank__next', `次の ${rank.next.name} まで あと ${need.toLocaleString('en')}`));
  } else {
    box.append(el('p', 'rank__next', '最上位です'));
  }

  const grid = el('dl', 'tally');
  const cleared = Object.keys(s.cleared).length;
  for (const [k, v] of [
    ['CLEAR', `${s.runs}`],
    ['ステージ制覇', `${cleared} / ${LESSONS.length}`],
    ['総打鍵', s.keys.toLocaleString('en')],
    ['最速', `${s.bestWpm} wpm`],
    ['最高正確さ', `${s.bestAcc}%`],
    ['連続', `${s.streak} 日`],
    ['ノーミス', `${s.perfect} 回`],
    ['はじめた日', s.since || '—'],
  ]) {
    const d = el('div');
    d.append(el('dt', null, k), el('dd', null, v));
    grid.append(d);
  }
  box.append(grid);
  return box;
}

function stageTable(s) {
  const box = el('section', 'card');
  box.append(el('h3', 'card__head', 'ステージ別の記録'));

  const table = el('table', 'rec');
  const thead = el('thead');
  const hr = el('tr');
  for (const h of ['ステージ', 'CLEAR', 'ベスト', 'wpm', '正確さ']) hr.append(el('th', null, h));
  thead.append(hr);
  table.append(thead);

  const tbody = el('tbody');
  for (const g of lessonsByGroup()) {
    const gr = el('tr', 'is-group');
    const gc = el('td');
    gc.colSpan = 5;
    gc.textContent = g.name;
    gr.append(gc);
    tbody.append(gr);

    for (const l of g.items) {
    const best = getBest(l.id);
    const n = s.cleared[l.id] || 0;
    const tr = el('tr', n ? null : 'is-untouched');
    const name = el('td');
    name.append(el('b', null, l.title), el('small', null, l.subtitle));
    tr.append(
      name,
      el('td', 'num', n ? `${n}` : '—'),
      el('td', 'num', best && best.seconds != null ? `${best.seconds.toFixed(1)}s` : '—'),
      el('td', 'num', best ? `${best.wpm}` : '—'),
      el('td', 'num', best ? `${best.accuracy}%` : '—')
    );
    tbody.append(tr);
    }
  }
  table.append(tbody);
  box.append(table);
  return box;
}

function achievements(s) {
  const got = TROPHIES.filter((t) => s.earned[t.id]);
  const box = el('section', 'card');
  const head = el('h3', 'card__head', 'アチーブメント');
  head.append(el('span', 'card__count', `${got.length} / ${TROPHIES.length}`));
  box.append(head);

  const grid = el('div', 'trophies');
  for (const t of TROPHIES) {
    const on = Boolean(s.earned[t.id]);
    const chip = el('span', `trophy${on ? ' is-got' : ''}`);
    chip.append(el('b', null, on ? t.name : 'LOCKED'), el('small', null, t.hint));
    if (on) chip.append(el('small', 'trophy__when', `取得 ${s.earned[t.id]}`));
    grid.append(chip);
  }
  box.append(grid);
  return box;
}

function history(s) {
  const box = el('section', 'card');
  box.append(el('h3', 'card__head', '最近の記録'));

  if (!s.history.length) {
    box.append(el('p', 'empty', 'まだ記録がありません。一本クリアするとここに残ります。'));
    return box;
  }

  const table = el('table', 'rec');
  const thead = el('thead');
  const hr = el('tr');
  for (const h of ['日時', 'ステージ', 'タイム', 'wpm', '正確さ', 'SCORE']) hr.append(el('th', null, h));
  thead.append(hr);
  table.append(thead);

  const tbody = el('tbody');
  for (const r of s.history.slice(0, 20)) {
    const l = findLesson(r.id);
    const tr = el('tr');
    tr.append(
      el('td', 'when', fmtDate(r.at)),
      el('td', null, l ? l.title : r.id),
      el('td', 'num', r.seconds != null ? `${r.seconds.toFixed(1)}s` : '—'),
      el('td', 'num', `${r.wpm}`),
      el('td', 'num', `${r.accuracy}%`),
      el('td', 'num', `+${r.score}`)
    );
    tbody.append(tr);
  }
  table.append(tbody);
  box.append(table);
  return box;
}

function dataBox(onChange) {
  const box = el('section', 'card');
  box.append(el('h3', 'card__head', '記録の置き場所'));

  const p = el('p', 'data__lead');
  p.append(
    document.createTextNode('記録は '),
    el('b', null, 'このブラウザの localStorage'),
    document.createTextNode(' にだけ保存しています。サーバーには何も送っていません。別の端末やブラウザからは見えません。履歴を消すと一緒に消えます。')
  );
  box.append(p);

  const keys = el('ul', 'data__keys');
  for (const k of STORAGE_KEYS) keys.append(el('li', null, k));
  box.append(keys);

  const row = el('div', 'data__row');

  const save = el('button', 'btn', '記録を書き出す（JSON）');
  save.type = 'button';
  save.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([exportAll()], { type: 'application/json' }));
    const a = el('a');
    a.href = url;
    a.download = 'typing-engineer-record.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  const load = el('button', 'btn', '記録を読み込む（JSON）');
  load.type = 'button';
  const file = el('input');
  file.type = 'file';
  file.accept = 'application/json,.json';
  file.hidden = true;
  load.addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    const f = file.files && file.files[0];
    if (!f) return;
    if (!confirm('いまの記録を、読み込んだ内容で置き換えます。元に戻せません。よろしいですか。')) {
      file.value = '';
      return;
    }
    const res = importAll(await f.text());
    file.value = '';
    if (!res.ok) {
      alert(`読み込めませんでした。\n${res.reason}`);
      return;
    }
    onChange();
  });

  const wipe = el('button', 'btn btn--danger', 'すべて消す');
  wipe.type = 'button';
  wipe.addEventListener('click', () => {
    if (!confirm('スコア・ベストタイム・アチーブメントをすべて消します。元に戻せません。よろしいですか。')) return;
    clearAll();
    onChange();
  });

  row.append(save, load, file, wipe);
  box.append(row);
  return box;
}

export function renderMypage(root, onChange) {
  const s = getStats();
  root.replaceChildren(
    summary(s),
    stageTable(s),
    achievements(s),
    history(s),
    dataBox(onChange)
  );
}
