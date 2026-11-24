import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Pause, Play, RotateCcw, Volume2, VolumeX, ChevronLeft, ChevronRight } from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { CharacterAvatar } from '../CharacterAvatar';
import { isSoundMuted, playError, playSuccess, playVictory, setSoundMuted } from '../../utils/sound';

interface Game3CatcherArcadeProps {
  bestScore: number;
  autostart?: boolean;
  onScoreUpdate: (score: number) => void;
  onBack: () => void;
}

type ArcadeState = 'title' | 'playing' | 'paused' | 'gameover';

interface PromptRound {
  prompt: string;
  correctLabels: string[];
  wrongLabels: string[];
}

const ROUNDS: PromptRound[] = [
  {
    prompt: 'Tangkap nilai VOLUME KUBUS dengan rusuk s = 4 cm!',
    correctLabels: ['64 cm³', 's × s × s'],
    wrongLabels: ['16 cm³', '48 cm³', '24 cm³'],
  },
  {
    prompt: 'Tangkap rumus atau hasil VOLUME BALOK (p=5, l=4, t=3)!',
    correctLabels: ['60 cm³', 'p × l × t'],
    wrongLabels: ['12 cm³', '30 cm³', '⅓ × p × l'],
  },
  {
    prompt: 'Tangkap RUMUS VOLUME TABUNG!',
    correctLabels: ['π × r² × t', 'Luas O × t'],
    wrongLabels: ['⅓ × π × r² × t', '⁴⁄₃ × π × r³', 's × s × s'],
  },
  {
    prompt: 'Tangkap hasil VOLUME KERUCUT jika volume tabungnya 300 cm³!',
    correctLabels: ['100 cm³', '⅓ Tabung'],
    wrongLabels: ['150 cm³', '900 cm³', '75 cm³'],
  },
];

interface FallingCrate {
  x: number;
  y: number;
  vy: number;
  w: number;
  h: number;
  label: string;
  isCorrect: boolean;
}

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export function Game3CatcherArcade({
  bestScore,
  autostart = false,
  onScoreUpdate,
  onBack,
}: Game3CatcherArcadeProps) {
  const rara = CHARACTERS.rara;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<ArcadeState>(autostart ? 'playing' : 'title');
  const [hudScore, setHudScore] = useState(0);
  const [hudHearts, setHudHearts] = useState(3);
  const [hudRound, setHudRound] = useState(0);
  const [hudCombo, setHudCombo] = useState(0);
  const [muted, setMutedState] = useState(() => isSoundMuted());

  const stateRef = useRef<ArcadeState>(gameState);
  const scoreRef = useRef(0);
  const heartsRef = useRef(3);
  const roundRef = useRef(0);
  const comboRef = useRef(0);
  const playerXRef = useRef(360);
  const keysRef = useRef<Set<string>>(new Set());
  const cratesRef = useRef<FallingCrate[]>([]);
  const spawnTimerRef = useRef(0.4);
  const particlesRef = useRef<Particle[]>(
    Array.from({ length: 40 }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      life: 0,
      color: '#10B981',
    }))
  );
  const onScoreRef = useRef(onScoreUpdate);
  onScoreRef.current = onScoreUpdate;

  // Sync body dataset state
  useEffect(() => {
    stateRef.current = gameState;
    document.body.dataset.state = gameState;
    return () => {
      delete document.body.dataset.state;
    };
  }, [gameState]);

  const startNewGame = () => {
    scoreRef.current = 0;
    heartsRef.current = 3;
    roundRef.current = 0;
    comboRef.current = 0;
    playerXRef.current = 360;
    cratesRef.current = [];
    spawnTimerRef.current = 0.4;
    keysRef.current.clear();
    setHudScore(0);
    setHudHearts(3);
    setHudRound(0);
    setHudCombo(0);
    setGameState('playing');
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  };

  // Keyboard listeners
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (stateRef.current === 'title' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        startNewGame();
        return;
      }
      if (e.key === 'Escape' || e.key === 'p' || e.key === 'P') {
        if (stateRef.current === 'playing') setGameState('paused');
        else if (stateRef.current === 'paused') setGameState('playing');
        return;
      }
      if (e.key === 'm' || e.key === 'M') {
        const next = !isSoundMuted();
        setSoundMuted(next);
        setMutedState(next);
        return;
      }
      keysRef.current.add(e.key);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    const clearKeys = () => keysRef.current.clear();

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearKeys);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearKeys);
    };
  }, []);

  // Main 60Hz Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 720;
    const H = 400;
    canvas.width = W;
    canvas.height = H;

    let animId = 0;
    let lastTime = performance.now();

    const emitParticles = (x: number, y: number, color: string) => {
      let spawned = 0;
      for (const p of particlesRef.current) {
        if (!p.active) {
          p.active = true;
          p.x = x;
          p.y = y;
          p.vx = (Math.random() - 0.5) * 180;
          p.vy = -60 - Math.random() * 120;
          p.life = 0.45;
          p.color = color;
          spawned++;
          if (spawned >= 10) break;
        }
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      if (stateRef.current === 'playing') {
        // Player movement
        const speed = 380;
        if (keysRef.current.has('ArrowLeft') || keysRef.current.has('a') || keysRef.current.has('A')) {
          playerXRef.current -= speed * dt;
        }
        if (keysRef.current.has('ArrowRight') || keysRef.current.has('d') || keysRef.current.has('D')) {
          playerXRef.current += speed * dt;
        }
        playerXRef.current = Math.max(54, Math.min(W - 54, playerXRef.current));

        // Spawn crates
        spawnTimerRef.current -= dt;
        if (spawnTimerRef.current <= 0) {
          spawnTimerRef.current = 1.25;
          const currentRound = ROUNDS[roundRef.current % ROUNDS.length];
          const isCorrect = Math.random() < 0.52;
          const pool = isCorrect ? currentRound.correctLabels : currentRound.wrongLabels;
          const label = pool[Math.floor(Math.random() * pool.length)];
          cratesRef.current.push({
            x: 65 + Math.random() * (W - 130),
            y: -28,
            vy: 115 + roundRef.current * 14,
            w: 112,
            h: 40,
            label,
            isCorrect,
          });
        }

        // Update crates & collision
        const basketTop = H - 64;
        const nextCrates: FallingCrate[] = [];
        for (const c of cratesRef.current) {
          c.y += c.vy * dt;
          const hitX = Math.abs(c.x - playerXRef.current) < c.w * 0.5 + 34;
          const hitY = c.y + c.h / 2 >= basketTop && c.y - c.h / 2 <= basketTop + 34;

          if (hitX && hitY) {
            if (c.isCorrect) {
              comboRef.current += 1;
              const pts = 25 + Math.min(25, (comboRef.current - 1) * 5);
              scoreRef.current += pts;
              setHudScore(scoreRef.current);
              setHudCombo(comboRef.current);
              onScoreRef.current(scoreRef.current);
              emitParticles(c.x, basketTop, '#10B981');
              playSuccess();

              const nextRoundIdx = Math.floor(scoreRef.current / 75);
              if (nextRoundIdx !== roundRef.current) {
                roundRef.current = nextRoundIdx;
                setHudRound(nextRoundIdx);
              }
              if (scoreRef.current >= 250) {
                playVictory();
                setGameState('gameover');
              }
            } else {
              comboRef.current = 0;
              heartsRef.current -= 1;
              setHudCombo(0);
              setHudHearts(heartsRef.current);
              emitParticles(c.x, basketTop, '#EF4444');
              playError();
              if (heartsRef.current <= 0) {
                setGameState('gameover');
              }
            }
            continue;
          }

          if (c.y < H + 40) {
            nextCrates.push(c);
          }
        }
        cratesRef.current = nextCrates;
      }

      // Update particles
      for (const p of particlesRef.current) {
        if (p.active) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.vy += 320 * dt;
          p.life -= dt;
          if (p.life <= 0) p.active = false;
        }
      }

      // Draw scene
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#F0FDFA';
      ctx.fillRect(0, 0, W, H);

      // Subtle horizon & ground
      ctx.fillStyle = '#CCFBF1';
      ctx.fillRect(0, H - 36, W, 36);
      ctx.strokeStyle = '#99F6E4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, H - 36);
      ctx.lineTo(W, H - 36);
      ctx.stroke();

      // Crates
      ctx.font = '600 14px "IBM Plex Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (const c of cratesRef.current) {
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#0F172A';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(c.x - c.w / 2, c.y - c.h / 2, c.w, c.h, 8);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#0F172A';
        ctx.fillText(c.label, c.x, c.y);
      }

      // Player (Rara's wooden catcher crate)
      const px = playerXRef.current;
      const py = H - 52;
      const bw = 124;
      ctx.fillStyle = '#EA580C';
      ctx.strokeStyle = '#7C2D12';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(px - bw / 2, py - 15, bw, 32, 8);
      ctx.fill();
      ctx.stroke();

      // Basket rim highlight
      ctx.fillStyle = '#FDBA74';
      ctx.beginPath();
      ctx.roundRect(px - bw / 2 + 4, py - 13, bw - 8, 5, 3);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 12px "Outfit", sans-serif';
      ctx.fillText('KERANJANG RARA', px, py + 5);

      // Particles
      for (const p of particlesRef.current) {
        if (!p.active) continue;
        ctx.globalAlpha = Math.max(0, p.life / 0.45);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, []);

  const currentPrompt = ROUNDS[hudRound % ROUNDS.length].prompt;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke 5 Permainan
        </button>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-slate-600">
            Skor Terbaik: <strong className="font-mono-math text-slate-900 tabular-nums">{Math.max(bestScore, hudScore)}</strong>
          </span>
          <button
            type="button"
            aria-label={muted ? 'Nyalakan suara' : 'Bisukan suara'}
            onClick={() => {
              const next = !muted;
              setSoundMuted(next);
              setMutedState(next);
            }}
            className="w-9 h-9 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {gameState === 'playing' || gameState === 'paused' ? (
            <button
              type="button"
              aria-label={gameState === 'paused' ? 'Lanjutkan permainan' : 'Jeda permainan'}
              onClick={() => setGameState((s) => (s === 'paused' ? 'playing' : 'paused'))}
              className="w-9 h-9 rounded-lg border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50"
            >
              {gameState === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          ) : null}
        </div>
      </div>

      {/* Unified Perimeter HUD + Target Prompt */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CharacterAvatar character={rara} size="sm" />
          <div>
            <p className="text-xs font-semibold text-teal-800">Misi Rara Sekarang</p>
            <p className="text-base font-bold text-slate-900">{currentPrompt}</p>
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0 font-mono-math text-sm tabular-nums">
          <div>
            <span className="text-xs text-slate-500 block">SKOR</span>
            <strong className="text-lg text-blue-700">{hudScore}</strong>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">KOMBO</span>
            <strong className="text-lg text-emerald-700">{hudCombo}x</strong>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">NYAWA</span>
            <strong className="text-lg text-rose-600">{hudHearts}/3 ♥</strong>
          </div>
        </div>
      </div>

      {/* Canvas Stage */}
      <div className="relative w-full max-w-3xl mx-auto rounded-2xl border border-slate-300 overflow-hidden bg-teal-50">
        <canvas
          ref={canvasRef}
          data-testid="catcher-canvas"
          onPointerMove={(e) => {
            if (stateRef.current !== 'playing') return;
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * 720;
            playerXRef.current = Math.max(54, Math.min(720 - 54, relX));
          }}
          className="w-full h-auto block touch-none"
        />

        {/* Title Overlay */}
        {gameState === 'title' && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4">
              <div className="flex justify-center">
                <CharacterAvatar character={rara} size="md" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">
                Tangkap Bangun & Rumus
              </h2>
              <p className="text-sm text-slate-600">
                Gerakkan keranjang Rara ke kiri dan kanan untuk menangkap jawaban yang cocok dengan misi di atas. Capai 250 poin untuk menang!
              </p>
              <button
                type="button"
                data-start="true"
                onClick={startNewGame}
                className="w-full py-2.5 px-5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                Mulai Permainan
              </button>
              <p className="text-xs text-slate-500">
                Kontrol: Panah Kiri/Kanan · A/D · Geser Mouse · P Jeda
              </p>
            </div>
          </div>
        )}

        {/* Pause Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-slate-900/65 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center space-y-4">
              <h3 className="text-xl font-bold text-slate-900">Permainan Dijeda</h3>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setGameState('playing')}
                  className="w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Lanjutkan
                </button>
                <button
                  type="button"
                  onClick={startNewGame}
                  className="w-full py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Ulangi Dari Awal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game Over / Victory Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full text-center space-y-4">
              <h3 className="text-2xl font-bold text-slate-900">
                {hudScore >= 250 ? 'Menang! Skor Sempurna!' : 'Permainan Selesai'}
              </h3>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Skor Akhir</span>
                  <strong className="text-xl font-mono-math text-blue-700 tabular-nums">{hudScore}</strong>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block">Skor Terbaik</span>
                  <strong className="text-xl font-mono-math text-slate-900 tabular-nums">
                    {Math.max(bestScore, hudScore)}
                  </strong>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  data-start="true"
                  onClick={startNewGame}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  <RotateCcw className="w-4 h-4" />
                  Main Lagi
                </button>
                <button
                  type="button"
                  onClick={onBack}
                  className="flex-1 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Touch / Accessibility Arrow Buttons */}
      <div className="flex items-center justify-center gap-4 max-w-3xl mx-auto">
        <button
          type="button"
          onPointerDown={() => keysRef.current.add('ArrowLeft')}
          onPointerUp={() => keysRef.current.delete('ArrowLeft')}
          onPointerLeave={() => keysRef.current.delete('ArrowLeft')}
          onClick={() => {
            playerXRef.current = Math.max(54, playerXRef.current - 55);
          }}
          className="flex-1 max-w-[160px] py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm flex items-center justify-center gap-1 hover:bg-slate-50"
        >
          <ChevronLeft className="w-4 h-4" />
          Geser Kiri
        </button>
        <button
          type="button"
          onPointerDown={() => keysRef.current.add('ArrowRight')}
          onPointerUp={() => keysRef.current.delete('ArrowRight')}
          onPointerLeave={() => keysRef.current.delete('ArrowRight')}
          onClick={() => {
            playerXRef.current = Math.min(720 - 54, playerXRef.current + 55);
          }}
          className="flex-1 max-w-[160px] py-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 font-semibold text-sm flex items-center justify-center gap-1 hover:bg-slate-50"
        >
          Geser Kanan
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
