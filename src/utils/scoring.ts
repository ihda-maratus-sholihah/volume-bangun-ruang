import { CharacterId } from '../data/characters';
import { ShapeId } from '../data/shapes';

export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  characterId?: CharacterId;
  requirementText: string;
}

export const BADGES: BadgeDefinition[] = [
  {
    id: 'penjelajah_3d',
    title: 'Penjelajah 7 Bangun',
    description: 'Menjelajahi seluruh 7 jenis bangun ruang di Laboratorium 3D.',
    requirementText: 'Buka semua 7 bangun di Eksplorasi',
  },
  {
    id: 'arsitek_kubus',
    title: 'Arsitek Kubus Satuan',
    description: 'Menyelesaikan tantangan Susun Kubus bersama Kiko.',
    characterId: 'kiko',
    requirementText: 'Skor minimal 100 di Permainan 1',
  },
  {
    id: 'insinyur_air',
    title: 'Master Takaran Air',
    description: 'Mengisi tangki volume dengan presisi bersama Bara.',
    characterId: 'bara',
    requirementText: 'Skor minimal 100 di Permainan 2',
  },
  {
    id: 'penangkap_kilat',
    title: 'Penangkap Rumus Kilat',
    description: 'Meraih skor tinggi dalam Tangkap Bangun bersama Rara.',
    characterId: 'rara',
    requirementText: 'Skor minimal 100 di Permainan 3',
  },
  {
    id: 'memori_tajam',
    title: 'Juara Memori Geometri',
    description: 'Memasangkan semua kartu 3D bersama Mimi.',
    characterId: 'mimi',
    requirementText: 'Selesaikan Permainan 4',
  },
  {
    id: 'penakluk_labirin',
    title: 'Penakluk Labirin',
    description: 'Menyelesaikan Petualangan Labirin Volume bersama Pak Tobi.',
    characterId: 'tobi',
    requirementText: 'Selesaikan Permainan 5',
  },
  {
    id: 'lulus_asesmen',
    title: 'Lulus Evaluasi KKM',
    description: 'Meraih nilai minimal 70 pada 10 Asesmen Volume.',
    requirementText: 'Nilai Asesmen ≥ 70',
  },
  {
    id: 'bintang_sempurna',
    title: 'Bintang Matematika 100',
    description: 'Meraih nilai sempurna 100 pada 10 Asesmen Volume.',
    requirementText: 'Nilai Asesmen = 100',
  },
];

export interface StudentProgress {
  studentName: string;
  studentClass: string;
  exploredShapes: ShapeId[];
  gameScores: Record<1 | 2 | 3 | 4 | 5, number>;
  assessmentBestScore: number | null;
  assessmentAttempts: number;
  lastAssessmentAnswers: number[] | null;
  unlockedBadges: string[];
}

export const DEFAULT_PROGRESS: StudentProgress = {
  studentName: 'Siswa Hebat',
  studentClass: 'Kelas 6',
  exploredShapes: ['kubus'],
  gameScores: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  assessmentBestScore: null,
  assessmentAttempts: 0,
  lastAssessmentAnswers: null,
  unlockedBadges: [],
};

export function calculateAssessmentScore(correctCount: number, totalQuestions = 10): number {
  if (totalQuestions <= 0) return 0;
  return Math.round((correctCount / totalQuestions) * 100);
}

export function getAssessmentPredicate(score: number): {
  label: string;
  message: string;
  tone: 'emerald' | 'blue' | 'amber' | 'rose';
} {
  if (score >= 90) {
    return {
      label: 'Sangat Baik (Istimewa)',
      message: 'Penguasaan konsep volume bangun ruangmu luar biasa!',
      tone: 'emerald',
    };
  }
  if (score >= 75) {
    return {
      label: 'Baik (Tuntas)',
      message: 'Hebat! Kamu sudah memahami sebagian besar rumus dan penerapan volume.',
      tone: 'blue',
    };
  }
  if (score >= 60) {
    return {
      label: 'Cukup (Perlu Penguatan)',
      message: 'Cukup baik, ayo ulangi materi kerucut, limas, dan bola agar lebih mantap.',
      tone: 'amber',
    };
  }
  return {
    label: 'Perlu Latihan Lagi',
    message: 'Jangan menyerah! Coba mainkan 5 permainan dan eksplorasi 3D lalu coba asesmen lagi.',
    tone: 'rose',
  };
}

export function calculateTotalPoints(progress: StudentProgress): number {
  const explorePts = progress.exploredShapes.length * 15;
  const gamesPts =
    progress.gameScores[1] +
    progress.gameScores[2] +
    progress.gameScores[3] +
    progress.gameScores[4] +
    progress.gameScores[5];
  const assessmentPts = (progress.assessmentBestScore ?? 0) * 3;
  const badgePts = progress.unlockedBadges.length * 25;
  return explorePts + gamesPts + assessmentPts + badgePts;
}

export function getStudentRank(totalPoints: number): string {
  if (totalPoints >= 1000) return 'Grandmaster Geometri';
  if (totalPoints >= 650) return 'Arsitek Ruang Handal';
  if (totalPoints >= 350) return 'Penjelajah Volume';
  if (totalPoints >= 150) return 'Pelajar Tekun';
  return 'Pemula Geometri';
}

export function evaluateBadges(progress: StudentProgress): string[] {
  const badges = new Set<string>(progress.unlockedBadges);
  if (progress.exploredShapes.length >= 7) badges.add('penjelajah_3d');
  if (progress.gameScores[1] >= 100) badges.add('arsitek_kubus');
  if (progress.gameScores[2] >= 100) badges.add('insinyur_air');
  if (progress.gameScores[3] >= 100) badges.add('penangkap_kilat');
  if (progress.gameScores[4] >= 100) badges.add('memori_tajam');
  if (progress.gameScores[5] >= 100) badges.add('penakluk_labirin');
  if (progress.assessmentBestScore !== null && progress.assessmentBestScore >= 70) {
    badges.add('lulus_asesmen');
  }
  if (progress.assessmentBestScore !== null && progress.assessmentBestScore === 100) {
    badges.add('bintang_sempurna');
  }
  return Array.from(badges);
}

const STORAGE_KEY = 'ruangvolume_progress_v1';

export function loadProgress(): StudentProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<StudentProgress>;
    const merged: StudentProgress = {
      studentName: typeof parsed.studentName === 'string' && parsed.studentName.trim() ? parsed.studentName : DEFAULT_PROGRESS.studentName,
      studentClass: typeof parsed.studentClass === 'string' && parsed.studentClass.trim() ? parsed.studentClass : DEFAULT_PROGRESS.studentClass,
      exploredShapes: Array.isArray(parsed.exploredShapes) ? parsed.exploredShapes : DEFAULT_PROGRESS.exploredShapes,
      gameScores: {
        1: parsed.gameScores?.[1] ?? 0,
        2: parsed.gameScores?.[2] ?? 0,
        3: parsed.gameScores?.[3] ?? 0,
        4: parsed.gameScores?.[4] ?? 0,
        5: parsed.gameScores?.[5] ?? 0,
      },
      assessmentBestScore: typeof parsed.assessmentBestScore === 'number' ? parsed.assessmentBestScore : null,
      assessmentAttempts: typeof parsed.assessmentAttempts === 'number' ? parsed.assessmentAttempts : 0,
      lastAssessmentAnswers: Array.isArray(parsed.lastAssessmentAnswers) ? parsed.lastAssessmentAnswers : null,
      unlockedBadges: Array.isArray(parsed.unlockedBadges) ? parsed.unlockedBadges : [],
    };
    merged.unlockedBadges = evaluateBadges(merged);
    return merged;
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(progress: StudentProgress): StudentProgress {
  const updated: StudentProgress = {
    ...progress,
    unlockedBadges: evaluateBadges(progress),
  };
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore storage quota errors cleanly
    }
  }
  return updated;
}

export function resetProgress(): StudentProgress {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
  return { ...DEFAULT_PROGRESS };
}
