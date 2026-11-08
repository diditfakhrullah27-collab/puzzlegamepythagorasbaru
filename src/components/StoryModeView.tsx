/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { StoryProgress, StoryScene, PracticeProgressRecord } from '../types/game';
import { STORY_SCENES } from '../data/storyScenes';
import { StoryDialogueBox } from './StoryDialogueBox';
import { RafiCharacter } from './RafiCharacter';
import { TactileButton } from './TactileButton';
import { soundEngine } from '../utils/audio';
import { SoundtrackPlayer } from './SoundtrackPlayer';

interface StoryModeViewProps {
  onHome: () => void;
  onStartChallenge: (challengeId: number) => void;
  storyProgress: StoryProgress;
  onUpdateStoryProgress: (updated: StoryProgress) => void;
  practiceProgress: PracticeProgressRecord;
  targetChallengeId?: number;
  initialMode?: 'intro' | 'success';
}

export const StoryModeView: React.FC<StoryModeViewProps> = ({
  onHome,
  onStartChallenge,
  storyProgress,
  onUpdateStoryProgress,
  practiceProgress,
  targetChallengeId,
  initialMode = 'intro',
}) => {
  // Determine active scene based on targetChallengeId or progress
  const getInitialSceneIndex = (): number => {
    if (targetChallengeId !== undefined) {
      const idx = STORY_SCENES.findIndex((s) => s.challengeId === targetChallengeId);
      if (idx !== -1) return idx;
    }
    // Default: if prologue not seen, show prologue
    if (!storyProgress.hasSeenPrologue) {
      return 0; // Prologue
    }
    // Else find first unfinished challenge
    for (let c = 1; c <= 10; c++) {
      if (!storyProgress.completedChallengeIds.includes(c)) {
        const idx = STORY_SCENES.findIndex((s) => s.challengeId === c);
        if (idx !== -1) return idx;
      }
    }
    // If all 10 are completed, show Epilogue!
    return STORY_SCENES.length - 1;
  };

  const [activeSceneIndex, setActiveSceneIndex] = useState<number>(getInitialSceneIndex);
  const [dialogueIndex, setDialogueIndex] = useState<number>(0);
  const [isSuccessMode, setIsSuccessMode] = useState<boolean>(initialMode === 'success');
  const [successDialogueIndex, setSuccessDialogueIndex] = useState<number>(0);

  // Sync state if navigation props update
  useEffect(() => {
    if (targetChallengeId !== undefined) {
      const idx = STORY_SCENES.findIndex((s) => s.challengeId === targetChallengeId);
      if (idx !== -1) {
        setActiveSceneIndex(idx);
        setDialogueIndex(0);
        setSuccessDialogueIndex(0);
        setIsSuccessMode(initialMode === 'success');
      }
    }
  }, [targetChallengeId, initialMode]);

  const currentScene: StoryScene = STORY_SCENES[activeSceneIndex] || STORY_SCENES[0];
  const isEpilogue = currentScene.id === 'epilogue';

  // Compute total stats
  const totalStars = Object.values(practiceProgress).reduce((acc, p) => acc + (p.stars || 0), 0);
  const totalScore = Object.values(practiceProgress).reduce((acc, p) => acc + (p.score || 0), 0);
  const completedCount = Object.values(practiceProgress).filter((p) => p.completed).length;

  // Active dialogue line
  const activeDialogues =
    isSuccessMode && currentScene.successDialogues && currentScene.successDialogues.length > 0
      ? currentScene.successDialogues
      : currentScene.dialogues;

  const currentDialogue = activeDialogues[isSuccessMode ? successDialogueIndex : dialogueIndex] || activeDialogues[0];
  const isLastLine = isSuccessMode
    ? successDialogueIndex >= activeDialogues.length - 1
    : dialogueIndex >= activeDialogues.length - 1;

  // Trigger celebration on epilogue or success
  useEffect(() => {
    if (isEpilogue || isSuccessMode) {
      soundEngine.victoryFanfare();
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }
  }, [isEpilogue, isSuccessMode]);

  const handleNextDialogue = () => {
    soundEngine.click();
    if (isSuccessMode) {
      if (successDialogueIndex < activeDialogues.length - 1) {
        setSuccessDialogueIndex((prev) => prev + 1);
      } else {
        // Move to next challenge scene
        handleNextChallengeScene();
      }
    } else {
      if (dialogueIndex < activeDialogues.length - 1) {
        setDialogueIndex((prev) => prev + 1);
      } else {
        handleActionComplete();
      }
    }
  };

  const handleReplayDialogue = () => {
    soundEngine.click();
    if (isSuccessMode) {
      setSuccessDialogueIndex(0);
    } else {
      setDialogueIndex(0);
    }
  };

  const handleSkipStory = () => {
    soundEngine.click();
    if (isEpilogue) {
      onHome();
      return;
    }
    if (isSuccessMode) {
      handleNextChallengeScene();
      return;
    }
    if (currentScene.challengeId === 0) {
      // Prologue skipped -> go to challenge 1 scene
      goToScene(1);
    } else {
      // Go directly into puzzle
      onStartChallenge(currentScene.challengeId);
    }
  };

  const handleActionComplete = () => {
    soundEngine.click();
    if (isSuccessMode) {
      handleNextChallengeScene();
      return;
    }
    if (currentScene.challengeId === 0) {
      // Finished Prologue -> advance to Challenge 1
      onUpdateStoryProgress({
        ...storyProgress,
        hasSeenPrologue: true,
      });
      goToScene(1);
    } else if (isEpilogue) {
      // Epilogue completed
      onUpdateStoryProgress({
        ...storyProgress,
        hasCompletedEpilogue: true,
      });
      onHome();
    } else {
      // Start puzzle challenge
      onStartChallenge(currentScene.challengeId);
    }
  };

  const handleNextChallengeScene = () => {
    const nextChallengeId = currentScene.challengeId + 1;
    if (nextChallengeId <= 10) {
      if (storyProgress.unlockedChallengeId < nextChallengeId) {
        onUpdateStoryProgress({
          ...storyProgress,
          unlockedChallengeId: Math.max(storyProgress.unlockedChallengeId, nextChallengeId),
        });
      }
      goToScene(nextChallengeId);
    } else {
      // All completed -> Epilogue!
      onUpdateStoryProgress({
        ...storyProgress,
        hasCompletedEpilogue: true,
      });
      goToScene(11);
    }
  };

  const goToScene = (challengeId: number) => {
    const idx = STORY_SCENES.findIndex((s) => s.challengeId === challengeId);
    if (idx !== -1) {
      setActiveSceneIndex(idx);
      setDialogueIndex(0);
      setSuccessDialogueIndex(0);
      setIsSuccessMode(false);
    }
  };

  // Dedicated Geometric Showcase Diagram (Papan Peraga Bangun Datar)
  // Positioned alongside Rafi so Rafi never blocks or covers the geometric shapes!
  const renderSceneDiagram = (challengeId: number) => {
    switch (challengeId) {
      case 3: // Tantangan 3: Persegi Panjang & Diagonal
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>📐</span>
              <span>Papan Peraga: Persegi Panjang & Diagonal</span>
            </div>
            <svg viewBox="0 0 320 180" className="w-full max-w-[280px] sm:max-w-[320px] h-32 sm:h-38 drop-shadow">
              {/* Grid / Backdrop */}
              <rect x="20" y="20" width="280" height="130" rx="8" fill="#1e293b" fillOpacity="0.8" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Diagonal Line */}
              <line x1="20" y1="150" x2="300" y2="20" stroke="#f43f5e" strokeWidth="3" strokeDasharray="5 3" />
              {/* Right angle marker at bottom-left */}
              <path d="M 20 135 L 35 135 L 35 150" fill="none" stroke="#fbbf24" strokeWidth="2" />
              {/* Dimension Labels */}
              <text x="160" y="170" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">Panjang (p = 12 cm)</text>
              <text x="10" y="90" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle" transform="rotate(-90 10 90)">Lebar (l = 5 cm)</text>
              {/* Diagonal Label */}
              <text x="175" y="75" fill="#f43f5e" fontSize="13" fontWeight="bold" textAnchor="middle" transform="rotate(-23 175 75)">Diagonal d = √(12² + 5²)</text>
              {/* Result badge */}
              <rect x="180" y="115" width="105" height="26" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="232" y="132" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">d = 13 cm ✓</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              d² = p² + l² &nbsp;|&nbsp; Luas = p × l = 60 cm²
            </div>
          </div>
        );

      case 1: // Tantangan 1: Mengenal Sisi Segitiga Siku-Siku
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>📐</span>
              <span>Papan Peraga: Hubungan Sisi Segitiga</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              {/* Right Triangle */}
              <polygon points="50,140 250,140 50,30" fill="#1e293b" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="3" />
              {/* Right angle corner */}
              <path d="M 50 120 L 70 120 L 70 140" fill="none" stroke="#fbbf24" strokeWidth="2" />
              {/* Labels */}
              <text x="35" y="85" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="end">a (Sisi Tegak)</text>
              <text x="150" y="160" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">b (Sisi Datar)</text>
              <text x="175" y="70" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle" transform="rotate(-30 175 70)">c (Hipotenusa)</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              Rumus Pythagoras: c² = a² + b²
            </div>
          </div>
        );

      case 2: // Tantangan 2: Menghitung Sisi Siku-Siku
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>📐</span>
              <span>Papan Peraga: Menghitung Sisi Yang Hilang</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              <polygon points="60,140 240,140 60,35" fill="#1e293b" fillOpacity="0.85" stroke="#10b981" strokeWidth="3" />
              <path d="M 60 120 L 80 120 L 80 140" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <text x="45" y="90" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="end">a = 6 cm</text>
              <text x="150" y="160" fill="#f43f5e" fontSize="13" fontWeight="bold" textAnchor="middle">b = ? (Hilang)</text>
              <text x="175" y="75" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle" transform="rotate(-32 175 75)">c = 10 cm</text>
              {/* Formula badge */}
              <rect x="135" y="95" width="120" height="24" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="195" y="112" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">b = √(10² - 6²) = 8</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              b² = c² - a² &nbsp;|&nbsp; b = √(100 - 36) = √64 = 8 cm
            </div>
          </div>
        );

      case 4: // Tantangan 4: Layang-layang
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>🪁</span>
              <span>Papan Peraga: Geometri Layang-Layang</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              {/* Kite Shape */}
              <polygon points="150,20 230,80 150,150 70,80" fill="#1e293b" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="2.5" />
              {/* Diagonals */}
              <line x1="150" y1="20" x2="150" y2="150" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="70" y1="80" x2="230" y2="80" stroke="#38bdf8" strokeWidth="2" strokeDasharray="4 3" />
              {/* Right angle symbol in center */}
              <path d="M 150 70 L 160 70 L 160 80" fill="none" stroke="#fbbf24" strokeWidth="2" />
              {/* Labels */}
              <text x="155" y="45" fill="#38bdf8" fontSize="11" fontWeight="bold">d₁</text>
              <text x="105" y="75" fill="#38bdf8" fontSize="11" fontWeight="bold">d₂</text>
              <text x="215" y="50" fill="#fbbf24" fontSize="12" fontWeight="bold">sisi a</text>
              <text x="215" y="125" fill="#fbbf24" fontSize="12" fontWeight="bold">sisi b</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              Kedua diagonal tegak lurus membentuk 4 segitiga siku-siku
            </div>
          </div>
        );

      case 5: // Tantangan 5: Trapesium
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>📐</span>
              <span>Papan Peraga: Garis Tinggi Trapesium</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              {/* Trapezoid */}
              <polygon points="90,40 210,40 260,140 40,140" fill="#1e293b" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Height lines */}
              <line x1="90" y1="40" x2="90" y2="140" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="210" y1="40" x2="210" y2="140" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />
              {/* Right angle marker */}
              <path d="M 90 125 L 105 125 L 105 140" fill="none" stroke="#fbbf24" strokeWidth="2" />
              {/* Labels */}
              <text x="150" y="32" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Sisi Atas (a)</text>
              <text x="150" y="160" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Sisi Bawah (b)</text>
              <text x="75" y="90" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="end">Tinggi t</text>
              <text x="250" y="85" fill="#fbbf24" fontSize="12" fontWeight="bold">Sisi miring c</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              c² = t² + ((b - a)/2)² &nbsp;|&nbsp; Bantuan Segitiga Siku-siku
            </div>
          </div>
        );

      case 6: // Tantangan 6: Bangun Gabungan
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>📐</span>
              <span>Papan Peraga: Bangun Gabungan</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              {/* Rectangle section */}
              <rect x="40" y="50" width="120" height="90" fill="#1e293b" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="2.5" />
              {/* Triangle section attached to right */}
              <polygon points="160,50 250,140 160,140" fill="#1e293b" fillOpacity="0.85" stroke="#10b981" strokeWidth="2.5" />
              <line x1="160" y1="50" x2="160" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 3" />
              <text x="100" y="100" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Persegi Panjang</text>
              <text x="200" y="115" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">Segitiga</text>
              <text x="220" y="85" fill="#fbbf24" fontSize="12" fontWeight="bold">c = √(a²+b²)</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              Keliling dihitung dari seluruh sisi terluar yang membatasi bangun
            </div>
          </div>
        );

      case 7: // Tantangan 7: Pembuktian Segitiga
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>🔍</span>
              <span>Papan Peraga: Detektif Segitiga Siku-Siku</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              <polygon points="60,140 240,140 90,30" fill="#1e293b" fillOpacity="0.85" stroke="#f43f5e" strokeWidth="2.5" />
              <text x="50" y="80" fill="#38bdf8" fontSize="12" fontWeight="bold">a = 13 cm</text>
              <text x="140" y="160" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">b = 16 cm</text>
              <text x="190" y="75" fill="#fbbf24" fontSize="12" fontWeight="bold">c = 21 cm</text>
              <rect x="70" y="90" width="165" height="28" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
              <text x="152" y="108" fill="#fda4af" fontSize="11" fontWeight="bold" textAnchor="middle">13² + 16² = 425 ≠ 21² (441)</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-rose-300 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-rose-500/30">
              a² + b² ≠ c² ➔ Segitiga Tumpul (Bukan Siku-Siku!)
            </div>
          </div>
        );

      case 8: // Tantangan 8: Tiang dan Tali
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>🚩</span>
              <span>Papan Peraga: Tiang Bendera & Tali Pancang</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              {/* Ground */}
              <line x1="30" y1="140" x2="270" y2="140" stroke="#64748b" strokeWidth="4" />
              {/* Flagpole */}
              <line x1="70" y1="20" x2="70" y2="140" stroke="#cbd5e1" strokeWidth="6" />
              {/* Flag */}
              <polygon points="73,20 115,35 73,50" fill="#ef4444" />
              {/* Guy wire / rope */}
              <line x1="70" y1="20" x2="230" y2="140" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5 3" />
              {/* Labels */}
              <text x="45" y="80" fill="#38bdf8" fontSize="12" fontWeight="bold">Tinggi t = ?</text>
              <text x="150" y="160" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Jarak Patok j = 9 m</text>
              <text x="175" y="65" fill="#fbbf24" fontSize="12" fontWeight="bold">Tali s = 15 m</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              Tinggi = √(15² - 9²) = √(225 - 81) = √144 = 12 meter
            </div>
          </div>
        );

      case 9: // Tantangan 9: Jajargenjang
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>📐</span>
              <span>Papan Peraga: Tinggi Bangun Jajargenjang</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              <polygon points="90,40 250,40 200,140 40,140" fill="#1e293b" fillOpacity="0.85" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="90" y1="40" x2="90" y2="140" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />
              <text x="170" y="32" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Alas a = 20 cm</text>
              <text x="75" y="90" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="end">Tinggi t</text>
              <text x="45" y="80" fill="#fbbf24" fontSize="12" fontWeight="bold">Sisi b = 15 cm</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              Garis tinggi membentuk segitiga siku-siku dengan sisi miring
            </div>
          </div>
        );

      case 10: // Tantangan 10: Kerucut Geometri
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>🍦</span>
              <span>Papan Peraga: Garis Pelukis Kerucut</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              <ellipse cx="150" cy="140" rx="80" ry="18" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
              <line x1="70" y1="140" x2="150" y2="25" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="230" y1="140" x2="150" y2="25" stroke="#38bdf8" strokeWidth="2.5" />
              <line x1="150" y1="25" x2="150" y2="140" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4 3" />
              <line x1="150" y1="140" x2="230" y2="140" stroke="#10b981" strokeWidth="2.5" />
              <text x="135" y="85" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="end">Tinggi t</text>
              <text x="190" y="158" fill="#10b981" fontSize="12" fontWeight="bold">Jari-jari r</text>
              <text x="210" y="75" fill="#fbbf24" fontSize="12" fontWeight="bold">Pelukis s</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              Garis Pelukis: s = √(r² + t²) &nbsp;|&nbsp; Hubungan Segitiga Siku-siku
            </div>
          </div>
        );

      case 0: // Prologue
      default:
        return (
          <div className="flex flex-col items-center justify-center w-full">
            <div className="flex items-center gap-1.5 mb-1.5 text-amber-300 font-bold text-xs sm:text-sm">
              <span>⭐</span>
              <span>Papan Peraga: Teorema Pythagoras</span>
            </div>
            <svg viewBox="0 0 300 170" className="w-full max-w-[270px] sm:max-w-[300px] h-32 sm:h-38 drop-shadow">
              <polygon points="60,140 240,140 60,40" fill="#1e293b" fillOpacity="0.85" stroke="#f59e0b" strokeWidth="3" />
              <path d="M 60 120 L 80 120 L 80 140" fill="none" stroke="#fbbf24" strokeWidth="2" />
              <text x="45" y="90" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="end">a = 3</text>
              <text x="150" y="160" fill="#38bdf8" fontSize="13" fontWeight="bold" textAnchor="middle">b = 4</text>
              <text x="175" y="75" fill="#fbbf24" fontSize="13" fontWeight="bold" textAnchor="middle" transform="rotate(-30 175 75)">c = 5</text>
              <rect x="120" y="90" width="130" height="24" rx="6" fill="#0f172a" stroke="#10b981" strokeWidth="1.5" />
              <text x="185" y="106" fill="#34d399" fontSize="11" fontWeight="bold" textAnchor="middle">3² + 4² = 9 + 16 = 25 = 5²</text>
            </svg>
            <div className="mt-1 text-[11px] sm:text-xs text-amber-200/90 font-mono text-center bg-slate-950/60 px-3 py-1 rounded-lg border border-amber-500/30">
              Kuadrat sisi miring sama dengan jumlah kuadrat sisi tegak (c² = a² + b²)
            </div>
          </div>
        );
    }
  };

  // Render Background thematic ambient lighting
  const renderBackground = () => {
    switch (currentScene.bgTheme) {
      case 'park':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-950 via-emerald-950/80 to-slate-950 overflow-hidden pointer-events-none">
            <div className="absolute top-8 left-1/4 w-32 h-16 bg-white/5 rounded-full blur-md" />
            <div className="absolute top-16 right-1/3 w-48 h-20 bg-white/5 rounded-full blur-lg" />
            <svg viewBox="0 0 1000 400" className="absolute bottom-0 w-full h-[55vh] opacity-20" preserveAspectRatio="none">
              <polygon points="0,400 250,150 500,400" fill="#047857" />
              <polygon points="350,400 650,100 950,400" fill="#065f46" />
              <polygon points="700,400 850,220 1000,400" fill="#047857" />
            </svg>
          </div>
        );

      case 'bridge':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-slate-900 to-sky-950 overflow-hidden pointer-events-none">
            <svg viewBox="0 0 1000 500" className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none">
              <line x1="0" y1="380" x2="1000" y2="380" stroke="#94a3b8" strokeWidth="6" />
              <rect x="490" y="50" width="20" height="330" fill="#cbd5e1" />
              {[100, 200, 300, 400].map((x, i) => (
                <line key={i} x1={x} y1="380" x2="500" y2={90 + i * 50} stroke="#f59e0b" strokeWidth="2" />
              ))}
              {[600, 700, 800, 900].map((x, i) => (
                <line key={i} x1={x} y1="380" x2="500" y2={90 + i * 50} stroke="#f59e0b" strokeWidth="2" />
              ))}
            </svg>
          </div>
        );

      case 'room':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-stone-950 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />
          </div>
        );

      case 'sky_kite':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900 via-sky-950 to-slate-950 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-32 h-32 bg-sky-400/10 rounded-full blur-2xl" />
          </div>
        );

      case 'palace':
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-amber-950/50 via-slate-950 to-black overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
          </div>
        );

      case 'world':
      default:
        return (
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-black overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
          </div>
        );
    }
  };

  return (
    <div className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-y-auto overflow-x-hidden text-slate-100 select-none scroll-smooth pb-4 sm:pb-6">
      {/* Background Thematic Viewport */}
      {renderBackground()}

      {/* Top Header: Location, Chapter, Menu Controls */}
      <header className="relative z-20 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-md border-b border-amber-500/20 shadow-md">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onHome}
            className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Kembali ke Menu Utama"
          >
            <img
              src="/assets/rafi/btn_menu_utama_gold.png"
              alt="Menu Utama"
              className="h-7 sm:h-8 w-auto object-contain drop-shadow"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] sm:text-xs font-black uppercase text-amber-400 tracking-wider">
                {currentScene.title}
              </span>
              <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.2 rounded-full font-bold border border-amber-400/30">
                {currentScene.challengeId === 0
                  ? 'Prolog'
                  : currentScene.challengeId === 11
                  ? 'Epilog'
                  : `Tantangan ${currentScene.challengeId}/10`}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-bold text-white block truncate">
              📍 {currentScene.locationName}
            </span>
          </div>
        </div>

        {/* Story Chapter Selector Dropdown / Quick Links */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="hidden md:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700">
            {STORY_SCENES.map((scene, idx) => {
              const isCurrent = idx === activeSceneIndex;
              const isUnlocked =
                scene.challengeId === 0 ||
                storyProgress.unlockedChallengeId >= scene.challengeId ||
                storyProgress.completedChallengeIds.includes(scene.challengeId);
              return (
                <button
                  key={scene.id}
                  disabled={!isUnlocked}
                  onClick={() => {
                    setActiveSceneIndex(idx);
                    setDialogueIndex(0);
                    setSuccessDialogueIndex(0);
                    setIsSuccessMode(false);
                    soundEngine.click();
                  }}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                      : isUnlocked
                      ? 'bg-slate-800 text-slate-300 hover:text-white'
                      : 'bg-slate-900/40 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {scene.challengeId === 0 ? 'P' : scene.challengeId === 11 ? '👑' : scene.challengeId}
                </button>
              );
            })}
          </div>

          {/* Soundtrack Player */}
          <SoundtrackPlayer currentFeature="Mode Cerita" />

          {/* Quick Skip Story Button using real golden Lewati button */}
          <button
            onClick={handleSkipStory}
            className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Lewati Cerita Langsung ke Tantangan"
          >
            <img
              src="/assets/rafi/btn_lewati_gold.png"
              alt="Lewati"
              className="h-7 sm:h-8 w-auto object-contain drop-shadow"
            />
          </button>
        </div>
      </header>

      {/* Middle Interactive Stage: Geometric Showcase Board + Rafi Side-by-Side (NO OVERLAP) */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-center gap-3 sm:gap-6 md:gap-10 px-3 sm:px-6 my-auto py-2 sm:py-3">
        {isEpilogue ? (
          /* Epilogue Grand Celebration Layout */
          <div className="flex flex-col items-center justify-center text-center my-auto pointer-events-auto max-w-lg bg-slate-950/85 border-2 border-amber-500/60 rounded-3xl p-4 sm:p-6 shadow-2xl backdrop-blur-md">
            <div className="relative mb-2">
              <img
                src="/assets/rafi/rafi_pose_victory_jump.png"
                alt="Rafi Menang"
                className="w-24 h-24 sm:w-32 sm:h-32 object-contain drop-shadow-xl animate-bounce"
              />
            </div>
            <div className="text-amber-400 font-black text-xs uppercase tracking-widest">Prestasi Utama</div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
              PENJELAJAH PYTHAGORAS
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-sm">
              Selamat! Kamu telah menyelesaikan seluruh 10 tantangan matematika Teorema Pythagoras bersama Rafi!
            </p>

            {/* Achievement Badges */}
            <div className="grid grid-cols-3 gap-2 w-full mt-4 bg-slate-900/90 p-3 rounded-2xl border border-amber-500/30">
              <div className="text-center">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Tantangan</span>
                <span className="text-sm sm:text-base font-black text-white">{completedCount} / 10</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Total Bintang</span>
                <span className="text-sm sm:text-base font-black text-amber-300">★ {totalStars}</span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">Total Skor</span>
                <span className="text-sm sm:text-base font-black text-emerald-300">{totalScore} Poin</span>
              </div>
            </div>

            {/* End Game Action Buttons */}
            <div className="flex items-center gap-3 mt-4 w-full">
              <button
                onClick={() => {
                  goToScene(0);
                  soundEngine.click();
                }}
                className="flex-1 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                🔄 Main Lagi
              </button>
              <button
                onClick={onHome}
                className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg transition-all cursor-pointer"
              >
                🏠 Menu Utama
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Left Column / Top on Mobile: Geometric Showcase Card (Papan Peraga Bangun Datar) */}
            <div className="w-full max-w-sm sm:max-w-md bg-slate-900/95 border-2 sm:border-3 border-amber-600/80 rounded-2xl p-2.5 sm:p-3 shadow-2xl backdrop-blur-md">
              {renderSceneDiagram(currentScene.challengeId)}
            </div>

            {/* Right Column / Side: Rafi Full-Body Character pointing or presenting */}
            <div className="flex items-end justify-center pointer-events-none mt-1 sm:mt-0">
              <RafiCharacter
                emotion={currentDialogue.emotion}
                pose={currentDialogue.pose || 'standing'}
                isTalking={false}
                size="full"
                className="animate-fade-in"
              />
            </div>
          </>
        )}
      </div>

      {/* Bottom Area: Visual Novel Interactive Dialogue Box */}
      {!isEpilogue && (
        <div className="relative z-20 pt-1">
          <StoryDialogueBox
            dialogue={currentDialogue}
            isLastLine={isLastLine}
            onNext={handleNextDialogue}
            onSkip={handleSkipStory}
            onReplay={handleReplayDialogue}
            onActionComplete={handleActionComplete}
            actionButtonLabel={
              isSuccessMode
                ? currentScene.challengeId < 10
                  ? `LANJUT TANTANGAN ${currentScene.challengeId + 1} ➔`
                  : 'MENUJU EPILOG 👑'
                : currentScene.actionButtonLabel
            }
          />
        </div>
      )}
    </div>
  );
};
