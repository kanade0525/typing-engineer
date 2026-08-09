// 依存なしの小さな字句解析。文字の位置ごとに種別を返すだけで、
// 構文の正しさは見ない。色を付けるのが目的。

/**
 * @returns {{start:number,end:number,type:string}[]}
 */
export function tokenize(src, lang) {
  if (lang === 'css') return tokenizeCss(src, 0);
  if (lang === 'js') return tokenizeJs(src);
  if (lang === 'yaml') return tokenizeYaml(src);
  if (lang === 'ruby') return tokenizeRuby(src);
  return tokenizeHtml(src);
}

/** 文字位置 → 種別 の配列にならす */
export function typeMap(src, lang) {
  const types = new Array(src.length).fill('plain');
  for (const t of tokenize(src, lang)) {
    for (let i = t.start; i < t.end && i < types.length; i++) types[i] = t.type;
  }
  return types;
}

function tokenizeHtml(src) {
  const out = [];
  const push = (start, end, type) => {
    if (end > start) out.push({ start, end, type });
  };
  let i = 0;

  while (i < src.length) {
    if (src[i] !== '<') {
      const s = i;
      while (i < src.length && src[i] !== '<') i++;
      push(s, i, 'text');
      continue;
    }

    // コメント
    if (src.startsWith('<!--', i)) {
      const e = src.indexOf('-->', i + 4);
      const stop = e === -1 ? src.length : e + 3;
      push(i, stop, 'comment');
      i = stop;
      continue;
    }

    // <!DOCTYPE ...>
    if (src[i + 1] === '!') {
      const e = src.indexOf('>', i);
      const stop = e === -1 ? src.length : e + 1;
      push(i, stop, 'doctype');
      i = stop;
      continue;
    }

    // 開始タグ / 終了タグ
    let j = i + 1;
    const closing = src[j] === '/';
    if (closing) j++;
    const nameStart = j;
    while (j < src.length && /[A-Za-z0-9-]/.test(src[j])) j++;
    const name = src.slice(nameStart, j).toLowerCase();
    push(i, nameStart, 'punct');
    push(nameStart, j, 'tag');

    while (j < src.length && src[j] !== '>') {
      const c = src[j];
      if (/\s/.test(c)) {
        const s = j;
        while (j < src.length && /\s/.test(src[j])) j++;
        push(s, j, 'plain');
      } else if (c === '=' || c === '/') {
        push(j, j + 1, 'punct');
        j++;
      } else if (c === '"' || c === "'") {
        let k = j + 1;
        while (k < src.length && src[k] !== c) k++;
        const stop = Math.min(k + 1, src.length);
        push(j, stop, 'string');
        j = stop;
      } else {
        const s = j;
        while (j < src.length && !/[\s=>/'"]/.test(src[j])) j++;
        if (j === s) j++; // 念のため。ここで止まると無限ループになる
        push(s, j, 'attr');
      }
    }
    if (j < src.length) {
      push(j, j + 1, 'punct');
      j++;
    }
    i = j;

    // <style> の中身は CSS として色を付ける
    if (!closing && name === 'style') {
      const close = src.toLowerCase().indexOf('</style', i);
      const stop = close === -1 ? src.length : close;
      for (const t of tokenizeCss(src.slice(i, stop), i)) out.push(t);
      i = stop;
    }
  }
  return out;
}

function tokenizeCss(src, offset = 0) {
  const out = [];
  const push = (start, end, type) => {
    if (end > start) out.push({ start: start + offset, end: end + offset, type });
  };
  let i = 0;
  let depth = 0; // { } の深さ
  let afterColon = false; // 宣言の値を読んでいる最中か

  while (i < src.length) {
    const c = src[i];

    if (/\s/.test(c)) {
      const s = i;
      while (i < src.length && /\s/.test(src[i])) i++;
      push(s, i, 'plain');
      continue;
    }

    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      const stop = e === -1 ? src.length : e + 2;
      push(i, stop, 'comment');
      i = stop;
      continue;
    }

    if (c === '"' || c === "'") {
      let k = i + 1;
      while (k < src.length && src[k] !== c) k++;
      const stop = Math.min(k + 1, src.length);
      push(i, stop, 'string');
      i = stop;
      continue;
    }

    if (c === '{') {
      depth++;
      afterColon = false;
      push(i, i + 1, 'punct');
      i++;
      continue;
    }
    if (c === '}') {
      depth = Math.max(0, depth - 1);
      afterColon = false;
      push(i, i + 1, 'punct');
      i++;
      continue;
    }
    if (c === ';') {
      afterColon = false;
      push(i, i + 1, 'punct');
      i++;
      continue;
    }
    if (c === ':') {
      if (depth > 0) afterColon = true; // セレクタの擬似クラスは値ではない
      push(i, i + 1, 'punct');
      i++;
      continue;
    }
    if (c === ',' || c === '(' || c === ')') {
      push(i, i + 1, 'punct');
      i++;
      continue;
    }

    if (c === '@') {
      const s = i++;
      while (i < src.length && /[A-Za-z-]/.test(src[i])) i++;
      push(s, i, 'atrule');
      continue;
    }

    if (c === '#' && /[0-9A-Fa-f]/.test(src[i + 1] || '')) {
      const s = i++;
      while (i < src.length && /[0-9A-Za-z]/.test(src[i])) i++;
      push(s, i, 'number');
      continue;
    }

    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      const s = i;
      while (i < src.length && /[0-9.]/.test(src[i])) i++;
      while (i < src.length && /[a-z%]/.test(src[i])) i++;
      push(s, i, 'number');
      continue;
    }

    const s = i;
    while (i < src.length && !/[\s{};:,()]/.test(src[i])) i++;
    if (i === s) i++;
    push(s, i, depth > 0 ? (afterColon ? 'value' : 'prop') : 'selector');
  }
  return out;
}

const JS_WORDS = new Set([
  'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'of', 'in',
  'while', 'do', 'break', 'continue', 'new', 'class', 'extends', 'this', 'null',
  'undefined', 'true', 'false', 'typeof', 'instanceof', 'delete', 'void', 'try',
  'catch', 'finally', 'throw', 'switch', 'case', 'default', 'async', 'await',
  'import', 'export', 'from', 'static',
]);

function tokenizeJs(src) {
  const out = [];
  const push = (start, end, type) => {
    if (end > start) out.push({ start, end, type });
  };
  let i = 0;

  while (i < src.length) {
    const c = src[i];

    if (/\s/.test(c)) {
      const s = i;
      while (i < src.length && /\s/.test(src[i])) i++;
      push(s, i, 'plain');
      continue;
    }

    if (c === '/' && src[i + 1] === '/') {
      const s = i;
      while (i < src.length && src[i] !== '\n') i++;
      push(s, i, 'comment');
      continue;
    }

    if (c === '/' && src[i + 1] === '*') {
      const e = src.indexOf('*/', i + 2);
      const stop = e === -1 ? src.length : e + 2;
      push(i, stop, 'comment');
      i = stop;
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      let k = i + 1;
      while (k < src.length && src[k] !== c) {
        if (src[k] === '\\') k++;
        k++;
      }
      const stop = Math.min(k + 1, src.length);
      push(i, stop, 'string');
      i = stop;
      continue;
    }

    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(src[i + 1] || ''))) {
      const s = i;
      while (i < src.length && /[0-9.]/.test(src[i])) i++;
      push(s, i, 'number');
      continue;
    }

    if (/[A-Za-z_$]/.test(c)) {
      const s = i;
      while (i < src.length && /[A-Za-z0-9_$]/.test(src[i])) i++;
      const word = src.slice(s, i);

      let p = s - 1;
      while (p >= 0 && /\s/.test(src[p])) p--;
      const afterDot = src[p] === '.';

      let q = i;
      while (q < src.length && /\s/.test(src[q])) q++;
      const beforeParen = src[q] === '(';

      let type = 'plain';
      if (JS_WORDS.has(word) && !afterDot) type = 'keyword';
      else if (beforeParen) type = 'fn';
      else if (afterDot) type = 'prop';
      push(s, i, type);
      continue;
    }

    push(i, i + 1, 'punct');
    i++;
  }
  return out;
}

/** YAML。この題材に出る書き方だけ */
function tokenizeYaml(src) {
  const out = [];
  const push = (start, end, type) => {
    if (end > start) out.push({ start, end, type });
  };
  let i = 0;

  while (i < src.length) {
    const nl = src.indexOf('\n', i);
    const end = nl === -1 ? src.length : nl;
    const line = src.slice(i, end);
    const lead = line.length - line.trimStart().length;
    let p = i + lead;

    push(i, p, 'plain');

    if (line.trim().startsWith('#')) {
      push(p, end, 'comment');
    } else {
      if (src[p] === '-') {
        push(p, p + 1, 'punct');
        p += 1;
        while (p < end && src[p] === ' ') p++;
        push(i + lead + 1, p, 'plain');
      }
      const colon = src.indexOf(':', p);
      if (colon !== -1 && colon < end) {
        push(p, colon, 'prop');
        push(colon, colon + 1, 'punct');
        const rest = src.slice(colon + 1, end);
        const vs = colon + 1 + (rest.length - rest.trimStart().length);
        push(colon + 1, vs, 'plain');
        push(vs, end, /^["']/.test(src.slice(vs, end)) ? 'string' : 'value');
      } else {
        push(p, end, 'string');
      }
    }

    push(end, Math.min(end + 1, src.length), 'plain');
    i = end + 1;
  }
  return out;
}

/** Ruby。routes.rb に出る書き方だけ */
function tokenizeRuby(src) {
  const RB = new Set(['do', 'end', 'to', 'only', 'except', 'as', 'module', 'namespace', 'scope']);
  const out = [];
  const push = (start, end, type) => {
    if (end > start) out.push({ start, end, type });
  };
  let i = 0;

  while (i < src.length) {
    const c = src[i];

    if (/\s/.test(c)) {
      const s = i;
      while (i < src.length && /\s/.test(src[i])) i++;
      push(s, i, 'plain');
      continue;
    }

    if (c === '#') {
      const s = i;
      while (i < src.length && src[i] !== '\n') i++;
      push(s, i, 'comment');
      continue;
    }

    if (c === '"' || c === "'") {
      let k = i + 1;
      while (k < src.length && src[k] !== c) k++;
      const stop = Math.min(k + 1, src.length);
      push(i, stop, 'string');
      i = stop;
      continue;
    }

    if (c === ':' && /[a-zA-Z_]/.test(src[i + 1] || '')) {
      const s = i++;
      while (i < src.length && /[a-zA-Z0-9_]/.test(src[i])) i++;
      push(s, i, 'value'); // 記号（シンボル）
      continue;
    }

    if (/[A-Za-z_]/.test(c)) {
      const s = i;
      while (i < src.length && /[A-Za-z0-9_.]/.test(src[i])) i++;
      const word = src.slice(s, i);
      push(s, i, RB.has(word) ? 'keyword' : /^[A-Z]/.test(word) ? 'tag' : 'fn');
      continue;
    }

    push(i, i + 1, 'punct');
    i++;
  }
  return out;
}
