// 打鍵の判定と集計。DOM も音も知らない。
//
// 方針: 間違えた打鍵ではカーソルを進めない。
// こうすると「打ち終わった所まで」が常に元コードの正しい前半になり、
// プレビューに壊れたコードが流れ込まない。

/** 行頭・行末の空白は自動で送る（コードのタイピングでは打たせない慣習） */
function isAutoSkippable(code, i) {
  const c = code[i];
  if (c !== ' ' && c !== '\t') return false;

  // 行頭からここまで全部が空白なら、インデントとみなす
  let j = i - 1;
  while (j >= 0 && code[j] !== '\n' && (code[j] === ' ' || code[j] === '\t')) j--;
  if (j < 0 || code[j] === '\n') return true;

  // ここから行末まで全部が空白なら、行末の余りとみなす
  let k = i;
  while (k < code.length && code[k] !== '\n') {
    if (code[k] !== ' ' && code[k] !== '\t') return false;
    k++;
  }
  return true;
}

const HEX = /[0-9a-fA-F]/;
const WORD = /[0-9a-zA-Z_-]/;

/** #1f2937 の 1f2937 にあたる部分 */
function inHex(code, i) {
  if (!HEX.test(code[i] || '')) return false;

  let s = i;
  while (s > 0 && HEX.test(code[s - 1])) s--;
  if (code[s - 1] !== '#') return false;

  let e = s;
  while (e < code.length && HEX.test(code[e])) e++;
  if (![3, 4, 6, 8].includes(e - s)) return false;

  // 続きが語なら色ではない（#id セレクタなど）
  return !(code[e] !== undefined && WORD.test(code[e]));
}

const COLOR_FN = new Set(['rgb', 'rgba', 'hsl', 'hsla']);

/** rgba(15, 23, 42, 0.14) の括弧の中と閉じ括弧 */
function inColorFn(code, i) {
  let p = i;
  let depth = 0;
  while (p > 0) {
    p--;
    const c = code[p];
    if (c === ')') depth++;
    else if (c === '(') {
      if (depth === 0) break;
      depth--;
    } else if (c === ';' || c === '{' || c === '}' || c === '\n') return false;
  }
  if (code[p] !== '(') return false;

  let s = p;
  while (s > 0 && /[a-zA-Z-]/.test(code[s - 1])) s--;
  return COLOR_FN.has(code.slice(s, p).toLowerCase());
}

/**
 * 色の値。実務でも手では打たず、コピーしてくる所。
 * #1f2937 なら # を、rgba(...) なら ( を打った時点で残りが埋まる。
 */
function isAutoFilled(code, i) {
  return inHex(code, i) || inColorFn(code, i);
}

/** 手で打つ必要のない字 */
function isAuto(code, i) {
  return isAutoSkippable(code, i) || isAutoFilled(code, i);
}

/** 実際に打つことになる字数 */
export function countKeystrokes(code) {
  let n = 0;
  for (let i = 0; i < code.length; i++) if (!isAuto(code, i)) n++;
  return n;
}

export class TypingEngine {
  constructor(code) {
    this.code = code;
    this.index = 0;
    this.strokes = 0; // 判定した打鍵の総数
    this.misses = 0;
    this.missByKey = new Map();
    this.startedAt = null;
    this.finishedAt = null;
    this.pending = ''; // 直前に自動で埋めた分。なぞって打たれても許す

    // 各位置から終わりまでに何回打つか。残りを出すのに使う
    this.rem = new Array(code.length + 1).fill(0);
    for (let i = code.length - 1; i >= 0; i--) {
      this.rem[i] = this.rem[i + 1] + (isAuto(code, i) ? 0 : 1);
    }

    this.settle();
  }

  /** 手で打たなくていい字を飛ばす */
  settle() {
    const from = this.index;
    while (this.index < this.code.length && isAuto(this.code, this.index)) {
      this.index++;
    }
    this.pending = this.code.slice(from, this.index);
  }

  /** カウントダウンが明けた瞬間から測る */
  begin() {
    if (this.startedAt == null) this.startedAt = performance.now();
  }

  get expected() {
    return this.index < this.code.length ? this.code[this.index] : null;
  }

  get typed() {
    return this.code.slice(0, this.index);
  }

  get finished() {
    return this.index >= this.code.length;
  }

  /** あと何回打つか */
  get remaining() {
    return this.rem[Math.min(this.index, this.code.length)];
  }

  /** 全部で何回打つか */
  get totalKeys() {
    return this.rem[0];
  }

  get progress() {
    return this.code.length ? this.index / this.code.length : 0;
  }

  get elapsed() {
    if (this.startedAt == null) return 0;
    return ((this.finishedAt ?? performance.now()) - this.startedAt) / 1000;
  }

  get wpm() {
    const min = this.elapsed / 60;
    if (min <= 0) return 0;
    return Math.round(this.index / 5 / min);
  }

  get accuracy() {
    if (this.strokes === 0) return 100;
    return Math.round(((this.strokes - this.misses) / this.strokes) * 100);
  }

  /** 苦手キーを多い順に返す */
  weakKeys(n = 3) {
    return [...this.missByKey.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([key, count]) => ({ key, count }));
  }

  /**
   * 一打鍵ぶん進める。
   * @param {string} char 打たれた文字（改行は '\n'）
   * @returns {{ok:boolean, from:number, to:number, finished:boolean}}
   */
  input(char) {
    if (this.finished) return { ok: false, from: this.index, to: this.index, finished: true };
    if (this.startedAt == null) this.startedAt = performance.now();

    // 自動で埋めた所を、見たままなぞって打つ人がいる。
    // それを間違い扱いにすると、埋めたことが罰になってしまう。
    if (this.pending && this.pending[0] === char) {
      this.pending = this.pending.slice(1);
      return { ok: true, ignored: true, from: this.index, to: this.index, finished: false };
    }

    const from = this.index;
    this.strokes++;

    if (char !== this.expected) {
      this.misses++;
      const label = this.expected === '\n' ? '⏎' : this.expected;
      this.missByKey.set(label, (this.missByKey.get(label) || 0) + 1);
      return { ok: false, from, to: from, finished: false };
    }

    this.index++;
    this.settle();
    if (this.finished) this.finishedAt = performance.now();
    return { ok: true, from, to: this.index, finished: this.finished };
  }
}
