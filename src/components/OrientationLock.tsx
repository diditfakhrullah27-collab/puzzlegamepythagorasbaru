/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface OrientationLockProps {
  onDismiss?: () => void;
}

export const OrientationLock: React.FC<OrientationLockProps> = ({ onDismiss }) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [lockStatusMessage, setLockStatusMessage] = useState<string | null>(null);

  // Auto-dismiss when rotated to landscape
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > window.innerHeight) {
        setIsDismissed(true);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const requestFullscreenAndLandscape = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      
      const screenAny = window.screen as unknown as {
        orientation?: {
          lock?: (orientation: string) => Promise<void>;
        };
      };

      if (screenAny.orientation?.lock) {
        await screenAny.orientation.lock('landscape');
        setLockStatusMessage('Mode landscape berhasil diaktifkan!');
        setIsDismissed(true);
      } else {
        setLockStatusMessage('Silakan miringkan ponsel Anda ke posisi horizontal (mendatar).');
      }
    } catch {
      setLockStatusMessage('Miringkan ponsel Anda ke posisi mendatar (Auto-rotate aktif).');
    }

    setTimeout(() => setLockStatusMessage(null), 3500);
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (onDismiss) onDismiss();
  };

  return (
    <>
      {/* Fullscreen Overlay triggered by CSS Media Query when in Portrait Mode on screens <= 1024px */}
      <div
        className={`orientation-lock-overlay ${isDismissed ? 'dismissed' : ''} fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 text-center text-white select-none`}
        role="alertdialog"
        aria-label="Peringatan Orientasi Layar"
      >
        <div className="relative max-w-sm w-full bg-slate-900/95 border-2 border-amber-400/50 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-amber-500/10 flex flex-col items-center">
          
          {/* Animated 3D Phone Icon Rotating */}
          <div className="relative w-28 h-28 mb-4 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-400/40 animate-pulse-ring" />
            
            <svg
              className="absolute inset-0 w-full h-full text-amber-400 opacity-60"
              viewBox="0 0 100 100"
            >
              <path
                d="M 20,50 A 30,30 0 0,1 80,50"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeDasharray="4,4"
              />
              <polygon points="80,45 86,52 76,55" fill="currentColor" />
            </svg>

            {/* Rotating Smartphone Device Frame */}
            <div className="relative animate-rotate-device">
              <div className="w-14 h-24 bg-gradient-to-b from-slate-700 to-slate-900 rounded-2xl p-1.5 shadow-xl border border-slate-600 flex flex-col items-center justify-between">
                <div className="w-4 h-1 bg-slate-500 rounded-full mb-1" />
                <div className="w-full flex-1 bg-gradient-to-br from-indigo-950 to-blue-900 rounded-lg flex items-center justify-center overflow-hidden border border-cyan-500/30">
                  <svg className="w-8 h-8" viewBox="0 0 40 40">
                    <polygon points="8,32 32,32 32,8" fill="#3b82f6" fillOpacity="0.4" stroke="#60a5fa" strokeWidth="2" />
                    <line x1="8" y1="32" x2="32" y2="8" stroke="#f59e0b" strokeWidth="2.5" />
                  </svg>
                </div>
                <div className="w-4 h-1 bg-slate-500 rounded-full mt-1" />
              </div>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 mb-2 tracking-wide uppercase">
            Putar ke Mode Landscape
          </h2>

          {/* Subtitle / Explanation */}
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            Aplikasi <strong className="text-amber-300">Pythagoras Adventure</strong> dirancang dalam posisi mendatar (horizontal) agar arena puzzle dan panel tombol tampil rapi dan lapang seperti di komputer/laptop.
          </p>

          {/* Action Buttons */}
          <div className="w-full space-y-2">
            <button
              onClick={requestFullscreenAndLandscape}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-amber-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 border border-yellow-200 cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>Layar Penuh & Landscape</span>
            </button>

            <button
              onClick={handleDismiss}
              className="w-full py-2 px-3 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer border border-slate-700"
            >
              Tetap Lanjutkan (Mode Tegak)
            </button>
          </div>

          {lockStatusMessage && (
            <div className="mt-2.5 text-xs text-cyan-300 font-medium animate-pulse">
              {lockStatusMessage}
            </div>
          )}

          <div className="mt-4 pt-2.5 border-t border-slate-800 w-full flex items-center justify-center text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
            👑 Made In Didit Fakhrullah
          </div>
        </div>
      </div>
    </>
  );
};
