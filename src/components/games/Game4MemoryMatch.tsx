import { useEffect, useState } from 'react';
import { ArrowLeft, RotateCcw, CheckCircle2 } from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { CharacterAvatar } from '../CharacterAvatar';
import { MEMORY_PAIRS } from '../../utils/gameLogic';
import { ShapeId } from '../../data/shapes';
import { playClick, playError, playSuccess, playVictory } from '../../utils/sound';

interface Game4MemoryMatchProps {
  bestScore: number;
  onScoreUpdate: (score: number) => void;
  onBack: () => void;
}

interface CardItem {
  uid: string;
  pairId: string;
  kind: 'shape' | 'answer';
  title: string;
  subtitle: string;
  shape?: ShapeId;
}

function buildShuffledDeck(): CardItem[] {
  const deck: CardItem[] = [];
  for (const p of MEMORY_PAIRS) {
    deck.push({
      uid: `${p.pairId}-a`,
      pairId: p.pairId,
      kind: 'shape',
      title: p.frontLabel,
      subtitle: p.frontSub,
      shape: p.shape,
    });
    deck.push({
      uid: `${p.pairId}-b`,
      pairId: p.pairId,
      kind: 'answer',
      title: p.matchLabel,
      subtitle: p.matchSub,
    });
  }
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export function Game4MemoryMatch({ bestScore, onScoreUpdate, onBack }: Game4MemoryMatchProps) {
  const mimi = CHARACTERS.mimi;
  const [cards, setCards] = useState<CardItem[]>(() => buildShuffledDeck());
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [locked, setLocked] = useState(false);

  const isVictory = matchedIds.length === MEMORY_PAIRS.length;
  const computedScore = isVictory ? Math.max(100, 220 - Math.max(0, moves - 6) * 10) : matchedIds.length * 20;

  useEffect(() => {
    if (isVictory) {
      onScoreUpdate(computedScore);
      playVictory();
    }
  }, [isVictory, computedScore, onScoreUpdate]);

  const handleFlip = (index: number) => {
    if (locked) return;
    if (flipped.includes(index)) return;
    const card = cards[index];
    if (matchedIds.includes(card.pairId)) return;

    playClick();
    const nextFlipped = [...flipped, index];
    setFlipped(nextFlipped);

    if (nextFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = nextFlipped;
      const first = cards[firstIdx];
      const second = cards[secondIdx];

      if (first.pairId === second.pairId) {
        playSuccess();
        setMatchedIds((prev) => [...prev, first.pairId]);
        setFlipped([]);
      } else {
        playError();
        setLocked(true);
        setTimeout(() => {
          setFlipped([]);
          setLocked(false);
        }, 700);
      }
    }
  };

  const handleRestart = () => {
    playClick();
    setCards(buildShuffledDeck());
    setFlipped([]);
    setMatchedIds([]);
    setMoves(0);
    setLocked(false);
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
            Pasangan: <strong className="font-mono-math text-emerald-700 tabular-nums">{matchedIds.length}/{MEMORY_PAIRS.length}</strong>
          </span>
          <span className="text-slate-600">
            Langkah: <strong className="font-mono-math text-slate-900 tabular-nums">{moves}</strong>
          </span>
          <span className="text-slate-600">
            Terbaik: <strong className="font-mono-math text-blue-700 tabular-nums">{Math.max(bestScore, computedScore)}</strong>
          </span>
        </div>
      </div>

      {/* Character Prompt */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <CharacterAvatar character={mimi} size="md" />
          <div className="space-y-1">
            <p className="text-xs font-semibold text-emerald-800">{mimi.name} · {mimi.gameTitle}</p>
            <h2 className="text-xl font-bold text-slate-900">
              Pasangkan setiap bangun ruang dengan hasil volumenya!
            </h2>
            <p className="text-xs text-slate-600">
              Buka dua kartu secara bergantian. Semakin sedikit langkah, semakin tinggi skormu.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRestart}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          Acak Ulang
        </button>
      </div>

      {isVictory ? (
        <div className="bg-white border border-emerald-300 rounded-2xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
          <h3 className="text-2xl font-bold text-slate-900">Semua 6 Pasangan Ditemukan!</h3>
          <p className="text-slate-600">
            Kamu menyelesaikannya dalam <strong className="font-mono-math">{moves}</strong> langkah dan meraih{' '}
            <strong className="font-mono-math text-blue-700">{computedScore}</strong> poin!
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
            >
              Main Lagi
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card, idx) => {
            const isMatched = matchedIds.includes(card.pairId);
            const isRevealed = isMatched || flipped.includes(idx);

            return (
              <button
                key={card.uid}
                type="button"
                disabled={isRevealed || locked}
                onClick={() => handleFlip(idx)}
                aria-label={isRevealed ? `${card.title} ${card.subtitle}` : `Kartu tertutup nomor ${idx + 1}`}
                className={`h-36 rounded-2xl border p-4 text-center flex flex-col items-center justify-center gap-1.5 transition-all duration-200 ${
                  isMatched
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : isRevealed
                    ? 'bg-white border-blue-500 text-slate-900 shadow-sm'
                    : 'bg-slate-800 border-slate-900 text-white hover:bg-slate-700'
                }`}
              >
                {isRevealed ? (
                  <>
                    <span className="text-[11px] font-medium text-slate-500">
                      {card.kind === 'shape' ? 'Bangun & Ukuran' : 'Hasil Volume'}
                    </span>
                    <span className="text-base font-bold font-mono-math leading-snug">
                      {card.title}
                    </span>
                    <span className="text-xs font-mono-math text-blue-700">
                      {card.subtitle}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-display font-bold text-slate-300">?</span>
                    <span className="text-xs text-slate-400">Buka Kartu</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
