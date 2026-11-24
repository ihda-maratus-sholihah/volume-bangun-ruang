import { useState } from 'react';
import { ArrowLeft, CheckCircle2, RotateCcw, Plus, Minus } from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { CharacterAvatar } from '../CharacterAvatar';
import { checkCubeLevelMatch, CUBE_LEVELS, sumGridVolume } from '../../utils/gameLogic';
import { playClick, playError, playSuccess, playVictory } from '../../utils/sound';

interface Game1CubeBuilderProps {
  bestScore: number;
  onScoreUpdate: (score: number) => void;
  onBack: () => void;
}

function createEmptyGrid(size = 4): number[][] {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function IsoCubeStack({ x, y, height, onAdd, onRemove }: {
  x: number;
  y: number;
  height: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-2 flex flex-col items-center justify-between gap-1.5">
      <span className="text-[11px] font-mono-math text-slate-400">
        ({x + 1},{y + 1})
      </span>

      {/* Visual stacked cubes */}
      <div className="h-16 w-full flex flex-col-reverse items-center justify-start gap-0.5 overflow-hidden">
        {Array.from({ length: height }).map((_, idx) => (
          <div
            key={idx}
            className="w-8 h-3 rounded-sm bg-blue-500 border border-blue-700 shadow-xs"
          />
        ))}
        {height === 0 && (
          <div className="w-8 h-3 rounded-sm border border-dashed border-slate-300" />
        )}
      </div>

      <div className="flex items-center gap-1.5 w-full justify-center">
        <button
          type="button"
          onClick={onRemove}
          disabled={height === 0}
          aria-label={`Kurangi kubus di posisi ${x + 1},${y + 1}`}
          className="w-7 h-7 rounded-md border border-slate-300 bg-slate-50 text-slate-700 flex items-center justify-center hover:bg-slate-100 disabled:opacity-35"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="font-mono-math text-sm font-bold text-slate-900 w-5 text-center tabular-nums">
          {height}
        </span>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`Tambah kubus di posisi ${x + 1},${y + 1}`}
          className="w-7 h-7 rounded-md border border-blue-600 bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export function Game1CubeBuilder({ bestScore, onScoreUpdate, onBack }: Game1CubeBuilderProps) {
  const kiko = CHARACTERS.kiko;
  const [levelIdx, setLevelIdx] = useState(0);
  const [grid, setGrid] = useState<number[][]>(() => createEmptyGrid(4));
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'warn' | 'err'; text: string } | null>(null);
  const [finished, setFinished] = useState(false);

  const level = CUBE_LEVELS[levelIdx];
  const currentTotal = sumGridVolume(grid);

  const updateCell = (y: number, x: number, delta: number) => {
    playClick();
    setFeedback(null);
    setGrid((prev) =>
      prev.map((row, ry) =>
        row.map((val, rx) => {
          if (ry !== y || rx !== x) return val;
          return Math.max(0, Math.min(level.maxHeight, val + delta));
        })
      )
    );
  };

  const handleCheck = () => {
    const res = checkCubeLevelMatch(grid, level);
    if (res.isExactShape) {
      const gained = 50;
      const nextScore = score + gained;
      setScore(nextScore);
      onScoreUpdate(nextScore);
      if (levelIdx + 1 >= CUBE_LEVELS.length) {
        playVictory();
        setFinished(true);
        setFeedback({ type: 'ok', text: `Luar biasa! Semua 5 proyek arsitektur kubus selesai! (+${gained} poin)` });
      } else {
        playSuccess();
        setFeedback({ type: 'ok', text: `Tepat sekali! Susunan ${level.targetP}×${level.targetL}×${level.targetT} bernilai ${level.targetVolume} kubus satuan. (+${gained} poin)` });
      }
    } else if (res.isVolumeOnly) {
      playError();
      setFeedback({
        type: 'warn',
        text: `Jumlah kubus sudah ${res.totalCubes}, tetapi bentuknya belum rapi ${level.targetP} × ${level.targetL} × ${level.targetT}. Rapikan alas dan tingginya ya!`,
      });
    } else {
      playError();
      setFeedback({
        type: 'err',
        text: `Jumlah kubus masih ${res.totalCubes} satuan. Target proyek ini adalah ${level.targetVolume} kubus satuan (${level.targetP}×${level.targetL}×${level.targetT}).`,
      });
    }
  };

  const handleNextLevel = () => {
    playClick();
    setLevelIdx((i) => i + 1);
    setGrid(createEmptyGrid(4));
    setFeedback(null);
  };

  const handleRestart = () => {
    playClick();
    setLevelIdx(0);
    setScore(0);
    setGrid(createEmptyGrid(4));
    setFeedback(null);
    setFinished(false);
  };

  // Isometric SVG preview of built cubes
  const isoCubes: { x: number; y: number; z: number }[] = [];
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      for (let z = 0; z < grid[y][x]; z++) {
        isoCubes.push({ x, y, z });
      }
    }
  }
  isoCubes.sort((a, b) => a.x + a.y + a.z - (b.x + b.y + b.z));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke 5 Permainan
        </button>

        <div className="flex items-center gap-6 text-sm">
          <span className="text-slate-600">
            Proyek: <strong className="font-mono-math text-slate-900 tabular-nums">{levelIdx + 1}/{CUBE_LEVELS.length}</strong>
          </span>
          <span className="text-slate-600">
            Skor: <strong className="font-mono-math text-blue-700 tabular-nums">{score}</strong>
          </span>
          <span className="text-slate-600">
            Terbaik: <strong className="font-mono-math text-slate-900 tabular-nums">{Math.max(bestScore, score)}</strong>
          </span>
        </div>
      </div>

      {/* Character Prompt Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <CharacterAvatar character={kiko} size="md" />
        <div className="space-y-1 flex-1">
          <p className="text-xs font-semibold text-amber-800">
            {kiko.name} · Proyek {level.level}: {level.title}
          </p>
          <h2 className="text-xl font-bold text-slate-900">{level.prompt}</h2>
          <p className="text-xs text-slate-600">
            Klik tombol + atau − di tiap kotak lantai untuk menumpuk kubus satuan.
          </p>
        </div>
      </div>

      {finished ? (
        <div className="bg-white border border-emerald-300 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-2xl font-bold text-slate-900">Semua Proyek Arsitek Selesai!</h3>
          <p className="text-slate-600">
            Kamu memperoleh skor total <strong className="font-mono-math text-blue-700">{score}</strong> poin bersama Kiko.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Mainkan Ulang
            </button>
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Pilih Permainan Lain
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Interactive 4x4 Stack Grid */}
          <div className="lg:col-span-7 bg-slate-100 border border-slate-200 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-800">Denah Lantai 4 × 4</span>
              <span className="font-mono-math text-sm font-semibold text-blue-700 tabular-nums">
                Terpasang: {currentTotal} / {level.targetVolume} kubus satuan
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {grid.map((row, y) =>
                row.map((h, x) => (
                  <IsoCubeStack
                    key={`${y}-${x}`}
                    x={x}
                    y={y}
                    height={h}
                    onAdd={() => updateCell(y, x, 1)}
                    onRemove={() => updateCell(y, x, -1)}
                  />
                ))
              )}
            </div>
          </div>

          {/* Isometric Live Preview + Controls */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Pratinjau 3D Isometrik</h3>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center justify-center">
              <svg viewBox="0 0 260 220" className="w-full h-52" role="img" aria-label="Pratinjau 3D susunan kubus">
                {/* Base grid floor */}
                {Array.from({ length: 4 }).map((_, gy) =>
                  Array.from({ length: 4 }).map((__, gx) => {
                    const cx = 130 + (gx - gy) * 22;
                    const cy = 140 + (gx + gy) * 11;
                    return (
                      <polygon
                        key={`floor-${gx}-${gy}`}
                        points={`${cx},${cy} ${cx + 22},${cy + 11} ${cx},${cy + 22} ${cx - 22},${cy + 11}`}
                        fill="#F1F5F9"
                        stroke="#CBD5E1"
                        strokeWidth="1"
                      />
                    );
                  })
                )}
                {/* Stacked cubes */}
                {isoCubes.map((c, idx) => {
                  const cx = 130 + (c.x - c.y) * 22;
                  const cy = 140 + (c.x + c.y) * 11 - c.z * 18;
                  return (
                    <g key={idx}>
                      <polygon
                        points={`${cx},${cy - 18} ${cx + 22},${cy - 7} ${cx},${cy + 4} ${cx - 22},${cy - 7}`}
                        fill="#93C5FD"
                        stroke="#1D4ED8"
                        strokeWidth="1.2"
                      />
                      <polygon
                        points={`${cx - 22},${cy - 7} ${cx},${cy + 4} ${cx},${cy + 22} ${cx - 22},${cy + 11}`}
                        fill="#60A5FA"
                        stroke="#1D4ED8"
                        strokeWidth="1.2"
                      />
                      <polygon
                        points={`${cx},${cy + 4} ${cx + 22},${cy - 7} ${cx + 22},${cy + 11} ${cx},${cy + 22}`}
                        fill="#3B82F6"
                        stroke="#1D4ED8"
                        strokeWidth="1.2"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>

            {feedback && (
              <div
                className={`p-3.5 rounded-xl border text-sm font-medium ${
                  feedback.type === 'ok'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : feedback.type === 'warn'
                    ? 'bg-amber-50 border-amber-300 text-amber-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
              >
                {feedback.text}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              {feedback?.type === 'ok' ? (
                <button
                  type="button"
                  onClick={handleNextLevel}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  Lanjut Proyek Berikutnya
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCheck}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                >
                  Periksa Susunan
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  playClick();
                  setGrid(createEmptyGrid(4));
                  setFeedback(null);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
              >
                <RotateCcw className="w-4 h-4" />
                Kosongkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
