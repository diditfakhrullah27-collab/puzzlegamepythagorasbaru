/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { StoryDialogueLine } from '../types/game';
import { RafiCharacter } from './RafiCharacter';
import { soundEngine } from '../utils/audio';
import { TactileButton } from './TactileButton';

interface StoryDialogueBoxProps {
  dialogue: StoryDialogueLine;
  isLastLine: boolean;
  onNext: () => void;
  onSkip: () => void;
  onReplay: () => void;
  onActionComplete?: () => void;
  actionButtonLabel?: string;
}

export const StoryDialogueBox: React.FC<StoryDialogueBoxProps> = ({
  dialogue,
  isLastLine,
  onNext,
  onSkip,
  onReplay,
  onActionComplete,
  actionButtonLabel = 'LANJUTKAN',
}) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const textIndexRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Typewriter effect initialization and reset
  useEffect(() => {
    setIsTyping(true);
    setDisplayedText('');
    textIndexRef.current = 0;

    if (timerRef.current) clearInterval(timerRef.current);

    const fullText = dialogue.text;
    const speed = 20; // ms per char

    timerRef.current = setInterval(() => {
      textIndexRef.current += 1;
      const currentSub = fullText.slice(0, textIndexRef.current);
      setDisplayedText(currentSub);

      // Play soft dialogue blip every 2-3 characters
      if (textIndexRef.current % 2 === 0) {
        soundEngine.dialogueBlip();
      }

      if (textIndexRef.current >= fullText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
      }
    }, speed);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dialogue.id, dialogue.text]);

  // Click on box: If typing, autocomplete immediately. If finished, go next!
  const handleBoxClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(dialogue.text);
      setIsTyping(false);
      soundEngine.click();
    } else {
      if (isLastLine && onActionComplete) {
        onActionComplete();
      } else {
        onNext();
      }
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.click();
    if (isTyping) {
      if (timerRef.current) clearInterval(timerRef.current);
      setDisplayedText(dialogue.text);
      setIsTyping(false);
    } else {
      if (isLastLine && onActionComplete) {
        onActionComplete();
      } else {
        onNext();
      }
    }
  };

  const handleReplayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.click();
    onReplay();
  };

  const handleSkipClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.click();
    onSkip();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 select-none z-30">
      {/* Dialogue Frame Container */}
      <div
        onClick={handleBoxClick}
        className="relative bg-gradient-to-b from-amber-50 to-orange-50 border-3 sm:border-4 border-amber-600 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-[0_8px_30px_rgba(0,0,0,0.7)] cursor-pointer transition-all hover:border-amber-500"
      >
        {/* Top Header Ribbon: Speaker Name Badge on Left + Quick Controls (Ulangi, Lewati) on Right */}
        <div className="flex items-center justify-between -mt-6 sm:-mt-7 mb-2 px-1">
          {/* Speaker Name Ribbon Banner */}
          <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 border-2 border-amber-400 text-amber-200 px-3.5 sm:px-5 py-0.5 sm:py-1 rounded-full shadow-lg font-black text-xs sm:text-sm tracking-wide flex items-center gap-1.5">
            <span className="text-amber-400">★</span>
            <span>{dialogue.speaker}</span>
          </div>

          {/* Quick Header Buttons: Ulangi & Lewati with crisp icons and clear labels */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <TactileButton
              variant="purple"
              size="sm"
              iconSrc="/assets/icons/retry.png"
              iconAlt="Ulangi"
              label="Ulangi"
              className="py-1 px-2.5 text-[10px] sm:text-xs shadow-sm"
              onClick={handleReplayClick}
              title="Ulangi Dialog Ini"
            />
            <TactileButton
              variant="secondary"
              size="sm"
              iconSrc="/assets/icons/next.png"
              iconAlt="Lewati"
              label="Lewati"
              className="py-1 px-2.5 text-[10px] sm:text-xs shadow-sm"
              onClick={handleSkipClick}
              title="Lewati Cerita Langsung ke Tantangan"
            />
          </div>
        </div>

        {/* Interior Layout: Left Portrait + Right Speech Text & Integrated Action Button */}
        <div className="flex items-start gap-2.5 sm:gap-4">
          {/* Animated Rafi Portrait */}
          <div className="flex-shrink-0">
            <RafiCharacter emotion={dialogue.emotion} isTalking={isTyping} size="sm" className="sm:hidden" />
            <RafiCharacter emotion={dialogue.emotion} isTalking={isTyping} size="md" className="hidden sm:flex" />
          </div>

          {/* Dynamic Dialogue Text Area */}
          <div className="flex-1 min-w-0 flex flex-col justify-between min-h-[58px] sm:min-h-[72px]">
            <p className="text-slate-900 text-xs sm:text-base md:text-lg font-bold leading-relaxed tracking-wide pr-1">
              {displayedText}
              {isTyping && <span className="inline-block w-2 h-3.5 bg-amber-600 ml-1 animate-pulse" />}
            </p>

            {/* Bottom Row Inside Box: Click Hint on Left + Primary Action Button on Right */}
            <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-amber-200/80">
              <span className="text-[10px] sm:text-xs text-amber-800 font-semibold flex items-center gap-1">
                <span className="text-amber-600">💡</span>
                <span className="hidden sm:inline">Ketuk layar atau tombol untuk melanjutkan</span>
                <span className="sm:hidden">Ketuk untuk lanjut</span>
              </span>

              {/* Action Button: Real button asset with zero broken or squished miniature icons */}
              <div>
                {isTyping ? (
                  <button
                    onClick={handleNextClick}
                    className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-black text-xs sm:text-sm shadow-[0_3px_0_#065f46] active:translate-y-0.5 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>⏩ Selesai Ketik</span>
                  </button>
                ) : isLastLine && actionButtonLabel && actionButtonLabel !== 'LANJUTKAN' ? (
                  <button
                    onClick={handleNextClick}
                    className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_4px_0_#b45309] active:translate-y-0.5 transition-all flex items-center gap-1.5 cursor-pointer animate-pulse"
                  >
                    <span>{actionButtonLabel}</span>
                    {!actionButtonLabel.includes('➔') && <span className="text-sm">➔</span>}
                  </button>
                ) : (
                  <button
                    onClick={handleNextClick}
                    className="hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    title="Lanjutkan"
                  >
                    <img
                      src="/assets/rafi/btn_lanjutkan_gold.png"
                      alt="Lanjutkan"
                      className="h-8 sm:h-9 w-auto object-contain drop-shadow"
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
