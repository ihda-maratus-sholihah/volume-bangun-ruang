import { Gamepad2, ArrowRight } from 'lucide-react';
import { CHARACTER_LIST } from '../data/characters';
import { CharacterAvatar } from './CharacterAvatar';
import { Game1CubeBuilder } from './games/Game1CubeBuilder';
import { Game2TankPour } from './games/Game2TankPour';
import { Game3CatcherArcade } from './games/Game3CatcherArcade';
import { Game4MemoryMatch } from './games/Game4MemoryMatch';
import { Game5MazeAdventure } from './games/Game5MazeAdventure';
import { playClick } from '../utils/sound';

export type ActiveGameId = 1 | 2 | 3 | 4 | 5 | null;

interface GamesHubProps {
  activeGame: ActiveGameId;
  autostart?: boolean;
  gameScores: Record<1 | 2 | 3 | 4 | 5, number>;
  onSelectGame: (id: ActiveGameId) => void;
  onUpdateGameScore: (id: 1 | 2 | 3 | 4 | 5, score: number) => void;
}

export function GamesHub({
  activeGame,
  autostart = false,
  gameScores,
  onSelectGame,
  onUpdateGameScore,
}: GamesHubProps) {
  if (activeGame === 1) {
    return (
      <Game1CubeBuilder
        bestScore={gameScores[1]}
        onScoreUpdate={(s) => onUpdateGameScore(1, s)}
        onBack={() => onSelectGame(null)}
      />
    );
  }
  if (activeGame === 2) {
    return (
      <Game2TankPour
        bestScore={gameScores[2]}
        onScoreUpdate={(s) => onUpdateGameScore(2, s)}
        onBack={() => onSelectGame(null)}
      />
    );
  }
  if (activeGame === 3) {
    return (
      <Game3CatcherArcade
        bestScore={gameScores[3]}
        autostart={autostart}
        onScoreUpdate={(s) => onUpdateGameScore(3, s)}
        onBack={() => onSelectGame(null)}
      />
    );
  }
  if (activeGame === 4) {
    return (
      <Game4MemoryMatch
        bestScore={gameScores[4]}
        onScoreUpdate={(s) => onUpdateGameScore(4, s)}
        onBack={() => onSelectGame(null)}
      />
    );
  }
  if (activeGame === 5) {
    return (
      <Game5MazeAdventure
        bestScore={gameScores[5]}
        onScoreUpdate={(s) => onUpdateGameScore(5, s)}
        onBack={() => onSelectGame(null)}
      />
    );
  }

  return (
    <section className="space-y-8">
      <div className="border-b border-slate-200 pb-6 space-y-2 max-w-2xl">
        <p className="text-sm font-medium text-blue-700">
          Belajar Sambil Bermain · 5 Karakter Pemandu
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          5 Permainan Interaktif Volume Bangun Ruang
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Pilih karakter teman belajarmu dan mainkan 5 jenis permainan berbeda untuk mengumpulkan skor tertinggi dan membuka semua lencana reward.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CHARACTER_LIST.map((char, idx) => {
          const gameNum = (idx + 1) as 1 | 2 | 3 | 4 | 5;
          const best = gameScores[gameNum];

          return (
            <article
              key={char.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between gap-5 hover:border-blue-300 transition-colors"
            >
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <CharacterAvatar character={char} size="md" />
                  <div className="space-y-1 min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      Permainan {gameNum} · {char.name}
                    </p>
                    <h2 className="text-xl font-bold text-slate-900 leading-snug">
                      {char.gameTitle}
                    </h2>
                    <p className="text-xs text-slate-500">{char.role}</p>
                  </div>
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">{char.gameDesc}</p>

                <p className="text-xs italic text-slate-500 border-t border-slate-100 pt-3">
                  "{char.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Skor Terbaik:{' '}
                  <strong className="font-mono-math text-sm text-slate-900 tabular-nums">
                    {best}
                  </strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    onSelectGame(gameNum);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap shrink-0"
                >
                  <Gamepad2 className="w-4 h-4" />
                  Mainkan
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
