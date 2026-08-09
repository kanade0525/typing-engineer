// 燐光の色。意匠は変えない。CSS 側は --tone 一つから全部を導いている。
// 最初の描画前に当てないと一瞬ちらつくので、index.html の <head> にも
// 同じ鍵を読むだけの小さな script を置いてある。

const KEY = 'typing-engineer:tone';

export const TONES = [
  { id: 'green', name: 'グリーン' },
  { id: 'amber', name: 'アンバー' },
  { id: 'cyan', name: 'シアン' },
  { id: 'magenta', name: 'マゼンタ' },
  { id: 'mono', name: 'モノクロ' },
  { id: 'vivid', name: 'カラフル' },
];

const IDS = TONES.map((t) => t.id);

export function currentTone() {
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    /* 使えなくても既定で動く */
  }
  return IDS.includes(saved) ? saved : 'green';
}

export function applyTone(id) {
  const tone = IDS.includes(id) ? id : 'green';
  document.documentElement.dataset.tone = tone;
  try {
    localStorage.setItem(KEY, tone);
  } catch {
    /* 残せなくても切り替えは効く */
  }
  for (const b of document.querySelectorAll('[data-tone-set]')) {
    b.setAttribute('aria-pressed', String(b.dataset.toneSet === tone));
  }
  return tone;
}

export function initTone() {
  applyTone(currentTone());
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-tone-set]');
    if (b) applyTone(b.dataset.toneSet);
  });
}
