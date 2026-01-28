
export enum GameLevel {
  BASIC = 1,
  INTERMEDIATE = 2,
  ADVANCED = 3,
  EXPERT = 4,
  EXPERT_PLUS = 5
}

export type Question = {
  id: string;
  expression: string;
  answer: string;
  level: GameLevel;
  type: 'simple' | 'fraction' | 'expression';
};

export type Player = {
  id: string;
  name: string;
  score: number;
};

export type GameState = 'HOME' | 'SETUP' | 'PLAYING' | 'SCORING' | 'RESULTS';

export type CurrentQuestionState = 'QUESTION' | 'ANSWER';
