import { useCallback, useEffect, useState } from 'react';
import { Award, Volume2, VolumeX } from 'lucide-react';
import { ExploreLab } from './components/ExploreLab';
import { ActiveGameId, GamesHub } from './components/GamesHub';
import { AssessmentView } from './components/AssessmentView';
import { RewardsView } from './components/RewardsView';
import { ShapeId } from './data/shapes';
import {
  calculateTotalPoints,
  loadProgress,
  resetProgress,
  saveProgress,
  StudentProgress,
} from './utils/scoring';
import { isSoundMuted, playClick, setSoundMuted } from './utils/sound';

type AppTab = 'explore' | 'games' | 'assessment' | 'rewards';

export default function App() {
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());
  const [activeTab, setActiveTab] = useState<AppTab>('explore');
  const [activeGame, setActiveGame] = useState<ActiveGameId>(null);
  const [autostartGame, setAutostartGame] = useState(false);
  const [muted, setMutedState] = useState(() => isSoundMuted());

  // Support query parameters (?view=games&game=3&autostart=1) for direct deep-linking & verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const view = params.get('view');
    const game = params.get('game');
    const auto = params.get('autostart') === '1';

    if (view === 'games' || view === 'assessment' || view === 'rewards' || view === 'explore') {
      setActiveTab(view);
    }
    if (game) {
      const n = Number(game);
      if (n >= 1 && n <= 5) {
        setActiveTab('games');
        setActiveGame(n as 1 | 2 | 3 | 4 | 5);
      }
    }
    if (auto) {
      setAutostartGame(true);
      if (!game && view === 'games') {
        setActiveGame(3);
      }
    }
  }, []);

  const totalPoints = calculateTotalPoints(progress);

  const handleExploreShape = useCallback((shapeId: ShapeId) => {
    setProgress((prev) => {
      if (prev.exploredShapes.includes(shapeId)) return prev;
      return saveProgress({
        ...prev,
        exploredShapes: [...prev.exploredShapes, shapeId],
      });
    });
  }, []);

  const handleUpdateGameScore = useCallback((gameId: 1 | 2 | 3 | 4 | 5, score: number) => {
    setProgress((prev) => {
      const currentBest = prev.gameScores[gameId] ?? 0;
      if (score <= currentBest) return prev;
      return saveProgress({
        ...prev,
        gameScores: {
          ...prev.gameScores,
          [gameId]: score,
        },
      });
    });
  }, []);

  const handleCompleteAssessment = useCallback((score: number, answers: number[]) => {
    setProgress((prev) =>
      saveProgress({
        ...prev,
        assessmentAttempts: prev.assessmentAttempts + 1,
        assessmentBestScore:
          prev.assessmentBestScore === null ? score : Math.max(prev.assessmentBestScore, score),
        lastAssessmentAnswers: answers,
      })
    );
  }, []);

  const handleUpdateProfile = useCallback((studentName: string, studentClass: string) => {
    setProgress((prev) =>
      saveProgress({
        ...prev,
        studentName,
        studentClass,
      })
    );
  }, []);

  const handleResetAll = useCallback(() => {
    setProgress(resetProgress());
  }, []);

  const switchTab = (tab: AppTab) => {
    playClick();
    setActiveTab(tab);
    if (tab !== 'games') {
      setActiveGame(null);
      setAutostartGame(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar strictly following 3-zone contract */}
      <header className="no-print sticky top-0 z-30 bg-white/95 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single-line Brand Wordmark */}
          <a
            href="#beranda"
            onClick={(e) => {
              e.preventDefault();
              switchTab('explore');
            }}
            className="font-display text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            RuangVolume
          </a>

          {/* Zone 2: 4 single-line Navigation Links */}
          <nav aria-label="Menu utama" className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <button
              type="button"
              onClick={() => switchTab('explore')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'explore'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Eksplorasi 3D
            </button>
            <button
              type="button"
              onClick={() => switchTab('games')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'games'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              5 Permainan
            </button>
            <button
              type="button"
              onClick={() => switchTab('assessment')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'assessment'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              10 Asesmen
            </button>
            <button
              type="button"
              onClick={() => switchTab('rewards')}
              className={`py-1 border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                activeTab === 'rewards'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Skor & Reward
            </button>
          </nav>

          {/* Zone 3: 1 Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => switchTab('rewards')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span data-testid="header-total-points" className="font-mono-math tabular-nums">
                {totalPoints} Poin
              </span>
            </button>
          </div>
        </div>

        {/* Mobile compact navigation */}
        <nav
          aria-label="Menu seluler"
          className="md:hidden border-t border-slate-100 px-2 py-1.5 grid grid-cols-4 gap-1 text-[11px] font-semibold"
        >
          <button
            type="button"
            onClick={() => switchTab('explore')}
            className={`px-1.5 py-2 rounded-md text-center whitespace-nowrap truncate ${
              activeTab === 'explore' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
            }`}
          >
            Eksplorasi
          </button>
          <button
            type="button"
            onClick={() => switchTab('games')}
            className={`px-1.5 py-2 rounded-md text-center whitespace-nowrap truncate ${
              activeTab === 'games' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
            }`}
          >
            5 Permainan
          </button>
          <button
            type="button"
            onClick={() => switchTab('assessment')}
            className={`px-1.5 py-2 rounded-md text-center whitespace-nowrap truncate ${
              activeTab === 'assessment' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
            }`}
          >
            10 Asesmen
          </button>
          <button
            type="button"
            onClick={() => switchTab('rewards')}
            className={`px-1.5 py-2 rounded-md text-center whitespace-nowrap truncate ${
              activeTab === 'rewards' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
            }`}
          >
            Reward
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab === 'explore' && (
          <ExploreLab
            exploredShapes={progress.exploredShapes}
            onExploreShape={handleExploreShape}
            onNavigate={(tab) => switchTab(tab)}
          />
        )}

        {activeTab === 'games' && (
          <GamesHub
            activeGame={activeGame}
            autostart={autostartGame}
            gameScores={progress.gameScores}
            onSelectGame={(id) => setActiveGame(id)}
            onUpdateGameScore={handleUpdateGameScore}
          />
        )}

        {activeTab === 'assessment' && (
          <AssessmentView
            bestScore={progress.assessmentBestScore}
            attempts={progress.assessmentAttempts}
            onCompleteAssessment={handleCompleteAssessment}
            onGoToRewards={() => switchTab('rewards')}
          />
        )}

        {activeTab === 'rewards' && (
          <RewardsView
            progress={progress}
            onUpdateProfile={handleUpdateProfile}
            onResetAll={handleResetAll}
          />
        )}
      </main>

      {/* Clean Quiet Footer */}
      <footer className="no-print border-t border-slate-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            RuangVolume · Media Pembelajaran Interaktif Matematika Materi Volume Bangun Ruang
          </p>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                const next = !muted;
                setSoundMuted(next);
                setMutedState(next);
              }}
              className="inline-flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-medium"
            >
              {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              {muted ? 'Suara Mati' : 'Efek Suara Aktif'}
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => switchTab('rewards')}
              className="text-blue-700 hover:underline font-medium"
            >
              Panduan Unggah Vercel
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
