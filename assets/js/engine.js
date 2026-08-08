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

/** 実際に打つことになる字数（自動で送る空白を除く） */
export function countKeystrokes(code) {
  let n = 0;
  for (let i = 0; i < code.length; i++) if (!isAutoSkippable(code, i)) n++;
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
    this.settle();
  }

  /** 自動で送れる文字を飛ばす */
  settle() {
    while (this.index < this.code.length && isAutoSkippable(this.code, this.index)) {
      this.index++;
    }
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
