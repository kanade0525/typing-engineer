// 配色。意匠は変えず、色だけ替える。CSS 側は :root[data-tone="…"] で変数を差し替える。
//
// 二系統ある。
//   phosphor  単色の燐光。--tone 一つから全部を導く。2020 年の版の面影
//   editor    コードの意味ごとに色を分ける。滲みと走査線は切る
// 系統は data-family として <html> に付け、CSS がまとめて拾えるようにしてある。
//
// 最初の描画前に当てないと一瞬ちらつくので、index.html の <head> にも
// 同じ鍵を読むだけの小さな script を置いてある。

import { t } from './i18n.js';

const KEY = 'typing-engineer:tone';
const DEFAULT = 'vivid';

export const TONES = [
  { id: 'vivid', family: 'editor' },
  { id: 'dracula', family: 'editor' },
  { id: 'monokai', family: 'editor' },
  { id: 'nord', family: 'editor' },
  { id: 'gruvbox', family: 'editor' },
  { id: 'tokyo', family: 'editor' },
  { id: 'green', family: 'phosphor' },
  { id: 'amber', family: 'phosphor' },
  { id: 'cyan', family: 'phosphor' },
  { id: 'magenta', family: 'phosphor' },
  { id: 'mono', family: 'phosphor' },
];

const FAMILIES = ['editor', 'phosphor'];

const byId = new Map(TONES.map((t) => [t.id, t]));

export function currentTone() {
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    /* 使えなくても既定で動く */
  }
  return byId.has(saved) ? saved : DEFAULT;
}

/** 見本の色は CSS から読む。二重に持つと必ず食い違う */
function swatchOf(id) {
  const root = document.documentElement;
  const was = root.dataset.tone;
  root.dataset.tone = id;
  const c = getComputedStyle(root).getPropertyValue('--accent').trim();
  root.dataset.tone = was;
  return c;
}

export function applyTone(id) {
  const tone = byId.get(id) || byId.get(DEFAULT);
  const root = document.documentElement;
  root.dataset.tone = tone.id;
  root.dataset.family = tone.family;
  try {
    localStorage.setItem(KEY, tone.id);
  } catch {
    /* 残せなくても切り替えは効く */
  }
  for (const b of document.querySelectorAll('[data-tone-set]')) {
    b.setAttribute('aria-pressed', String(b.dataset.toneSet === tone.id));
  }
  const name = document.getElementById('toneName');
  if (name) name.textContent = t(`tone.${tone.id}`);
  const dot = document.getElementById('toneDot');
  if (dot) dot.style.background = swatchOf(tone.id);
  return tone.id;
}

function buildMenu(menu) {
  menu.replaceChildren();
  for (const f of FAMILIES) {
    const head = document.createElement('p');
    head.className = 'tones__label';
    head.textContent = t(`tone.${f}`);
    menu.append(head);

    for (const x of TONES.filter((v) => v.family === f)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'tones__opt';
      b.dataset.toneSet = x.id;
      const dot = document.createElement('i');
      dot.style.background = swatchOf(x.id);
      const label = document.createElement('span');
      label.textContent = t(`tone.${x.id}`);
      b.append(dot, label);
      menu.append(b);
    }
  }
}

/** 言語が変わったら並べ直す */
export function relabelTones() {
  const menu = document.getElementById('tonesMenu');
  if (menu) buildMenu(menu);
  applyTone(currentTone());
}

export function initTone(onChange = () => {}) {
  const btn = document.getElementById('tonesBtn');
  const menu = document.getElementById('tonesMenu');
  if (menu) buildMenu(menu);

  onChange(applyTone(currentTone()));

  const close = () => {
    if (!menu) return;
    menu.hidden = true;
    btn?.setAttribute('aria-expanded', 'false');
  };

  document.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-tone-set]');
    if (opt) {
      onChange(applyTone(opt.dataset.toneSet));
      close();
      return;
    }
    if (btn && e.target.closest('#tonesBtn')) {
      const opening = menu.hidden;
      menu.hidden = !opening;
      btn.setAttribute('aria-expanded', String(opening));
      return;
    }
    close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
}
