// matrix 配色のときだけ動く飾り。
// 一覧の背後に降る字と、Neo の画面に出たあの三行。
// 打鍵画面では止める（気が散るし、描く必要がない）。

const GLYPHS = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789';
const RABBIT = ['Wake up, Neo...', 'The Matrix has you...', 'Follow the white rabbit.'];

const still = window.matchMedia('(prefers-reduced-motion: reduce)');

export class Rain {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.drops = [];
    this.size = 15;
    this.running = false;
    this.last = 0;
    this.frame = null;
    this.onResize = () => this.layout();
  }

  layout() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = Math.floor(w * dpr);
    this.canvas.height = Math.floor(h * dpr);
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.w = w;
    this.h = h;

    const cols = Math.ceil(w / this.size);
    this.drops = Array.from({ length: cols }, () => Math.random() * -60);
    this.ctx.clearRect(0, 0, w, h);
  }

  start() {
    if (this.running || still.matches) return;
    this.running = true;
    this.canvas.hidden = false;
    this.layout();
    window.addEventListener('resize', this.onResize);
    this.frame = requestAnimationFrame((t) => this.tick(t));
  }

  stop() {
    if (!this.running) return;
    this.running = false;
    this.canvas.hidden = true;
    window.removeEventListener('resize', this.onResize);
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  tick(now) {
    if (!this.running) return;
    this.frame = requestAnimationFrame((t) => this.tick(t));

    // 毎フレーム描くほどの絵ではない。40ms ごとで十分足りる
    if (now - this.last < 40) return;
    this.last = now;

    const { ctx, size } = this;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.font = `${size}px ${getComputedStyle(document.body).getPropertyValue('--mono')}`;
    ctx.textBaseline = 'top';

    for (let i = 0; i < this.drops.length; i++) {
      const y = this.drops[i] * size;
      const ch = GLYPHS[(Math.random() * GLYPHS.length) | 0];

      ctx.fillStyle = '#d6ffcc'; // 先頭は白く光る
      ctx.fillText(ch, i * size, y);
      ctx.fillStyle = 'rgba(53, 224, 46, 0.55)';
      ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], i * size, y - size);

      this.drops[i]++;
      if (y > this.h && Math.random() > 0.975) this.drops[i] = 0;
    }
  }
}

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
