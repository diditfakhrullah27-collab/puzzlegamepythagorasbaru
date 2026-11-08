/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BgmTrack {
  id: string;
  name: string;
  src: string;
  featureName: string;
}

export const BGM_TRACKS: BgmTrack[] = [
  { id: 'title', name: '01. Petualangan Pythagoras (Title)', src: '/assets/audio/title.mp3', featureName: 'Menu Utama' },
  { id: 'spring', name: '02. Desa Harmoni (Spring Meadow)', src: '/assets/audio/spring.mp3', featureName: 'Mode Cerita' },
  { id: 'puzzle', name: '19. Kota Matematika (Town Puzzler)', src: '/assets/audio/town_puzzle.mp3', featureName: 'Lab Puzzle' },
  { id: 'practice', name: '12. Arena Latihan (Minigame 1)', src: '/assets/audio/minigame_practice.mp3', featureName: 'Ayo Berlatih' },
  { id: 'race', name: '13. Balapan Cepat (Race Challenge)', src: '/assets/audio/race_challenge.mp3', featureName: 'Tantangan Kilat' },
];

class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgmVolume: number = 0.55;
  private sfxVolume: number = 0.8;
  private currentTrackId: string = 'title';
  private manualOverride: boolean = false;

  private currentAudio: HTMLAudioElement | null = null;
  private audioElements: Map<string, HTMLAudioElement> = new Map();
  private sfxAudioPool: Map<string, HTMLAudioElement[]> = new Map();

  private isUnlocked: boolean = false;
  private listeners: Set<(trackId: string, isPlaying: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      // Preload SFX
      this.initSfx('klik_tombol', '/assets/audio/klik_tombol.wav');
      this.initSfx('perpindahan_menu', '/assets/audio/perpindahan_menu.wav');
      this.initSfx('jawaban_benar', '/assets/audio/jawaban_benar.wav');
      this.initSfx('lokasi_baru_terbuka', '/assets/audio/lokasi_baru_terbuka.wav');

      // Preload BGM
      BGM_TRACKS.forEach((track) => {
        try {
          const audio = new Audio(track.src);
          audio.loop = true;
          audio.preload = 'metadata';
          audio.volume = this.bgmVolume;
          this.audioElements.set(track.id, audio);
        } catch {}
      });

      // Unlock audio context and audio playback on first interaction
      const unlock = () => {
        if (this.isUnlocked) return;
        this.isUnlocked = true;
        this.initCtx();
        if (this.currentAudio && this.soundEnabled) {
          this.currentAudio.play().catch(() => {});
        }
        window.removeEventListener('pointerdown', unlock);
        window.removeEventListener('keydown', unlock);
      };
      window.addEventListener('pointerdown', unlock, { once: false });
      window.addEventListener('keydown', unlock, { once: false });
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  private initSfx(name: string, url: string) {
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < 3; i++) {
      try {
        const audio = new Audio(url);
        audio.preload = 'auto';
        pool.push(audio);
      } catch {}
    }
    this.sfxAudioPool.set(name, pool);
  }

  private playSfxFromPool(name: string, fallbackSynth?: () => void) {
    if (!this.soundEnabled) return;
    this.initCtx();

    const pool = this.sfxAudioPool.get(name);
    if (pool && pool.length > 0) {
      // Find an audio element that is either paused or ended
      let chosen = pool.find((a) => a.paused || a.ended);
      if (!chosen) {
        chosen = pool[0];
      }
      try {
        chosen.currentTime = 0;
        chosen.volume = this.sfxVolume;
        const playPromise = chosen.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            if (fallbackSynth) fallbackSynth();
          });
        }
        return;
      } catch {
        if (fallbackSynth) fallbackSynth();
      }
    } else if (fallbackSynth) {
      fallbackSynth();
    }
  }

  // Subscribe to BGM track changes for UI player sync
  public subscribe(fn: (trackId: string, isPlaying: boolean) => void) {
    this.listeners.add(fn);
    fn(this.currentTrackId, !this.currentAudio?.paused);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notifyListeners() {
    const isPlaying = !!this.currentAudio && !this.currentAudio.paused;
    this.listeners.forEach((fn) => fn(this.currentTrackId, isPlaying));
  }

  // -------------------------------------------------------------
  // BGM CONTROLS
  // -------------------------------------------------------------

  /**
   * Set BGM according to current game feature/screen
   * (e.g. 'menu' -> 'title', 'story' -> 'spring', 'practice' -> 'practice', 'puzzle' -> 'town_puzzle')
   */
  public setFeatureBgm(feature: 'menu' | 'story' | 'practice' | 'puzzle' | 'race') {
    if (this.manualOverride) return; // Player manually picked a specific track
    const trackMap: Record<string, string> = {
      menu: 'title',
      story: 'spring',
      practice: 'practice',
      puzzle: 'puzzle',
      race: 'race',
    };
    const trackId = trackMap[feature] || 'title';
    this.playTrack(trackId);
  }

  /**
   * Explicitly play a track (e.g. from the in-game music player)
   */
  public playTrack(trackId: string, isManual = false) {
    if (isManual) {
      this.manualOverride = true;
    }

    if (this.currentTrackId === trackId && this.currentAudio && !this.currentAudio.paused) {
      return;
    }

    // Stop current track
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
    }

    this.currentTrackId = trackId;
    let nextAudio = this.audioElements.get(trackId);

    if (!nextAudio) {
      const track = BGM_TRACKS.find((t) => t.id === trackId);
      if (track) {
        nextAudio = new Audio(track.src);
        nextAudio.loop = true;
        this.audioElements.set(trackId, nextAudio);
      }
    }

    if (nextAudio) {
      this.currentAudio = nextAudio;
      this.currentAudio.volume = this.soundEnabled ? this.bgmVolume : 0;
      if (this.soundEnabled && this.isUnlocked) {
        this.currentAudio.play().catch(() => {});
      }
    }

    this.notifyListeners();
  }

  public nextTrack() {
    const idx = BGM_TRACKS.findIndex((t) => t.id === this.currentTrackId);
    const nextIdx = (idx + 1) % BGM_TRACKS.length;
    this.playTrack(BGM_TRACKS[nextIdx].id, true);
  }

  public previousTrack() {
    const idx = BGM_TRACKS.findIndex((t) => t.id === this.currentTrackId);
    const prevIdx = (idx - 1 + BGM_TRACKS.length) % BGM_TRACKS.length;
    this.playTrack(BGM_TRACKS[prevIdx].id, true);
  }

  public resetAutoBgm() {
    this.manualOverride = false;
  }

  public getCurrentTrack(): BgmTrack {
    return BGM_TRACKS.find((t) => t.id === this.currentTrackId) || BGM_TRACKS[0];
  }

  public isManualOverride(): boolean {
    return this.manualOverride;
  }

  public setEnabled(val: boolean) {
    this.soundEnabled = val;
    if (this.currentAudio) {
      this.currentAudio.volume = val ? this.bgmVolume : 0;
      if (val && this.isUnlocked) {
        this.currentAudio.play().catch(() => {});
      } else if (!val) {
        this.currentAudio.pause();
      }
    }
    this.notifyListeners();
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public setBgmVolume(val: number) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.currentAudio && this.soundEnabled && !this.isDucked) {
      this.currentAudio.volume = this.bgmVolume;
    }
  }

  public getBgmVolume(): number {
    return this.bgmVolume;
  }

  private isDucked: boolean = false;
  private preDuckVolume: number = 0.55;

  /**
   * Ducks background music volume to a soft ambient level when educational video audio is active,
   * or restores normal volume when video audio is muted/paused.
   */
  public duckBgm(shouldDuck: boolean) {
    if (shouldDuck) {
      if (!this.isDucked) {
        this.isDucked = true;
        this.preDuckVolume = this.bgmVolume;
        if (this.currentAudio && this.soundEnabled) {
          // Gentle ambient ducking (15% of normal volume) so video speech is crisp and prominent
          this.currentAudio.volume = Math.max(0.04, this.preDuckVolume * 0.15);
        }
      }
    } else {
      if (this.isDucked) {
        this.isDucked = false;
        if (this.currentAudio && this.soundEnabled) {
          this.currentAudio.volume = this.preDuckVolume;
        }
      }
    }
    this.notifyListeners();
  }

  public isBgmDucked(): boolean {
    return this.isDucked;
  }

  public pauseBgm() {
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
      this.notifyListeners();
    }
  }

  public resumeBgm() {
    if (this.currentAudio && this.soundEnabled && this.isUnlocked && this.currentAudio.paused) {
      this.currentAudio.play().catch(() => {});
      this.notifyListeners();
    }
  }

  public setSfxVolume(val: number) {
    this.sfxVolume = Math.max(0, Math.min(1, val));
  }

  public getSfxVolume(): number {
    return this.sfxVolume;
  }

  // -------------------------------------------------------------
  // SFX METHODS - NAMED DIRECTLY AFTER AUDIO ASSETS
  // -------------------------------------------------------------

  /**
   * 01_klik_tombol: standard button clicks
   */
  public click() {
    this.playSfxFromPool('klik_tombol', () => this.synthClick());
  }

  /**
   * 02_perpindahan_menu: menu transitions, tab switches, modal opens/closes
   */
  public transition() {
    this.playSfxFromPool('perpindahan_menu', () => this.synthTransition());
  }

  /**
   * 03_jawaban_benar: correct answer, puzzle piece snapping into place, stage verified
   */
  public correct() {
    this.playSfxFromPool('jawaban_benar', () => this.synthSuccess());
  }

  public snap() {
    this.correct();
  }

  public success() {
    this.correct();
  }

  /**
   * 07_lokasi_baru_terbuka: level unlocked, stage complete, victory celebration
   */
  public unlock() {
    this.playSfxFromPool('lokasi_baru_terbuka', () => this.synthVictory());
  }

  public victory() {
    this.unlock();
  }

  public victoryFanfare() {
    this.unlock();
  }

  // -------------------------------------------------------------
  // ADDITIONAL SFX & PROCEDURAL SYNTHESIZERS (FALLBACK)
  // -------------------------------------------------------------

  public rotate() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(560, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.1);
    } catch {}
  }

  public hint() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + i * 0.06;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.12 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.14);
      });
    } catch {}
  }

  public error() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(174.61, now + 0.1);
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.22);
    } catch {}
  }

  public dialogueBlip() {
    if (!this.soundEnabled) return;
    this.initCtx();
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(540 + Math.random() * 80, now);
      gain.gain.setValueAtTime(0.04 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.03);
    } catch {}
  }

  private synthClick() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(720, this.ctx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch {}
  }

  private synthTransition() {
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(350, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, this.ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.15);
    } catch {}
  }

  private synthSuccess() {
    if (!this.ctx) return;
    try {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.18 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {}
  }

  private synthVictory() {
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const now = this.ctx.currentTime + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      });
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
