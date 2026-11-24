let audioCtx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (muted || typeof window === 'undefined') return null;
  if (!audioCtx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (Ctx) {
      audioCtx = new Ctx();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundMuted(): boolean {
  return muted;
}

export function setSoundMuted(next: boolean): void {
  muted = next;
}

export function playTone(freq: number, duration = 0.09, type: OscillatorType = 'sine', volume = 0.08): void {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors in headless environments
  }
}

export function playClick(): void {
  playTone(520, 0.05, 'triangle', 0.05);
}

export function playSuccess(): void {
  const ctx = getCtx();
  if (!ctx) return;
  playTone(523.25, 0.09, 'sine', 0.08);
  setTimeout(() => playTone(659.25, 0.12, 'sine', 0.08), 70);
}

export function playError(): void {
  playTone(220, 0.14, 'sawtooth', 0.05);
}

export function playVictory(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, i) => {
    setTimeout(() => playTone(n, 0.16, 'triangle', 0.08), i * 95);
  });
}
