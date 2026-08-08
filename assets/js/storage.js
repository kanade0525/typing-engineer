// 課題ごとの自己ベスト。手元のブラウザにだけ残る。

const KEY = 'typing-engineer:best:v1';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

export function getBest(id) {
  return readAll()[id] || null;
}

/** 更新したら true */
export function saveBest(id, record) {
  const all = readAll();
  const prev = all[id];
  if (prev && prev.wpm >= record.wpm) return false;
  all[id] = record;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    return false;
  }
  return true;
}
