/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LevelData } from '../types/game';
import { TactileButton } from './TactileButton';

interface VictoryModalProps {
  level: LevelData;
  stars: number;
  timeSpent: number;
  onRetry: () => void;
  onNext: () => void;
  onHome: () => void;
  hasNextLevel: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  level,
  stars,
  timeSpent,
  onRetry,
  onNext,
  onHome,
  hasNextLevel,
}) => {
  useEffect(() => {
    // Fire celebratory confetti bursts
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-2 sm:p-4 bg-black/85 backdrop-blur-md select-none flex min-h-full items-center justify-center">
      <div className="w-full max-w-lg md:max-w-xl max-h-[95dvh] overflow-y-auto bg-slate-850 border-3 sm:border-4 border-amber-400 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] p-3 sm:p-5 md:p-6 text-slate-100 flex flex-col my-auto space-y-3 sm:space-y-4 landscape:space-y-2.5">
        
        {/* Top Trophy & Title Lockup - Compact in landscape */}
        <div className="flex flex-col landscape:flex-row items-center justify-center gap-2 sm:gap-3 text-center landscape:text-left">
          {/* Trophy Hero Icon */}
          <div className="relative flex-shrink-0">
            <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-lg animate-pulse" />
            <img
              src="/assets/icons/trophy.png"
              alt="Piala Penghargaan"
              className="w-14 h-14 sm:w-20 sm:h-20 landscape:w-12 landscape:h-12 object-contain relative z-10 drop-shadow-[0_6px_12px_rgba(245,158,11,0.5)]"
            />
          </div>

          <div className="space-y-0.5 min-w-0">
            <span className="text-[10px] sm:text-xs font-black tracking-widest text-amber-400 uppercase block">
              PEMBUKTIAN BERHASIL!
            </span>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight">
              {level.title}
            </h2>
          </div>
        </div>

        {/* Stars Earned */}
        <div className="flex items-center justify-center gap-2 py-0.5">
          {[1, 2, 3].map((starIndex) => (
            <img
              key={starIndex}
              src="/assets/icons/star.png"
              alt="Bintang"
              className={`w-7 h-7 sm:w-9 sm:h-9 landscape:w-6 landscape:h-6 object-contain transition-all duration-300 ${
                starIndex <= stars
                  ? 'scale-110 drop-shadow-[0_4px_8px_rgba(245,158,11,0.8)]'
                  : 'opacity-25 grayscale scale-90'
              }`}
            />
          ))}
        </div>

        {/* Math Explanation Card */}
        <div className="bg-slate-900/90 p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border border-slate-700 space-y-1.5 text-left">
          <div className="text-[10px] sm:text-[11px] font-bold text-amber-400 uppercase tracking-wide">
            Kesimpulan Matematis:
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-mono">
            {level.mathExplanation}
          </p>
          <div className="pt-1.5 border-t border-slate-800 flex justify-between text-[11px] sm:text-xs text-slate-400">
            <span>Waktu Penyelesaian:</span>
            <strong className="text-amber-300 font-mono">
              {Math.floor(timeSpent / 60)} menit {timeSpent % 60} detik
            </strong>
          </div>
        </div>

        {/* Navigation Buttons: Retry, Next, Home - Always visible & easily accessible */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <TactileButton
            iconSrc="/assets/icons/retry.png"
            iconAlt="Ulangi"
            label="Ulangi"
            variant="neutral"
            size="sm"
            className="py-2 text-xs sm:text-sm"
            onClick={onRetry}
          />
          <TactileButton
            iconSrc="/assets/icons/home.png"
            iconAlt="Menu"
            label="Menu"
            variant="neutral"
            size="sm"
            className="py-2 text-xs sm:text-sm"
            onClick={onHome}
          />
          {hasNextLevel ? (
            <TactileButton
              iconSrc="/assets/icons/next.png"
              iconAlt="Lanjut"
              label="Lanjut"
              variant="primary"
              size="sm"
              className="py-2 text-xs sm:text-sm"
              onClick={onNext}
            />
          ) : (
            <TactileButton
              iconSrc="/assets/icons/trophy.png"
              iconAlt="Selesai"
              label="Tamat!"
              variant="success"
              size="sm"
              className="py-2 text-xs sm:text-sm"
              onClick={onHome}
            />
          )}
        </div>

        {/* Watermark Requirement */}
        <div className="pt-1 text-center border-t border-slate-800/80">
          <span className="text-[10px] sm:text-[11px] font-bold text-amber-400/80 tracking-wider">
            👑 Made In Didit Fakhrullah
          </span>
        </div>
      </div>
    </div>
  );
};
