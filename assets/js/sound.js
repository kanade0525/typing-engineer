// 打鍵音。音声ファイルは持たず、その場で合成する。
// 昔の版は base64 の wav を 2 本ソースに埋めていて、コードの見通しを悪くしていた。

const KEY = 'typing-engineer:sound';

export class Clicker {
  constructor() {
    this.enabled = localStorage.getItem(KEY) !== 'off';
    this.ctx = null;
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem(KEY, this.enabled ? 'on' : 'off');
    if (this.enabled) this.hit();
    return this.enabled;
  }

  /** 音は利用者の操作のあとでしか鳴らせないので、初回の打鍵で作る */
  ensure() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    this.ctx = new AC();
    return this.ctx;
  }

  blip({ freq, type, dur, gain, drop = 0 }) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (drop) osc.frequency.exponentialRampToValueAtTime(Math.max(40, freq - drop), t + dur);

    amp.gain.setValueAtTime(0.0001, t);
    amp.gain.exponentialRampToValueAtTime(gain, t + 0.004);
    amp.gain.exponentialRampToValueAtTime(0.0001, t + dur);

    osc.connect(amp).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  hit() {
    this.blip({ freq: 1180, type: 'triangle', dur: 0.035, gain: 0.05, drop: 400 });
  }

  miss() {
    this.blip({ freq: 190, type: 'sawtooth', dur: 0.09, gain: 0.045 });
  }

  done() {
    if (!this.enabled) return;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      setTimeout(
        () => this.blip({ freq: f, type: 'triangle', dur: 0.16, gain: 0.055 }),
        i * 90
      );
    });
  }
}
