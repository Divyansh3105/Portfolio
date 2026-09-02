/**
 * Tiny Web Audio synth for UI feedback — ported from the previous build.
 *
 * Two deliberate changes from that version: it starts *off* rather than on
 * (a portfolio that makes noise at a visitor uninvited is a portfolio they
 * close), and the choice is persisted, so someone who turns it on keeps it
 * across visits. Every tone is synthesised, so there are no audio assets to
 * download.
 */

const STORAGE_KEY = "dg:sound";

class SoundManager {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.listeners = new Set();

    if (typeof window !== "undefined") {
      try {
        this.enabled = window.localStorage.getItem(STORAGE_KEY) === "on";
      } catch {
        // Private mode or blocked storage — stay off.
      }
    }
  }

  /** The AudioContext can only be created inside a user gesture. */
  #resume() {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
    return this.ctx;
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  toggle() {
    this.enabled = !this.enabled;
    try {
      window.localStorage.setItem(STORAGE_KEY, this.enabled ? "on" : "off");
    } catch {
      // Not being able to remember the choice is not worth failing over.
    }
    this.listeners.forEach((fn) => fn(this.enabled));
    if (this.enabled) this.pluck();
    return this.enabled;
  }

  /**
   * One oscillator, one gain envelope, gone in under a tenth of a second.
   * Everything below is a variation on these four numbers.
   */
  #tone({ type, from, to, gain, duration }) {
    if (!this.enabled) return;
    try {
      const ctx = this.#resume();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      const t = ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(from, t);
      osc.frequency.exponentialRampToValueAtTime(to, t + duration);

      amp.gain.setValueAtTime(gain, t);
      amp.gain.exponentialRampToValueAtTime(0.0001, t + duration);

      osc.connect(amp).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + duration);
    } catch {
      // Autoplay policy, no audio device — never let sound break the page.
    }
  }

  hover() {
    this.#tone({ type: "sine", from: 520, to: 780, gain: 0.008, duration: 0.03 });
  }

  click() {
    this.#tone({ type: "triangle", from: 180, to: 60, gain: 0.02, duration: 0.05 });
  }

  /** The silk-thread note, used for the sound toggle and a sent message. */
  pluck() {
    this.#tone({ type: "sine", from: 580, to: 960, gain: 0.012, duration: 0.08 });
  }
}

export const sound = new SoundManager();

/** Spread onto any element that should click and chirp. */
export const sfx = {
  onMouseEnter: () => sound.hover(),
  onClick: () => sound.click(),
};
