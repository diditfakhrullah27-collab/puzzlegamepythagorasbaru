/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TactileButton } from './TactileButton';
import { LevelProgress, PracticeProgressRecord, StoryProgress } from '../types/game';

interface MainMenuProps {
  onPlay: () => void;
  onStory: () => void;
  onLearn: () => void;
  onPractice: () => void;
  onHelp: () => void;
  onSettings: () => void;
  progress: Record<number, LevelProgress>;
  practiceProgress?: PracticeProgressRecord;
  storyProgress?: StoryProgress;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onPlay,
  onStory,
  onLearn,
  onPractice,
  onHelp,
  onSettings,
  progress,
  practiceProgress = {},
  storyProgress,
}) => {
  const totalStars = Object.values(progress).reduce((acc, p) => acc + p.stars, 0);
  const completedLevels = Object.values(progress).filter((p) => p.completed).length;
  const totalLevels = 6;
  const maxStars = totalLevels * 3;

  const practiceCompleted = Object.values(practiceProgress).filter((p) => p.completed).length;
  const practiceTotalStars = Object.values(practiceProgress).reduce((acc, p) => acc + (p.stars || 0), 0);

  const storyCompleted = storyProgress ? storyProgress.completedChallengeIds.length : 0;

  return (
    <div className="relative w-full h-[100dvh] max-h-screen flex flex-col items-center justify-between p-3 sm:p-5 md:p-6 landscape:p-2 bg-radial from-slate-800 via-slate-900 to-slate-950 overflow-hidden text-slate-100 select-none">
      {/* Decorative Floating 3D Geometric Illustrations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <img
          src="/assets/geometry/shape_right_triangle.png"
          alt="Segitiga Siku-Siku"
          className="absolute -top-6 -left-6 w-36 md:w-56 object-contain animate-pulse"
        />
        <img
          src="/assets/geometry/shape_square.png"
          alt="Persegi"
          className="absolute top-1/4 -right-10 w-32 md:w-52 object-contain"
        />
        <img
          src="/assets/geometry/shape_trapezoid.png"
          alt="Trapesium"
          className="absolute -bottom-10 -left-6 w-40 md:w-64 object-contain"
        />
        <img
          src="/assets/geometry/shape_parallelogram.png"
          alt="Jajargenjang"
          className="absolute -bottom-8 -right-8 w-36 md:w-56 object-contain"
        />
      </div>

      {/* Top Header: Stats Badges (Story, Puzzle & Practice) */}
      <header className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-2 landscape:py-0">
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 rounded-xl sm:rounded-2xl border-2 border-amber-500/40 shadow-xl">
          <img src="/assets/rafi/rafi_bust_smile_closed.png" alt="Rafi" className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow" />
          <div className="text-left leading-tight">
            <span className="text-[9px] text-amber-400 font-bold uppercase tracking-wider block">Story Mode</span>
            <span className="text-xs sm:text-sm font-black text-white">{storyCompleted}/10 Bab</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-2.5 sm:px-3.5 py-1 rounded-xl sm:rounded-2xl border-2 border-sky-500/40 shadow-xl">
          <img src="/assets/icons/trophy.png" alt="Piala" className="w-5 h-5 sm:w-6 sm:h-6 object-contain drop-shadow" />
          <div className="text-left leading-tight">
            <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wider block">Petualangan Puzzle</span>
            <span className="text-xs sm:text-sm font-black text-sky-300">{completedLevels}/{totalLevels} Level ({totalStars}★)</span>
          </div>
        </div>
      </header>

      {/* Center Hero: Title & Menu Actions */}
      <main className="relative z-10 flex flex-col items-center justify-center my-auto text-center max-w-md sm:max-w-lg landscape:my-1 w-full px-2">
        {/* Animated Badge Container */}
        <div className="relative mb-1 sm:mb-2 landscape:mb-0.5">
          <div className="inline-flex items-center justify-center p-1.5 sm:p-2 rounded-2xl bg-gradient-to-b from-amber-400 via-amber-500 to-amber-600 shadow-[0_4px_0_#b45309] border-2 sm:border-4 border-amber-200">
            <img
              src="/assets/icons/star.png"
              alt="Pythagoras Icon"
              className="w-7 h-7 sm:w-10 sm:h-10 landscape:w-6 landscape:h-6 object-contain drop-shadow"
            />
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-500 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] tracking-tight landscape:text-lg sm:landscape:text-2xl">
          PYTHAGORAS ADVENTURE
        </h1>

        <p className="mt-0.5 text-xs sm:text-sm text-slate-300 font-medium max-w-md leading-snug landscape:hidden sm:landscape:block">
          Petualangan pembuktian geometri klasik & cerita interaktif bersama <strong className="text-amber-300">Rafi</strong>!
        </p>

        {/* Feature 1: STORY MODE (PETUALANGAN CERITA RAFI) */}
        <div className="mt-2.5 sm:mt-4 landscape:mt-1 w-full max-w-xs sm:max-w-sm">
          <button
            onClick={onStory}
            className="w-full py-2.5 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm sm:text-base shadow-[0_5px_0_#b45309] active:translate-y-1 active:shadow-[0_1px_0_#b45309] transition-all flex items-center justify-center gap-2.5 cursor-pointer ring-2 ring-amber-300/80"
          >
            <img src="/assets/rafi/rafi_bust_smile_closed.png" alt="Rafi Story Mode" className="w-6 h-6 sm:w-7 sm:h-7 object-contain drop-shadow" />
            <span className="tracking-wide">STORY MODE: PETUALANGAN RAFI</span>
            <span className="text-xs bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">BARU</span>
          </button>
        </div>

        {/* Feature 2: MULAI PETUALANGAN (Puzzle Klasik 6 Level) & SOAL LATIHAN */}
        <div className="mt-2 sm:mt-2.5 landscape:mt-1 grid grid-cols-2 gap-2 w-full max-w-xs sm:max-w-sm">
          <TactileButton
            iconSrc="/assets/icons/play.png"
            iconAlt="Puzzle Klasik"
            label="Puzzle Klasik"
            variant="primary"
            size="sm"
            className="py-2 text-xs font-black shadow-[0_4px_0_#b45309]"
            onClick={onPlay}
          />
          <TactileButton
            iconSrc="/assets/icons/ruler.png"
            iconAlt="Soal Latihan"
            label="Soal Latihan"
            variant="accent"
            size="sm"
            className="py-2 text-xs font-black shadow-[0_4px_0_#c2410c] bg-gradient-to-b from-orange-400 to-amber-600 text-amber-950 border-orange-700"
            onClick={onPractice}
          />
        </div>

        {/* Feature 3: MATERI, PETUNJUK & SETELAN */}
        <div className="mt-2 landscape:mt-1 grid grid-cols-3 gap-2 w-full max-w-xs sm:max-w-sm">
          <TactileButton
            iconSrc="/assets/icons/learn.png"
            iconAlt="Materi"
            label="Materi"
            variant="secondary"
            size="sm"
            className="py-1.5 text-xs font-bold"
            onClick={onLearn}
          />
          <TactileButton
            iconSrc="/assets/icons/help.png"
            iconAlt="Petunjuk"
            label="Petunjuk"
            variant="purple"
            size="sm"
            className="py-1.5 text-xs font-bold"
            onClick={onHelp}
          />
          <TactileButton
            iconSrc="/assets/icons/settings.png"
            iconAlt="Pengaturan"
            label="Setelan"
            variant="neutral"
            size="sm"
            className="py-1.5 text-xs font-bold"
            onClick={onSettings}
          />
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 flex flex-col items-center gap-1 text-center text-xs text-slate-400 pb-1 landscape:hidden sm:landscape:flex">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900/90 rounded-full border border-amber-500/40 text-amber-300 font-black text-[11px] shadow-lg tracking-wide">
          <span>👑 Made In Didit Fakhrullah • Story Mode Bersama Rafi</span>
        </div>
      </footer>
    </div>
  );
};
