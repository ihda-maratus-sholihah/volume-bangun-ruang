import { useState } from 'react';
import { ArrowLeft, Droplets, RotateCcw, CheckCircle2 } from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { CharacterAvatar } from '../CharacterAvatar';
import { TANK_CHALLENGES } from '../../utils/gameLogic';
import { formatIndoNumber } from '../../data/shapes';
import { playClick, playError, playSuccess, playVictory } from '../../utils/sound';

interface Game2TankPourProps {
  bestScore: number;
  onScoreUpdate: (score: number) => void;
  onBack: () => void;
}

export function Game2TankPour({ bestScore, onScoreUpdate, onBack }: Game2TankPourProps) {
  const bara = CHARACTERS.bara;
  const [stageIdx, setStageIdx] = useState(0);
  const [currentFill, setCurrentFill] = useState(0);
  const [score, setScore] = useState(0);
  const [status, setStatus] = useState<'idle' | 'success' | 'overflow'>('idle');
  const [finished, setFinished] = useState(false);

  const challenge = TANK_CHALLENGES[stageIdx];
  const fillRatio = Math.min(1, currentFill / challenge.capacity);
  const targetRatio = challenge.targetFill / challenge.capacity;
  const isCloseEnough = Math.abs(currentFill - challenge.targetFill) <= 2;

  const handlePour = (vol: number) => {
    if (status !== 'idle') return;
    const next = Math.round((currentFill + vol) * 100) / 100;
    setCurrentFill(next);

    if (next > challenge.capacity + 2) {
      playError();
      setStatus('overflow');
    } else if (Math.abs(next - challenge.targetFill) <= 2) {
      const gained = 60;
      const nextScore = score + gained;
      setScore(nextScore);
      onScoreUpdate(nextScore);
      if (stageIdx + 1 >= TANK_CHALLENGES.length) {
        playVictory();
        setStatus('success');
        setFinished(true);
      } else {
        playSuccess();
        setStatus('success');
      }
    } else {
      playClick();
    }
  };

  const handleEmpty = () => {
    playClick();
    setCurrentFill(0);
    setStatus('idle');
  };

  const handleNext = () => {
    playClick();
    setStageIdx((i) => i + 1);
    setCurrentFill(0);
    setStatus('idle');
  };

  const handleRestart = () => {
    playClick();
    setStageIdx(0);
    setCurrentFill(0);
    setScore(0);
    setStatus('idle');
    setFinished(false);
  };

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
            Tangki: <strong className="font-mono-math text-slate-900 tabular-nums">{stageIdx + 1}/{TANK_CHALLENGES.length}</strong>
          </span>
          <span className="text-slate-600">
            Skor: <strong className="font-mono-math text-blue-700 tabular-nums">{score}</strong>
          </span>
          <span className="text-slate-600">
            Terbaik: <strong className="font-mono-math text-slate-900 tabular-nums">{Math.max(bestScore, score)}</strong>
          </span>
        </div>
      </div>

      {/* Character Prompt */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <CharacterAvatar character={bara} size="md" />
        <div className="space-y-1 flex-1">
          <p className="text-xs font-semibold text-sky-800">
            {bara.name} · {challenge.title}
          </p>
          <h2 className="text-xl font-bold text-slate-900">
            Tuang air hingga tepat {formatIndoNumber(challenge.targetFill)} cm³!
          </h2>
          <p className="text-xs text-slate-600">{challenge.dimsLabel}</p>
        </div>
      </div>

      {finished ? (
        <div className="bg-white border border-emerald-300 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-2xl font-bold text-slate-900">Semua Tangki Terisi Presisi!</h3>
          <p className="text-slate-600">
            Skor akhir kamu bersama Bara: <strong className="font-mono-math text-blue-700">{score}</strong> poin.
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
          {/* Animated Tank Visual */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-700">Meteran Tangki</span>
              <span className="font-mono-math font-bold text-sky-700 tabular-nums">
                {formatIndoNumber(currentFill)} / {formatIndoNumber(challenge.capacity)} cm³
              </span>
            </div>

            <div className="relative w-56 h-72 border-2 border-slate-700 border-t-0 rounded-b-2xl bg-slate-50 overflow-hidden">
              {/* Target Line */}
              <div
                style={{ bottom: `${targetRatio * 100}%` }}
                className="absolute left-0 right-0 border-t-2 border-dashed border-amber-600 z-20 flex justify-end pr-2"
              >
                <span className="-mt-5 bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-mono-math font-semibold px-1.5 py-0.5 rounded">
                  Target: {formatIndoNumber(challenge.targetFill)}
                </span>
              </div>

              {/* Liquid Level */}
              <div
                style={{ height: `${fillRatio * 100}%` }}
                className={`absolute bottom-0 left-0 right-0 transition-all duration-300 ${
                  status === 'overflow'
                    ? 'bg-rose-400/80'
                    : isCloseEnough
                    ? 'bg-emerald-400/80'
                    : 'bg-sky-400/80'
                }`}
              />
            </div>
          </div>

          {/* Pouring Controls */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">Pilih Gelas Takar</h3>
              <p className="text-xs text-slate-600">
                Klik gelas takar untuk menuangkan cairan ke dalam tangki. Jangan sampai melebihi kapasitas!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {challenge.scoops.map((scoop, idx) => (
                <button
                  key={idx}
                  type="button"
                  disabled={status !== 'idle'}
                  onClick={() => handlePour(scoop.volume)}
                  className="p-4 rounded-xl border border-sky-200 bg-sky-50/70 hover:bg-sky-100 text-left flex items-center gap-3 transition-colors disabled:opacity-50"
                >
                  <Droplets className="w-5 h-5 text-sky-600 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{scoop.label}</p>
                    <p className="text-xs font-mono-math text-sky-800">+{formatIndoNumber(scoop.volume)} cm³</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
              <strong className="text-slate-800">Petunjuk Bara:</strong> {challenge.hint}
            </div>

            {status === 'overflow' && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-sm text-rose-900 font-medium">
                Air meluap melebihi batas tangki! Klik Kosongkan Tangki untuk mencoba lagi.
              </div>
            )}

            {status === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-sm text-emerald-900 font-medium">
                Tepat sekali! Takaran mencapai {formatIndoNumber(challenge.targetFill)} cm³. (+60 poin)
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              {status === 'success' ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                >
                  Lanjut Tangki Berikutnya
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleEmpty}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Kosongkan Tangki
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
