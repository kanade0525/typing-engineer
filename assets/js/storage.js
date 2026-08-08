// 自己ベストと積み上げ。手元のブラウザにだけ残る。

import { tokensFor, streakOf, dayKey, newlyEarned } from './trophies.js';

const KEY = 'typing-engineer:best:v1';
const STATS = 'typing-engineer:stats:v1';

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
  if (prev && prev.seconds != null && prev.seconds <= record.seconds) return false;
  if (prev && prev.seconds == null && prev.wpm >= record.wpm) return false;
  all[id] = record;
  try {
    localStorage.setItem(KEY, JSON.stringify(all));
  } catch {
    return false;
  }
  return true;
}

// ---------------------------------------------------------------- 積み上げ

const EMPTY = {
  runs: 0, // 打ち切った回数
  keys: 0, // 通算の打鍵数
  perfect: 0, // ミス〇で打ち切った回数
  night: 0, // 深夜に打ち切った回数
  bestWpm: 0,
  bestAcc: 0,
  tokens: 0,
  cleared: {}, // ステージごとのクリア回数
  days: [], // 打った日
  earned: {}, // 取ったアチーブメント → 取った日
  history: [], // 直近の記録。新しいものが先頭
  since: null, // はじめて打った日
};

export function getStats() {
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STATS)) || {};
  } catch {
    saved = {};
  }
  const s = { ...EMPTY, ...saved };
  s.cleared = { ...saved.cleared };
  s.earned = { ...saved.earned };
  s.days = Array.isArray(saved.days) ? saved.days : [];
  s.history = Array.isArray(saved.history) ? saved.history : [];
  s.streak = streakOf(s.days);
  return s;
}

function writeStats(s) {
  try {
    localStorage.setItem(STATS, JSON.stringify(s));
  } catch {
    /* 残せなくても遊べる */
  }
}

/**
 * 一本ぶんを記録する。
 * @returns {{stats:object, gained:number, earned:object[]}}
 */
export function recordRun({ lessonId, keys, accuracy, wpm, misses, seconds }) {
  const s = getStats();
  const today = dayKey();
  const hour = new Date().getHours();

  s.runs++;
  s.keys += keys;
  if (misses === 0) s.perfect++;
  if (hour < 4) s.night++;
  s.bestWpm = Math.max(s.bestWpm, wpm);
  s.bestAcc = Math.max(s.bestAcc, accuracy);
  s.cleared[lessonId] = (s.cleared[lessonId] || 0) + 1;
  if (!s.days.includes(today)) s.days.push(today);
  s.days = s.days.slice(-400);
  s.streak = streakOf(s.days);

  const gained = tokensFor({ keys, accuracy, wpm });
  s.tokens += gained;

  if (!s.since) s.since = today;
  s.history.unshift({ at: new Date().toISOString(), id: lessonId, seconds, wpm, accuracy, score: gained });
  s.history = s.history.slice(0, 200);

  const earned = newlyEarned(s);
  for (const t of earned) s.earned[t.id] = today;

  writeStats(s);
  return { stats: s, gained, earned };
}

// ---------------------------------------------------------------- 持ち出しと消去

/** 手元の記録をまるごと JSON にする */
export function exportAll() {
  return JSON.stringify(
    {
      app: 'typing-engineer',
      exportedAt: new Date().toISOString(),
      best: readAll(),
      stats: getStats(),
    },
    null,
    2
  );
}

/** 手元の記録をぜんぶ消す。戻せない */
export function clearAll() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(STATS);
    return true;
  } catch {
    return false;
  }
}

/** 記録の置き場所。マイページに出して隠さない */
export const STORAGE_KEYS = [KEY, STATS];

/**
 * 書き出した JSON を読み戻す。中身を確かめてから入れ替える。
 * @returns {{ok:boolean, reason?:string}}
 */
export function importAll(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, reason: 'JSON として読めませんでした' };
  }
  if (!data || data.app !== 'typing-engineer') {
    return { ok: false, reason: 'Typing Engineer の書き出しファイルではありません' };
  }
  if (typeof data.best !== 'object' || typeof data.stats !== 'object') {
    return { ok: false, reason: '中身が足りません（best と stats が要ります）' };
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(data.best || {}));
    localStorage.setItem(STATS, JSON.stringify(data.stats || {}));
  } catch {
    return { ok: false, reason: 'このブラウザに保存できませんでした' };
  }
  return { ok: true };
}
