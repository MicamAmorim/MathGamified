
import React, { useState, useEffect, useCallback } from 'react';
import { Question, GameLevel, Player, CurrentQuestionState } from '../types';
import { Button } from './Button';
import { generateQuestionSet } from '../services/mathGenerator';
import { Check, X, Trophy, FastForward, Power } from 'lucide-react';

interface QuizGameProps {
  initialPlayers: string[];
  initialLevel: GameLevel;
  onFinish: (players: Player[]) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ initialPlayers, initialLevel, onFinish }) => {
  const [level, setLevel] = useState<GameLevel>(initialLevel);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [viewState, setViewState] = useState<CurrentQuestionState>('QUESTION');
  const [players, setPlayers] = useState<Player[]>(
    initialPlayers.map(name => ({ id: Math.random().toString(), name, score: 0 }))
  );
  const [isGameEnded, setIsGameEnded] = useState(false);

  // Initialize questions for current level
  useEffect(() => {
    const count = level === GameLevel.EXPERT_PLUS ? 40 : 20;
    setQuestions(generateQuestionSet(level, count));
    setQIndex(0);
    setViewState('QUESTION');
  }, [level]);

  const toggleAnswer = useCallback(() => {
    if (viewState === 'QUESTION') {
      setViewState('ANSWER');
    }
  }, [viewState]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') {
        toggleAnswer();
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [toggleAnswer]);

  const handleScore = (playerId: string | null) => {
    if (playerId) {
      setPlayers(prev => prev.map(p => p.id === playerId ? { ...p, score: p.score + 1 } : p));
    }

    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
      setViewState('QUESTION');
    } else {
      // Level complete
      if (level < GameLevel.EXPERT_PLUS) {
        setLevel(prev => (prev + 1) as GameLevel);
      } else {
        onFinish(players);
      }
    }
  };

  const quitGame = () => {
    onFinish(players);
  };

  if (questions.length === 0) return null;

  const currentQuestion = questions[qIndex];
  const maxQuestions = level === GameLevel.EXPERT_PLUS ? 40 : 20;

  return (
    <div className="w-full h-full flex flex-col items-center justify-between p-6 md:p-12 relative overflow-hidden">
      {/* HUD */}
      <div className="w-full flex justify-between items-center mb-8">
        <div className="space-y-1">
          <p className="text-indigo-400 font-bold uppercase tracking-wider text-xs">
            {level === GameLevel.EXPERT_PLUS ? 'Nível Expert Plus' : `Nível ${level}`}
          </p>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-1.5 w-8 rounded-full ${i + 1 <= level ? 'bg-indigo-500' : 'bg-slate-800'}`} />
            ))}
          </div>
        </div>
        
        <div className="bg-slate-800/50 backdrop-blur px-4 py-2 rounded-full border border-slate-700 text-sm font-semibold">
          Questão <span className="text-white">{qIndex + 1}</span> / {maxQuestions}
        </div>

        <Button variant="ghost" onClick={quitGame} className="px-4 py-2 flex items-center gap-2">
          <Power size={18} />
          <span className="hidden sm:inline">Finalizar</span>
        </Button>
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 w-full flex flex-col items-center justify-center cursor-pointer select-none"
        onClick={toggleAnswer}
      >
        <div className={`text-center transition-all duration-500 transform ${viewState === 'QUESTION' ? 'scale-100 opacity-100' : 'scale-90 opacity-50'}`}>
          <h2 className="text-7xl md:text-9xl font-black math-font text-white drop-shadow-2xl">
            {currentQuestion.expression}
          </h2>
          {viewState === 'QUESTION' && (
            <p className="mt-8 text-slate-500 animate-pulse font-medium">Toque na tela para ver o resultado</p>
          )}
        </div>

        {viewState === 'ANSWER' && (
          <div className="mt-12 animate-in zoom-in fade-in duration-300 text-center">
             <div className="inline-block bg-emerald-500/10 border-4 border-emerald-500/20 px-12 py-6 rounded-3xl shadow-2xl shadow-emerald-500/20">
                <p className="text-8xl md:text-9xl font-black math-font text-emerald-400">
                  {currentQuestion.answer}
                </p>
             </div>
          </div>
        )}
      </div>

      {/* Scoring Footer */}
      <div className={`w-full max-w-4xl transition-all duration-500 transform ${viewState === 'ANSWER' ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700 p-6 rounded-3xl shadow-2xl">
          <h3 className="text-center text-slate-400 font-bold mb-6 flex items-center justify-center gap-2">
            <Trophy size={20} className="text-yellow-500" />
            QUEM MARCOU PONTO?
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {players.map(p => (
              <button
                key={p.id}
                onClick={() => handleScore(p.id)}
                className="group relative overflow-hidden bg-slate-700 hover:bg-indigo-600 transition-all p-4 rounded-xl text-center border border-slate-600 hover:border-indigo-400"
              >
                <span className="text-white font-bold block truncate">{p.name}</span>
                <span className="text-xs text-slate-400 group-hover:text-indigo-200">{p.score} pts</span>
              </button>
            ))}
            <button
              onClick={() => handleScore(null)}
              className="bg-slate-900/50 hover:bg-slate-900 transition-all p-4 rounded-xl text-slate-400 border border-slate-800 flex items-center justify-center gap-2 italic"
            >
              Ninguém <X size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
