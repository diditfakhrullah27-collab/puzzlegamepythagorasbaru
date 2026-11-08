/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { LevelData, PuzzlePiece, Point, GameSettings } from '../types/game';
import { TactileButton } from './TactileButton';
import { RulerOverlay } from './RulerOverlay';
import { ProofTutorialOverlay } from './ProofTutorialOverlay';
import { soundEngine } from '../utils/audio';
import { SoundtrackPlayer } from './SoundtrackPlayer';

interface PuzzleBoardProps {
  level: LevelData;
  settings: GameSettings;
  onUpdateSettings: (s: Partial<GameSettings>) => void;
  onBack: () => void;
  onHome: () => void;
  onOpenSettings: () => void;
  onLevelComplete: (levelId: number, stars: number, timeSpent: number) => void;
  onNextLevel?: () => void;
  hasNextLevel: boolean;
}

// Compute centroid of polygon
function getCentroid(pts: Point[]): Point {
  const n = pts.length;
  if (n === 0) return { x: 0, y: 0 };
  const sumX = pts.reduce((acc, p) => acc + p.x, 0);
  const sumY = pts.reduce((acc, p) => acc + p.y, 0);
  return { x: Math.round(sumX / n), y: Math.round(sumY / n) };
}

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  level,
  settings,
  onUpdateSettings,
  onBack,
  onHome,
  onOpenSettings,
  onLevelComplete,
  onNextLevel,
  hasNextLevel,
}) => {
  // Stage management for multi-stage levels (e.g. Level 6 MoMath)
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [stageCompleted, setStageCompleted] = useState<Record<number, boolean>>({});
  const [stageSuccessBanner, setStageSuccessBanner] = useState<boolean>(false);

  const hasStages = !!(level.stages && level.stages.length > 0);
  const currentStage = hasStages && level.stages ? level.stages[activeStageIndex] : null;

  // Active target zone definition
  const activeTargetZone = currentStage
    ? {
        name: currentStage.targetName,
        vertices: currentStage.targetVertices,
        targetArea: currentStage.targetArea,
        formula: currentStage.formula,
        description: currentStage.subtitle,
      }
    : level.targetZone;

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedPieceId, setSelectedPieceId] = useState<string | null>(null);
  const [isRulerActive, setIsRulerActive] = useState<boolean>(false);
  const [showAreaOverlay, setShowAreaOverlay] = useState<boolean>(true);
  const [showHintGuide, setShowHintGuide] = useState<boolean>(false);
  const [isSolutionPreview, setIsSolutionPreview] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Dragging state
  const [draggingPieceId, setDraggingPieceId] = useState<string | null>(null);
  const [rotatingPieceId, setRotatingPieceId] = useState<string | null>(null);

  // SVG and Board refs
  const boardRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Drag tracking ref with SVG coordinates
  const dragRef = useRef<{
    pieceId: string;
    pointerId: number;
    grabOffset: Point;
  }>({
    pieceId: '',
    pointerId: -1,
    grabOffset: { x: 0, y: 0 },
  });

  // Dynamic canvas target origin offsets based on level and active stage
  const getStageTargetOrigin = (stageIdx: number): Point => {
    if (level.id === 6) {
      if (stageIdx === 0) return { x: -160, y: 60 }; // Kolom a² (120x120)
      if (stageIdx === 1) return { x: 240, y: 40 };  // Kolom b² (160x160)
      return { x: 0, y: 20 };                         // Kolom c² (200x200)
    }
    if (level.id === 2 || level.id === 3) {
      return { x: 0, y: 15 };                         // Target (280x280)
    }
    return { x: 0, y: 25 };                           // Target (200x200)
  };

  const currentTargetOrigin = getStageTargetOrigin(activeStageIndex);

  // Convert client pointer coordinates directly to exact SVG coordinate space
  const getSvgPoint = (clientX: number, clientY: number): Point => {
    if (!svgRef.current) return { x: clientX, y: clientY };
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (ctm) {
      const transformed = pt.matrixTransform(ctm.inverse());
      return { x: transformed.x, y: transformed.y };
    }
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    return {
      x: ((clientX - rect.left) / rect.width) * vb.width + vb.x,
      y: ((clientY - rect.top) / rect.height) * vb.height + vb.y,
    };
  };

  // Dedicated staging positions on left and right sides so pieces NEVER overlap with target board
  // Uses mathematical centroid displacement so every piece is GUARANTEED to be inside the visible shelf
  const getStagingPieces = (
    rawPieces: PuzzlePiece[],
    targetOrigin: Point,
    scrambleAngles = true
  ): PuzzlePiece[] => {
    const SCRAMBLE_ANGLES = [45, 90, 135, 180, 225, 270, 315];
    const n = rawPieces.length;
    const half = Math.ceil(n / 2);

    // Dynamic shelf X centers based on level layout
    let leftShelfX = -130;
    let rightShelfX = 330;
    if (level.id === 6) {
      leftShelfX = -290;
      rightShelfX = 510;
    } else if (level.id === 2 || level.id === 3) {
      leftShelfX = -155;
      rightShelfX = 425;
    }

    return rawPieces.map((piece, idx) => {
      const isLeft = idx < half;
      const shelfIdx = isLeft ? idx : idx - half;
      const totalInShelf = isLeft ? half : n - half;

      const desiredCanvasX = isLeft ? leftShelfX : rightShelfX;
      const shelfHeight = 180;
      const stepY = totalInShelf > 1 ? shelfHeight / (totalInShelf - 1) : 0;
      const desiredCanvasY = totalInShelf > 1 ? Math.round(50 + shelfIdx * stepY) : 130;

      // Shape centroid in piece local vertex space
      const c = getCentroid(piece.vertices);

      // Relative displacement so shape center sits EXACTLY at (desiredCanvasX, desiredCanvasY)
      const relX = desiredCanvasX - targetOrigin.x - c.x;
      const relY = desiredCanvasY - targetOrigin.y - c.y;

      // Clean natural orientation matching target (0°):
      // Only scramble in multiples of 90° if explicitly requested via Acak
      let angle = piece.targetRotation || 0;
      if (scrambleAngles) {
        const candidateAngles = [90, 180, 270];
        angle = candidateAngles[idx % candidateAngles.length];
      }

      return {
        ...piece,
        x: relX,
        y: relY,
        rotation: angle,
      };
    });
  };

  // Reset pieces for a specific stage or level (default: clean target-ready orientation)
  const resetToStage = (stageIdx: number, scramble = false) => {
    const rawPieces = hasStages && level.stages ? level.stages[stageIdx].pieces : level.pieces;
    const origin = getStageTargetOrigin(stageIdx);

    const initialized = getStagingPieces(rawPieces, origin, scramble);

    setPieces(initialized);
    setSelectedPieceId(null);
    setRotatingPieceId(null);
    setValidationMessage(null);
    setIsSolutionPreview(false);
    setStageSuccessBanner(false);
  };

  // Initialize level
  useEffect(() => {
    setActiveStageIndex(0);
    setStageCompleted({});
    setStageSuccessBanner(false);
    resetToStage(0, false);
    setElapsedTime(0);
    setIsCompleted(false);
    setIsSolutionPreview(false);
    setShowHintGuide(false);
    setValidationMessage(null);
  }, [level.id]);

  // Timer
  useEffect(() => {
    if (isCompleted) return;
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCompleted]);

  const resetToInitial = () => {
    resetToStage(activeStageIndex, false);
    soundEngine.click();
  };

  // Shuffle pieces with new positions and angles
  const handleShufflePieces = () => {
    soundEngine.rotate();
    resetToStage(activeStageIndex, true);
    setValidationMessage({
      text: 'Keping puzzle diacak di wadah sisi kiri dan kanan! Putar 90° & pasang ke bingkai tengah.',
      type: 'info',
    });
  };

  // Return a single piece to its dedicated shelf slot
  const handleReturnPieceToShelf = (pieceId: string) => {
    const rawPieces = hasStages && level.stages ? level.stages[activeStageIndex].pieces : level.pieces;
    const idx = rawPieces.findIndex((p) => p.id === pieceId);
    if (idx === -1) return;
    const n = rawPieces.length;
    const half = Math.ceil(n / 2);
    const isLeft = idx < half;
    const shelfIdx = isLeft ? idx : idx - half;
    const totalInShelf = isLeft ? half : n - half;
    const desiredCanvasX = isLeft ? -95 : 405;
    const shelfHeight = 210;
    const stepY = totalInShelf > 1 ? shelfHeight / (totalInShelf - 1) : 0;
    const desiredCanvasY = totalInShelf > 1 ? Math.round(40 + shelfIdx * stepY) : 140;

    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;
    const c = getCentroid(piece.vertices);
    const relX = desiredCanvasX - currentTargetOrigin.x - c.x;
    const relY = desiredCanvasY - currentTargetOrigin.y - c.y;

    soundEngine.rotate();
    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, x: relX, y: relY } : p))
    );
    setValidationMessage({
      text: `${piece.name} dikembalikan ke wadah keping!`,
      type: 'info',
    });
  };

  // Switch stage in Level 6
  const handleSwitchStage = (idx: number) => {
    setActiveStageIndex(idx);
    resetToStage(idx, true);
    soundEngine.click();
  };

  const getPointsString = (vertices: Point[]): string => {
    return vertices.map((p) => `${p.x},${p.y}`).join(' ');
  };

  // Check if a piece is currently snapped inside the target frame
  const isPieceSnapped = (piece: PuzzlePiece): boolean => {
    const dist = Math.hypot(piece.x - piece.targetX, piece.y - piece.targetY);
    const normalizedRot = ((piece.rotation % 360) + 360) % 360;
    const targetRot = ((piece.targetRotation % 360) + 360) % 360;
    const rotDiff = Math.abs(normalizedRot - targetRot);

    // Symmetric rotation tolerance: 90 deg for squares, 180 deg for rectangles
    const isRotValid =
      piece.type === 'square'
        ? rotDiff % 90 <= 25 || rotDiff % 90 >= 65
        : piece.type === 'rectangle'
        ? rotDiff % 180 <= 25 || rotDiff % 180 >= 155
        : rotDiff <= 25 || rotDiff >= 335;

    const tolerance = Math.max(settings.snapTolerance, 45);
    return dist <= tolerance && isRotValid;
  };

  // Rotation controls
  const handleSetPieceRotation = (pieceId: string, angle: number) => {
    const normalized = Math.round(((angle % 360) + 360) % 360);
    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, rotation: normalized } : p))
    );
  };

  const handleAdjustPieceRotation = (pieceId: string, delta: number) => {
    soundEngine.rotate();
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== pieceId) return p;
        const normalized = Math.round((((p.rotation + delta) % 360) + 360) % 360);
        return { ...p, rotation: normalized };
      })
    );
  };

  // Auto-align angle to target rotation
  const handleAutoAlignAngle = (pieceId: string) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;
    soundEngine.snap();
    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, rotation: p.targetRotation } : p))
    );
    setValidationMessage({
      text: `Sudut ${piece.name} berhasil diluruskan (${piece.targetRotation}°)! Tarik ke dalam bingkai tengah.`,
      type: 'info',
    });
  };

  // Auto-place piece to exact target position
  const handleAutoPlacePiece = (pieceId: string) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;
    soundEngine.snap();
    setPieces((prev) =>
      prev.map((p) =>
        p.id === pieceId
          ? { ...p, x: p.targetX, y: p.targetY, rotation: p.targetRotation }
          : p
      )
    );
    setValidationMessage({
      text: `${piece.name} berhasil ditempatkan tepat di bingkai sasaran!`,
      type: 'success',
    });
  };

  // Pointer drag event handlers with exact SVG matrix conversion
  const handlePointerDown = (pieceId: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSolutionPreview) setIsSolutionPreview(false);

    setSelectedPieceId(pieceId);
    setDraggingPieceId(pieceId);

    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;

    const svgPt = getSvgPoint(e.clientX, e.clientY);
    const pieceOriginX = currentTargetOrigin.x + piece.x;
    const pieceOriginY = currentTargetOrigin.y + piece.y;

    dragRef.current = {
      pieceId,
      pointerId: e.pointerId,
      grabOffset: {
        x: pieceOriginX - svgPt.x,
        y: pieceOriginY - svgPt.y,
      },
    };

    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {}
  };

  // Drag on-canvas rotation handle knob
  const handleRotationHandlePointerDown = (pieceId: string, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRotatingPieceId(pieceId);
    setSelectedPieceId(pieceId);
    try {
      (e.currentTarget as Element).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // 1. Rotation knob dragging
    if (rotatingPieceId && svgRef.current) {
      const piece = pieces.find((p) => p.id === rotatingPieceId);
      if (piece) {
        const svgPt = getSvgPoint(e.clientX, e.clientY);
        const centroid = getCentroid(piece.vertices);
        const pieceCenterX = currentTargetOrigin.x + piece.x + centroid.x;
        const pieceCenterY = currentTargetOrigin.y + piece.y + centroid.y;
        const rad = Math.atan2(svgPt.y - pieceCenterY, svgPt.x - pieceCenterX);
        let deg = Math.round((rad * 180) / Math.PI) + 90;
        deg = ((deg % 360) + 360) % 360;
        handleSetPieceRotation(rotatingPieceId, deg);
      }
      return;
    }

    // 2. Piece position dragging
    if (!dragRef.current.pieceId || dragRef.current.pieceId !== draggingPieceId) return;

    const pieceId = dragRef.current.pieceId;
    const svgPt = getSvgPoint(e.clientX, e.clientY);

    const newOriginX = svgPt.x + dragRef.current.grabOffset.x;
    const newOriginY = svgPt.y + dragRef.current.grabOffset.y;

    const nextX = Math.round(newOriginX - currentTargetOrigin.x);
    const nextY = Math.round(newOriginY - currentTargetOrigin.y);

    setPieces((prev) =>
      prev.map((p) => (p.id === pieceId ? { ...p, x: nextX, y: nextY } : p))
    );
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (rotatingPieceId) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {}
      setRotatingPieceId(null);
    }

    const pieceId = dragRef.current.pieceId;
    if (pieceId) {
      try {
        (e.currentTarget as Element).releasePointerCapture(e.pointerId);
      } catch {}

      const currentPiece = pieces.find((p) => p.id === pieceId);
      if (currentPiece) {
        const dist = Math.hypot(currentPiece.x - currentPiece.targetX, currentPiece.y - currentPiece.targetY);
        const normalizedRot = ((currentPiece.rotation % 360) + 360) % 360;
        const targetRot = ((currentPiece.targetRotation % 360) + 360) % 360;
        const rotDiff = Math.abs(normalizedRot - targetRot);

        const isRotClose =
          currentPiece.type === 'square'
            ? rotDiff % 90 <= 25 || rotDiff % 90 >= 65
            : currentPiece.type === 'rectangle'
            ? rotDiff % 180 <= 25 || rotDiff % 180 >= 155
            : rotDiff <= 25 || rotDiff >= 335;

        const tolerance = Math.max(settings.snapTolerance, 45);

        // Snap into target position and align rotation perfectly
        if (dist <= tolerance && isRotClose) {
          soundEngine.snap();
          setPieces((prev) =>
            prev.map((p) =>
              p.id === pieceId
                ? {
                    ...p,
                    x: p.targetX,
                    y: p.targetY,
                    rotation: p.targetRotation,
                  }
                : p
            )
          );
        } else {
          // Boundary clamp so pieces NEVER get pushed outside the visible SVG viewBox
          const c = getCentroid(currentPiece.vertices);
          const currentCentroidX = currentTargetOrigin.x + currentPiece.x + c.x;
          const currentCentroidY = currentTargetOrigin.y + currentPiece.y + c.y;

          const minX = level.id === 6 ? -370 : -250;
          const maxX = level.id === 6 ? 560 : 480;
          const minY = 10;
          const maxY = 290;

          if (
            currentCentroidX < minX ||
            currentCentroidX > maxX ||
            currentCentroidY < minY ||
            currentCentroidY > maxY
          ) {
            const clampedX = Math.max(minX, Math.min(maxX, currentCentroidX));
            const clampedY = Math.max(minY, Math.min(maxY, currentCentroidY));
            setPieces((prev) =>
              prev.map((p) =>
                p.id === pieceId
                  ? {
                      ...p,
                      x: clampedX - currentTargetOrigin.x - c.x,
                      y: clampedY - currentTargetOrigin.y - c.y,
                    }
                  : p
              )
            );
          }
        }
      }

      dragRef.current = { pieceId: '', pointerId: -1, grabOffset: { x: 0, y: 0 } };
      setDraggingPieceId(null);
    }
  };

  // Validation function
  const handleCheckSolution = () => {
    const allSnapped = pieces.every((p) => isPieceSnapped(p));

    if (allSnapped) {
      soundEngine.victory();
      setStageCompleted((prev) => ({ ...prev, [activeStageIndex]: true }));

      if (hasStages && activeStageIndex < (level.stages?.length || 1) - 1) {
        setStageSuccessBanner(true);
      } else {
        setIsCompleted(true);
        const starsEarned = elapsedTime < 60 ? 3 : elapsedTime < 120 ? 2 : 1;
        setValidationMessage({
          text: hasStages
            ? 'LUAR BIASA! Seluruh tahap pembuktian selesai utuh tanpa celah! Teorema Pythagoras c² = a² + b² terbukti mutlak!'
            : `SEMPURNA! Seluruh keping pas dan menutup bingkai tanpa celah! ${level.concept}.`,
          type: 'success',
        });
        onLevelComplete(level.id, starsEarned, elapsedTime);
      }
    } else {
      soundEngine.error();
      const snappedCount = pieces.filter((p) => isPieceSnapped(p)).length;
      setValidationMessage({
        text: `${snappedCount} dari ${pieces.length} keping berada di posisi tepat. Gunakan tombol "Luruskan Sudut" atau sesuaikan putaran keping agar menutup rapat!`,
        type: 'error',
      });
    }
  };

  const handleProceedNextStage = () => {
    setStageSuccessBanner(false);
    if (hasStages && activeStageIndex < (level.stages?.length || 1) - 1) {
      handleSwitchStage(activeStageIndex + 1);
    }
  };

  // Show Solution
  const handleShowSolution = () => {
    soundEngine.hint();
    setIsSolutionPreview(true);
    setPieces((prev) =>
      prev.map((p) => ({
        ...p,
        x: p.targetX,
        y: p.targetY,
        rotation: p.targetRotation,
      }))
    );
    setValidationMessage({
      text: 'Kunci jawaban ditampilkan! Keping telah tersusun rapi membuktikan teorema.',
      type: 'info',
    });
  };

  // Toggle Hint
  const handleHint = () => {
    soundEngine.hint();
    setShowHintGuide((prev) => !prev);
    setValidationMessage({
      text: currentStage ? currentStage.hint : level.hint,
      type: 'info',
    });
  };

  const selectedPiece = pieces.find((p) => p.id === selectedPieceId);

  const placedArea = pieces
    .filter((p) => isPieceSnapped(p))
    .reduce((sum, p) => sum + p.area, 0);

  const snappedCount = pieces.filter((p) => isPieceSnapped(p)).length;

  // Render order: render unselected/snapped first, and selected piece LAST so it floats on top of everything
  const sortedRenderPieces = [...pieces].sort((a, b) => {
    if (a.id === selectedPieceId) return 1;
    if (b.id === selectedPieceId) return -1;
    const aSnapped = isPieceSnapped(a);
    const bSnapped = isPieceSnapped(b);
    if (aSnapped && !bSnapped) return -1;
    if (!aSnapped && bSnapped) return 1;
    return 0;
  });

  return (
    <div className="relative w-full h-[100dvh] max-h-screen flex flex-col bg-slate-950 select-none overflow-hidden text-slate-100">
      {/* Top Header Bar - Compact 36px/40px height */}
      <header className="h-9 sm:h-10 md:h-11 px-2 sm:px-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0 z-30">
        {/* Left: Home & Back */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          <TactileButton
            iconSrc="/assets/icons/home.png"
            iconAlt="Menu Utama"
            label="Menu"
            variant="neutral"
            size="sm"
            className="py-1 px-2 text-[11px] sm:text-xs"
            onClick={onHome}
          />
          <TactileButton
            iconSrc="/assets/icons/back.png"
            iconAlt="Pilih Level"
            label="Level"
            variant="neutral"
            size="sm"
            className="py-1 px-2 text-[11px] sm:text-xs"
            onClick={onBack}
          />

          <span className="hidden sm:inline-block text-xs font-black text-amber-400 ml-1 truncate max-w-[180px] md:max-w-xs">
            Lvl {level.id}: {level.title.split(':')[1] || level.title}
          </span>
        </div>

        {/* Center: Stage Navigation Stepper or Concept Badge */}
        {hasStages && level.stages ? (
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-700">
            {level.stages.map((stg, sIdx) => {
              const isCurr = sIdx === activeStageIndex;
              const isDone = stageCompleted[sIdx];
              return (
                <button
                  key={stg.id}
                  onClick={() => handleSwitchStage(sIdx)}
                  className={`px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                    isCurr
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : isDone
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-600'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{stg.title.split(':')[0]}</span>
                  {isDone && <span className="text-emerald-400 font-black">✓</span>}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-700 text-[11px] sm:text-xs font-mono">
            <span className="text-amber-400 font-bold">{level.concept}</span>
            <span className="text-slate-400 text-[10px] sm:text-[11px]">
              ({placedArea}/{activeTargetZone.targetArea} cm²)
            </span>
          </div>
        )}

        {/* Right: Soundtrack Player, Sound & Settings */}
        <div className="flex items-center gap-1 sm:gap-2">
          <SoundtrackPlayer currentFeature="Lab Puzzle" />

          <button
            onClick={() => {
              const next = !settings.soundEnabled;
              soundEngine.setEnabled(next);
              onUpdateSettings({ soundEnabled: next });
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition active:scale-95"
            title={settings.soundEnabled ? 'Matikan Suara' : 'Nyalakan Suara'}
          >
            <span className="text-xs">{settings.soundEnabled ? '🔊' : '🔇'}</span>
          </button>

          <button
            onClick={onOpenSettings}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/50 flex items-center justify-center transition active:scale-95"
            title="Setelan"
          >
            <img
              src="/assets/icons/settings.png"
              alt="Settings"
              className="w-4 h-4 object-contain"
            />
          </button>
        </div>
      </header>

      {/* Main Game Screen - Always Side-by-Side in Landscape & Desktop */}
      <main
        ref={boardRef}
        className="relative flex-1 min-h-0 w-full flex flex-col landscape:flex-row md:flex-row overflow-hidden bg-slate-950"
      >
        {/* Measuring Ruler Overlay */}
        <RulerOverlay active={isRulerActive} onClose={() => setIsRulerActive(false)} scale={36} />

        {/* Stage Success Banner */}
        {stageSuccessBanner && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-emerald-400 p-5 rounded-3xl max-w-sm w-full text-center shadow-2xl space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center">
                <img src="/assets/icons/check.png" alt="Berhasil" className="w-8 h-8 object-contain drop-shadow" />
              </div>
              <div>
                <span className="text-[11px] font-black tracking-widest text-emerald-400 uppercase block">
                  TAHAP {activeStageIndex + 1} SELESAI TEPAT!
                </span>
                <h3 className="text-base font-black text-white mt-1">
                  {currentStage?.title || 'Tahap Selesai'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {currentStage?.explanation || 'Semua keping pas dan menutup rata tanpa celah!'}
                </p>
              </div>

              <button
                onClick={handleProceedNextStage}
                autoFocus
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>LANJUT KE TAHAP {activeStageIndex + 2}</span>
                <img src="/assets/icons/next.png" alt="Lanjut" className="w-4 h-4 object-contain" />
              </button>
            </div>
          </div>
        )}

        {/* Left/Center Section: SVG Puzzle Arena (Clean, responsive, ZERO vertical scroll) */}
        <section
          aria-label="Arena Puzzle Geometri"
          className="flex-1 h-full min-h-0 min-w-0 relative flex items-center justify-center p-1 sm:p-2 bg-slate-950 overflow-hidden"
        >
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
              backgroundSize: '36px 36px',
            }}
          />

          {/* SVG Canvas - Scales smoothly with preserveAspectRatio="xMidYMid meet" */}
          <svg
            ref={svgRef}
            className="w-full h-full max-h-full max-w-full select-none block"
            viewBox={
              level.id === 6
                ? "-380 -15 980 320"
                : level.id === 2 || level.id === 3
                ? "-250 -15 780 330"
                : "-230 -15 660 300"
            }
            preserveAspectRatio="xMidYMid meet"
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            style={{ touchAction: 'none' }}
          >
            <defs>
              <pattern id="targetGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <rect width="40" height="40" fill="#0b1329" fillOpacity="0.9" />
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
              </pattern>

              <filter id="pieceShadow" x="-20%" y="-20%" width="150%" height="150%">
                <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.6" />
              </filter>
              <filter id="activeGlow" x="-25%" y="-25%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.9" />
              </filter>
              <filter id="goldGlow" x="-25%" y="-25%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.9" />
              </filter>
            </defs>

            {/* Left Staging Pedestal (Wadah Keping Kiri) */}
            {(() => {
              const leftX = level.id === 6 ? -360 : level.id === 2 || level.id === 3 ? -230 : -200;
              const width = level.id === 2 || level.id === 3 ? 150 : 140;
              const height = level.id === 2 || level.id === 3 ? 280 : 260;
              return (
                <g className="select-none pointer-events-none">
                  <rect
                    x={leftX}
                    y="15"
                    width={width}
                    height={height}
                    rx="14"
                    fill="#0b1329"
                    fillOpacity="0.85"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <rect x={leftX + 15} y="21" width={width - 30} height="18" rx="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <text x={leftX + width / 2} y="33" fill="#38bdf8" fontSize="9" fontWeight="900" textAnchor="middle">
                    📦 WADAH KEPING
                  </text>
                </g>
              );
            })()}

            {/* Right Staging Pedestal (Wadah Keping Kanan) */}
            {(() => {
              const rightX = level.id === 6 ? 440 : level.id === 2 || level.id === 3 ? 350 : 260;
              const width = level.id === 2 || level.id === 3 ? 150 : 140;
              const height = level.id === 2 || level.id === 3 ? 280 : 260;
              return (
                <g className="select-none pointer-events-none">
                  <rect
                    x={rightX}
                    y="15"
                    width={width}
                    height={height}
                    rx="14"
                    fill="#0b1329"
                    fillOpacity="0.85"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                  />
                  <rect x={rightX + 15} y="21" width={width - 30} height="18" rx="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
                  <text x={rightX + width / 2} y="33" fill="#38bdf8" fontSize="9" fontWeight="900" textAnchor="middle">
                    📦 WADAH KEPING
                  </text>
                </g>
              );
            })()}

            {/* In Level 6: Background Frames for all 3 columns with completely separate positions */}
            {level.id === 6 && (
              <g className="pointer-events-none select-none">
                {/* Kolom a² (9 cm² = 3x3 cm = 120x120 px) */}
                <g transform="translate(-160, 60)">
                  <rect
                    width={120}
                    height={120}
                    rx="8"
                    fill="#0f172a"
                    fillOpacity="0.75"
                    stroke={activeStageIndex === 0 ? '#facc15' : '#713f12'}
                    strokeWidth={activeStageIndex === 0 ? '2.5' : '1.5'}
                    strokeDasharray={activeStageIndex === 0 ? 'none' : '4 3'}
                  />
                  <text x={60} y="-8" fill="#facc15" fontSize="11" fontWeight="800" textAnchor="middle">
                    a² (9 cm²)
                  </text>
                  <text x={60} y="64" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">
                    3 × 3
                  </text>
                  {stageCompleted[0] && (
                    <text x={60} y="85" fill="#10b981" fontSize="11" fontWeight="900" textAnchor="middle">
                      ✓ SELESAI
                    </text>
                  )}
                </g>

                {/* Kolom c² (25 cm² = 5x5 cm = 200x200 px) in center */}
                <g transform="translate(0, 20)">
                  <text x={100} y="-8" fill="#38bdf8" fontSize="12" fontWeight="900" textAnchor="middle">
                    c² = a² + b² (25 cm²)
                  </text>
                  {activeStageIndex !== 2 && (
                    <rect
                      width={200}
                      height={200}
                      rx="8"
                      fill="#0f172a"
                      fillOpacity="0.55"
                      stroke="#0369a1"
                      strokeWidth="1.5"
                      strokeDasharray="6 4"
                    />
                  )}
                </g>

                {/* Kolom b² (16 cm² = 4x4 cm = 160x160 px) on right */}
                <g transform="translate(240, 40)">
                  <rect
                    width={160}
                    height={160}
                    rx="8"
                    fill="#0f172a"
                    fillOpacity="0.75"
                    stroke={activeStageIndex === 1 ? '#f87171' : '#881337'}
                    strokeWidth={activeStageIndex === 1 ? '2.5' : '1.5'}
                    strokeDasharray={activeStageIndex === 1 ? 'none' : '4 3'}
                  />
                  <text x={80} y="-8" fill="#f87171" fontSize="11" fontWeight="800" textAnchor="middle">
                    b² (16 cm²)
                  </text>
                  <text x={80} y="84" fill="#64748b" fontSize="12" fontWeight="bold" textAnchor="middle">
                    4 × 4 (4 Keping)
                  </text>
                  {stageCompleted[1] && (
                    <text x={80} y="105" fill="#10b981" fontSize="11" fontWeight="900" textAnchor="middle">
                      ✓ SELESAI
                    </text>
                  )}
                </g>
              </g>
            )}

            {/* Active Target Area Outline */}
            <g transform={`translate(${currentTargetOrigin.x}, ${currentTargetOrigin.y})`}>
              <polygon
                points={getPointsString(activeTargetZone.vertices)}
                fill="url(#targetGrid)"
                stroke="#38bdf8"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                strokeLinejoin="round"
              />

              {(() => {
                const targetCentroid = getCentroid(activeTargetZone.vertices);
                return (
                  <text
                    x={targetCentroid.x}
                    y={targetCentroid.y}
                    fill="#38bdf8"
                    opacity="0.25"
                    fontSize="22"
                    fontWeight="900"
                    fontFamily="monospace"
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    {activeTargetZone.targetArea} cm²
                  </text>
                );
              })()}

              {/* Hint Ghost Outlines */}
              {showHintGuide && (
                <g opacity="0.45">
                  {pieces.map((p) => {
                    const c = getCentroid(p.vertices);
                    return (
                      <polygon
                        key={`hint_${p.id}`}
                        points={getPointsString(p.vertices)}
                        transform={`translate(${p.targetX}, ${p.targetY}) rotate(${p.targetRotation}, ${c.x}, ${c.y})`}
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                        strokeLinejoin="round"
                      />
                    );
                  })}
                </g>
              )}
            </g>

            {/* Interactive Puzzle Pieces - Ordered so active/selected piece is always on top */}
            {sortedRenderPieces.map((piece) => {
              const isSelected = selectedPieceId === piece.id;
              const snapped = isPieceSnapped(piece);
              const centroid = getCentroid(piece.vertices);
              const handleRadius = 48;

              return (
                <g
                  key={piece.id}
                  transform={`translate(${currentTargetOrigin.x + piece.x}, ${currentTargetOrigin.y + piece.y}) rotate(${piece.rotation}, ${centroid.x}, ${centroid.y})`}
                  className="cursor-grab active:cursor-grabbing select-none"
                  style={{ touchAction: 'none' }}
                  onPointerDown={(e) => handlePointerDown(piece.id, e)}
                  filter={isSelected ? 'url(#activeGlow)' : 'url(#pieceShadow)'}
                >
                  {/* Main Polygon Shape */}
                  <polygon
                    points={getPointsString(piece.vertices)}
                    fill={piece.color}
                    stroke={isSelected ? '#ffffff' : piece.borderColor}
                    strokeWidth={isSelected ? '2.5' : '1.8'}
                    strokeLinejoin="round"
                  />

                  {/* Inner bevel */}
                  <polygon
                    points={getPointsString(piece.vertices)}
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    strokeLinejoin="round"
                  />

                  {/* Area Badge positioned at shape centroid */}
                  {showAreaOverlay && (
                    <g transform={`translate(${centroid.x}, ${centroid.y})`} className="pointer-events-none select-none">
                      <rect
                        x="-18"
                        y="-8"
                        width="36"
                        height="16"
                        rx="4"
                        fill="#0b1120"
                        fillOpacity="0.85"
                        stroke="#ffffff"
                        strokeWidth="0.8"
                      />
                      <text
                        x="0"
                        y="2"
                        fill="#ffffff"
                        fontSize="8.5"
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        {piece.area} cm²
                      </text>
                    </g>
                  )}

                  {/* Snapped Checkmark indicator */}
                  {snapped && (
                    <g transform={`translate(${centroid.x}, ${centroid.y - 14})`} className="pointer-events-none">
                      <circle r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.2" />
                      <path d="M -2.5 0 l 1.8 1.8 l 3.5 -3.5" fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  )}

                  {/* On-canvas Interactive Rotation Handle */}
                  {isSelected && (
                    <g className="select-none">
                      <circle
                        cx={centroid.x}
                        cy={centroid.y}
                        r={handleRadius}
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                        strokeDasharray="3 3"
                        opacity="0.6"
                        pointerEvents="none"
                      />
                      <line
                        x1={centroid.x}
                        y1={centroid.y}
                        x2={centroid.x}
                        y2={centroid.y - handleRadius}
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                        pointerEvents="none"
                      />
                      {/* Knob (drag to rotate) */}
                      <g
                        transform={`translate(${centroid.x}, ${centroid.y - handleRadius})`}
                        className="cursor-grab active:cursor-grabbing hover:scale-125 transition-transform"
                        onPointerDown={(e) => handleRotationHandlePointerDown(piece.id, e)}
                        style={{ touchAction: 'none' }}
                      >
                        <circle r="11" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.8" filter="url(#goldGlow)" />
                        <path d="M -3.5 -0.8 a 3.5 3.5 0 1 1 6.5 2.5 l 1.2 -0.8 l -0.6 2.4 l -2.4 -0.6 l 1.2 -0.8" fill="#ffffff" />
                        <rect
                          x="-14"
                          y="-20"
                          width="28"
                          height="13"
                          rx="3"
                          fill="#0f172a"
                          stroke="#f59e0b"
                          strokeWidth="0.8"
                          pointerEvents="none"
                        />
                        <text
                          x="0"
                          y="-11"
                          fill="#facc15"
                          fontSize="8"
                          fontWeight="900"
                          fontFamily="monospace"
                          textAnchor="middle"
                          pointerEvents="none"
                        >
                          {piece.rotation}°
                        </text>
                      </g>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </section>

        {/* Right Section: Compact Side Dock (Controls, Assist, & Validation) */}
        <aside
          aria-label="Panel Aksi Permainan"
          className="w-full landscape:w-64 md:w-72 lg:w-80 h-auto landscape:h-full md:h-full bg-slate-900/95 border-t landscape:border-t-0 landscape:border-l md:border-t-0 md:border-l border-slate-800 p-2 sm:p-2.5 flex flex-col justify-between shrink-0 z-20 overflow-y-auto"
        >
          {/* Top of Dock: Tutorial Sequence, Piece Selector Bar & Selected Piece Card */}
          <div className="space-y-1.5 sm:space-y-2">
            {/* Proof Sequence Tutorial Guide */}
            <ProofTutorialOverlay
              levelId={level.id}
              activeStageIndex={activeStageIndex}
              stageCompleted={stageCompleted}
              onSelectStage={handleSwitchStage}
              hasStages={hasStages}
            />

            {/* Quick Piece Finder Bar - Shows every piece in the level, tap to select or locate! */}
            <div className="bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold mb-1 px-1">
                <span>Daftar Keping ({snappedCount}/{pieces.length})</span>
                <span className="text-amber-400 font-mono text-[9px]">Ketuk untuk memilih</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto py-0.5 scrollbar-none">
                {pieces.map((p, idx) => {
                  const snapped = isPieceSnapped(p);
                  const isSel = selectedPieceId === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedPieceId(p.id);
                        soundEngine.click();
                      }}
                      className={`px-1.5 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer ${
                        isSel
                          ? 'ring-2 ring-amber-400 bg-amber-500/20 text-white border-amber-400 scale-105'
                          : snapped
                          ? 'bg-emerald-950/70 border-emerald-600 text-emerald-300'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                      }`}
                      title={`${p.name} (${p.area} cm²)`}
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-white/50 flex-shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span>P{idx + 1}</span>
                      {snapped ? (
                        <span className="text-emerald-400 font-black">✓</span>
                      ) : (
                        <span className="text-slate-400 text-[9px]">{p.area}cm²</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Piece Info, Rotation & Auto-Assist Controls */}
            <div
              className={`p-2 rounded-xl border transition-all ${
                selectedPiece
                  ? 'bg-slate-850 border-amber-400 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              {selectedPiece ? (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full border border-white/50 flex-shrink-0"
                          style={{ backgroundColor: selectedPiece.color }}
                        />
                        <h4 className="text-xs font-black text-white truncate">{selectedPiece.name}</h4>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate block mt-0.5">{selectedPiece.dimensionsText}</span>
                    </div>
                    <span className="text-[11px] font-mono font-black text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700 flex-shrink-0">
                      {selectedPiece.rotation}°
                    </span>
                  </div>

                  {/* Easy Step Rotate Buttons */}
                  <div className="grid grid-cols-4 gap-1">
                    <button
                      onClick={() => handleAdjustPieceRotation(selectedPiece.id, -45)}
                      className="py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-[10px] font-mono font-bold rounded border border-slate-700 cursor-pointer"
                      title="Putar -45°"
                    >
                      -45°
                    </button>
                    <button
                      onClick={() => handleAdjustPieceRotation(selectedPiece.id, 45)}
                      className="py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-[10px] font-mono font-bold rounded border border-slate-700 cursor-pointer"
                      title="Putar +45°"
                    >
                      +45°
                    </button>
                    <button
                      onClick={() => handleSetPieceRotation(selectedPiece.id, 0)}
                      className="py-1 bg-slate-800 hover:bg-slate-700 active:scale-95 text-amber-300 text-[10px] font-bold rounded border border-amber-500/40 cursor-pointer"
                      title="Set ke 0° Sejajar"
                    >
                      0° Sejajar
                    </button>
                    <button
                      onClick={() => handleAdjustPieceRotation(selectedPiece.id, 90)}
                      className="py-1 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 text-[10px] font-black rounded border border-amber-300 cursor-pointer"
                      title="Putar +90°"
                    >
                      +90°
                    </button>
                  </div>

                  {/* Assist Buttons: Align Angle, Auto-Place, and Return to Shelf */}
                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-slate-700/60">
                    <button
                      onClick={() => handleAutoAlignAngle(selectedPiece.id)}
                      className="py-1 px-1 bg-indigo-900/70 hover:bg-indigo-800 text-indigo-200 font-bold text-[9px] sm:text-[10px] rounded-lg border border-indigo-500/50 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                      title="Luruskan sudut keping ke target yang tepat"
                    >
                      <span>✨ Luruskan</span>
                    </button>
                    <button
                      onClick={() => handleAutoPlacePiece(selectedPiece.id)}
                      className="py-1 px-1 bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200 font-bold text-[9px] sm:text-[10px] rounded-lg border border-emerald-500/50 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                      title="Tempatkan keping ke sasaran otomatis"
                    >
                      <span>🎯 Pasang</span>
                    </button>
                    <button
                      onClick={() => handleReturnPieceToShelf(selectedPiece.id)}
                      className="py-1 px-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-[9px] sm:text-[10px] rounded-lg border border-slate-600 flex items-center justify-center gap-1 active:scale-95 transition-all cursor-pointer"
                      title="Kembalikan keping ke wadah sisi"
                    >
                      <span>📦 Ke Wadah</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-1.5 text-[10.5px] text-slate-400">
                  <span>Pilih keping untuk memutar & menyusun</span>
                </div>
              )}
            </div>

            {/* Validation Feedback Message Toast */}
            {validationMessage && (
              <div
                className={`p-1.5 sm:p-2 rounded-xl border text-[10.5px] font-medium leading-tight flex items-start gap-1.5 shadow ${
                  validationMessage.type === 'success'
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                    : validationMessage.type === 'error'
                    ? 'bg-rose-950/90 border-rose-500 text-rose-200'
                    : 'bg-amber-950/90 border-amber-500 text-amber-200'
                }`}
              >
                <img
                  src={
                    validationMessage.type === 'success'
                      ? '/assets/icons/check.png'
                      : validationMessage.type === 'error'
                      ? '/assets/icons/retry.png'
                      : '/assets/icons/hint.png'
                  }
                  alt="Status"
                  className="w-3.5 h-3.5 object-contain flex-shrink-0 mt-0.5"
                />
                <div className="flex-1">{validationMessage.text}</div>
              </div>
            )}
          </div>

          {/* Bottom Action Buttons: Primary Check & Supporting Tools */}
          <div className="space-y-1 sm:space-y-1.5 pt-1 border-t border-slate-800">
            {/* Primary Action Button: PERIKSA SUSUNAN */}
            <TactileButton
              iconSrc="/assets/icons/check.png"
              iconAlt="Periksa Susunan"
              label="Periksa Susunan"
              variant="success"
              size="md"
              className="w-full text-xs sm:text-sm py-2 sm:py-2.5 shadow-md"
              onClick={handleCheckSolution}
            />

            {/* 5-Column Compact Tools Grid: Hint, Solution, Shuffle, Reset, Ruler */}
            <div className="grid grid-cols-5 gap-1.5">
              <TactileButton
                iconSrc="/assets/icons/hint.png"
                iconAlt="Petunjuk"
                label="Petunjuk"
                variant="neutral"
                size="compact"
                layout="vertical"
                onClick={handleHint}
              />
              <TactileButton
                iconSrc="/assets/icons/solution.png"
                iconAlt="Kunci"
                label="Kunci"
                variant="neutral"
                size="compact"
                layout="vertical"
                onClick={handleShowSolution}
              />
              <TactileButton
                iconSrc="/assets/icons/retry.png"
                iconAlt="Acak"
                label="Acak"
                variant="secondary"
                size="compact"
                layout="vertical"
                onClick={handleShufflePieces}
              />
              <TactileButton
                iconSrc="/assets/icons/reset.png"
                iconAlt="Reset"
                label="Reset"
                variant="danger"
                size="compact"
                layout="vertical"
                onClick={resetToInitial}
              />
              <TactileButton
                iconSrc="/assets/icons/ruler.png"
                iconAlt="Ukur"
                label="Ukur"
                variant={isRulerActive ? 'primary' : 'neutral'}
                active={isRulerActive}
                size="compact"
                layout="vertical"
                onClick={() => setIsRulerActive((prev) => !prev)}
              />
            </div>

            {/* Next Level CTA if Completed */}
            {isCompleted && hasNextLevel && onNextLevel && (
              <TactileButton
                iconSrc="/assets/icons/next.png"
                iconAlt="Lanjut Level"
                label="Lanjut Level Berikutnya"
                variant="primary"
                size="sm"
                className="w-full py-1.5 sm:py-2 animate-bounce"
                onClick={onNextLevel}
              />
            )}
          </div>
        </aside>
      </main>
    </div>
  );
};
