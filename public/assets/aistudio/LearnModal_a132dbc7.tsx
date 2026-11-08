/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GEOMETRY_SHAPES, ShapeInfo } from '../data/learningContent';
import { TactileButton } from './TactileButton';
import { soundEngine } from '../utils/audio';

interface LearnModalProps {
  onBack: () => void;
  onOpenPractice?: (challengeId?: number) => void;
  initialChapter?: number;
}

export const LearnModal: React.FC<LearnModalProps> = ({
  onBack,
  onOpenPractice,
  initialChapter = 1,
}) => {
  const [activeTab, setActiveTab] = useState<'materi' | 'shapes'>('materi');
  const [currentChapter, setCurrentChapter] = useState<number>(initialChapter);

  // Chapter 1 Interactive State
  const [c1TriangleA, setC1TriangleA] = useState<number>(3);
  const [c1TriangleB, setC1TriangleB] = useState<number>(4);
  const c1Hypotenuse = Math.hypot(c1TriangleA, c1TriangleB);

  // Chapter 2 Interactive State (Rearrangement Visualizer)
  const [c2Arrangement, setC2Arrangement] = useState<'center_c2' | 'split_ab'>('center_c2');

  // Chapter 3 Interactive State (Calculation Steps)
  const [c3ActiveExample, setC3ActiveExample] = useState<1 | 2>(1);
  const [c3StepEx1, setC3StepEx1] = useState<number>(0);
  const [c3StepEx2, setC3StepEx2] = useState<number>(0);

  // Chapter 4 Interactive State (Real World Application)
  const [c4ActiveApp, setC4ActiveApp] = useState<'tangga' | 'tiang' | 'jembatan' | 'diagonal' | 'atap'>('tangga');
  const [c4LadderHeight, setC4LadderHeight] = useState<number>(4);
  const [c4LadderDistance, setC4LadderDistance] = useState<number>(3);

  // Chapter 5 Interactive State (Converse & Angle Identification)
  const [c5SideA, setC5SideA] = useState<number>(6);
  const [c5SideB, setC5SideB] = useState<number>(8);
  const [c5SideC, setC5SideC] = useState<number>(10);

  // Chapter 6 Interactive State (Pythagorean Triple Generator)
  const [c6ValM, setC6ValM] = useState<number>(2);
  const [c6ValN, setC6ValN] = useState<number>(1);

  // Shapes Tab State (Preserving Existing Feature)
  const [selectedShape, setSelectedShape] = useState<ShapeInfo>(GEOMETRY_SHAPES[0]);
  const [shapeValA, setShapeValA] = useState<number>(GEOMETRY_SHAPES[0].exampleData.defaultA);
  const [shapeValB, setShapeValB] = useState<number>(GEOMETRY_SHAPES[0].exampleData.defaultB);
  const [shapeValC, setShapeValC] = useState<number>(GEOMETRY_SHAPES[0].exampleData.defaultC || 3);

  const CHAPTER_NAMES = [
    'Pengertian & Rumus',
    'Pembuktian Geometris',
    'Contoh Perhitungan',
    'Penerapan Sehari-hari',
    'Kebalikan Teorema',
    'Triple Pythagoras',
  ];

  // Map chapters to practice challenges
  const CHAPTER_PRACTICE_TARGETS: Record<number, number> = {
    1: 1, // Tantangan 1: Hubungan Sisi Segitiga
    2: 2, // Tantangan 2: Pembuktian Aljabar Visual
    3: 3, // Tantangan 3: Perhitungan Panjang Sisi
    4: 4, // Tantangan 4: Aplikasi Diagonal & Geometri Komposit (or 8, 9)
    5: 5, // Tantangan 5: Uji Jenis Segitiga & Kebalikan
    6: 6, // Tantangan 6: Identifikasi Triple Pythagoras
  };

  const handleNextChapter = () => {
    if (currentChapter < 6) {
      setCurrentChapter((prev) => prev + 1);
      soundEngine.click();
    }
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter((prev) => prev - 1);
      soundEngine.click();
    }
  };

  const handleGoToPractice = (challengeId: number) => {
    soundEngine.click();
    if (onOpenPractice) {
      onOpenPractice(challengeId);
    }
  };

  return (
    <div className="relative w-full h-[100dvh] max-h-screen flex flex-col bg-radial from-slate-900 via-slate-950 to-black overflow-hidden text-slate-100 select-none">
      {/* Top Header Bar */}
      <header className="flex-shrink-0 z-20 px-3 sm:px-6 py-2 sm:py-3 bg-slate-950/90 backdrop-blur-md border-b-2 border-amber-500/30 flex items-center justify-between gap-2 shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <TactileButton
            iconSrc="/assets/icons/back.png"
            iconAlt="Kembali"
            label="Kembali"
            variant="neutral"
            size="sm"
            className="py-1 px-2.5 sm:px-3 text-xs"
            onClick={onBack}
          />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="p-1 sm:p-1.5 rounded-xl bg-amber-500/20 border border-amber-400">
              <img src="/assets/icons/learn.png" alt="Materi" className="w-5 h-5 sm:w-6 sm:h-6 object-contain" />
            </div>
            <div>
              <h1 className="text-sm sm:text-lg md:text-xl font-black text-amber-400 uppercase tracking-tight">
                Materi Teorema Pythagoras
              </h1>
              <span className="hidden sm:block text-[10px] text-slate-400">
                Panduan Komprehensif Matematika Sesuai Buku & Kurikulum
              </span>
            </div>
          </div>
        </div>

        {/* Tab switcher: Materi Utama vs Ensiklopedia Bangun Datar */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => {
              setActiveTab('materi');
              soundEngine.click();
            }}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'materi'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Materi Teorema (6 Bab)
          </button>
          <button
            onClick={() => {
              setActiveTab('shapes');
              soundEngine.click();
            }}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-black transition-all cursor-pointer ${
              activeTab === 'shapes'
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ensiklopedia Bangun
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-4 md:p-6 flex flex-col items-center">
        {activeTab === 'materi' ? (
          <div className="w-full max-w-5xl flex flex-col gap-3 sm:gap-4 my-auto">
            {/* Chapter Stepper & Navigation Header */}
            <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-2 sm:p-3 shadow-lg flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-0.5">
                {[1, 2, 3, 4, 5, 6].map((ch) => (
                  <button
                    key={ch}
                    onClick={() => {
                      setCurrentChapter(ch);
                      soundEngine.click();
                    }}
                    className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                      currentChapter === ch
                        ? 'bg-amber-400 text-slate-950 shadow-md scale-102 font-black ring-2 ring-amber-300'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-slate-950/20 flex items-center justify-center text-[10px]">
                      {ch}
                    </span>
                    <span className="hidden md:inline">{CHAPTER_NAMES[ch - 1]}</span>
                    <span className="md:hidden">Bab {ch}</span>
                  </button>
                ))}
              </div>

              {/* Action: Coba Soal Ini Button */}
              {onOpenPractice && (
                <button
                  onClick={() => handleGoToPractice(CHAPTER_PRACTICE_TARGETS[currentChapter])}
                  className="px-3 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-[0_3px_0_#b45309] active:translate-y-0.5 active:shadow-[0_1px_0_#b45309] transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
                >
                  <img src="/assets/icons/ruler.png" alt="Soal" className="w-4 h-4 object-contain" />
                  <span>COBA SOAL INI</span>
                  <span className="bg-black/20 text-slate-950 text-[10px] px-1.5 py-0.2 rounded font-mono font-bold">
                    Tantangan #{CHAPTER_PRACTICE_TARGETS[currentChapter]}
                  </span>
                </button>
              )}
            </div>

            {/* Chapter Card Content */}
            <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-3xl p-3.5 sm:p-6 shadow-2xl backdrop-blur-md">
              {/* BAB 1: PENGERTIAN TEOREMA PYTHAGORAS */}
              {currentChapter === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                        Bab 1 Pembelajaran
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-white">
                        Pengertian Teorema Pythagoras & Hubungan Sisi
                      </h2>
                    </div>
                    <span className="text-xs bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 font-semibold">
                      Konsep Dasar & Rumus Utama
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Teorema Pythagoras adalah salah satu prinsip fundamental dalam geometri yang dirumuskan oleh
                    filsuf Yunani Kuno bernama <strong className="text-amber-300">Pythagoras</strong>. Teorema ini
                    menyatakan bahwa:
                  </p>

                  <div className="bg-gradient-to-r from-amber-950/50 via-slate-900 to-amber-950/30 p-3 sm:p-4 rounded-2xl border-l-4 border-amber-400 text-xs sm:text-sm text-amber-200 font-medium shadow-inner">
                    &quot;Pada setiap <strong>segitiga siku-siku</strong>, kuadrat panjang sisi miring (hipotenusa) sama
                    dengan jumlah kuadrat panjang kedua sisi lainnya.&quot;
                  </div>

                  {/* Interactive Formula & Dynamic 3D Triangle Display */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* SVG Visual Representation with Squares on each side */}
                    <div className="md:col-span-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Ilustrasi Luas Persegi Sisi: a² + b² = c²
                      </div>
                      <svg viewBox="-80 -80 360 360" className="w-full max-w-[280px] h-56">
                        <defs>
                          <pattern id="grid-ch1" width="10" height="10" patternUnits="userSpaceOnUse">
                            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#334155" strokeWidth="0.5" />
                          </pattern>
                        </defs>

                        {/* Square on side A (vertical: left) */}
                        <rect x="-40" y="40" width="60" height="60" fill="#f59e0b" fillOpacity="0.25" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                        <text x="-10" y="75" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">a² = 9</text>

                        {/* Square on side B (horizontal: bottom) */}
                        <rect x="20" y="100" width="80" height="80" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                        <text x="60" y="145" fill="#10b981" fontSize="12" fontWeight="bold" textAnchor="middle">b² = 16</text>

                        {/* Square on hypotenuse C (slanted) */}
                        <g transform="translate(20,40) rotate(-36.87)">
                          <rect x="0" y="-100" width="100" height="100" fill="#38bdf8" fillOpacity="0.3" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3 3" />
                          <text x="50" y="-45" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">c² = 25</text>
                        </g>

                        {/* Right Triangle ABC */}
                        <polygon points="20,40 20,100 100,100" fill="#1e293b" stroke="#e2e8f0" strokeWidth="3" />
                        
                        {/* Right angle marker at (20,100) */}
                        <polyline points="20,86 34,86 34,100" fill="none" stroke="#f43f5e" strokeWidth="2" />
                        <circle cx="27" cy="93" r="2" fill="#f43f5e" />

                        {/* Labels for vertices */}
                        <text x="10" y="32" fill="#fbbf24" fontSize="13" fontWeight="black">A</text>
                        <text x="8" y="116" fill="#fbbf24" fontSize="13" fontWeight="black">C (90°)</text>
                        <text x="112" y="106" fill="#fbbf24" fontSize="13" fontWeight="black">B</text>

                        {/* Side length annotations */}
                        <text x="10" y="70" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="end">a = 3</text>
                        <text x="60" y="118" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">b = 4</text>
                        <text x="68" y="60" fill="#38bdf8" fontSize="11" fontWeight="bold">c = 5</text>
                      </svg>
                      <div className="text-[11px] text-center text-slate-300 font-mono mt-1">
                        Luas Persegi a (9) + Luas Persegi b (16) = Luas Persegi c (25)
                      </div>
                    </div>

                    {/* Mathematical Formula Variants Breakdown */}
                    <div className="md:col-span-6 space-y-3">
                      <div className="bg-slate-950 p-3 sm:p-4 rounded-2xl border border-amber-500/30 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-amber-400">Rumus Utama (Mencari Hipotenusa)</span>
                        <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 bg-slate-900/80 p-2 rounded-xl text-center border border-amber-500/20">
                          c² = a² + b²
                        </div>
                        <div className="text-xs text-slate-300 text-center font-mono">
                          atau: <strong className="text-sky-300">c = √(a² + b²)</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-amber-400 font-bold block mb-1">Mencari Sisi a:</span>
                          <div className="font-mono font-bold text-amber-200">a² = c² − b²</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">a = √(c² − b²)</div>
                        </div>

                        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                          <span className="text-[10px] text-emerald-400 font-bold block mb-1">Mencari Sisi b:</span>
                          <div className="font-mono font-bold text-emerald-200">b² = c² − a²</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">b = √(c² − a²)</div>
                        </div>
                      </div>

                      <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 text-[11px] text-slate-300 space-y-1">
                        <div className="font-bold text-white mb-0.5">Keterangan Komponen:</div>
                        <div>• <strong className="text-amber-400">a</strong> = Sisi siku-siku pertama (tegak atau alas)</div>
                        <div>• <strong className="text-emerald-400">b</strong> = Sisi siku-siku kedua (alas atau tegak)</div>
                        <div>• <strong className="text-sky-400">c</strong> = Sisi miring (hipotenusa, sisi terpanjang di hadapan sudut siku-siku)</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* BAB 2: PEMBUKTIAN TEOREMA PYTHAGORAS */}
              {currentChapter === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                        Bab 2 Pembelajaran
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-white">
                        Pembuktian Geometris Teorema Pythagoras
                      </h2>
                    </div>
                    <span className="text-xs bg-emerald-400/10 text-emerald-300 px-3 py-1 rounded-full border border-emerald-400/30 font-semibold">
                      Metode Luas Persegi Besar & 4 Segitiga
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Bagaimana kita membuktikan bahwa rumus <strong className="text-amber-300 font-mono">c² = a² + b²</strong> pasti
                    benar untuk setiap segitiga siku-siku? Kita dapat membuktikannya secara aljabar menggunakan luas
                    sebuah persegi besar dengan panjang sisi <strong className="text-amber-300 font-mono">(a + b)</strong> yang
                    disusun dari 4 segitiga siku-siku identik dan 1 persegi di tengahnya.
                  </p>

                  {/* Rearrangement Simulator & Geometric Visualizer */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-6 bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-3">
                        <button
                          onClick={() => {
                            setC2Arrangement('center_c2');
                            soundEngine.click();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            c2Arrangement === 'center_c2'
                              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Susunan 1: Persegi c² di Tengah
                        </button>
                        <button
                          onClick={() => {
                            setC2Arrangement('split_ab');
                            soundEngine.click();
                          }}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            c2Arrangement === 'split_ab'
                              ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          Susunan 2: Persegi a² & b²
                        </button>
                      </div>

                      {/* SVG Canvas for geometric arrangement */}
                      <svg viewBox="0 0 240 240" className="w-56 h-56 bg-slate-900 rounded-xl border border-slate-700">
                        {/* Outer Square (a+b) x (a+b) = 7x7 */}
                        <rect x="10" y="10" width="220" height="220" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="4 4" />

                        {c2Arrangement === 'center_c2' ? (
                          <>
                            {/* 4 Triangles forming inner rotated square */}
                            <polygon points="10,10 10,75 175,10" fill="#3b82f6" fillOpacity="0.4" stroke="#60a5fa" strokeWidth="2" />
                            <polygon points="10,75 10,230 75,230" fill="#10b981" fillOpacity="0.4" stroke="#34d399" strokeWidth="2" />
                            <polygon points="75,230 230,230 230,165" fill="#f59e0b" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="2" />
                            <polygon points="230,165 230,10 175,10" fill="#ec4899" fillOpacity="0.4" stroke="#f472b6" strokeWidth="2" />

                            {/* Center square c^2 */}
                            <polygon points="175,10 10,75 75,230 230,165" fill="#38bdf8" fillOpacity="0.35" stroke="#38bdf8" strokeWidth="2.5" />
                            <text x="120" y="125" fill="#38bdf8" fontSize="16" fontWeight="black" textAnchor="middle">
                              Luas = c²
                            </text>
                          </>
                        ) : (
                          <>
                            {/* Rearranged 4 triangles in 2 rectangles, revealing a^2 and b^2 */}
                            <rect x="10" y="10" width="65" height="65" fill="#f59e0b" fillOpacity="0.4" stroke="#fbbf24" strokeWidth="2" />
                            <text x="42" y="47" fill="#fbbf24" fontSize="14" fontWeight="black" textAnchor="middle">a²</text>

                            <rect x="75" y="75" width="155" height="155" fill="#10b981" fillOpacity="0.4" stroke="#34d399" strokeWidth="2" />
                            <text x="152" y="157" fill="#34d399" fontSize="16" fontWeight="black" textAnchor="middle">b²</text>

                            {/* Two rectangles (2 triangles each) */}
                            <polygon points="75,10 230,10 75,75" fill="#3b82f6" fillOpacity="0.35" stroke="#60a5fa" strokeWidth="1.5" />
                            <polygon points="230,10 230,75 75,75" fill="#3b82f6" fillOpacity="0.35" stroke="#60a5fa" strokeWidth="1.5" />
                            <polygon points="10,75 75,75 10,230" fill="#ec4899" fillOpacity="0.35" stroke="#f472b6" strokeWidth="1.5" />
                            <polygon points="75,75 75,230 10,230" fill="#ec4899" fillOpacity="0.35" stroke="#f472b6" strokeWidth="1.5" />
                          </>
                        )}
                      </svg>

                      <div className="text-[11px] text-slate-400 mt-2 text-center font-mono">
                        Persegi Luar berukuran (a + b) × (a + b)
                      </div>
                    </div>

                    {/* Algebraic Step-by-Step Proof */}
                    <div className="md:col-span-6 space-y-3">
                      <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                        <span className="text-[10px] uppercase font-bold text-amber-400">Penurunan Rumus Aljabar:</span>
                        <div className="text-xs sm:text-sm text-slate-300 font-mono space-y-1.5">
                          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700">
                            <strong>1. Luas Persegi Luar:</strong>
                            <div className="text-amber-300 mt-0.5">L = (a + b)² = a² + 2ab + b²</div>
                          </div>
                          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700">
                            <strong>2. Luas Bagian-Bagian Dalam:</strong>
                            <div className="text-sky-300 mt-0.5">L = Luas Persegi Tengah + 4 × Luas Segitiga</div>
                            <div className="text-sky-300">L = c² + 4(½ × a × b) = c² + 2ab</div>
                          </div>
                          <div className="bg-slate-900/90 p-2 rounded-lg border border-slate-700">
                            <strong>3. Samakan Kedua Persamaan Luas:</strong>
                            <div className="text-slate-200 mt-0.5">c² + 2ab = a² + 2ab + b²</div>
                          </div>
                          <div className="bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-500/40 text-emerald-300 font-black text-center text-sm">
                            c² = a² + b² (Terbukti!)
                          </div>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed italic">
                        Kesimpulan: Kedua konfigurasi memiliki luas sisa yang identik jika 4 segitiga disisihkan, membuktikan bahwa luas c² persis sama dengan jumlah a² + b².
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* BAB 3: CONTOH PERHITUNGAN */}
              {currentChapter === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                        Bab 3 Pembelajaran
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-white">
                        Contoh Perhitungan Step-by-Step
                      </h2>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setC3ActiveExample(1);
                          soundEngine.click();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          c3ActiveExample === 1 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Contoh 1 (Mencari Sisi Tegak)
                      </button>
                      <button
                        onClick={() => {
                          setC3ActiveExample(2);
                          soundEngine.click();
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                          c3ActiveExample === 2 ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        Contoh 2 (Mencari Sisi Miring)
                      </button>
                    </div>
                  </div>

                  {c3ActiveExample === 1 ? (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                        <div className="text-xs font-bold text-amber-400 uppercase">Soal: Mencari Sisi Siku-Siku (b)</div>
                        <p className="text-xs text-slate-300">
                          Diketahui segitiga siku-siku dengan sisi miring <strong className="text-sky-400">c = 5 cm</strong> dan
                          panjang salah satu sisi siku-siku <strong className="text-amber-400">a = 3 cm</strong>. Berapakah panjang
                          sisi siku-siku kedua (<strong className="text-emerald-400">b</strong>)?
                        </p>
                        <svg viewBox="0 0 160 120" className="w-48 h-36 mx-auto bg-slate-900 rounded-xl p-2 border border-slate-700">
                          <polygon points="30,20 30,100 130,100" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                          <polyline points="30,88 42,88 42,100" fill="none" stroke="#f43f5e" strokeWidth="2" />
                          <text x="20" y="65" fill="#f59e0b" fontSize="12" fontWeight="bold">a=3</text>
                          <text x="80" y="115" fill="#10b981" fontSize="12" fontWeight="bold">b = ?</text>
                          <text x="90" y="55" fill="#38bdf8" fontSize="12" fontWeight="bold">c=5</text>
                        </svg>
                      </div>

                      <div className="md:col-span-7 bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3">
                        <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                          Langkah Penyelesaian Sistematis:
                        </div>
                        <div className="space-y-2 font-mono text-xs sm:text-sm">
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-sans">Langkah 1: Tulis rumus pengurangan</span>
                            <div className="text-amber-300 font-bold">b² = c² − a²</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-sans">Langkah 2: Substitusi nilai c = 5 dan a = 3</span>
                            <div className="text-slate-200">b² = 5² − 3²</div>
                            <div className="text-slate-200">b² = 25 − 9 = 16</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-sans">Langkah 3: Ambil akar kuadrat kedua ruas</span>
                            <div className="text-emerald-300 font-bold">b = √16 = 4 cm</div>
                          </div>
                        </div>
                        <div className="bg-emerald-950/60 p-2.5 rounded-xl border border-emerald-500/40 text-emerald-300 font-bold text-xs">
                          Kesimpulan: Panjang sisi siku-siku kedua adalah <strong className="font-mono text-sm">4 cm</strong>.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center space-y-3">
                        <div className="text-xs font-bold text-amber-400 uppercase">Soal: Mencari Hipotenusa (c)</div>
                        <p className="text-xs text-slate-300">
                          Diketahui panjang kedua sisi siku-siku sebuah segitiga berturut-turut adalah{' '}
                          <strong className="text-amber-400">a = 5 cm</strong> dan <strong className="text-emerald-400">b = 12 cm</strong>.
                          Hitunglah panjang sisi miring (<strong className="text-sky-400">c</strong>)!
                        </p>
                        <svg viewBox="0 0 160 120" className="w-48 h-36 mx-auto bg-slate-900 rounded-xl p-2 border border-slate-700">
                          <polygon points="30,30 30,100 140,100" fill="#1e293b" stroke="#38bdf8" strokeWidth="2.5" />
                          <polyline points="30,88 42,88 42,100" fill="none" stroke="#f43f5e" strokeWidth="2" />
                          <text x="18" y="70" fill="#f59e0b" fontSize="12" fontWeight="bold">a=5</text>
                          <text x="80" y="115" fill="#10b981" fontSize="12" fontWeight="bold">b=12</text>
                          <text x="95" y="58" fill="#38bdf8" fontSize="12" fontWeight="bold">c = ?</text>
                        </svg>
                      </div>

                      <div className="md:col-span-7 bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3">
                        <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                          Langkah Penyelesaian Sistematis:
                        </div>
                        <div className="space-y-2 font-mono text-xs sm:text-sm">
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-sans">Langkah 1: Gunakan rumus utama penambahan</span>
                            <div className="text-amber-300 font-bold">c² = a² + b²</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-sans">Langkah 2: Kuadratkan dan jumlahkan nilai</span>
                            <div className="text-slate-200">c² = 5² + 12²</div>
                            <div className="text-slate-200">c² = 25 + 144 = 169</div>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                            <span className="text-[10px] text-slate-400 block font-sans">Langkah 3: Ambil akar kuadrat positif</span>
                            <div className="text-sky-300 font-bold">c = √169 = 13 cm</div>
                          </div>
                        </div>
                        <div className="bg-sky-950/60 p-2.5 rounded-xl border border-sky-500/40 text-sky-300 font-bold text-xs">
                          Kesimpulan: Panjang sisi miring (hipotenusa) adalah <strong className="font-mono text-sm">13 cm</strong>.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BAB 4: PENERAPAN DALAM KEHIDUPAN SEHARI-HARI */}
              {currentChapter === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                        Bab 4 Pembelajaran
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-white">
                        Penerapan Teorema Pythagoras di Dunia Nyata
                      </h2>
                    </div>
                    <span className="text-xs bg-sky-400/10 text-sky-300 px-3 py-1 rounded-full border border-sky-400/30 font-semibold">
                      Teknologi, Konstruksi & Alam
                    </span>
                  </div>

                  {/* 5 Real World Application Tabs */}
                  <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
                    {[
                      { id: 'tangga', label: '1. Tangga Bersandar' },
                      { id: 'tiang', label: '2. Kawat Tiang Bendera' },
                      { id: 'jembatan', label: '3. Jembatan Gantung' },
                      { id: 'diagonal', label: '4. Diagonal TV & Lapangan' },
                      { id: 'atap', label: '5. Rangka Atap Rumah' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setC4ActiveApp(tab.id as any);
                          soundEngine.click();
                        }}
                        className={`px-2.5 sm:px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          c4ActiveApp === tab.id
                            ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Detail Views */}
                  {c4ActiveApp === 'tangga' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <svg viewBox="0 0 200 160" className="w-56 h-44 mx-auto bg-slate-900 rounded-xl p-2 border border-slate-700">
                          {/* Ground and Wall */}
                          <line x1="20" y1="130" x2="180" y2="130" stroke="#64748b" strokeWidth="3" />
                          <rect x="150" y="20" width="20" height="110" fill="#475569" stroke="#64748b" strokeWidth="2" />
                          
                          {/* Leaning Ladder */}
                          <line x1="50" y1="130" x2="150" y2="30" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
                          <circle cx="50" cy="130" r="4" fill="#fbbf24" />
                          <circle cx="150" cy="30" r="4" fill="#fbbf24" />

                          {/* Dimensions */}
                          <text x="100" y="145" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">Jarak Kaki (b = 3 m)</text>
                          <text x="175" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold">Tinggi (a = 4 m)</text>
                          <text x="80" y="70" fill="#f59e0b" fontSize="12" fontWeight="black">Tangga = 5 m</text>
                        </svg>
                      </div>
                      <div className="md:col-span-7 space-y-2 text-xs sm:text-sm text-slate-300">
                        <h3 className="text-base font-black text-amber-300">Kasus 1: Tangga Bersandar pada Dinding</h3>
                        <p className="leading-relaxed">
                          Ketika tangga bersandar pada dinding tegak, terbentuk segitiga siku-siku sempurna antara permukaan dinding vertikal, tanah mendatar, dan kemiringan tangga.
                        </p>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono space-y-1 text-xs">
                          <div>• <strong className="text-amber-400">Panjang Tangga (Hipotenusa c)</strong>: c² = a² + b²</div>
                          <div>• Jika tinggi dinding a = 4 m dan jarak kaki b = 3 m:</div>
                          <div className="text-emerald-300 font-bold">c = √(4² + 3²) = √(16 + 9) = √25 = 5 meter.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {c4ActiveApp === 'tiang' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <svg viewBox="0 0 200 160" className="w-56 h-44 mx-auto bg-slate-900 rounded-xl p-2 border border-slate-700">
                          <line x1="20" y1="130" x2="180" y2="130" stroke="#64748b" strokeWidth="3" />
                          {/* Pole */}
                          <line x1="100" y1="20" x2="100" y2="130" stroke="#e2e8f0" strokeWidth="4" />
                          {/* Stay Wires */}
                          <line x1="40" y1="130" x2="100" y2="30" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" />
                          <line x1="160" y1="130" x2="100" y2="30" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="3 3" />
                          <circle cx="100" cy="20" r="5" fill="#f59e0b" />
                          <text x="100" y="80" fill="#e2e8f0" fontSize="11" fontWeight="bold" textAnchor="end">Tiang (8m) </text>
                          <text x="65" y="145" fill="#10b981" fontSize="11" fontWeight="bold">Jarak (6m)</text>
                          <text x="50" y="70" fill="#38bdf8" fontSize="11" fontWeight="bold">Kawat=10m</text>
                        </svg>
                      </div>
                      <div className="md:col-span-7 space-y-2 text-xs sm:text-sm text-slate-300">
                        <h3 className="text-base font-black text-amber-300">Kasus 2: Kawat Pancang Tiang Antena & Bendera</h3>
                        <p className="leading-relaxed">
                          Teknisi telekomunikasi menghitung panjang kawat baja penahan angin agar tiang tegak kokoh tanpa roboh.
                        </p>
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono space-y-1 text-xs">
                          <div>• Tinggi tiang = 8 meter, Jarak pasak di tanah = 6 meter</div>
                          <div>• Panjang 1 kawat = √(8² + 6²) = √(64 + 36) = √100 = 10 meter</div>
                          <div className="text-sky-300 font-bold">Jika dipasang 4 kawat penyeimbang, total kawat dibutuhkan = 4 × 10 = 40 meter.</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {c4ActiveApp === 'jembatan' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <svg viewBox="0 0 200 160" className="w-56 h-44 mx-auto bg-slate-900 rounded-xl p-2 border border-slate-700">
                          {/* Bridge Deck */}
                          <line x1="10" y1="120" x2="190" y2="120" stroke="#94a3b8" strokeWidth="4" />
                          {/* Pylon Tower */}
                          <polygon points="95,20 105,20 110,130 90,130" fill="#475569" stroke="#cbd5e1" strokeWidth="1.5" />
                          {/* Cable Stays */}
                          <line x1="30" y1="120" x2="100" y2="35" stroke="#f59e0b" strokeWidth="1.5" />
                          <line x1="55" y1="120" x2="100" y2="45" stroke="#f59e0b" strokeWidth="1.5" />
                          <line x1="170" y1="120" x2="100" y2="35" stroke="#f59e0b" strokeWidth="1.5" />
                          <line x1="145" y1="120" x2="100" y2="45" stroke="#f59e0b" strokeWidth="1.5" />
                          <text x="100" y="150" fill="#f59e0b" fontSize="11" fontWeight="bold" textAnchor="middle">Kabel Pancang Jembatan</text>
                        </svg>
                      </div>
                      <div className="md:col-span-7 space-y-2 text-xs sm:text-sm text-slate-300">
                        <h3 className="text-base font-black text-amber-300">Kasus 3: Kabel Pancang Jembatan (Cable-Stayed Bridge)</h3>
                        <p className="leading-relaxed">
                          Seperti pada <strong>Jembatan Teluk Hangzhou</strong> di Tiongkok atau Jembatan Suramadu di Indonesia, setiap kabel baja penopang beban jembatan bertindak sebagai hipotenusa dari segitiga siku-siku antara menara pilon dan lantai jembatan.
                        </p>
                      </div>
                    </div>
                  )}

                  {c4ActiveApp === 'diagonal' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <svg viewBox="0 0 200 160" className="w-56 h-44 mx-auto bg-slate-900 rounded-xl p-2 border border-slate-700">
                          {/* TV Screen */}
                          <rect x="30" y="30" width="140" height="90" rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                          <line x1="30" y1="120" x2="170" y2="30" stroke="#f43f5e" strokeWidth="2.5" strokeDasharray="4 3" />
                          <text x="100" y="80" fill="#f43f5e" fontSize="12" fontWeight="black" textAnchor="middle">Diagonal = d</text>
                          <text x="100" y="135" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">Lebar (p)</text>
                          <text x="185" y="80" fill="#38bdf8" fontSize="11" fontWeight="bold">Tinggi (l)</text>
                        </svg>
                      </div>
                      <div className="md:col-span-7 space-y-2 text-xs sm:text-sm text-slate-300">
                        <h3 className="text-base font-black text-amber-300">Kasus 4: Ukuran Diagonal Layar TV & Lapangan Olahraga</h3>
                        <p className="leading-relaxed">
                          Ukuran TV (misalnya 43 inci atau 55 inci) selalu merujuk pada <strong>panjang diagonal layarnya</strong>, dihitung dengan rumus: <strong className="text-amber-300 font-mono">d = √(panjang² + lebar²)</strong>.
                        </p>
                      </div>
                    </div>
                  )}

                  {c4ActiveApp === 'atap' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
                        <svg viewBox="0 0 200 160" className="w-56 h-44 mx-auto bg-slate-900 rounded-xl p-2 border border-slate-700">
                          {/* Roof Truss Trapezoid */}
                          <polygon points="50,40 150,40 180,120 20,120" fill="#1e293b" stroke="#e2e8f0" strokeWidth="2.5" />
                          {/* Vertical Height Line */}
                          <line x1="50" y1="40" x2="50" y2="120" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
                          <polyline points="50,108 62,108 62,120" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                          <text x="40" y="85" fill="#f59e0b" fontSize="11" fontWeight="bold">t</text>
                          <text x="25" y="70" fill="#38bdf8" fontSize="11" fontWeight="bold">sisi miring</text>
                        </svg>
                      </div>
                      <div className="md:col-span-7 space-y-2 text-xs sm:text-sm text-slate-300">
                        <h3 className="text-base font-black text-amber-300">Kasus 5: Konstruksi Rangka Atap Rumah</h3>
                        <p className="leading-relaxed">
                          Arsitek dan tukang kayu membagi trapesium atau limas atap rumah menjadi persegi panjang dan segitiga siku-siku untuk memastikan kemiringan genteng tepat menahan aliran air hujan.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* BAB 5: KEBALIKAN TEOREMA PYTHAGORAS & JENIS SEGITIGA */}
              {currentChapter === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                        Bab 5 Pembelajaran
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-white">
                        Kebalikan Teorema Pythagoras & Uji Jenis Segitiga
                      </h2>
                    </div>
                    <span className="text-xs bg-purple-400/10 text-purple-300 px-3 py-1 rounded-full border border-purple-400/30 font-semibold">
                      Klasifikasi Sudut Siku-Siku, Lancip, & Tumpul
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Kebalikan Teorema Pythagoras digunakan untuk <strong>menentukan apakah suatu segitiga siku-siku, lancip, atau tumpul</strong> jika ketiga panjang sisinya diketahui. Misalkan <strong className="text-sky-300">c</strong> adalah sisi terpanjang:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-950 p-3.5 rounded-2xl border-2 border-emerald-500/40 text-center space-y-1">
                      <span className="text-xs font-black text-emerald-400 uppercase">Segitiga Siku-Siku</span>
                      <div className="text-lg font-black font-mono text-emerald-300">c² = a² + b²</div>
                      <p className="text-[11px] text-slate-300">Besar sudut di hadapan sisi c tepat <strong className="text-emerald-400">90°</strong>.</p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border-2 border-sky-500/40 text-center space-y-1">
                      <span className="text-xs font-black text-sky-400 uppercase">Segitiga Lancip</span>
                      <div className="text-lg font-black font-mono text-sky-300">c² &lt; a² + b²</div>
                      <p className="text-[11px] text-slate-300">Seluruh sudut segitiga besarnya <strong className="text-sky-400">&lt; 90°</strong>.</p>
                    </div>

                    <div className="bg-slate-950 p-3.5 rounded-2xl border-2 border-rose-500/40 text-center space-y-1">
                      <span className="text-xs font-black text-rose-400 uppercase">Segitiga Tumpul</span>
                      <div className="text-lg font-black font-mono text-rose-300">c² &gt; a² + b²</div>
                      <p className="text-[11px] text-slate-300">Sudut di hadapan sisi c besarnya <strong className="text-rose-400">&gt; 90°</strong>.</p>
                    </div>
                  </div>

                  {/* Identification of Right-Angled Vertex */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-2">
                    <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                      Aturan Penentuan Letak Titik Sudut Siku-Siku:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-amber-400 font-bold block mb-0.5">Jika a² = b² + c²</span>
                        <div className="text-slate-300 font-sans text-[11px]">Maka siku-siku di titik sudut <strong className="text-amber-400">A</strong> (∠A = 90°)</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-emerald-400 font-bold block mb-0.5">Jika b² = a² + c²</span>
                        <div className="text-slate-300 font-sans text-[11px]">Maka siku-siku di titik sudut <strong className="text-emerald-400">B</strong> (∠B = 90°)</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-sky-400 font-bold block mb-0.5">Jika c² = a² + b²</span>
                        <div className="text-slate-300 font-sans text-[11px]">Maka siku-siku di titik sudut <strong className="text-sky-400">C</strong> (∠C = 90°)</div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Triangle Classifier Simulator */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                    <div className="text-xs font-black text-amber-400 uppercase">
                      Simulator Interaktif Uji Segitiga:
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Sisi a:</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={c5SideA}
                          onChange={(e) => setC5SideA(Number(e.target.value) || 1)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Sisi b:</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={c5SideB}
                          onChange={(e) => setC5SideB(Number(e.target.value) || 1)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">Sisi c (terpanjang):</label>
                        <input
                          type="number"
                          min="1"
                          max="99"
                          value={c5SideC}
                          onChange={(e) => setC5SideC(Number(e.target.value) || 1)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-white"
                        />
                      </div>
                    </div>

                    {/* Dynamic Calculation Result */}
                    {(() => {
                      const sides = [c5SideA, c5SideB, c5SideC].sort((x, y) => x - y);
                      const [x, y, z] = sides;
                      const sumSquares = x * x + y * y;
                      const zSquare = z * z;
                      let typeLabel = '';
                      let badgeColor = '';
                      if (zSquare === sumSquares) {
                        typeLabel = 'Segitiga Siku-Siku (Memenuhi Teorema Pythagoras)';
                        badgeColor = 'text-emerald-400 border-emerald-500/50 bg-emerald-950/40';
                      } else if (zSquare < sumSquares) {
                        typeLabel = 'Segitiga Lancip (c² < a² + b²)';
                        badgeColor = 'text-sky-400 border-sky-500/50 bg-sky-950/40';
                      } else {
                        typeLabel = 'Segitiga Tumpul (c² > a² + b²)';
                        badgeColor = 'text-rose-400 border-rose-500/50 bg-rose-950/40';
                      }
                      return (
                        <div className={`p-3 rounded-xl border ${badgeColor} text-xs font-mono flex flex-col sm:flex-row justify-between items-center gap-2`}>
                          <div>
                            Uji: Sisi terpanjang ({z})² = {zSquare} vs ({x})² + ({y})² = {sumSquares}
                          </div>
                          <strong className="font-sans font-bold">{typeLabel}</strong>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* BAB 6: TRIPLE PYTHAGORAS */}
              {currentChapter === 6 && (
                <div className="space-y-4">
                  <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-black uppercase text-amber-400 tracking-wider">
                        Bab 6 Pembelajaran
                      </span>
                      <h2 className="text-lg sm:text-2xl font-black text-white">
                        Triple Pythagoras & Rumus Pembentukannya
                      </h2>
                    </div>
                    <span className="text-xs bg-amber-400/10 text-amber-300 px-3 py-1 rounded-full border border-amber-400/30 font-semibold">
                      Kelompok Bilangan Bulat Positif
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    <strong>Triple Pythagoras</strong> adalah tiga bilangan asli <strong className="text-amber-300 font-mono">(a, b, c)</strong> yang memenuhi persamaan <strong className="text-amber-300 font-mono">a² + b² = c²</strong>. Jika ketiga bilangan tersebut dikalikan dengan bilangan asli k, kelipatannya juga selalu merupakan Triple Pythagoras!
                  </p>

                  {/* Common Triples Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left text-slate-300 border-collapse bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
                      <thead className="bg-slate-900 text-amber-400 uppercase text-[10px] font-black">
                        <tr>
                          <th className="p-2.5">Triple Dasar</th>
                          <th className="p-2.5">Kelipatan ×2</th>
                          <th className="p-2.5">Kelipatan ×3</th>
                          <th className="p-2.5">Kelipatan ×5</th>
                          <th className="p-2.5">Uji a² + b² = c²</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono">
                        <tr className="hover:bg-slate-900/50">
                          <td className="p-2.5 text-amber-300 font-bold">3, 4, 5</td>
                          <td className="p-2.5">6, 8, 10</td>
                          <td className="p-2.5">9, 12, 15</td>
                          <td className="p-2.5">15, 20, 25</td>
                          <td className="p-2.5 text-emerald-400">9 + 16 = 25 ✓</td>
                        </tr>
                        <tr className="hover:bg-slate-900/50">
                          <td className="p-2.5 text-amber-300 font-bold">5, 12, 13</td>
                          <td className="p-2.5">10, 24, 26</td>
                          <td className="p-2.5">15, 36, 39</td>
                          <td className="p-2.5">25, 60, 65</td>
                          <td className="p-2.5 text-emerald-400">25 + 144 = 169 ✓</td>
                        </tr>
                        <tr className="hover:bg-slate-900/50">
                          <td className="p-2.5 text-amber-300 font-bold">7, 24, 25</td>
                          <td className="p-2.5">14, 48, 50</td>
                          <td className="p-2.5">21, 72, 75</td>
                          <td className="p-2.5">35, 120, 125</td>
                          <td className="p-2.5 text-emerald-400">49 + 576 = 625 ✓</td>
                        </tr>
                        <tr className="hover:bg-slate-900/50">
                          <td className="p-2.5 text-amber-300 font-bold">8, 15, 17</td>
                          <td className="p-2.5">16, 30, 34</td>
                          <td className="p-2.5">24, 45, 51</td>
                          <td className="p-2.5">40, 75, 85</td>
                          <td className="p-2.5 text-emerald-400">64 + 225 = 289 ✓</td>
                        </tr>
                        <tr className="hover:bg-slate-900/50">
                          <td className="p-2.5 text-amber-300 font-bold">9, 40, 41</td>
                          <td className="p-2.5">18, 80, 82</td>
                          <td className="p-2.5">27, 120, 123</td>
                          <td className="p-2.5">45, 200, 205</td>
                          <td className="p-2.5 text-emerald-400">81 + 1600 = 1681 ✓</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Formula to generate Pythagorean Triples (m and n) */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
                        Rumus Generator Triple Pythagoras (Dua Bilangan Asli m &gt; n):
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">Identitas: (m² − n²)² + (2mn)² = (m² + n²)²</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-center">
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-amber-400 font-sans block">Sisi Pertama (a)</span>
                        <div className="text-base font-black text-amber-300">a = m² − n²</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-emerald-400 font-sans block">Sisi Kedua (b)</span>
                        <div className="text-base font-black text-emerald-300">b = 2mn</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[10px] text-sky-400 font-sans block">Sisi Miring (c)</span>
                        <div className="text-base font-black text-sky-300">c = m² + n²</div>
                      </div>
                    </div>

                    {/* Interactive m and n generator */}
                    <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-700 space-y-2">
                      <div className="text-xs font-bold text-white flex items-center justify-between">
                        <span>Coba Nilai m dan n Sendiri:</span>
                        <span className="text-[11px] text-amber-400">Syarat: m harus lebih besar dari n (m &gt; n)</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Nilai m:</label>
                          <input
                            type="number"
                            min="2"
                            max="20"
                            value={c6ValM}
                            onChange={(e) => setC6ValM(Math.max(2, Number(e.target.value) || 2))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-white"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">Nilai n:</label>
                          <input
                            type="number"
                            min="1"
                            max={c6ValM - 1}
                            value={Math.min(c6ValN, c6ValM - 1)}
                            onChange={(e) => setC6ValN(Math.max(1, Math.min(c6ValM - 1, Number(e.target.value) || 1)))}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-white"
                          />
                        </div>
                      </div>

                      {(() => {
                        const m = c6ValM;
                        const n = Math.min(c6ValN, m - 1);
                        const a = m * m - n * n;
                        const b = 2 * m * n;
                        const c = m * m + n * n;
                        return (
                          <div className="mt-2 p-2.5 rounded-lg bg-slate-950 border border-emerald-500/40 text-xs font-mono text-emerald-300 flex flex-wrap justify-between items-center gap-2">
                            <span>
                              Hasil: a = {m}² − {n}² = <strong>{a}</strong> | b = 2×{m}×{n} = <strong>{b}</strong> | c = {m}² + {n}² = <strong>{c}</strong>
                            </span>
                            <span className="font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/40">
                              Triple: ({a}, {b}, {c})
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Stepper Controls: Prev / Next */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapter === 1}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                ← Bab Sebelumnya
              </button>

              <div className="text-xs text-slate-400 font-medium">
                Bab <span className="font-black text-amber-400">{currentChapter}</span> dari 6
              </div>

              <button
                onClick={handleNextChapter}
                disabled={currentChapter === 6}
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 disabled:opacity-40 disabled:cursor-not-allowed font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
              >
                Bab Selanjutnya →
              </button>
            </div>
          </div>
        ) : (
          /* Preserved Feature: 6 Geometry Shapes Showcase Encyclopedia */
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto">
            {/* Left: Shape selector buttons */}
            <div className="lg:col-span-4 flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                Pilih Bangun Datar
              </span>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                {GEOMETRY_SHAPES.map((shape) => {
                  const isSelected = selectedShape.id === shape.id;
                  return (
                    <button
                      key={shape.id}
                      onClick={() => {
                        setSelectedShape(shape);
                        setShapeValA(shape.exampleData.defaultA);
                        setShapeValB(shape.exampleData.defaultB);
                        setShapeValC(shape.exampleData.defaultC || 3);
                        soundEngine.click();
                      }}
                      className={`flex items-center gap-3 p-2.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                          : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-500'
                      }`}
                    >
                      <img
                        src={shape.image}
                        alt={shape.name}
                        className="w-12 h-10 object-contain rounded-lg bg-slate-950/60 p-1 border border-slate-700"
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">{shape.name}</span>
                        <span className="text-[10px] text-amber-400/90 font-mono block truncate">
                          {shape.areaFormula}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Shape Detail Card & Interactive Simulator */}
            <div className="lg:col-span-8 bg-slate-900/90 p-4 sm:p-6 rounded-3xl border-2 border-slate-700 shadow-2xl flex flex-col justify-between gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                  <img
                    src={selectedShape.image}
                    alt={selectedShape.name}
                    className="w-full max-w-[240px] h-36 object-contain filter drop-shadow-lg"
                  />
                  <span className="mt-2 text-xs text-amber-300 font-mono font-bold">
                    {selectedShape.areaFormula}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-black text-amber-400">{selectedShape.name}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedShape.description}</p>
                  <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="text-emerald-400 font-bold font-mono">Rumus Luas: {selectedShape.areaFormula}</div>
                    <div className="text-sky-400 font-bold font-mono">Rumus Keliling: {selectedShape.perimeterFormula}</div>
                  </div>
                  <ul className="text-[11px] text-slate-400 space-y-0.5 list-disc list-inside">
                    {selectedShape.properties.map((prop, idx) => (
                      <li key={idx}>{prop}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interactive Area Calculator */}
              <div className="bg-slate-950 p-3 sm:p-4 rounded-2xl border border-amber-500/30">
                <span className="text-xs font-black text-amber-400 uppercase tracking-wider block mb-2">
                  Kalkulator Interaktif Luas Geometri
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">{selectedShape.exampleData.labelA}</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={shapeValA}
                      onChange={(e) => setShapeValA(Number(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">{selectedShape.exampleData.labelB}</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={shapeValB}
                      onChange={(e) => setShapeValB(Number(e.target.value) || 1)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-white"
                    />
                  </div>
                  {selectedShape.exampleData.labelC && (
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">{selectedShape.exampleData.labelC}</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={shapeValC}
                        onChange={(e) => setShapeValC(Number(e.target.value) || 1)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-sm font-mono text-white"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Hasil Luas:</span>
                  <span className="text-base font-black text-emerald-400 font-mono">
                    {selectedShape.exampleData.calcArea(shapeValA, shapeValB, shapeValC).toFixed(2)} cm²
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
