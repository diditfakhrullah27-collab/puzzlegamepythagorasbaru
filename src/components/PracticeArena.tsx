/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PracticeCategory, PracticeChallenge, PracticeProgressRecord } from '../types/game';
import { PRACTICE_CHALLENGES } from '../data/practiceQuestions';
import { TactileButton } from './TactileButton';
import { soundEngine } from '../utils/audio';
import { SoundtrackPlayer } from './SoundtrackPlayer';

interface PracticeArenaProps {
  onHome: () => void;
  onOpenMateri: (chapterId?: number) => void;
  progress: PracticeProgressRecord;
  onSaveProgress: (updated: PracticeProgressRecord) => void;
  initialChallengeId?: number;
  onReturnToStory?: (challengeId: number) => void;
}

export const PracticeArena: React.FC<PracticeArenaProps> = ({
  onHome,
  onOpenMateri,
  progress,
  onSaveProgress,
  initialChallengeId,
  onReturnToStory,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<PracticeCategory | 'semua'>('semua');
  const [activeChallengeId, setActiveChallengeId] = useState<number | null>(initialChallengeId || null);
  const [activeSubIndex, setActiveSubIndex] = useState<number>(0);
  
  // Active question interaction state
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [challengeScore, setChallengeScore] = useState<number>(0);
  const [showResultModal, setShowResultModal] = useState<boolean>(false);
  const [answeredMap, setAnsweredMap] = useState<Record<string, { correct: boolean; answer: string }>>({});

  const activeChallenge = PRACTICE_CHALLENGES.find((c) => c.id === activeChallengeId);
  const currentSub = activeChallenge ? activeChallenge.subQuestions[activeSubIndex] : null;

  // Filter challenges by category
  const filteredChallenges = PRACTICE_CHALLENGES.filter((c) =>
    selectedCategory === 'semua' ? true : c.category === selectedCategory
  );

  // Total stars & completed challenges
  const totalStars = Object.values(progress).reduce((acc, p) => acc + (p.stars || 0), 0);
  const completedCount = Object.values(progress).filter((p) => p.completed).length;

  const handleStartChallenge = (challengeId: number) => {
    setActiveChallengeId(challengeId);
    setActiveSubIndex(0);
    setSelectedAnswer('');
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setShowHint(false);
    setChallengeScore(0);
    setAnsweredMap({});
    setShowResultModal(false);
    soundEngine.click();
  };

  const handleSelectAnswer = (ans: string) => {
    if (isAnswerChecked && isCorrect) return;
    setSelectedAnswer(ans);
    setIsAnswerChecked(false);
    soundEngine.click();
  };

  const handleCheckAnswer = () => {
    if (!currentSub || !selectedAnswer) return;

    const normalizedChosen = selectedAnswer.trim().toLowerCase();
    const normalizedCorrect = currentSub.correctAnswer.trim().toLowerCase();
    const isAnsCorrect = Boolean(
      normalizedChosen === normalizedCorrect ||
      (currentSub.acceptableAnswers &&
        currentSub.acceptableAnswers.some((a) => a.trim().toLowerCase() === normalizedChosen))
    );

    setIsAnswerChecked(true);
    setIsCorrect(isAnsCorrect);

    const subId = currentSub.id;
    const newAnswered = {
      ...answeredMap,
      [subId]: { correct: isAnsCorrect, answer: selectedAnswer },
    };
    setAnsweredMap(newAnswered);

    if (isAnsCorrect) {
      soundEngine.success();
      setChallengeScore((prev) => prev + 10);
      try {
        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      } catch {}
    } else {
      soundEngine.error();
    }
  };

  const handleNextSubQuestion = () => {
    if (!activeChallenge) return;

    if (activeSubIndex < activeChallenge.subQuestions.length - 1) {
      setActiveSubIndex((prev) => prev + 1);
      setSelectedAnswer('');
      setIsAnswerChecked(false);
      setIsCorrect(false);
      setShowHint(false);
      soundEngine.click();
    } else {
      // Challenge finished! Calculate total stars & record progress
      const totalSubs = activeChallenge.subQuestions.length;
      const correctSubs = Object.values(answeredMap).filter((a) => a.correct).length;
      const percentage = Math.round((correctSubs / totalSubs) * 100);

      const starsEarned = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

      const updatedProgress: PracticeProgressRecord = {
        ...progress,
        [activeChallenge.id]: {
          unlocked: true,
          completed: true,
          score: Math.max(progress[activeChallenge.id]?.score || 0, percentage),
          stars: Math.max(progress[activeChallenge.id]?.stars || 0, starsEarned),
          completedSubIds: Object.keys(answeredMap),
        },
      };

      // Unlock next challenge if exists
      const nextId = activeChallenge.id + 1;
      if (nextId <= 10) {
        updatedProgress[nextId] = {
          ...(updatedProgress[nextId] || {
            unlocked: false,
            completed: false,
            score: 0,
            stars: 0,
            completedSubIds: [],
          }),
          unlocked: true,
        };
      }

      onSaveProgress(updatedProgress);
      setShowResultModal(true);
      soundEngine.victory();
    }
  };

  const handleRetryCurrentChallenge = () => {
    if (activeChallengeId) {
      handleStartChallenge(activeChallengeId);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-screen flex flex-col bg-slate-950 select-none overflow-hidden text-slate-100 font-sans">
      {/* Top Header Bar */}
      <header className="h-10 sm:h-11 md:h-12 px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 z-30">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <TactileButton
            iconSrc="/assets/icons/home.png"
            iconAlt="Menu Utama"
            label="Menu"
            variant="neutral"
            size="sm"
            className="py-1 px-2.5 text-xs"
            onClick={onHome}
          />
          {activeChallengeId && (
            <TactileButton
              iconSrc="/assets/icons/back.png"
              iconAlt="Daftar Soal"
              label="Daftar Tantangan"
              variant="neutral"
              size="sm"
              className="py-1 px-2.5 text-xs"
              onClick={() => {
                setActiveChallengeId(null);
                soundEngine.click();
              }}
            />
          )}
          <span className="hidden sm:inline-block text-xs sm:text-sm font-black text-amber-400 ml-1 truncate">
            {activeChallenge ? activeChallenge.numberTitle : 'Tantangan Soal Pythagoras'}
          </span>
        </div>

        {/* Center / Right info badges */}
        <div className="flex items-center gap-2">
          <SoundtrackPlayer currentFeature="Ayo Berlatih" />

          <button
            onClick={() => onOpenMateri(activeChallenge?.recommendedChapter || 1)}
            className="px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-xl text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all active:scale-95"
            title="Pelajari materi pendukung di buku ensiklopedia"
          >
            <img src="/assets/rafi/item_math_book.png" alt="Materi" className="w-4 h-4 object-contain" />
            <span className="hidden sm:inline">Buka Materi</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-900 border border-amber-500/40 px-2.5 py-1 rounded-xl shadow-sm">
            <img src="/assets/rafi/item_star.png" alt="Bintang" className="w-4 h-4 object-contain drop-shadow" />
            <span className="text-xs sm:text-sm font-black text-amber-300">
              {totalStars}/30
            </span>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      {!activeChallengeId ? (
        /* ========================================================
           SCREEN 1: CHALLENGE SELECTION LIST (10 TANTANGAN DARI PDF)
           ======================================================== */
        <main className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-5 md:p-6 max-w-5xl mx-auto w-full flex flex-col justify-between">
          <div className="space-y-3 sm:space-y-4">
            {/* Header intro lockup */}
            <div className="text-center space-y-1">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/10 px-3 py-0.5 rounded-full border border-amber-500/30 inline-block">
                AYO BERLATIH 1 • TEOREMA PYTHAGORAS
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white drop-shadow">
                Tantangan Puzzle Matematika
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Asah pemahaman geometri dengan 10 kelompok tantangan puzzle interaktif bersumber langsung dari buku materi. Selesaikan tantangan untuk membuka nomor berikutnya!
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-1">
              {[
                { id: 'semua', label: 'Semua (1-10)' },
                { id: 'mudah', label: 'Level 1: Mudah (No. 1-2)' },
                { id: 'sedang', label: 'Level 2: Sedang (No. 3, 5, 8)' },
                { id: 'menantang', label: 'Level 3: Menantang (No. 4, 6, 7, 9, 10)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id as PracticeCategory | 'semua');
                    soundEngine.click();
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-amber-500 text-slate-950 border-amber-300 shadow-md scale-102'
                      : 'bg-slate-900/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 10 Challenges Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
              {filteredChallenges.map((challenge) => {
                const prog = progress[challenge.id] || {
                  unlocked: challenge.id === 1,
                  completed: false,
                  score: 0,
                  stars: 0,
                  completedSubIds: [],
                };
                const isUnlocked = prog.unlocked;

                return (
                  <div
                    key={challenge.id}
                    onClick={() => isUnlocked && handleStartChallenge(challenge.id)}
                    className={`rounded-2xl p-3 sm:p-3.5 border-2 transition-all flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-gradient-to-b from-slate-850 to-slate-900 border-amber-500/50 shadow-md hover:border-amber-400 hover:-translate-y-0.5 cursor-pointer'
                        : 'bg-slate-900/40 border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      {/* Card Header: Badge + Difficulty */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-black font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          No. {challenge.id}
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            challenge.category === 'mudah'
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-600'
                              : challenge.category === 'sedang'
                              ? 'bg-sky-950 text-sky-300 border-sky-600'
                              : 'bg-purple-950 text-purple-300 border-purple-600'
                          }`}
                        >
                          {challenge.categoryLabel}
                        </span>
                      </div>

                      <h3 className="text-sm font-black text-white leading-snug line-clamp-2">
                        {challenge.numberTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {challenge.description}
                      </p>
                    </div>

                    {/* Card Footer: Sub-questions count & Stars */}
                    <div className="pt-2.5 mt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400 font-bold">
                        {challenge.subQuestions.length} Subsoal
                      </span>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <img
                            key={s}
                            src="/assets/icons/star.png"
                            alt="Bintang"
                            className={`w-3.5 h-3.5 object-contain ${
                              s <= prog.stars ? 'opacity-100 drop-shadow' : 'opacity-20 grayscale'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Watermark */}
          <footer className="mt-4 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Selesai: {completedCount}/10 Tantangan</span>
            <span className="font-bold text-amber-400/90 uppercase tracking-wider">
              👑 Made In Didit Fakhrullah
            </span>
          </footer>
        </main>
      ) : (
        /* ========================================================
           SCREEN 2: INTERACTIVE CHALLENGE PLAYER (1 OF 10)
           ======================================================== */
        activeChallenge && currentSub && (
          <main className="flex-1 min-h-0 w-full flex flex-col landscape:flex-row md:flex-row overflow-hidden bg-slate-950">
            {/* Left Area: Dynamic Visual SVG Diagram + Question Prompt */}
            <section className="flex-1 h-full min-h-0 overflow-y-auto p-3 sm:p-5 flex flex-col justify-between border-b landscape:border-b-0 landscape:border-r md:border-b-0 md:border-r border-slate-800">
              <div className="space-y-3">
                {/* Challenge & Subquestion Progress Stepper */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 font-black text-xs border border-amber-500/40">
                      Tantangan {activeChallenge.id}
                    </span>
                    <span className="text-xs font-bold text-slate-300">
                      {currentSub.label} ({activeSubIndex + 1}/{activeChallenge.subQuestions.length})
                    </span>
                  </div>

                  <span className="text-xs font-mono font-bold text-amber-400">
                    Skor: {challengeScore} Poin
                  </span>
                </div>

                {/* Question Text */}
                <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-3 sm:p-4 shadow-sm space-y-1">
                  <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-100 leading-relaxed">
                    {currentSub.questionText}
                  </h3>
                  <span className="text-[10px] text-amber-400/80 font-mono block">
                    Sumber: {activeChallenge.sourceReference}
                  </span>
                </div>

                {/* Interactive Dynamic SVG Diagram Box */}
                <div className="w-full bg-slate-900/60 border border-cyan-500/30 rounded-2xl p-3 flex items-center justify-center relative min-h-[160px] sm:min-h-[200px]">
                  <svg className="w-full max-w-sm h-40 sm:h-48" viewBox="0 0 300 180">
                    <defs>
                      <linearGradient id="diagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>

                    {/* DIAGRAM 1: Right Triangle */}
                    {currentSub.diagramType === 'triangle' && (
                      <g transform="translate(60, 20)">
                        <polygon
                          points="0,130 180,130 0,20"
                          fill="url(#diagGrad)"
                          stroke="#38bdf8"
                          strokeWidth="2.5"
                          strokeLinejoin="round"
                        />
                        {/* Right angle symbol */}
                        <path d="M 0 115 L 15 115 L 15 130" fill="none" stroke="#f59e0b" strokeWidth="2" />
                        
                        {/* Side labels */}
                        <text x="-15" y="75" fill="#facc15" fontSize="12" fontWeight="bold" textAnchor="end">
                          {String(currentSub.diagramProps?.height || currentSub.diagramProps?.sideB || currentSub.diagramProps?.ab || 'Tinggi')}
                        </text>
                        <text x="90" y="148" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">
                          {String(currentSub.diagramProps?.base || currentSub.diagramProps?.sideC || currentSub.diagramProps?.bc || 'Alas')}
                        </text>
                        <text x="105" y="65" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="start">
                          {String(currentSub.diagramProps?.hyp || currentSub.diagramProps?.sideA || currentSub.diagramProps?.ac || 'Hipotenusa')}
                        </text>
                      </g>
                    )}

                    {/* DIAGRAM 2: Rectangle with Diagonal */}
                    {currentSub.diagramType === 'rectangle' && (
                      <g transform="translate(40, 25)">
                        <rect x="0" y="0" width="220" height="120" rx="4" fill="url(#diagGrad)" stroke="#38bdf8" strokeWidth="2.5" />
                        <line x1="0" y1="120" x2="220" y2="0" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="5 3" />
                        <text x="110" y="140" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                          Panjang = 10,5 cm
                        </text>
                        <text x="-10" y="65" fill="#facc15" fontSize="11" fontWeight="bold" textAnchor="end">
                          Lebar (l) = ?
                        </text>
                        <text x="120" y="55" fill="#f43f5e" fontSize="11" fontWeight="bold">
                          Diagonal = 14,5 cm
                        </text>
                      </g>
                    )}

                    {/* DIAGRAM 3: Kite */}
                    {currentSub.diagramType === 'kite' && (
                      <g transform="translate(150, 90)">
                        <polygon points="0,-70 55,-10 0,75 -55,-10" fill="url(#diagGrad)" stroke="#38bdf8" strokeWidth="2.5" />
                        <line x1="0" y1="-70" x2="0" y2="75" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                        <line x1="-55" y1="-10" x2="55" y2="-10" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 2" />
                        <rect x="0" y="-10" width="10" height="10" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                        <text x="35" y="-45" fill="#facc15" fontSize="10" fontWeight="bold">Sisi Luar</text>
                        <text x="0" y="5" fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle">90°</text>
                      </g>
                    )}

                    {/* DIAGRAM 4: Trapezoid */}
                    {currentSub.diagramType === 'trapezoid' && (
                      <g transform="translate(45, 25)">
                        <polygon points="0,0 140,0 210,120 0,120" fill="url(#diagGrad)" stroke="#38bdf8" strokeWidth="2.5" />
                        <line x1="140" y1="0" x2="140" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
                        <text x="70" y="-8" fill="#facc15" fontSize="11" fontWeight="bold" textAnchor="middle">CD = 27 cm</text>
                        <text x="-10" y="65" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="end">AD = 24 cm</text>
                        <text x="105" y="138" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">AB = 34 cm</text>
                        <text x="148" y="65" fill="#f59e0b" fontSize="10" fontWeight="bold">CE=24</text>
                        <text x="195" y="60" fill="#f43f5e" fontSize="11" fontWeight="bold">BC=?</text>
                      </g>
                    )}

                    {/* DIAGRAM 5: Pole & Rope */}
                    {currentSub.diagramType === 'pole' && (
                      <g transform="translate(50, 20)">
                        <line x1="0" y1="130" x2="200" y2="130" stroke="#64748b" strokeWidth="3" />
                        <line x1="20" y1="130" x2="20" y2="10" stroke="#facc15" strokeWidth="4" />
                        <line x1="20" y1="10" x2="160" y2="130" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" />
                        <circle cx="160" cy="130" r="4" fill="#f43f5e" />
                        <text x="8" y="75" fill="#facc15" fontSize="11" fontWeight="bold" textAnchor="end">Tiang (t = ?)</text>
                        <text x="90" y="146" fill="#64748b" fontSize="11" fontWeight="bold" textAnchor="middle">Patok = 8 m</text>
                        <text x="105" y="65" fill="#38bdf8" fontSize="11" fontWeight="bold">Tali = 17 m</text>
                      </g>
                    )}

                    {/* DIAGRAM 6: Composite / Parallelogram */}
                    {(currentSub.diagramType === 'composite' || currentSub.diagramType === 'parallelogram') && (
                      <g transform="translate(45, 20)">
                        <polygon points="0,0 120,0 180,120 60,120" fill="url(#diagGrad)" stroke="#38bdf8" strokeWidth="2.5" />
                        <polygon points="180,120 230,120 180,0" fill="#f59e0b" fillOpacity="0.2" stroke="#f59e0b" strokeWidth="2" />
                        <text x="60" y="-8" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Jajargenjang</text>
                        <text x="215" y="60" fill="#f43f5e" fontSize="10" fontWeight="bold">37 cm</text>
                        <text x="205" y="136" fill="#f59e0b" fontSize="10" fontWeight="bold">12 cm</text>
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              {/* Hint Box (Optional toggle) */}
              {showHint && (
                <div className="mt-3 p-3 rounded-xl bg-amber-950/80 border border-amber-500/60 text-xs text-amber-200 animate-in fade-in flex items-start gap-2">
                  <img src="/assets/icons/hint.png" alt="Petunjuk" className="w-4 h-4 object-contain flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold text-amber-300 mb-0.5">Petunjuk Pengerjaan:</strong>
                    <span>{currentSub.hint}</span>
                  </div>
                </div>
              )}
            </section>

            {/* Right Area: Interactive Options / Formula Chips & Evaluation */}
            <aside className="w-full landscape:w-80 md:w-96 p-3 sm:p-5 flex flex-col justify-between bg-slate-900/95 overflow-y-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-xs font-black uppercase text-amber-400 tracking-wide">
                    {currentSub.type === 'formula_puzzle' ? 'Susun Rumus' : 'Pilih Jawaban'}
                  </span>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                  >
                    <img src="/assets/icons/hint.png" alt="Hint" className="w-3.5 h-3.5 object-contain" />
                    <span>{showHint ? 'Tutup Petunjuk' : 'Buka Petunjuk'}</span>
                  </button>
                </div>

                {/* Mode 1: Formula Puzzle Chips */}
                {currentSub.formulaChips && (
                  <div className="space-y-2">
                    <span className="text-xs text-slate-300 block">
                      Pilih rumus hubungan Pythagoras yang tepat:
                    </span>
                    <div className="grid grid-cols-1 gap-2">
                      {currentSub.formulaChips.map((chip) => (
                        <button
                          key={chip}
                          onClick={() => handleSelectAnswer(chip)}
                          className={`p-3 rounded-xl font-mono font-bold text-sm text-left border-2 transition-all cursor-pointer flex items-center justify-between ${
                            selectedAnswer === chip
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-400/40'
                              : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750'
                          }`}
                        >
                          <span>{chip}</span>
                          {selectedAnswer === chip && (
                            <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center text-xs">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mode 2: Multiple Choice Options */}
                {currentSub.options && (
                  <div className="space-y-2">
                    <span className="text-xs text-slate-300 block">Pilih jawaban yang paling tepat:</span>
                    <div className="grid grid-cols-1 gap-2">
                      {currentSub.options.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectAnswer(opt.id)}
                          className={`p-2.5 rounded-xl text-left border-2 transition-all cursor-pointer flex items-start gap-2.5 ${
                            selectedAnswer === opt.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md ring-2 ring-amber-400/40'
                              : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-750'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${
                            selectedAnswer === opt.id ? 'bg-amber-400 text-slate-950' : 'bg-slate-700 text-slate-300'
                          }`}>
                            {opt.label}
                          </span>
                          <span className="text-xs font-medium leading-relaxed">{opt.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step-by-Step Explanation Banner (Shown after check) */}
                {isAnswerChecked && (
                  <div
                    className={`p-3 rounded-2xl border text-xs space-y-1.5 animate-in zoom-in-95 ${
                      isCorrect
                        ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                        : 'bg-rose-950/90 border-rose-500 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-bold text-sm">
                      <img
                        src={isCorrect ? '/assets/icons/check.png' : '/assets/icons/retry.png'}
                        alt="Status"
                        className="w-5 h-5 object-contain"
                      />
                      <span>{isCorrect ? 'Jawaban Kamu Tepat Sekali!' : 'Jawaban Belum Tepat'}</span>
                    </div>

                    <div className="space-y-1 text-slate-300 font-mono text-[11px] pt-1 border-t border-slate-700/60">
                      <strong className="block font-sans text-amber-300 font-bold">Pembahasan Matematis:</strong>
                      {currentSub.explanation.map((step, sIdx) => (
                        <p key={sIdx}>{step}</p>
                      ))}
                    </div>

                    {currentSub.teacherVerificationNote && (
                      <p className="text-[10px] text-amber-400 bg-amber-950/80 p-1.5 rounded-lg border border-amber-500/50 mt-1">
                        ℹ️ {currentSub.teacherVerificationNote}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Bottom Evaluation Action Buttons */}
              <div className="pt-3 border-t border-slate-800 space-y-2">
                {!isAnswerChecked || !isCorrect ? (
                  <TactileButton
                    iconSrc="/assets/icons/check.png"
                    iconAlt="Periksa"
                    label="PERIKSA JAWABAN"
                    variant="success"
                    size="md"
                    className="w-full py-2.5 text-xs sm:text-sm shadow-md"
                    disabled={!selectedAnswer}
                    onClick={handleCheckAnswer}
                  />
                ) : (
                  <TactileButton
                    iconSrc="/assets/icons/next.png"
                    iconAlt="Lanjut"
                    label={activeSubIndex < activeChallenge.subQuestions.length - 1 ? 'LANJUTKAN SUBSOAL' : 'SELESAIKAN TANTANGAN'}
                    variant="primary"
                    size="md"
                    className="w-full py-2.5 text-xs sm:text-sm shadow-md animate-pulse"
                    onClick={handleNextSubQuestion}
                  />
                )}
              </div>
            </aside>
          </main>
        )
      )}

      {/* RESULT MODAL (HASIL LATIHAN TANTANGAN) */}
      {showResultModal && activeChallenge && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-3 sm:p-5 bg-black/85 backdrop-blur-md flex items-center justify-center select-none">
          <div className="bg-slate-850 border-3 sm:border-4 border-amber-400 rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl text-center space-y-4 my-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center">
              <img src="/assets/icons/trophy.png" alt="Piala" className="w-10 h-10 object-contain drop-shadow" />
            </div>

            <div>
              <span className="text-[10px] font-black tracking-widest text-amber-400 uppercase block">
                HASIL LATIHAN TANTANGAN {activeChallenge.id}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-white mt-1">
                {activeChallenge.numberTitle}
              </h3>
            </div>

            {/* Stars */}
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3].map((s) => {
                const totalSubs = activeChallenge.subQuestions.length;
                const correctSubs = Object.values(answeredMap).filter((a) => a.correct).length;
                const percentage = Math.round((correctSubs / totalSubs) * 100);
                const earned = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;
                return (
                  <img
                    key={s}
                    src="/assets/icons/star.png"
                    alt="Bintang"
                    className={`w-8 h-8 object-contain transition-all ${
                      s <= earned ? 'drop-shadow scale-110' : 'opacity-20 grayscale'
                    }`}
                  />
                );
              })}
            </div>

            {/* Score Summary Box */}
            <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-700 text-xs text-left space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Kategori:</span>
                <strong className="text-amber-300">{activeChallenge.categoryLabel}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Subsoal:</span>
                <span>{activeChallenge.subQuestions.length} Soal</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Jawaban Benar:</span>
                <span>{Object.values(answeredMap).filter((a) => a.correct).length} Soal</span>
              </div>
              <div className="flex justify-between text-rose-400 font-bold">
                <span>Jawaban Salah / Percobaan:</span>
                <span>{Object.values(answeredMap).filter((a) => !a.correct).length} Soal</span>
              </div>
              <div className="flex justify-between text-slate-100 font-black pt-1 border-t border-slate-800 text-sm">
                <span>Nilai Akhir:</span>
                <span className="text-amber-400">
                  {Math.round(
                    (Object.values(answeredMap).filter((a) => a.correct).length /
                      activeChallenge.subQuestions.length) *
                      100
                  )}%
                </span>
              </div>
            </div>

            {/* Recommendation banner */}
            <div className="bg-indigo-950/70 border border-indigo-500/50 p-2.5 rounded-xl text-xs text-indigo-200 text-left">
              <strong className="block text-amber-300 mb-0.5 font-bold">Rekomendasi Materi:</strong>
              <span>
                Pelajari kembali <strong>Bab {activeChallenge.recommendedChapter}</strong> di menu Materi untuk memperkuat pemahaman geometri.
              </span>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <TactileButton
                iconSrc="/assets/icons/retry.png"
                iconAlt="Ulangi"
                label="Ulangi"
                variant="neutral"
                size="sm"
                className="py-2 text-xs"
                onClick={handleRetryCurrentChallenge}
              />
              <TactileButton
                iconSrc="/assets/icons/home.png"
                iconAlt="Daftar Soal"
                label="Daftar Soal"
                variant="primary"
                size="sm"
                className="py-2 text-xs"
                onClick={() => {
                  setActiveChallengeId(null);
                  setShowResultModal(false);
                  soundEngine.click();
                }}
              />
            </div>

            {/* Direct next challenge button if available */}
            {activeChallenge.id < 10 && (
              <button
                onClick={() => {
                  handleStartChallenge(activeChallenge.id + 1);
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs sm:text-sm shadow-[0_4px_0_#065f46] active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <span>Kerjakan Tantangan {activeChallenge.id + 1} Langsung ➔</span>
              </button>
            )}

            {onReturnToStory && (
              <button
                onClick={() => {
                  setShowResultModal(false);
                  onReturnToStory(activeChallenge.id);
                  soundEngine.click();
                }}
                className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_4px_0_#b45309] active:translate-y-0.5 active:shadow-[0_1px_0_#b45309] transition-all flex items-center justify-center gap-2 cursor-pointer mt-1"
              >
                <img src="/assets/rafi/rafi_bust_smile_closed.png" alt="Rafi" className="w-5 h-5 object-contain" />
                <span>Lanjutkan Cerita Rafi ➔</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
