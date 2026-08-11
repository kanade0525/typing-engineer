// マイページ。記録がどこに何として残っているかを、隠さず全部出す。
//
// サーバーは無い。だから「サーバーに残っているのだろう」と思わせないよう、
// 置き場所（localStorage の鍵）まで書いて、持ち出しと消去の手段も並べる。

import { LESSONS, SERIES, findLesson, lessonsByGroup, blocksOf } from './lessons.js';
import { TROPHIES, rankOf } from './trophies.js';
import { getBest, getStats, exportAll, clearAll, importAll, STORAGE_KEYS } from './storage.js';
import { t, pick } from './i18n.js';

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
    box.append(bar, el('p', 'rank__next', t('my.toNext', { name: rank.next.name, n: need.toLocaleString('en') })));
  } else {
    box.append(el('p', 'rank__next', t('my.top')));
  }

  const grid = el('dl', 'tally');
  const cleared = Object.keys(s.cleared).length;
  for (const [k, v] of [
    [t('my.clear'), `${s.runs}`],
    [t('my.stages'), `${cleared} / ${LESSONS.length}`],
    [t('my.keys'), s.keys.toLocaleString('en')],
    [t('my.fastest'), `${s.bestWpm} wpm`],
    [t('my.bestAcc'), `${s.bestAcc}%`],
    [t('my.streak'), t('my.days', { n: s.streak })],
    [t('my.perfect'), t('my.times', { n: s.perfect })],
    [t('my.since'), s.since || '—'],
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
  box.append(el('h3', 'card__head', t('my.stageTable')));

  const table = el('table', 'rec');
  const thead = el('thead');
  const hr = el('tr');
  for (const h of [t('th.stage'), t('my.clear'), t('th.best'), 'wpm', t('result.acc')]) hr.append(el('th', null, h));
  thead.append(hr);
  table.append(thead);

  const tbody = el('tbody');

  const line = (label, cls) => {
    const tr = el('tr', cls);
    const td = el('td');
    td.colSpan = 5;
    td.textContent = label;
    tr.append(td);
    tbody.append(tr);
  };

  const row = (l, step) => {
    const best = getBest(l.id);
    const n = s.cleared[l.id] || 0;
    const tr = el('tr', n ? null : 'is-untouched');
    const name = el('td', step ? 'is-step' : null);
    name.append(el('b', null, pick(l, 'title')), el('small', null, pick(l, 'subtitle')));
    tr.append(
      name,
      el('td', 'num', n ? `${n}` : '—'),
      el('td', 'num', best && best.seconds != null ? `${best.seconds.toFixed(1)}s` : '—'),
      el('td', 'num', best ? `${best.wpm}` : '—'),
      el('td', 'num', best ? `${best.accuracy}%` : '—')
    );
    tbody.append(tr);
  };

  for (const g of lessonsByGroup()) {
    line(t('group.' + g.name), 'is-group');

    for (const b of blocksOf(g.items)) {
      if (!b.series) {
        row(b.items[0], false);
        continue;
      }
      // 作品はひとまとまりで見せる。章はその下に
      const done = b.items.filter((l) => getBest(l.id)).length;
      line(`${pick(b, 'headline')}　—　${t('my.chapters', { done, all: b.items.length })}`, 'is-series');
      for (const l of b.items) row(l, true);
    }
  }
  table.append(tbody);
  box.append(table);
  return box;
}

function achievements(s) {
  const got = TROPHIES.filter((t) => s.earned[t.id]);
  const box = el('section', 'card');
  const head = el('h3', 'card__head', t('my.trophies'));
  head.append(el('span', 'card__count', `${got.length} / ${TROPHIES.length}`));
  box.append(head);

  const grid = el('div', 'trophies');
  for (const tr of TROPHIES) {
    const on = Boolean(s.earned[tr.id]);
    const chip = el('span', `trophy${on ? ' is-got' : ''}`);
    chip.append(el('b', null, on ? pick(tr, 'name') : t('my.locked')), el('small', null, pick(tr, 'hint')));
    if (on) chip.append(el('small', 'trophy__when', t('my.got', { date: s.earned[tr.id] })));
    grid.append(chip);
  }
  box.append(grid);
  return box;
}

function history(s) {
  const box = el('section', 'card');
  box.append(el('h3', 'card__head', t('my.history')));

  if (!s.history.length) {
    box.append(el('p', 'empty', t('my.noHistory')));
    return box;
  }

  const table = el('table', 'rec');
  const thead = el('thead');
  const hr = el('tr');
  for (const h of [t('th.when'), t('th.stage'), t('th.best'), 'wpm', t('result.acc'), 'SCORE']) hr.append(el('th', null, h));
  thead.append(hr);
  table.append(thead);

  const tbody = el('tbody');
  for (const r of s.history.slice(0, 20)) {
    const l = findLesson(r.id);
    const tr = el('tr');
    tr.append(
      el('td', 'when', fmtDate(r.at)),
      el('td', null, l ? pick(l, 'title') : r.id),
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
  box.append(el('h3', 'card__head', t('my.storage')));

  const p = el('p', 'data__lead');
  p.innerHTML = t('my.storageLead');
  box.append(p);

  const keys = el('ul', 'data__keys');
  for (const k of STORAGE_KEYS) keys.append(el('li', null, k));
  box.append(keys);

  const row = el('div', 'data__row');

  const save = el('button', 'btn', t('my.export'));
  save.type = 'button';
  save.addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([exportAll()], { type: 'application/json' }));
    const a = el('a');
    a.href = url;
    a.download = 'typing-engineer-record.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  const load = el('button', 'btn', t('my.import'));
  load.type = 'button';
  const file = el('input');
  file.type = 'file';
  file.accept = 'application/json,.json';
  file.hidden = true;
  load.addEventListener('click', () => file.click());
  file.addEventListener('change', async () => {
    const f = file.files && file.files[0];
    if (!f) return;
    if (!confirm(t('my.importAsk'))) {
      file.value = '';
      return;
    }
    const res = importAll(await f.text());
    file.value = '';
    if (!res.ok) {
      alert(`${t('my.importFail')}\n${res.reason}`);
      return;
    }
    onChange();
  });

  const wipe = el('button', 'btn btn--danger', t('my.wipe'));
  wipe.type = 'button';
  wipe.addEventListener('click', () => {
    if (!confirm(t('my.wipeAsk'))) return;
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
