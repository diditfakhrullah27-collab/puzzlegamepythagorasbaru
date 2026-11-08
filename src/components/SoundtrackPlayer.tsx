/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { soundEngine, BGM_TRACKS, BgmTrack } from '../utils/audio';

interface SoundtrackPlayerProps {
  currentFeature?: string;
  className?: string;
}

export const SoundtrackPlayer: React.FC<SoundtrackPlayerProps> = ({ currentFeature = 'Menu Utama', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<BgmTrack>(soundEngine.getCurrentTrack());
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [bgmVol, setBgmVol] = useState<number>(soundEngine.getBgmVolume());
  const [sfxVol, setSfxVol] = useState<number>(soundEngine.getSfxVolume());
  const [isManual, setIsManual] = useState<boolean>(soundEngine.isManualOverride());
  const [isMuted, setIsMuted] = useState<boolean>(!soundEngine.isEnabled());

  useEffect(() => {
    const unsub = soundEngine.subscribe((trackId, playing) => {
      const track = BGM_TRACKS.find((t) => t.id === trackId) || BGM_TRACKS[0];
      setCurrentTrack(track);
      setIsPlaying(playing);
      setIsManual(soundEngine.isManualOverride());
      setIsMuted(!soundEngine.isEnabled());
    });
    return unsub;
  }, []);

  const handleSelectTrack = (trackId: string) => {
    soundEngine.click();
    soundEngine.playTrack(trackId, true);
    setIsManual(true);
  };

  const handleNext = () => {
    soundEngine.click();
    soundEngine.nextTrack();
    setIsManual(true);
  };

  const handlePrev = () => {
    soundEngine.click();
    soundEngine.previousTrack();
    setIsManual(true);
  };

  const handleTogglePlay = () => {
    soundEngine.click();
    soundEngine.setEnabled(!soundEngine.isEnabled());
  };

  const handleResetAuto = () => {
    soundEngine.click();
    soundEngine.resetAutoBgm();
    setIsManual(false);
    // Trigger feature bgm update
    const map: Record<string, 'menu' | 'story' | 'practice' | 'puzzle' | 'race'> = {
      'Menu Utama': 'menu',
      'Mode Cerita': 'story',
      'Ayo Berlatih': 'practice',
      'Lab Puzzle': 'puzzle',
    };
    const feat = map[currentFeature] || 'menu';
    soundEngine.setFeatureBgm(feat);
  };

  const handleBgmVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setBgmVol(val);
    soundEngine.setBgmVolume(val);
  };

  const handleSfxVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSfxVol(val);
    soundEngine.setSfxVolume(val);
  };

  return (
    <div className={`relative z-40 ${className}`}>
      {/* Compact Mini Pill / Trigger Button */}
      <button
        onClick={() => {
          soundEngine.click();
          setIsOpen(!isOpen);
        }}
        className="group flex items-center gap-1.5 px-2.5 py-1 sm:py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 text-amber-300 border border-amber-600/50 shadow-md backdrop-blur-md transition-all active:scale-95 text-xs font-semibold"
        title="Pengatur Soundtrack & Musik Latar"
      >
        <span className={`inline-block ${isPlaying && !isMuted ? 'animate-bounce text-emerald-400' : 'text-slate-400'}`}>
          🎵
        </span>
        <span className="hidden sm:inline max-w-[140px] truncate text-slate-200 group-hover:text-amber-200">
          {currentTrack.name.split(' (')[0]}
        </span>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
          {isManual ? 'Manual' : 'Auto'}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Floating Detailed Music Player Panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-10 sm:top-11 z-50 w-80 sm:w-96 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/50 shadow-2xl p-4 text-slate-100 flex flex-col gap-3.5 animate-in fade-in slide-in-from-top-2 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎵</span>
                <div>
                  <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Pemutar Musik & Efek Suara
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Mode: {isManual ? 'Pilihan Pengguna (Manual)' : `Otomatis Sesuai Fitur (${currentFeature})`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Currently Playing Card */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-amber-500/30 flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-xl shadow-inner shrink-0 overflow-hidden">
                <img
                  src="/assets/rafi/item_star.png"
                  alt="Track"
                  className="w-8 h-8 object-contain drop-shadow"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider block">
                  {currentTrack.featureName}
                </span>
                <p className="text-sm font-bold text-white truncate">{currentTrack.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`inline-block w-2 h-2 rounded-full ${isPlaying && !isMuted ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`} />
                  <span className="text-[10px] text-slate-400">
                    {isMuted ? 'Muted / Hening' : isPlaying ? 'Sedang Memutar' : 'Dijeda'}
                  </span>
                </div>
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-center gap-3 py-1">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-95 border border-slate-700 hover:border-amber-500/50"
                title="Lagu Sebelumnya"
              >
                ⏮
              </button>
              <button
                onClick={handleTogglePlay}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold shadow-lg transition active:scale-95 border-2 ${
                  isMuted
                    ? 'bg-red-600 hover:bg-red-500 border-red-400 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white'
                }`}
                title={isMuted ? 'Nyalakan Musik' : 'Matikan Suara'}
              >
                {isMuted ? '🔇' : '🔊'}
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition active:scale-95 border border-slate-700 hover:border-amber-500/50"
                title="Lagu Selanjutnya"
              >
                ⏭
              </button>
            </div>

            {/* Soundtrack Selector List */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                <span>Daftar Soundtrack Game:</span>
                {isManual && (
                  <button
                    onClick={handleResetAuto}
                    className="text-[10px] text-amber-400 hover:text-amber-300 underline font-normal"
                  >
                    Kembalikan ke Otomatis
                  </button>
                )}
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {BGM_TRACKS.map((track) => {
                  const isSelected = track.id === currentTrack.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleSelectTrack(track.id)}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition ${
                        isSelected
                          ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                          : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300 border border-transparent'
                      }`}
                    >
                      <span className="truncate">{track.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700/60 text-slate-300 shrink-0 ml-1">
                        {track.featureName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Volume Sliders */}
            <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400 w-24 shrink-0">Musik (BGM):</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bgmVol}
                  onChange={handleBgmVolumeChange}
                  className="flex-1 accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-amber-300 w-8 text-right font-mono">
                  {Math.round(bgmVol * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-slate-400 w-24 shrink-0">Efek (SFX):</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={sfxVol}
                  onChange={handleSfxVolumeChange}
                  className="flex-1 accent-emerald-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="text-[11px] text-emerald-300 w-8 text-right font-mono">
                  {Math.round(sfxVol * 100)}%
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
