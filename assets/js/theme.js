// 配色。editor が既定、matrix が 2020 年の版の面影。
// 最初の描画前に当てないと一瞬ちらつくので、当てるだけの小さな script を
// index.html の <head> にも置いてある。ここと同じ鍵を読む。

const KEY = 'typing-engineer:theme';
const THEMES = ['editor', 'matrix'];

export function currentTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem(KEY);
  } catch {
    /* localStorage が使えなくても動く */
  }
  return THEMES.includes(saved) ? saved : 'editor';
}

export function applyTheme(name) {
  const theme = THEMES.includes(name) ? name : 'editor';
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {
    /* 残せなくても切り替えは効く */
  }
  for (const b of document.querySelectorAll('[data-set-theme]')) {
    b.setAttribute('aria-pressed', String(b.dataset.setTheme === theme));
  }
  return theme;
}

export function initTheme(onChange = () => {}) {
  onChange(applyTheme(currentTheme()));
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-set-theme]');
    if (b) onChange(applyTheme(b.dataset.setTheme));
  });
}
