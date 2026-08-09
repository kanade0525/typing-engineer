// 打った所までを描く。
//
// HTML: document.write で継ぎ足す。ブラウザが実際にページを読み込むときと
//       同じ流し込みなので、閉じタグを打つ前でも途中まで組み上がる。
//       毎回 srcdoc を入れ直すとその都度リロードが走り、ちらつく。
// CSS : 土台の HTML は置いたまま、<style> の中身だけ差し替える。
//       ちらつかず、アニメーションも動いたままになる。

// base は前の章までに書いたぶん。最初から効いている状態にして、
// 打つのは今の章の差分だけにする。写経が章ごとに完結する。
import { renderCompose, COMPOSE_STYLES } from './view-compose.js';
import { renderRoutes, ROUTES_STYLES } from './view-routes.js';

const CSS_SHELL = (scaffold, base) =>
  `<!DOCTYPE html><html><head><meta charset="UTF-8">` +
  `<style id="sw-base">${base || ''}</style>` +
  `<style id="sw-typed"></style></head><body>${scaffold}</body></html>`;

/**
 * JS の課題は srcdoc に流し込む。
 * document.write で継ぎ足す手は使えない。文法が途中の JS は動かないので、
 * 一字ごとに流しても意味が無いうえ、書き足すたびに二重に走ってしまう。
 *
 * sandbox について。
 *
 * allow-scripts だけにすると出所が不定のページ扱いになり、localStorage も
 * フォームの送信も使えない。保存を教える章も、追加ボタンも成立しない。
 * そこで allow-same-origin と allow-forms を足している。
 *
 * この二つを併せると、中から sandbox を外せるようになる。ふつうは避ける形。
 * ここで許しているのは、走らせるものが必ず lesson.base + lesson.code、
 * つまりこの入れ物に同梱した文字列そのものだからである。
 * 打ち手が入れた字は engine が元コードと突き合わせていて、
 * 一致しない字は先へ進まない。外から来た文字列が走ることはない。
 */
const JS_SHELL = (lesson, js) =>
  `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>` +
  `html,body{margin:0;height:100%;display:grid;place-items:center;` +
  `background:#0b1020;font-family:system-ui,sans-serif}` +
  `${lesson.styles || ''}</style></head><body>${lesson.scaffold || ''}` +
  `<script>\n${lesson.base || ''}\n${js}\n<\/script></body></html>`;

// 動かせないもの（Docker・Rails）は、打った内容を読んで意味を絵にする。
// 「打っても何も見えない」のはこの入れ物の看板に反するので。
const VIEWS = {
  yaml: { render: renderCompose, styles: COMPOSE_STYLES },
  ruby: { render: renderRoutes, styles: ROUTES_STYLES },
};

const VIEW_SHELL = (styles) =>
  `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>` +
  `body{margin:0;padding:22px;background:#f6f8fb;font-family:system-ui,sans-serif;color:#0f172a}` +
  `${styles}</style></head><body><div id="sw-view"></div></body></html>`;

export class Preview {
  constructor(iframe) {
    this.iframe = iframe;
    this.mode = 'html';
    this.written = '';
    this.opened = false;
    this.styleEl = null;
    this.onPaint = null;
  }

  get doc() {
    try {
      return this.iframe.contentDocument;
    } catch {
      return null;
    }
  }

  /** 課題を差し替える */
  mount(lesson) {
    this.mode = VIEWS[lesson.lang]
      ? 'view'
      : lesson.lang === 'css'
        ? 'css'
        : lesson.lang === 'js'
          ? 'js'
          : 'html';
    this.lesson = lesson;
    this.written = '';
    this.opened = false;
    this.styleEl = null;

    if (this.mode === 'js') {
      // 読み書きの向きが違うので、囲いごと入れ替える
      this.iframe.removeAttribute('srcdoc');
      this.iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
      this.iframe.srcdoc = JS_SHELL(lesson, '');
      return;
    }

    this.iframe.removeAttribute('srcdoc');
    this.iframe.setAttribute('sandbox', 'allow-same-origin');

    if (this.mode === 'view') {
      const doc0 = this.doc;
      if (!doc0) return;
      doc0.open();
      doc0.write(VIEW_SHELL(VIEWS[lesson.lang].styles));
      doc0.close();
      return;
    }

    const doc = this.doc;
    if (!doc) return;

    if (this.mode === 'css') {
      doc.open();
      doc.write(CSS_SHELL(lesson.scaffold || '', lesson.base));
      doc.close();
      this.styleEl = doc.getElementById('sw-typed');
    } else {
      doc.open();
      doc.write('<!DOCTYPE html><meta charset="UTF-8">');
      doc.close();
    }
  }

  /** 打った所までを流し込む */
  render(text) {
    if (this.mode === 'js') {
      if (text === this.written) return;
      this.written = text;
      this.iframe.srcdoc = JS_SHELL(this.lesson, text);
      this.onPaint?.();
      return;
    }

    const doc = this.doc;
    if (!doc) return;

    if (this.mode === 'view') {
      if (text === this.written) return;
      this.written = text;
      const root = doc.getElementById('sw-view');
      if (root) root.innerHTML = VIEWS[this.lesson.lang].render(text);
      this.onPaint?.();
      return;
    }

    if (this.mode === 'css') {
      if (text === this.written) return;
      if (!this.styleEl || !this.styleEl.isConnected) {
        this.styleEl = doc.getElementById('sw-typed');
      }
      if (this.styleEl) this.styleEl.textContent = text;
      this.written = text;
      this.onPaint?.();
      return;
    }

    // 打ち直しで短くなったら、初めから流し直す
    if (this.written && !text.startsWith(this.written)) {
      this.opened = false;
      this.written = '';
    }
    if (text === this.written) return;

    if (!this.opened) {
      doc.open(); // 開き直すと中身は消えるので、ここから全部書き直す
      this.opened = true;
      this.written = '';
    }
    doc.write(text.slice(this.written.length));
    this.written = text;
    this.onPaint?.();
  }

  /** プレビュー側の <title>。head を打っている間、目に見えて変わるのはここだけ */
  get title() {
    return this.doc?.title || '';
  }

  /** 画面に何か出ているか。<head> を打っている間はまだ何も無い */
  hasContent() {
    if (this.mode === 'js' || this.mode === 'view') return true;
    const body = this.doc?.body;
    if (!body) return false;
    return body.children.length > 0 || body.textContent.trim() !== '';
  }

  /** 打ち終わったら文書を閉じる（読み込み中のままにしない） */
  seal() {
    const doc = this.doc;
    if (!doc || this.mode !== 'html' || !this.opened) return;
    doc.close();
    this.opened = false;
  }
}
