/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LevelProgress, PracticeProgressRecord, StoryProgress } from '../types/game';
import { soundEngine } from '../utils/audio';
import { SoundtrackPlayer } from './SoundtrackPlayer';
import { EducationalVideoWidget } from './EducationalVideoWidget';

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
  const storyCompleted = storyProgress ? storyProgress.completedChallengeIds.length : 0;

  const [openVideoTheater, setOpenVideoTheater] = React.useState<boolean>(false);

  const handleNav = (action: () => void) => {
    soundEngine.click();
    soundEngine.transition();
    action();
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-screen flex flex-col justify-between overflow-hidden select-none bg-gradient-to-b from-sky-400 via-sky-300 to-emerald-100">
      {/* ==============================================================
          LAYER 1: SKY, SOFT GLOW & FLUFFY CLOUDS
          ============================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Warm sunlight gradient */}
        <div className="absolute -top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-amber-200/40 blur-3xl" />

        {/* Fluffy stylized clouds */}
        <div className="absolute top-5 left-10 w-36 h-10 rounded-full bg-white/70 blur-[1px] shadow-sm animate-pulse" />
        <div className="absolute top-12 right-20 w-48 h-12 rounded-full bg-white/60 blur-[1px] shadow-sm" />
        <div className="absolute top-28 left-1/3 w-32 h-8 rounded-full bg-white/40 blur-[1px]" />
      </div>

      {/* ==============================================================
          LAYER 2: ROLLING HILLS & CLEAN SCENIC ENVIRONMENT
          ============================================================== */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none h-60 sm:h-72 overflow-hidden">
        {/* Back green hill */}
        <div className="absolute inset-x-0 bottom-0 h-32 sm:h-40 bg-gradient-to-t from-emerald-700 via-emerald-600 to-emerald-500 rounded-t-[50%] scale-x-125 shadow-inner opacity-85" />

        {/* Foreground rolling grass */}
        <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-emerald-800 to-emerald-600" />

        {/* Left Side: Charming village trees & signpost illustration (anchored seamlessly) */}
        <div className="absolute bottom-0 left-0 sm:left-4 flex items-end pointer-events-none">
          <img
            src="/assets/rafi/tree_and_signpost.png"
            alt="Pohon dan Papan"
            className="w-52 sm:w-68 object-contain drop-shadow-md z-10"
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
          />
        </div>

        {/* Right Side: Scenic lush oak tree framing the meadow */}
        <div className="absolute bottom-0 right-0 sm:right-4 flex items-end pointer-events-none">
          <img
            src="/assets/sliced/tree_oak_large.png"
            alt="Pohon Rindang"
            className="w-44 sm:w-56 object-contain drop-shadow-md z-10"
            onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
          />
        </div>
      </div>

      {/* ==============================================================
          LAYER 3: TOP HEADER BAR (Stats & Music Player)
          ============================================================== */}
      <header className="relative z-30 w-full px-3 sm:px-6 pt-2 sm:pt-3 flex items-center justify-between gap-2">
        {/* Left Stats Badges */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Story Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-amber-950/85 backdrop-blur-md border border-amber-400/60 shadow-lg text-white">
            <img
              src="/assets/rafi/item_math_book.png"
              alt="Cerita"
              className="w-5 h-5 object-contain drop-shadow"
            />
            <div className="text-left leading-none">
              <span className="text-[9px] text-amber-300 font-bold uppercase tracking-wider block">Cerita</span>
              <span className="text-xs font-black text-amber-100">{storyCompleted}/10 Bab</span>
            </div>
          </div>

          {/* Puzzle Progress Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-sky-950/85 backdrop-blur-md border border-sky-400/60 shadow-lg text-white">
            <img
              src="/assets/rafi/item_trophy.png"
              alt="Piala"
              className="w-5 h-5 object-contain drop-shadow"
            />
            <div className="text-left leading-none">
              <span className="text-[9px] text-sky-300 font-bold uppercase tracking-wider block">Lab Puzzle</span>
              <span className="text-xs font-black text-sky-100">{completedLevels}/{totalLevels} ({totalStars}★)</span>
            </div>
          </div>
        </div>

        {/* Right Controls: Video Edukasi, Soundtrack Player & Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEngine.click();
              setOpenVideoTheater(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950 border border-yellow-200 shadow-md font-black text-xs transition active:scale-95 cursor-pointer"
            title="Tonton Video Edukasi Pythagoras Bersama Rafi"
          >
            <span>🎬</span>
            <span className="hidden sm:inline">Video Edukasi</span>
          </button>

          <SoundtrackPlayer currentFeature="Menu Utama" />

          <button
            onClick={() => handleNav(onSettings)}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-amber-300 border border-amber-500/60 shadow-lg flex items-center justify-center transition active:scale-95 cursor-pointer"
            title="Setelan Suara & Game"
          >
            <img
              src="/assets/icons/settings.png"
              alt="Settings"
              className="w-4 h-4 object-contain"
            />
          </button>
        </div>
      </header>

      {/* ==============================================================
          LAYER 4: MAIN INTERACTIVE CENTER (Character + Notice Board)
          ============================================================== */}
      <main className="relative z-20 my-auto flex items-center justify-center gap-3 sm:gap-6 px-2 w-full max-w-4xl mx-auto">
        {/* Rafi Mascot on the Left with Speaking Bubble */}
        <div className="hidden md:flex flex-col items-center shrink-0 w-36 sm:w-44 -mt-2">
          {/* Welcome Speech Bubble */}
          <div className="relative mb-2 px-3 py-2 rounded-2xl bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-600 shadow-xl text-slate-900 text-center max-w-[170px]">
            <p className="text-[11px] font-bold leading-tight">
              Ayo buktikan keajaiban rumus <span className="text-amber-700 font-black">a² + b² = c²</span> bersama Rafi!
            </p>
            {/* Bubble arrow pointing down */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[7px] border-t-amber-600" />
          </div>

          {/* Rafi Standing Character */}
          <img
            src="/assets/rafi/rafi_pose_presenting.png"
            alt="Rafi"
            className="w-32 sm:w-36 object-contain drop-shadow-2xl hover:scale-105 transition-transform"
            onError={(e) => {
              e.currentTarget.src = '/assets/rafi/rafi_portrait_main_thumbsup.png';
            }}
          />
        </div>

        {/* Central Wooden Notice Board Card */}
        <div className="relative w-full max-w-md sm:max-w-lg rounded-3xl bg-gradient-to-b from-amber-900 via-amber-950 to-stone-950 border-4 border-amber-500/80 shadow-[0_12px_30px_rgba(0,0,0,0.6)] p-3.5 sm:p-5 text-center flex flex-col items-center">
          {/* Golden Ribbon Banner Header */}
          <div className="relative -mt-7 sm:-mt-9 mb-1 sm:mb-2">
            <div className="px-5 sm:px-7 py-1 rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 border-2 border-yellow-200 shadow-xl flex items-center justify-center gap-2">
              <img
                src="/assets/rafi/item_star.png"
                alt="Bintang"
                className="w-4 h-4 object-contain drop-shadow"
              />
              <span className="text-xs sm:text-sm font-black text-amber-950 tracking-wider uppercase">
                Game Edukasi Interaktif
              </span>
              <img
                src="/assets/rafi/item_star.png"
                alt="Bintang"
                className="w-4 h-4 object-contain drop-shadow"
              />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-amber-300 to-amber-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-tight">
            PETUALANGAN PYTHAGORAS
          </h1>
          <p className="text-[11px] sm:text-xs text-amber-200/80 font-medium mt-0.5 mb-3 sm:mb-4">
            Laboratorium Pembuktian Puzzle & Cerita Matematika Bersama Rafi
          </p>

          {/* Action 1: STORY MODE (Main Banner Button) */}
          <button
            onClick={() => handleNav(onStory)}
            className="w-full group relative py-2.5 sm:py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-500 hover:from-emerald-400 hover:to-green-400 text-emerald-950 font-black text-sm sm:text-base shadow-[0_5px_0_#065f46] active:translate-y-1 active:shadow-[0_1px_0_#065f46] transition-all flex items-center justify-between border-2 border-emerald-200 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
                <img
                  src="/assets/rafi/item_math_book.png"
                  alt="Cerita"
                  className="w-7 h-7 object-contain drop-shadow"
                />
              </div>
              <div className="text-left leading-tight">
                <span className="block text-xs sm:text-sm font-black tracking-wide">
                  PETUALANGAN CERITA RAFI
                </span>
                <span className="text-[10px] text-emerald-900 font-semibold block">
                  10 Bab Misi & Pembuktian Interaktif
                </span>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-900 text-yellow-300 text-[10px] font-black border border-emerald-700">
              MAIN
            </span>
          </button>

          {/* Action: Video Edukasi Rafi Banner */}
          <button
            onClick={() => {
              soundEngine.click();
              setOpenVideoTheater(true);
            }}
            className="w-full mt-2 group py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-black text-xs shadow-[0_3px_0_#78350f] active:translate-y-0.5 active:shadow-[0_1px_0_#78350f] transition-all flex items-center justify-between border-2 border-yellow-200 cursor-pointer"
            title="Tonton Video Edukasi Petualangan Pythagoras"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">🎬</span>
              <div className="text-left leading-tight">
                <span className="block font-black text-[11px] sm:text-xs text-amber-950 uppercase tracking-wide">
                  Video Edukasi Pythagoras
                </span>
                <span className="text-[9px] sm:text-[10px] text-amber-900 font-semibold block">
                  Panduan konsep & trik pembuktian bersama Rafi
                </span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-amber-950 text-yellow-300 text-[10px] font-black border border-amber-800">
              ▶ Tonton
            </span>
          </button>

          {/* Action 2: PUZZLE KLASIK & AYO BERLATIH */}
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full mt-2.5">
            {/* Lab Puzzle */}
            <button
              onClick={() => handleNav(onPlay)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-amber-950 font-black text-xs sm:text-sm shadow-[0_4px_0_#78350f] active:translate-y-1 active:shadow-[0_1px_0_#78350f] transition-all flex items-center justify-center gap-2 border-2 border-amber-200 cursor-pointer"
            >
              <img
                src="/assets/rafi/item_triangle_ruler.png"
                alt="Puzzle"
                className="w-5 h-5 object-contain drop-shadow"
              />
              <span className="truncate">Puzzle Klasik</span>
            </button>

            {/* Ayo Berlatih */}
            <button
              onClick={() => handleNav(onPractice)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-b from-orange-400 to-amber-700 hover:from-orange-300 hover:to-amber-600 text-orange-950 font-black text-xs sm:text-sm shadow-[0_4px_0_#7c2d12] active:translate-y-1 active:shadow-[0_1px_0_#7c2d12] transition-all flex items-center justify-center gap-2 border-2 border-orange-200 cursor-pointer"
            >
              <img
                src="/assets/rafi/item_backpack.png"
                alt="Latihan"
                className="w-5 h-5 object-contain drop-shadow"
              />
              <span className="truncate">Ayo Berlatih</span>
            </button>
          </div>

          {/* Action 3: Materi, Petunjuk & Setelan */}
          <div className="grid grid-cols-3 gap-2 w-full mt-2">
            <button
              onClick={() => handleNav(onLearn)}
              className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs shadow-[0_3px_0_#0f172a] active:translate-y-0.5 transition flex items-center justify-center gap-1.5 border border-slate-600 cursor-pointer"
            >
              <img
                src="/assets/rafi/item_scroll.png"
                alt="Materi"
                className="w-4 h-4 object-contain drop-shadow"
              />
              <span>Materi</span>
            </button>

            <button
              onClick={() => handleNav(onHelp)}
              className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs shadow-[0_3px_0_#0f172a] active:translate-y-0.5 transition flex items-center justify-center gap-1.5 border border-slate-600 cursor-pointer"
            >
              <img
                src="/assets/icons/help.png"
                alt="Petunjuk"
                className="w-4 h-4 object-contain"
              />
              <span>Petunjuk</span>
            </button>

            <button
              onClick={() => handleNav(onSettings)}
              className="py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs shadow-[0_3px_0_#0f172a] active:translate-y-0.5 transition flex items-center justify-center gap-1.5 border border-slate-600 cursor-pointer"
            >
              <img
                src="/assets/icons/settings.png"
                alt="Setelan"
                className="w-4 h-4 object-contain"
              />
              <span>Setelan</span>
            </button>
          </div>
        </div>
      </main>

      {/* ==============================================================
          LAYER 5: FOOTER BRANDING & CREDITS
          ============================================================== */}
      <footer className="relative z-30 w-full pb-2 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-amber-500/40 text-[11px] font-bold text-amber-200 shadow-lg">
          <span>👑 Made In Didit Fakhrullah</span>
          <span className="text-amber-500">•</span>
          <span>Teorema Pythagoras Interaktif</span>
        </div>
      </footer>

      {/* Educational Video Widget: Runs on main menu without covering menu elements */}
      <EducationalVideoWidget
        forceOpenTheater={openVideoTheater}
        onTheaterClose={() => setOpenVideoTheater(false)}
      />
    </div>
  );
};
