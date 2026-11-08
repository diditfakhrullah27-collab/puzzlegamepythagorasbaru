/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Screen, LevelProgress, GameSettings, PracticeProgressRecord, StoryProgress } from './types/game';
import { LEVELS } from './data/levels';
import { MainMenu } from './components/MainMenu';
import { LevelSelect } from './components/LevelSelect';
import { PuzzleBoard } from './components/PuzzleBoard';
import { LearnModal } from './components/LearnModal';
import { PracticeArena } from './components/PracticeArena';
import { StoryModeView } from './components/StoryModeView';
import { HelpModal } from './components/HelpModal';
import { SettingsModal } from './components/SettingsModal';
import { VictoryModal } from './components/VictoryModal';
import { OrientationLock } from './components/OrientationLock';
import { soundEngine } from './utils/audio';

const STORAGE_PROGRESS_KEY = 'pythagoras_adventure_progress_v1';
const STORAGE_SETTINGS_KEY = 'pythagoras_adventure_settings_v1';
const STORAGE_PRACTICE_PROGRESS_KEY = 'pythagoras_practice_progress_v1';
const STORAGE_STORY_PROGRESS_KEY = 'pythagoras_story_progress_v1';

const defaultSettings: GameSettings = {
  soundEnabled: true,
  showMathGrid: true,
  snapTolerance: 30,
};

const defaultProgress: Record<number, LevelProgress> = {
  1: { unlocked: true, completed: false, stars: 0, bestTime: 0 },
  2: { unlocked: false, completed: false, stars: 0, bestTime: 0 },
  3: { unlocked: false, completed: false, stars: 0, bestTime: 0 },
  4: { unlocked: false, completed: false, stars: 0, bestTime: 0 },
  5: { unlocked: false, completed: false, stars: 0, bestTime: 0 },
  6: { unlocked: true, completed: false, stars: 0, bestTime: 0 },
};

const defaultStoryProgress: StoryProgress = {
  unlockedChallengeId: 1,
  completedChallengeIds: [],
  hasSeenPrologue: false,
  hasCompletedEpilogue: false,
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [currentLevelId, setCurrentLevelId] = useState<number>(1);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [victoryData, setVictoryData] = useState<{ levelId: number; stars: number; timeSpent: number } | null>(null);

  // Deep linking & navigation targets
  const [learnChapterTarget, setLearnChapterTarget] = useState<number | undefined>(undefined);
  const [practiceChallengeTarget, setPracticeChallengeTarget] = useState<number | undefined>(undefined);
  const [storyChallengeTarget, setStoryChallengeTarget] = useState<number | undefined>(undefined);
  const [storyInitialMode, setStoryInitialMode] = useState<'intro' | 'success'>('intro');

  // Settings State
  const [settings, setSettings] = useState<GameSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      return saved ? JSON.parse(saved) : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });

  // Adventure Level Progress State (Puzzle Klasik 6 Level)
  const [progress, setProgress] = useState<Record<number, LevelProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROGRESS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultProgress,
          ...parsed,
          1: { ...defaultProgress[1], ...parsed[1], unlocked: true },
          6: parsed[6] || defaultProgress[6],
        };
      }
      return defaultProgress;
    } catch {
      return defaultProgress;
    }
  });

  // Practice Challenge Progress State (Ayo Berlatih 1 No. 1-10)
  const [practiceProgress, setPracticeProgress] = useState<PracticeProgressRecord>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PRACTICE_PROGRESS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Story Mode Progress State
  const [storyProgress, setStoryProgress] = useState<StoryProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STORY_PROGRESS_KEY);
      return saved ? JSON.parse(saved) : defaultStoryProgress;
    } catch {
      return defaultStoryProgress;
    }
  });

  // Sync sound engine
  useEffect(() => {
    soundEngine.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Dynamically switch BGM per screen feature and play transition SFX
  useEffect(() => {
    soundEngine.transition();
    const map: Record<Screen, 'menu' | 'story' | 'practice' | 'puzzle' | 'race'> = {
      menu: 'menu',
      'level-select': 'menu',
      game: 'puzzle',
      story: 'story',
      learn: 'story',
      practice: 'practice',
    };
    soundEngine.setFeatureBgm(map[currentScreen] || 'menu');
  }, [currentScreen]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Persist adventure progress
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROGRESS_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // Persist story progress
  const handleSaveStoryProgress = (updated: StoryProgress) => {
    setStoryProgress(updated);
    try {
      localStorage.setItem(STORAGE_STORY_PROGRESS_KEY, JSON.stringify(updated));
    } catch {}
  };

  // Persist practice progress & sync with story completed challenges
  const handleSavePracticeProgress = (updated: PracticeProgressRecord) => {
    setPracticeProgress(updated);
    try {
      localStorage.setItem(STORAGE_PRACTICE_PROGRESS_KEY, JSON.stringify(updated));
    } catch {}

    // Synchronize newly completed challenge IDs to story progress
    const completedIds = Object.keys(updated)
      .map(Number)
      .filter((id) => updated[id]?.completed);

    setStoryProgress((prev) => {
      const merged = Array.from(new Set([...prev.completedChallengeIds, ...completedIds]));
      const maxUnlocked = Math.min(10, Math.max(prev.unlockedChallengeId, ...merged.map((id) => id + 1)));
      const newStoryProgress: StoryProgress = {
        ...prev,
        completedChallengeIds: merged,
        unlockedChallengeId: maxUnlocked,
      };
      try {
        localStorage.setItem(STORAGE_STORY_PROGRESS_KEY, JSON.stringify(newStoryProgress));
      } catch {}
      return newStoryProgress;
    });
  };

  const updateSettings = (updated: Partial<GameSettings>) => {
    setSettings((prev) => ({ ...prev, ...updated }));
  };

  const handleResetProgress = () => {
    setProgress(defaultProgress);
    setPracticeProgress({});
    setStoryProgress(defaultStoryProgress);
    try {
      localStorage.removeItem(STORAGE_PROGRESS_KEY);
      localStorage.removeItem(STORAGE_PRACTICE_PROGRESS_KEY);
      localStorage.removeItem(STORAGE_STORY_PROGRESS_KEY);
    } catch {}
  };

  const handleLevelComplete = (levelId: number, stars: number, timeSpent: number) => {
    setProgress((prev) => {
      const current = prev[levelId] || { unlocked: true, completed: false, stars: 0, bestTime: 0 };
      const nextId = levelId + 1;
      const updated = {
        ...prev,
        [levelId]: {
          unlocked: true,
          completed: true,
          stars: Math.max(current.stars, stars),
          bestTime: current.bestTime > 0 ? Math.min(current.bestTime, timeSpent) : timeSpent,
        },
      };

      // Unlock next level if exists
      if (nextId <= LEVELS.length) {
        updated[nextId] = {
          ...(prev[nextId] || { unlocked: false, completed: false, stars: 0, bestTime: 0 }),
          unlocked: true,
        };
      }

      return updated;
    });

    setVictoryData({ levelId, stars, timeSpent });
  };

  const handleStartLevel = (levelId: number) => {
    setCurrentLevelId(levelId);
    setVictoryData(null);
    setCurrentScreen('game');
  };

  const handleNextLevel = () => {
    const nextId = currentLevelId + 1;
    if (nextId <= LEVELS.length) {
      setCurrentLevelId(nextId);
      setVictoryData(null);
    } else {
      setVictoryData(null);
      setCurrentScreen('level-select');
    }
  };

  const currentLevelData = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

  return (
    <div className="w-full h-[100dvh] max-h-screen overflow-hidden bg-slate-950 font-sans select-none flex flex-col">
      {/* Forced Landscape Warning & Orientation Controller (CSS Media Query Driven) */}
      <OrientationLock />

      {/* Main Menu Screen */}
      {currentScreen === 'menu' && (
        <MainMenu
          onPlay={() => setCurrentScreen('level-select')}
          onStory={() => {
            setStoryChallengeTarget(undefined);
            setStoryInitialMode('intro');
            setCurrentScreen('story');
          }}
          onLearn={() => {
            setLearnChapterTarget(1);
            setCurrentScreen('learn');
          }}
          onPractice={() => {
            setPracticeChallengeTarget(undefined);
            setCurrentScreen('practice');
          }}
          onHelp={() => setShowHelpModal(true)}
          onSettings={() => setShowSettingsModal(true)}
          progress={progress}
          practiceProgress={practiceProgress}
          storyProgress={storyProgress}
        />
      )}

      {/* Story Mode Screen (Petualangan Teorema Pythagoras with Rafi) */}
      {currentScreen === 'story' && (
        <StoryModeView
          onHome={() => setCurrentScreen('menu')}
          onStartChallenge={(challengeId) => {
            setPracticeChallengeTarget(challengeId);
            setCurrentScreen('practice');
          }}
          storyProgress={storyProgress}
          onUpdateStoryProgress={handleSaveStoryProgress}
          practiceProgress={practiceProgress}
          targetChallengeId={storyChallengeTarget}
          initialMode={storyInitialMode}
        />
      )}

      {/* Level Select Screen (Puzzle Klasik 6 Level) */}
      {currentScreen === 'level-select' && (
        <LevelSelect
          levels={LEVELS}
          progress={progress}
          onSelectLevel={handleStartLevel}
          onHome={() => setCurrentScreen('menu')}
        />
      )}

      {/* Game Screen */}
      {currentScreen === 'game' && (
        <PuzzleBoard
          level={currentLevelData}
          settings={settings}
          onUpdateSettings={updateSettings}
          onBack={() => setCurrentScreen('level-select')}
          onHome={() => setCurrentScreen('menu')}
          onOpenSettings={() => setShowSettingsModal(true)}
          onLevelComplete={handleLevelComplete}
          onNextLevel={handleNextLevel}
          hasNextLevel={currentLevelId < LEVELS.length}
        />
      )}

      {/* Materi Pembelajaran Screen (Fitur 1) */}
      {currentScreen === 'learn' && (
        <LearnModal
          onBack={() => setCurrentScreen('menu')}
          initialChapter={learnChapterTarget || 1}
          onOpenPractice={(challengeId) => {
            setPracticeChallengeTarget(challengeId);
            setCurrentScreen('practice');
          }}
        />
      )}

      {/* Soal Latihan Matematika Screen (Fitur 2 - Ayo Berlatih 1) */}
      {currentScreen === 'practice' && (
        <PracticeArena
          onHome={() => setCurrentScreen('menu')}
          onOpenMateri={(chapterId) => {
            setLearnChapterTarget(chapterId || 1);
            setCurrentScreen('learn');
          }}
          progress={practiceProgress}
          onSaveProgress={handleSavePracticeProgress}
          initialChallengeId={practiceChallengeTarget}
          onReturnToStory={(challengeId) => {
            setStoryChallengeTarget(challengeId);
            setStoryInitialMode('success');
            setCurrentScreen('story');
          }}
        />
      )}

      {/* Global Modals */}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}

      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={updateSettings}
          onResetProgress={handleResetProgress}
          onClose={() => setShowSettingsModal(false)}
        />
      )}

      {victoryData && (
        <VictoryModal
          level={currentLevelData}
          stars={victoryData.stars}
          timeSpent={victoryData.timeSpent}
          onRetry={() => {
            setVictoryData(null);
          }}
          onNext={handleNextLevel}
          onHome={() => {
            setVictoryData(null);
            setCurrentScreen('menu');
          }}
          hasNextLevel={currentLevelId < LEVELS.length}
        />
      )}
    </div>
  );
}
