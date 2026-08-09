// 一覧に出す一行。Neo の画面に出たあの三行を順に打ち出す。
// 打鍵画面では止める（気が散る）。

const RABBIT = ['Wake up, Neo...', 'The Matrix has you...', 'Follow the white rabbit.'];

const still = window.matchMedia('(prefers-reduced-motion: reduce)');

export class Rabbit {
  constructor(el) {
    this.el = el;
    this.timer = null;
  }

  start() {
    this.stop();
    this.el.hidden = false;
    if (still.matches) {
      this.el.textContent = RABBIT[RABBIT.length - 1];
      return;
    }
    this.line = 0;
    this.pos = 0;
    this.erasing = false;
    this.step();
  }

  stop() {
    clearTimeout(this.timer);
    this.timer = null;
    this.el.hidden = true;
    this.el.textContent = '';
  }

  step() {
    const text = RABBIT[this.line];
    let wait = 62;

    if (!this.erasing) {
      this.pos++;
      if (this.pos >= text.length) {
        this.erasing = true;
        // 最後の一行は長めに残す
        wait = this.line === RABBIT.length - 1 ? 4200 : 1500;
      }
    } else {
      this.pos--;
      wait = 26;
      if (this.pos <= 0) {
        this.erasing = false;
        this.line = (this.line + 1) % RABBIT.length;
        wait = 420;
      }
    }

    this.el.textContent = text.slice(0, this.pos);
    this.timer = setTimeout(() => this.step(), wait);
  }
}
