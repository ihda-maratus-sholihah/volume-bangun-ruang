import { useState } from 'react';
import { Award, CheckCircle2, Lock, Printer, RotateCcw, Rocket, Copy, Check } from 'lucide-react';
import { CHARACTERS, CHARACTER_LIST } from '../data/characters';
import {
  BADGES,
  calculateTotalPoints,
  getAssessmentPredicate,
  getStudentRank,
  StudentProgress,
} from '../utils/scoring';
import { CharacterAvatar } from './CharacterAvatar';
import { playClick } from '../utils/sound';

interface RewardsViewProps {
  progress: StudentProgress;
  onUpdateProfile: (name: string, studentClass: string) => void;
  onResetAll: () => void;
}

export function RewardsView({ progress, onUpdateProfile, onResetAll }: RewardsViewProps) {
  const [nameInput, setNameInput] = useState(progress.studentName);
  const [classInput, setClassInput] = useState(progress.studentClass);
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const totalPoints = calculateTotalPoints(progress);
  const rank = getStudentRank(totalPoints);
  const assessmentPredicate =
    progress.assessmentBestScore !== null
      ? getAssessmentPredicate(progress.assessmentBestScore)
      : null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) return;
    playClick();
    onUpdateProfile(nameInput.trim(), classInput.trim() || 'Kelas 6');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2200);
  };

  const handleCopyDeploy = () => {
    const cmd = 'npm run build && npx vercel --prod';
    navigator.clipboard?.writeText(cmd).catch(() => {});
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <section className="space-y-8">
      {/* Header Summary */}
      <div className="no-print flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-blue-700">
            Rekapitulasi Belajar · Peringkat: {rank}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Skor, Koleksi Reward & Sertifikat
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            Pantau total poin dari Laboratorium 3D, 5 permainan karakter, dan 10 asesmen. Lengkapi identitasmu untuk mencetak sertifikat prestasi.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Progres
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-200 rounded-lg px-3 py-1.5">
              <span className="text-xs font-medium text-rose-800">Hapus semua skor?</span>
              <button
                type="button"
                onClick={() => {
                  onResetAll();
                  setConfirmReset(false);
                }}
                className="px-2.5 py-1 rounded bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700"
              >
                Ya, Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-2 py-1 rounded text-xs font-semibold text-slate-700 hover:bg-white"
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
          <p className="text-xs font-medium text-slate-500">Total Poin Reward</p>
          <p data-testid="rewards-total-points" className="text-3xl font-extrabold font-mono-math text-blue-700 tabular-nums">
            {totalPoints}
          </p>
          <p className="text-xs text-slate-600">Gelar: {rank}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
          <p className="text-xs font-medium text-slate-500">Nilai Terbaik Asesmen</p>
          <p className="text-3xl font-extrabold font-mono-math text-slate-900 tabular-nums">
            {progress.assessmentBestScore !== null ? `${progress.assessmentBestScore}` : '—'}
            <span className="text-base font-normal text-slate-500"> / 100</span>
          </p>
          <p className="text-xs text-slate-600">
            {assessmentPredicate ? assessmentPredicate.label : 'Belum dikerjakan'}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
          <p className="text-xs font-medium text-slate-500">Total Skor 5 Permainan</p>
          <p className="text-3xl font-extrabold font-mono-math text-emerald-700 tabular-nums">
            {Object.values(progress.gameScores).reduce((a, b) => a + b, 0)}
          </p>
          <p className="text-xs text-slate-600">
            {Object.values(progress.gameScores).filter((s) => s > 0).length} dari 5 game dimainkan
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-1">
          <p className="text-xs font-medium text-slate-500">Lencana Terbuka</p>
          <p className="text-3xl font-extrabold font-mono-math text-amber-600 tabular-nums">
            {progress.unlockedBadges.length} / {BADGES.length}
          </p>
          <p className="text-xs text-slate-600">
            Eksplorasi 3D: {progress.exploredShapes.length}/7 bangun
          </p>
        </div>
      </div>

      {/* 8 Badges Grid */}
      <div className="no-print space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Koleksi Lencana & Stiker Karakter</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BADGES.map((badge) => {
            const unlocked = progress.unlockedBadges.includes(badge.id);
            const char = badge.characterId ? CHARACTERS[badge.characterId] : null;
            return (
              <div
                key={badge.id}
                className={`rounded-xl border p-4 flex flex-col justify-between gap-3 transition-colors ${
                  unlocked
                    ? 'bg-white border-emerald-300'
                    : 'bg-slate-100/70 border-slate-200 opacity-80'
                }`}
              >
                <div className="flex items-start gap-3">
                  {char ? (
                    <CharacterAvatar
                      character={char}
                      size="sm"
                      className={unlocked ? '' : 'grayscale opacity-60'}
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center shrink-0 ${
                        unlocked
                          ? 'bg-amber-50 border-amber-200 text-amber-700'
                          : 'bg-slate-200 border-slate-300 text-slate-500'
                      }`}
                    >
                      <Award className="w-6 h-6" />
                    </div>
                  )}
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 leading-snug">{badge.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{badge.description}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{badge.requirementText}</span>
                  {unlocked ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Diraih
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 font-medium text-slate-500 shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                      Terkunci
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Game Score Breakdown + Student Profile & Printable Certificate */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="no-print lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
          <h2 className="text-lg font-bold text-slate-900">Identitas Siswa</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="student-name" className="block text-sm font-medium text-slate-700">
                Nama Lengkap Siswa
              </label>
              <input
                id="student-name"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                placeholder="Masukkan nama siswa"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="student-class" className="block text-sm font-medium text-slate-700">
                Kelas / Sekolah
              </label>
              <input
                id="student-class"
                type="text"
                value={classInput}
                onChange={(e) => setClassInput(e.target.value)}
                placeholder="Contoh: Kelas 6A SDN Merdeka"
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 whitespace-nowrap shrink-0"
              >
                Simpan Profil
              </button>
              {savedNotice && (
                <span className="text-xs font-semibold text-emerald-700">
                  Profil berhasil diperbarui
                </span>
              )}
            </div>
          </form>

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <h3 className="text-sm font-semibold text-slate-900">Rincian Skor 5 Permainan</h3>
            {CHARACTER_LIST.map((char, idx) => {
              const gameNum = (idx + 1) as 1 | 2 | 3 | 4 | 5;
              const score = progress.gameScores[gameNum];
              return (
                <div key={char.id} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">
                    {gameNum}. {char.gameTitle}
                  </span>
                  <span className="font-mono-math font-semibold text-slate-900 tabular-nums">
                    {score} poin
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Printable Certificate */}
        <div className="lg:col-span-7 space-y-4">
          <div className="print-only-certificate bg-white border-2 border-slate-800 rounded-2xl p-8 space-y-6 text-center">
            <div className="space-y-1">
              <p className="text-xs font-semibold tracking-widest text-blue-700 uppercase">
                Sertifikat Penghargaan Belajar Matematika
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                RuangVolume — Volume Bangun Ruang
              </h2>
            </div>

            <div className="space-y-2 py-4 border-y border-slate-200">
              <p className="text-sm text-slate-600">Diberikan dengan bangga kepada:</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 font-display">
                {progress.studentName}
              </p>
              <p className="text-sm font-medium text-slate-600">{progress.studentClass}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Total Poin</p>
                <p className="text-xl font-bold font-mono-math text-blue-700 tabular-nums">
                  {totalPoints}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Nilai Asesmen</p>
                <p className="text-xl font-bold font-mono-math text-slate-900 tabular-nums">
                  {progress.assessmentBestScore !== null ? `${progress.assessmentBestScore}/100` : '—'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-xs text-slate-500">Lencana</p>
                <p className="text-xl font-bold font-mono-math text-amber-600 tabular-nums">
                  {progress.unlockedBadges.length}/{BADGES.length}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <span>Peringkat: {rank}</span>
              <span>Media Pembelajaran Interaktif Matematika</span>
            </div>
          </div>

          <div className="no-print flex justify-end">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <Printer className="w-4 h-4" />
              Cetak / Simpan PDF Sertifikat
            </button>
          </div>
        </div>
      </div>

      {/* Vercel Deployment Readiness Guide */}
      <div className="no-print bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <Rocket className="w-5 h-5 text-blue-600 shrink-0" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Siap Diunggah ke Vercel</h2>
              <p className="text-xs text-slate-600">
                Aplikasi ini sudah dilengkapi konfigurasi <code className="font-mono-math">vercel.json</code> dan build statis Vite (<code className="font-mono-math">dist/</code>).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCopyDeploy}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-300 bg-slate-50 text-slate-800 text-xs font-semibold hover:bg-slate-100 whitespace-nowrap shrink-0"
          >
            {copiedCmd ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedCmd ? 'Perintah Disalin' : 'Salin Perintah CLI'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-900">1. Unduh / Push ke GitHub</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Simpan kode proyek ini ke repositori GitHub Anda (semua aset gambar dan konfigurasi <code className="font-mono-math">vercel.json</code> sudah siap).
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-900">2. Impor di Vercel Dashboard</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Buka vercel.com → Add New Project → pilih repositori. Framework Preset otomatis terdeteksi sebagai <strong>Vite</strong> dengan Output Directory <code className="font-mono-math">dist</code>.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <p className="font-semibold text-slate-900">3. Klik Deploy</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tidak perlu API key atau server database tambahan — semua progres tersimpan di browser siswa sehingga gratis & instan di Vercel.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
