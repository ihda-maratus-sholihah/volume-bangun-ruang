import { useState } from 'react';
import { ArrowLeft, Heart, Lightbulb, RotateCcw, Trophy } from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { CharacterAvatar } from '../CharacterAvatar';
import { ShapeDiagramSVG } from '../ShapeDiagramSVG';
import { MAZE_STAGES } from '../../utils/gameLogic';
import { playClick, playError, playSuccess, playVictory } from '../../utils/sound';

interface Game5MazeAdventureProps {
  bestScore: number;
  onScoreUpdate: (score: number) => void;
  onBack: () => void;
}

export function Game5MazeAdventure({ bestScore, onScoreUpdate, onBack }: Game5MazeAdventureProps) {
  const tobi = CHARACTERS.tobi;
  const [stageIdx, setStageIdx] = useState(0);
  const [hearts, setHearts] = useState(3);
  const [score, setScore] = useState(0);
  const [showTip, setShowTip] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [status, setStatus] = useState<'playing' | 'won' | 'lost'>('playing');

  const stage = MAZE_STAGES[stageIdx];

  const handleAnswer = (optIdx: number) => {
    if (selectedOpt !== null || status !== 'playing') return;
    setSelectedOpt(optIdx);

    if (optIdx === stage.correctIndex) {
      const gained = 50;
      const nextScore = score + gained;
      setScore(nextScore);
      onScoreUpdate(nextScore);
      if (stageIdx + 1 >= MAZE_STAGES.length) {
        playVictory();
        setTimeout(() => setStatus('won'), 600);
      } else {
        playSuccess();
      }
    } else {
      playError();
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (nextHearts <= 0) {
        setTimeout(() => setStatus('lost'), 600);
      }
    }
  };

  const handleNextGate = () => {
    playClick();
    setStageIdx((i) => i + 1);
    setSelectedOpt(null);
    setShowTip(false);
  };

  const handleRetryGate = () => {
    playClick();
    setSelectedOpt(null);
  };

  const handleRestart = () => {
    playClick();
    setStageIdx(0);
    setHearts(3);
    setScore(0);
    setShowTip(false);
    setSelectedOpt(null);
    setStatus('playing');
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
          <span className="inline-flex items-center gap-1.5 font-mono-math font-bold text-rose-600 tabular-nums">
            <Heart className="w-4 h-4 fill-rose-500" />
            {hearts}/3 Nyawa
          </span>
          <span className="text-slate-600">
            Skor: <strong className="font-mono-math text-blue-700 tabular-nums">{score}</strong>
          </span>
          <span className="text-slate-600">
            Terbaik: <strong className="font-mono-math text-slate-900 tabular-nums">{Math.max(bestScore, score)}</strong>
          </span>
        </div>
      </div>

      {/* Expedition Progress Trail */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="grid grid-cols-5 gap-2">
          {MAZE_STAGES.map((s, idx) => {
            const done = idx < stageIdx || status === 'won';
            const active = idx === stageIdx && status === 'playing';
            return (
              <div
                key={s.stage}
                className={`p-2.5 rounded-xl border text-center text-xs font-semibold ${
                  done
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : active
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-500'
                }`}
              >
                Pos {s.stage}
              </div>
            );
          })}
        </div>
      </div>

      {status === 'won' || status === 'lost' ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4">
          <Trophy className={`w-12 h-12 mx-auto ${status === 'won' ? 'text-amber-500' : 'text-slate-400'}`} />
          <h3 className="text-2xl font-bold text-slate-900">
            {status === 'won'
              ? 'Selamat! Kamu Menaklukkan Kastil Raja Geometri!'
              : 'Petualangan Terhenti — Nyawa Habis'}
          </h3>
          <p className="text-slate-600">
            Skor yang kamu kumpulkan bersama Pak Tobi: <strong className="font-mono-math text-blue-700">{score}</strong> poin.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              <RotateCcw className="w-4 h-4" />
              Petualangan Baru
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
          {/* Guardian & Diagram */}
          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <CharacterAvatar character={tobi} size="sm" />
              <div>
                <p className="text-xs font-semibold text-blue-800">{stage.gateName}</p>
                <p className="text-sm font-bold text-slate-900">{stage.guardianTitle}</p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center">
              <ShapeDiagramSVG shape={stage.shape} labels={stage.dims} className="w-full max-w-[230px] h-44" />
            </div>

            <button
              type="button"
              onClick={() => {
                playClick();
                setShowTip((v) => !v);
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50"
            >
              <Lightbulb className="w-4 h-4 text-amber-600" />
              {showTip ? 'Sembunyikan Petunjuk' : 'Minta Petunjuk Pak Tobi'}
            </button>

            {showTip && (
              <p className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 font-mono-math">
                {stage.tip}
              </p>
            )}
          </div>

          {/* Question & Choices */}
          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-slate-900 leading-snug">{stage.question}</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stage.options.map((opt, idx) => {
                const isPicked = selectedOpt === idx;
                const isCorrect = idx === stage.correctIndex;
                let cls = 'border-slate-200 bg-white text-slate-800 hover:border-blue-400 hover:bg-blue-50/40';
                if (selectedOpt !== null) {
                  if (isCorrect) cls = 'border-emerald-500 bg-emerald-50 text-emerald-950';
                  else if (isPicked) cls = 'border-rose-400 bg-rose-50 text-rose-950';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={selectedOpt !== null}
                    onClick={() => handleAnswer(idx)}
                    className={`p-4 rounded-xl border text-left font-mono-math font-semibold text-base transition-colors ${cls}`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {selectedOpt !== null && (
              <div className="pt-2 flex items-center justify-between gap-4">
                {selectedOpt === stage.correctIndex ? (
                  <>
                    <span className="text-sm font-semibold text-emerald-700">
                      Gerbang terbuka! (+50 poin)
                    </span>
                    <button
                      type="button"
                      onClick={handleNextGate}
                      className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                    >
                      Masuk Gerbang Berikutnya
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-sm font-semibold text-rose-700">
                      Jawaban kurang tepat (-1 Nyawa).
                    </span>
                    <button
                      type="button"
                      onClick={handleRetryGate}
                      className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
                    >
                      Coba Jawab Lagi
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
