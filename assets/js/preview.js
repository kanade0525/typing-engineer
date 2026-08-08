// 打った所までを描く。
//
// HTML: document.write で継ぎ足す。ブラウザが実際にページを読み込むときと
//       同じ流し込みなので、閉じタグを打つ前でも途中まで組み上がる。
//       毎回 srcdoc を入れ直すとその都度リロードが走り、ちらつく。
// CSS : 土台の HTML は置いたまま、<style> の中身だけ差し替える。
//       ちらつかず、アニメーションも動いたままになる。

const CSS_SHELL = (scaffold) =>
  `<!DOCTYPE html><html><head><meta charset="UTF-8">` +
  `<style id="sw-typed"></style></head><body>${scaffold}</body></html>`;

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
    this.mode = lesson.lang === 'css' ? 'css' : 'html';
    this.written = '';
    this.opened = false;
    this.styleEl = null;

    const doc = this.doc;
    if (!doc) return;

    if (this.mode === 'css') {
      doc.open();
      doc.write(CSS_SHELL(lesson.scaffold || ''));
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
    const doc = this.doc;
    if (!doc) return;

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
