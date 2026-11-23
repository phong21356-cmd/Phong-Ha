// Web Audio API Synthesizer for Subtle Luxury Acoustic Feedback

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playChime(freq = 528, type: OscillatorType = 'sine', duration = 0.16, muted = false) {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0008, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio context restriction errors
  }
}

export function playPulseBeat(muted = false) {
  if (muted) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(72, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(38, ctx.currentTime + 0.32);
    gain.gain.setValueAtTime(0.28, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.32);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  } catch {
    // Ignore
  }
}

export function playLuxuryChord(muted = false) {
  if (muted) return;
  try {
    // Warm Maj9 architectural harp chord
    const notes = [261.63, 329.63, 392.0, 493.88, 587.33, 783.99];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playChime(freq, 'triangle', 0.65, muted);
      }, idx * 85);
    });
  } catch {
    // Ignore
  }
}

export function triggerChampagneConfetti(canvas: HTMLCanvasElement | null) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Curated warm champagne, bronze, alabaster palette (zero neon cyan)
  const colors = ['#C5A880', '#E5D3B3', '#F4F1EA', '#9A7B4F', '#D4BE98'];

  interface Particle {
    x: number;
    y: number;
    w: number;
    h: number;
    color: string;
    vx: number;
    vy: number;
    rotation: number;
    rspeed: number;
    opacity: number;
  }

  const pieces: Particle[] = [];
  for (let i = 0; i < 120; i++) {
    pieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 240,
      y: canvas.height * 0.35,
      w: Math.random() * 9 + 4,
      h: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 16,
      vy: (Math.random() - 0.85) * 14,
      rotation: Math.random() * 360,
      rspeed: (Math.random() - 0.5) * 6,
      opacity: 0.9,
    });
  }

  let animId = 0;
  function render() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    pieces.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.25;
      p.vx *= 0.985;
      p.rotation += p.rspeed;
      p.opacity -= 0.0045;

      if (p.opacity > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
    });

    if (active) {
      animId = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  render();
}
