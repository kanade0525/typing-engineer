// トロフィーとトークン。手元のブラウザにだけ残る。
//
// サーバーは使わない。順位を competing させるとサーバーが要り、
// しかもクライアントから送る数字は必ず偽装される。
// 自分の積み上げだけなら、ごまかしても損をするのは自分だけで済む。

import { LESSONS } from './lessons.js';

const VISUAL = LESSONS.filter((l) => l.group === '見た目が変わる').map((l) => l.id);
const PATTERNS = LESSONS.filter((l) => l.group === '王道パターン').map((l) => l.id);

const clearedAll = (s, ids) => ids.every((id) => (s.cleared[id] || 0) > 0);

export const TROPHIES = [
  {
    id: 'first',
    en: { name: "First blood", hint: "Clear one stage" },
    name: '最初の一本',
    hint: 'ステージを一つクリアする',
    check: (s) => s.runs >= 1,
  },
  {
    id: 'basics',
    en: { name: "Eye for the visual", hint: "Clear all six under Make it look right" },
    name: '見た目を操る',
    hint: '「見た目が変わる」六つを全クリア',
    check: (s) => clearedAll(s, VISUAL),
  },
  {
    id: 'patterns',
    en: { name: "Bread and butter", hint: "Clear all nine under Everyday patterns" },
    name: '王道を征く',
    hint: '「王道パターン」九つを全クリア',
    check: (s) => clearedAll(s, PATTERNS),
  },
  {
    id: 'complete',
    en: { name: "Completionist", hint: "Clear every stage" },
    name: '全課題制覇',
    hint: '全ステージをクリア',
    check: (s) => clearedAll(s, LESSONS.map((l) => l.id)),
  },
  {
    id: 'flawless',
    en: { name: "Untouched", hint: "Clear a stage with no mistakes" },
    name: '無傷',
    hint: 'ノーミスでクリア',
    check: (s) => s.perfect >= 1,
  },
  {
    id: 'flawless5',
    en: { name: "Untouched five times", hint: "Clear five stages with no mistakes" },
    name: '無傷を五度',
    hint: 'ノーミスで五回クリア',
    check: (s) => s.perfect >= 5,
  },
  {
    id: 'sniper',
    en: { name: "Marksman", hint: "Clear at 98% accuracy or better" },
    name: '狙撃手',
    hint: '正確さ 98% 以上でクリア',
    check: (s) => s.bestAcc >= 98,
  },
  {
    id: 'wpm40',
    en: { name: "Forty", hint: "Reach 40 wpm" },
    name: '時速四十',
    hint: '40 wpm に届く',
    check: (s) => s.bestWpm >= 40,
  },
  {
    id: 'wpm60',
    en: { name: "Sixty", hint: "Reach 60 wpm" },
    name: '時速六十',
    hint: '60 wpm に届く',
    check: (s) => s.bestWpm >= 60,
  },
  {
    id: 'wpm80',
    en: { name: "Eighty", hint: "Reach 80 wpm" },
    name: '時速八十',
    hint: '80 wpm に届く',
    check: (s) => s.bestWpm >= 80,
  },
  {
    id: 'keys10k',
    en: { name: "Ten thousand", hint: "Ten thousand keys in total" },
    name: '一万打',
    hint: '通算一万打',
    check: (s) => s.keys >= 10000,
  },
  {
    id: 'keys100k',
    en: { name: "Hundred thousand", hint: "A hundred thousand keys in total" },
    name: '十万打',
    hint: '通算十万打',
    check: (s) => s.keys >= 100000,
  },
  {
    id: 'streak3',
    en: { name: "Three days", hint: "Type three days running" },
    name: '三日続ける',
    hint: '三日つづけて打つ',
    check: (s) => s.streak >= 3,
  },
  {
    id: 'streak7',
    en: { name: "A week", hint: "Type seven days running" },
    name: '一週間',
    hint: '七日つづけて打つ',
    check: (s) => s.streak >= 7,
  },
  {
    id: 'night',
    en: { name: "The small hours", hint: "Clear a stage between midnight and 4am" },
    name: '深夜の呼び出し',
    hint: '午前 0 時から 4 時のあいだにクリア',
    check: (s) => s.night >= 1,
  },
  {
    id: 'again',
    en: { name: "Same road five times", hint: "Clear the same stage five times" },
    name: '同じ道を五度',
    hint: '同じステージを五回クリア',
    check: (s) => Object.values(s.cleared).some((n) => n >= 5),
  },
];

/** スコアで上がる称号。上二つは映画から借りている */
export const RANKS = [
  { at: 0, name: 'ROOKIE' },
  { at: 300, name: 'CODER' },
  { at: 1200, name: 'BUILDER' },
  { at: 3000, name: 'ENGINEER' },
  { at: 8000, name: 'ARCHITECT' },
  { at: 20000, name: 'OPERATOR' },
  { at: 50000, name: 'THE ONE' },
];

export function rankOf(score) {
  let i = 0;
  while (i + 1 < RANKS.length && score >= RANKS[i + 1].at) i++;
  return { ...RANKS[i], next: RANKS[i + 1] || null };
}

/**
 * 一本ぶんの取り分。速さだけでも正確さだけでも伸びないようにする。
 * 600 打・正確さ 100%・60 wpm でおよそ 96。
 */
export function tokensFor({ keys, accuracy, wpm }) {
  return Math.max(1, Math.round((keys / 10) * (accuracy / 100) * (1 + wpm / 100)));
}

/** 連続で打った日数。今日か昨日で終わっていなければ途切れている */
export function streakOf(days) {
  if (!days.length) return 0;
  const set = new Set(days);
  const d = new Date();
  if (!set.has(dayKey(d))) {
    d.setDate(d.getDate() - 1);
    if (!set.has(dayKey(d))) return 0;
  }
  let n = 0;
  while (set.has(dayKey(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

/** 地元時間の日付。toISOString だと UTC になって日付がずれる */
export function dayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** まだ取っていないもののうち、条件を満たしたものを返す */
export function newlyEarned(stats) {
  return TROPHIES.filter((t) => !stats.earned[t.id] && t.check(stats));
}
