import { useState } from 'react';
import { CheckCircle2, XCircle, RotateCcw, Award, ArrowRight, ArrowLeft } from 'lucide-react';
import { ASSESSMENT_QUESTIONS } from '../data/assessments';
import { ShapeDiagramSVG } from './ShapeDiagramSVG';
import { calculateAssessmentScore, getAssessmentPredicate } from '../utils/scoring';
import { playClick, playError, playSuccess, playVictory } from '../utils/sound';

interface AssessmentViewProps {
  bestScore: number | null;
  attempts: number;
  onCompleteAssessment: (score: number, answers: number[]) => void;
  onGoToRewards: () => void;
}

export function AssessmentView({
  bestScore,
  attempts,
  onCompleteAssessment,
  onGoToRewards,
}: AssessmentViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(ASSESSMENT_QUESTIONS.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const answeredCount = answers.filter((a) => a !== null).length;
  const allAnswered = answeredCount === ASSESSMENT_QUESTIONS.length;

  const correctCount = ASSESSMENT_QUESTIONS.reduce((acc, q, idx) => {
    return acc + (answers[idx] === q.correctIndex ? 1 : 0);
  }, 0);
  const finalScore = calculateAssessmentScore(correctCount, ASSESSMENT_QUESTIONS.length);
  const predicate = getAssessmentPredicate(finalScore);

  const handleSelectOption = (optionIdx: number) => {
    if (submitted) return;
    playClick();
    setAnswers((prev) => {
      const next = [...prev];
      next[currentIndex] = optionIdx;
      return next;
    });
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    const score = calculateAssessmentScore(correctCount, ASSESSMENT_QUESTIONS.length);
    setSubmitted(true);
    if (score >= 70) {
      playVictory();
    } else if (score >= 50) {
      playSuccess();
    } else {
      playError();
    }
    onCompleteAssessment(
      score,
      answers.map((a) => (a === null ? -1 : a))
    );
  };

  const handleReset = () => {
    playClick();
    setAnswers(Array(ASSESSMENT_QUESTIONS.length).fill(null));
    setCurrentIndex(0);
    setSubmitted(false);
  };

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-2xl">
          <p className="text-sm font-medium text-blue-700">
            Evaluasi Pembelajaran · 10 Soal Terstruktur · Nilai Terbaik:{' '}
            <span className="font-mono-math font-semibold tabular-nums">
              {bestScore !== null ? `${bestScore}/100` : 'Belum ada'}
            </span>{' '}
            · Percobaan: <span className="font-mono-math tabular-nums">{attempts}</span>
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Asesmen Volume Bangun Ruang (10 Soal)
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Jawab seluruh 10 soal pilihan ganda berikut. Setelah selesai, kamu akan langsung mendapatkan nilai akhir, pembahasan lengkap, serta poin reward.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {submitted && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Ulangi Asesmen
            </button>
          )}
        </div>
      </div>

      {/* Results Banner when submitted */}
      {submitted && (
        <div
          data-testid="assessment-result-card"
          className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Award className="w-5 h-5 text-amber-600" />
              <span>Hasil Asesmen Akhir</span>
              <span aria-hidden="true">·</span>
              <span>{predicate.label}</span>
            </div>
            <div className="flex items-baseline gap-4">
              <p className="text-4xl font-extrabold font-mono-math text-slate-900 tabular-nums">
                {finalScore} <span className="text-lg font-normal text-slate-500">/ 100</span>
              </p>
              <p className="text-sm text-slate-600 tabular-nums">
                ({correctCount} benar dari {ASSESSMENT_QUESTIONS.length} soal)
              </p>
            </div>
            <p className="text-sm text-slate-600">{predicate.message}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-semibold hover:bg-slate-50 whitespace-nowrap shrink-0"
            >
              Coba Lagi
            </button>
            <button
              type="button"
              onClick={onGoToRewards}
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 whitespace-nowrap shrink-0"
            >
              Lihat Skor & Sertifikat
            </button>
          </div>
        </div>
      )}

      {/* Question Navigator Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2" role="navigation" aria-label="Navigasi nomor soal">
          {ASSESSMENT_QUESTIONS.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const userAnswer = answers[idx];
            const isAnswered = userAnswer !== null;
            const isCorrect = submitted && userAnswer === q.correctIndex;
            const isWrong = submitted && userAnswer !== q.correctIndex;

            let btnStyle = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';
            if (isCurrent) {
              btnStyle = 'bg-blue-600 text-white border-blue-600';
            } else if (isCorrect) {
              btnStyle = 'bg-emerald-50 text-emerald-800 border-emerald-300';
            } else if (isWrong) {
              btnStyle = 'bg-rose-50 text-rose-800 border-rose-300';
            } else if (isAnswered) {
              btnStyle = 'bg-blue-50 text-blue-800 border-blue-300';
            }

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  playClick();
                  setCurrentIndex(idx);
                }}
                aria-label={`Soal nomor ${q.id}`}
                aria-current={isCurrent ? 'step' : undefined}
                className={`w-10 h-10 rounded-lg border text-sm font-mono-math font-semibold transition-colors tabular-nums ${btnStyle}`}
              >
                {q.id}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-medium text-slate-600 tabular-nums">
          Terjawab: {answeredCount} / {ASSESSMENT_QUESTIONS.length} soal
        </p>
      </div>

      {/* Active Question Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Diagram Column */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500 border-b border-slate-100 pb-3">
            <span>Soal {currentQuestion.id} dari 10</span>
            <span>
              {currentQuestion.topic} · {currentQuestion.difficulty}
            </span>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-center">
            <ShapeDiagramSVG
              shape={currentQuestion.diagram.shape}
              labels={currentQuestion.diagram.labels}
              secondShape={currentQuestion.diagram.secondShape}
              className="w-full max-w-[260px] h-48"
            />
          </div>
          <p className="text-xs text-slate-500 text-center">
            Perhatikan ukuran yang tertulis pada gambar di atas sebelum memilih jawaban.
          </p>
        </div>

        {/* Question & Options Column */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {currentQuestion.id}. {currentQuestion.question}
          </h2>

          <div className="space-y-3" role="radiogroup" aria-label={`Pilihan jawaban soal ${currentQuestion.id}`}>
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = answers[currentIndex] === optIdx;
              const isCorrectOption = currentQuestion.correctIndex === optIdx;

              let optClass =
                'border-slate-200 bg-white text-slate-800 hover:border-blue-300 hover:bg-blue-50/40';
              if (!submitted && isSelected) {
                optClass = 'border-blue-600 bg-blue-50 text-blue-900 ring-1 ring-blue-600';
              } else if (submitted && isCorrectOption) {
                optClass = 'border-emerald-500 bg-emerald-50 text-emerald-950';
              } else if (submitted && isSelected && !isCorrectOption) {
                optClass = 'border-rose-400 bg-rose-50 text-rose-950';
              }

              return (
                <button
                  key={optIdx}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={submitted}
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border transition-colors flex items-center justify-between gap-4 ${optClass}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-md border border-current/25 flex items-center justify-center text-xs font-mono-math font-bold shrink-0">
                      {optionLetters[optIdx]}
                    </span>
                    <span className="font-medium text-base font-mono-math">{opt}</span>
                  </div>

                  {submitted && isCorrectOption && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                      Benar
                    </span>
                  )}
                  {submitted && isSelected && !isCorrectOption && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 shrink-0">
                      <XCircle className="w-4 h-4" />
                      Kurang Tepat
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Step-by-step explanation shown after submission */}
          {submitted && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold text-slate-700">Pembahasan Langkah Demi Langkah</p>
              <ul className="space-y-1 text-sm text-slate-700 font-mono-math">
                {currentQuestion.explanation.map((line, i) => (
                  <li key={i}>• {line}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                playClick();
                setCurrentIndex((i) => Math.max(0, i - 1));
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              Sebelumnya
            </button>

            <div className="flex items-center gap-3">
              {currentIndex < ASSESSMENT_QUESTIONS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setCurrentIndex((i) => Math.min(ASSESSMENT_QUESTIONS.length - 1, i + 1));
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 whitespace-nowrap shrink-0"
                >
                  Soal Berikutnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : null}

              {!submitted && (
                <button
                  type="button"
                  disabled={!allAnswered}
                  onClick={handleSubmit}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-40 whitespace-nowrap shrink-0"
                >
                  Kumpulkan Jawaban ({answeredCount}/10)
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
