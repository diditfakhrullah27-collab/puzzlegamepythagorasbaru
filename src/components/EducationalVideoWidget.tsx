/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { soundEngine } from '../utils/audio';

interface EducationalVideoWidgetProps {
  forceOpenTheater?: boolean;
  onTheaterClose?: () => void;
}

const CHAPTERS = [
  { time: 0, label: 'Pengantar & Konsep' },
  { time: 112, label: 'Kuadrat & Akar' },
  { time: 152, label: 'Misi 1: Sisi Hilang' },
  { time: 218, label: 'Misi 2: Persegi Panjang' },
  { time: 316, label: 'Misi 3: Trapesium' },
  { time: 410, label: 'Misi 4: Tiang Berkemah' },
  { time: 480, label: 'Misi 5: Dua Segitiga' },
];

export const EducationalVideoWidget: React.FC<EducationalVideoWidgetProps> = ({
  forceOpenTheater = false,
  onTheaterClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(forceOpenTheater);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);

  // Sync external trigger to open theater mode
  useEffect(() => {
    if (forceOpenTheater) {
      setIsExpanded(true);
      setIsMinimized(false);
    }
  }, [forceOpenTheater]);

  // Handle soundtrack ducking when video audio is playing
  useEffect(() => {
    if (!isMuted && isPlaying) {
      soundEngine.duckBgm(true);
    } else {
      soundEngine.duckBgm(false);
    }

    return () => {
      soundEngine.duckBgm(false);
    };
  }, [isMuted, isPlaying]);

  // Attempt autoplay safely when video is ready
  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isMuted;
    video.defaultMuted = isMuted;

    const promise = video.play();
    if (promise !== undefined) {
      promise
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          // Autoplay blocked by browser policy until user interacts
          console.log('Video autoplay deferred by browser:', err);
          setIsPlaying(false);
        });
    }
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      attemptPlay();
    }
  }, [attemptPlay, isExpanded]);

  // Try playing on the user's very first interaction anywhere on screen
  useEffect(() => {
    const handleFirstInteraction = () => {
      const video = videoRef.current;
      if (video && video.paused) {
        attemptPlay();
      }
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [attemptPlay]);

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.click();
    const video = videoRef.current;
    if (!video) return;

    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);

    if (video.paused) {
      video
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
    }
  };

  const handleSeek = (time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    setCurrentTime(time);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ----------------------------------------------------------------------
  // CASE 1: FULLSCREEN CINEMA / THEATER MODAL (EXPANDED)
  // ----------------------------------------------------------------------
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in select-none">
        <div className="relative w-full max-w-4xl bg-slate-900 border-3 sm:border-4 border-amber-500 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col">
          {/* Top Cinema Header Bar */}
          <div className="px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 border-b border-amber-500/40 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-base sm:text-xl">🎬</span>
              <div>
                <h3 className="text-xs sm:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-300">
                  Video Edukasi: Menaklukkan Teorema Pythagoras
                </h3>
                <span className="text-[10px] sm:text-xs text-amber-200/80 font-medium hidden sm:inline">
                  Panduan langkah demi langkah bersama Rafi
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsExpanded(false);
                if (onTheaterClose) onTheaterClose();
                soundEngine.click();
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs border border-amber-500/50 flex items-center gap-1.5 cursor-pointer transition-all active:scale-95 shadow"
              title="Tutup Layar Penuh"
            >
              <span>✖ Tutup</span>
            </button>
          </div>

          {/* Large Video Screen */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src="/assets/aistudio/Pythagoras_Adventure_Menaklukkan_Teorema_Pythagoras_2f4bb92f.mp4"
              poster="/assets/aistudio/video_poster.jpg"
              playsInline
              autoPlay
              loop
              muted={isMuted}
              preload="auto"
              onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
              onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
              onLoadedData={() => {
                setHasLoaded(true);
                attemptPlay();
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={() => setHasError(true)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={() => togglePlay()}
            />

            {/* Play Overlay Button if paused */}
            {!isPlaying && (
              <div
                onClick={() => togglePlay()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl pl-1 text-2xl sm:text-3xl hover:scale-110 transition-transform">
                  ▶
                </div>
              </div>
            )}
          </div>

          {/* Timeline Scrubber */}
          <div className="px-3 sm:px-5 pt-2 bg-slate-950">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => handleSeek(Number(e.target.value))}
              className="w-full h-1.5 sm:h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300"
            />
          </div>

          {/* Bottom Player Controls Bar */}
          <div className="px-3 sm:px-5 py-2.5 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-slate-200">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={togglePlay}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <span>{isPlaying ? '⏸ Jeda' : '▶ Putar'}</span>
              </button>

              <button
                onClick={toggleMute}
                className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer transition-colors ${
                  isMuted
                    ? 'bg-rose-950/80 border border-rose-500/80 text-rose-300 hover:bg-rose-900'
                    : 'bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 hover:bg-emerald-900'
                }`}
              >
                <span>{isMuted ? '🔇 Bisu' : '🔊 Bersuara'}</span>
              </button>

              <span className="text-[11px] sm:text-xs font-mono text-amber-300/90 ml-1">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            {!isMuted && isPlaying && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/80 border border-indigo-400/40 text-[10px] text-indigo-200">
                <span>🎵</span>
                <span>Musik game dikecilkan otomatis agar narasi Rafi jelas</span>
              </div>
            )}

            {/* Chapter Quick Jumps */}
            <div className="hidden lg:flex items-center gap-1">
              <span className="text-[10px] text-slate-400 mr-1 font-bold">Lompat Bab:</span>
              {CHAPTERS.map((ch, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSeek(ch.time)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer ${
                    currentTime >= ch.time && (idx === CHAPTERS.length - 1 || currentTime < CHAPTERS[idx + 1].time)
                      ? 'bg-amber-400 text-slate-950 font-black'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  {idx === 0 ? 'Paham' : `Misi ${idx}`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // CASE 2: COMPACT FLOATING BADGE / PILL (USED ON MOBILE, TABLET, OR WHEN MINIMIZED)
  // Non-intrusive: Absolutely zero overlap with game menu buttons!
  // ----------------------------------------------------------------------
  if (isMinimized) {
    return (
      <div className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-40 animate-fade-in select-none">
        <button
          onClick={() => {
            setIsExpanded(true);
            soundEngine.click();
          }}
          className="group px-3 sm:px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-amber-950 font-black text-xs sm:text-sm shadow-[0_4px_15px_rgba(0,0,0,0.5)] border-2 border-yellow-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
          title="Tonton Video Edukasi Pythagoras"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600" />
          </span>
          <span className="flex items-center gap-1.5">
            <span>🎬</span>
            <span className="font-extrabold tracking-wide">Video Edukasi Rafi</span>
          </span>
          <span className="text-[10px] bg-amber-950/20 px-2 py-0.5 rounded-lg text-amber-950 font-black">
            ▶ Buka
          </span>
        </button>
      </div>
    );
  }

  // ----------------------------------------------------------------------
  // CASE 3: DOCKED CARD ON WIDESCREEN DESKTOP (xl+) & COMPACT PILL ON SCREENS < xl
  // Ensures standard laptops (< 1280px) and mobile NEVER have any button covered!
  // ----------------------------------------------------------------------
  return (
    <>
      {/* Screens < xl (Mobile, Tablets, Small Laptops): Compact floating pill */}
      <div className="xl:hidden fixed bottom-2 right-2 sm:bottom-3 sm:right-3 z-40 select-none">
        <button
          onClick={() => {
            setIsExpanded(true);
            soundEngine.click();
          }}
          className="group px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400 text-amber-950 font-black text-xs shadow-lg border-2 border-yellow-200 flex items-center gap-1.5 active:scale-95 hover:scale-105 transition-all cursor-pointer"
          title="Buka Video Edukasi Pythagoras"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
          </span>
          <span>🎬</span>
          <span className="font-black tracking-wide">Video Edukasi</span>
          <span className="text-[10px] bg-amber-950/20 px-1.5 py-0.2 rounded-md font-black">▶</span>
        </button>
      </div>

      {/* Screens >= xl (Widescreen Desktops): Sleek, simplified compact card tucked cleanly in corner */}
      <div className="hidden xl:block fixed bottom-3 right-3 lg:bottom-4 lg:right-4 z-40 w-48 rounded-2xl bg-slate-950/95 border-2 border-amber-500/90 shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md overflow-hidden select-none transition-all duration-300 hover:border-amber-400">
        {/* Header Bar */}
        <div className="px-2.5 py-1 bg-gradient-to-r from-amber-800 to-amber-900 border-b border-amber-400/40 flex items-center justify-between text-white">
          <div className="flex items-center gap-1 truncate">
            <span className="text-[11px]">🎬</span>
            <span className="text-[10px] font-black text-amber-200 tracking-wide uppercase truncate">
              Video Edukasi
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setIsMinimized(true);
                soundEngine.click();
              }}
              className="w-4 h-4 rounded bg-amber-950/70 hover:bg-amber-900 text-amber-200 text-[10px] flex items-center justify-center cursor-pointer"
              title="Perkecil ke Tombol"
            >
              ─
            </button>
            <button
              onClick={() => {
                setIsExpanded(true);
                soundEngine.click();
              }}
              className="w-4 h-4 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-[10px] font-bold flex items-center justify-center cursor-pointer shadow"
              title="Perbesar Layar Penuh"
            >
              ⛶
            </button>
          </div>
        </div>

        {/* Video Frame */}
        <div
          className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer"
          onClick={() => togglePlay()}
        >
          <video
            ref={videoRef}
            src="/assets/aistudio/Pythagoras_Adventure_Menaklukkan_Teorema_Pythagoras_2f4bb92f.mp4"
            poster="/assets/aistudio/video_poster.jpg"
            playsInline
            autoPlay
            loop
            muted={isMuted}
            preload="auto"
            onTimeUpdate={() => videoRef.current && setCurrentTime(videoRef.current.currentTime)}
            onLoadedMetadata={() => videoRef.current && setDuration(videoRef.current.duration)}
            onLoadedData={() => {
              setHasLoaded(true);
              attemptPlay();
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setHasError(true)}
            className="w-full h-full object-cover"
          />

          {/* Play Overlay if Paused */}
          {!isPlaying && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black pl-0.5 shadow-lg text-sm">
                ▶
              </div>
            </div>
          )}

          {/* Sound Toggle Banner if Muted */}
          {isMuted && (
            <div className="absolute inset-x-1.5 bottom-1.5 z-10">
              <button
                onClick={toggleMute}
                className="w-full py-1 px-1.5 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-slate-950 font-black text-[10px] shadow border border-yellow-100 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
              >
                <span>🔊</span>
                <span>Nyalakan Suara</span>
              </button>
            </div>
          )}

          {/* Active Audio Indicator */}
          {!isMuted && isPlaying && (
            <div className="absolute top-1 left-1 z-10 bg-emerald-950/85 border border-emerald-400/60 px-1.5 py-0.2 rounded-full text-[8px] font-bold text-emerald-200 flex items-center gap-0.5 shadow">
              <span className="animate-pulse">🔊</span>
              <span>Suara Aktif</span>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-2 py-1 bg-slate-950 flex items-center justify-between text-[10px] text-slate-300">
          <div className="flex items-center gap-1.5">
            <button
              onClick={togglePlay}
              className="hover:text-amber-300 transition text-[10px] font-bold cursor-pointer"
            >
              {isPlaying ? '⏸' : '▶'}
            </button>
            <button
              onClick={toggleMute}
              className={`transition text-[10px] font-bold cursor-pointer ${
                isMuted ? 'text-amber-400 hover:text-amber-300' : 'text-emerald-400 hover:text-emerald-300'
              }`}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
            <span className="text-[9px] font-mono text-slate-400">
              {formatTime(currentTime)}
            </span>
          </div>

          <button
            onClick={() => {
              setIsExpanded(true);
              soundEngine.click();
            }}
            className="text-[9px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Perbesar ⛶</span>
          </button>
        </div>
      </div>
    </>
  );
};
