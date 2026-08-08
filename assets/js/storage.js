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
  if (prev && prev.wpm >= record.wpm) return false;
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
  cleared: {}, // 課題ごとの打ち切った回数
  days: [], // 打った日
  earned: {}, // 取ったトロフィー → 取った日
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
export function recordRun({ lessonId, keys, accuracy, wpm, misses }) {
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

  const earned = newlyEarned(s);
  for (const t of earned) s.earned[t.id] = today;

  writeStats(s);
  return { stats: s, gained, earned };
}
