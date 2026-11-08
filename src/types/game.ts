export type Screen = 'menu' | 'level-select' | 'game' | 'learn' | 'practice' | 'story';

export interface Point {
  x: number;
  y: number;
}

export interface PuzzlePiece {
  id: string;
  name: string;
  type: string;
  vertices: Point[];
  area: number;
  color: string;
  borderColor: string;
  dimensionsText: string;
  targetX: number;
  targetY: number;
  targetRotation: number;
  x: number;
  y: number;
  rotation: number;
}

export interface TargetZone {
  name: string;
  vertices: Point[];
  targetArea: number;
  formula: string;
  description?: string;
}

export interface LevelStage {
  id: number;
  title: string;
  subtitle: string;
  targetName: string;
  targetVertices: Point[];
  targetArea: number;
  formula: string;
  hint: string;
  explanation: string;
  pieces: PuzzlePiece[];
}

export interface LevelData {
  id: number;
  title: string;
  subtitle?: string;
  difficulty: 'Mudah' | 'Sedang' | 'Tantangan' | 'Ahli' | 'Master';
  concept: string;
  mathExplanation: string;
  hint: string;
  targetZone: TargetZone;
  pieces: PuzzlePiece[];
  stages?: LevelStage[];
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  stars: number;
  bestTime: number;
}

export interface GameSettings {
  soundEnabled: boolean;
  showMathGrid: boolean;
  snapTolerance: number;
}

export type PracticeCategory = 'mudah' | 'sedang' | 'menantang';

export interface MultipleChoiceOption {
  id: string;
  label: string;
  text: string;
}

export interface PracticeSubQuestion {
  id: string;
  label: string;
  questionText: string;
  type: 'formula_puzzle' | 'multiple_choice' | 'calculation';
  diagramType: 'triangle' | 'rectangle' | 'kite' | 'trapezoid' | 'pole' | 'composite' | 'parallelogram';
  diagramProps?: Record<string, string | number>;
  hint: string;
  formulaChips?: string[];
  options?: MultipleChoiceOption[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  explanation: string[];
  teacherVerificationNote?: string;
}

export interface PracticeChallenge {
  id: number;
  numberTitle: string;
  title: string;
  category: PracticeCategory;
  categoryLabel: string;
  description: string;
  sourceReference: string;
  recommendedChapter: number;
  subQuestions: PracticeSubQuestion[];
}

export interface PracticeChallengeProgress {
  unlocked: boolean;
  completed: boolean;
  score: number;
  stars: number;
  completedSubIds: string[];
}

export type PracticeProgressRecord = Record<number, PracticeChallengeProgress>;

export type RafiEmotion =
  | 'happy'
  | 'thinking'
  | 'surprised'
  | 'excited'
  | 'serious'
  | 'sad'
  | 'neutral';

export type RafiPose =
  | 'standing'
  | 'pointing'
  | 'presenting'
  | 'arms_crossed'
  | 'running'
  | 'victory_jump'
  | 'thinking'
  | 'reading_book'
  | 'holding_pencil';

export interface StoryDialogueLine {
  id: string;
  speaker: string;
  text: string;
  emotion: RafiEmotion;
  pose?: RafiPose;
}

export interface StoryScene {
  id: string;
  challengeId: number;
  title: string;
  locationName: string;
  bgTheme: 'park' | 'bridge' | 'room' | 'sky_kite' | 'palace' | 'world';
  dialogues: StoryDialogueLine[];
  successDialogues?: StoryDialogueLine[];
  actionButtonLabel?: string;
}

export interface StoryProgress {
  unlockedChallengeId: number;
  completedChallengeIds: number[];
  hasSeenPrologue: boolean;
  hasCompletedEpilogue: boolean;
}

export interface ShapeInfo {
  id: string;
  name: string;
  image: string;
  areaFormula: string;
  perimeterFormula: string;
  description: string;
  properties: string[];
  exampleData: {
    labelA: string;
    defaultA: number;
    labelB: string;
    defaultB: number;
    labelC?: string;
    defaultC?: number;
    calcArea: (a: number, b: number, c?: number) => number;
  };
}
