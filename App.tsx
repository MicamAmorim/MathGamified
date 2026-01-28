
import React, { useState } from 'react';
import { GameState, GameLevel, Player } from './types';
import { QuizGame } from './components/QuizGame';
import { PlayerSetup } from './components/PlayerSetup';
import { Button } from './components/Button';
import { Trophy, Play, Settings, History, Calculator } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('HOME');
  const [level, setLevel] = useState<GameLevel>(GameLevel.BASIC);
  const [players, setPlayers] = useState<Player[]>([]);
  const [history, setHistory] = useState<{winner: string, date: string}[]>([]);

  const handleStartGame = (playerNames: string[]) => {
    const initializedPlayers = playerNames.map(name => ({ id: Math.random().toString(), name, score: 0 }));
    setPlayers(initializedPlayers);
    setGameState('PLAYING');
  };

  const handleGameFinish = (finalPlayers: Player[]) => {
    setPlayers(finalPlayers);
    const topScore = Math.max(...finalPlayers.map(p => p.score));
    const winners = finalPlayers.filter(p => p.score === topScore);
    
    if (topScore > 0) {
      setHistory(prev => [
        { 
          winner: winners.length > 1 ? "Empate" : winners[0].name, 
          date: new Date().toLocaleDateString('pt-BR') 
        }, 
        ...prev
      ].slice(0, 10));
    }
    
    setGameState('RESULTS');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col items-center justify-center p-4">
      {gameState === 'HOME' && (
        <div className="max-w-2xl w-full text-center space-y-12 animate-in fade-in duration-1000">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-indigo-600 shadow-2xl shadow-indigo-500/50 mb-4 transform rotate-3">
              <Calculator size={48} className="text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
              MATH<span className="text-indigo-500">MASTER</span>
            </h1>
            <p className="text-xl text-slate-400 font-medium max-w-md mx-auto">
              O desafio matemático definitivo para sua sala de aula.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button onClick={() => setGameState('SETUP')} className="flex items-center justify-center gap-2 text-lg h-16">
              <Play fill="currentColor" size={20} />
              Iniciar Jogo
            </Button>
            
            <div className="relative group">
              <select 
                value={level}
                onChange={(e) => setLevel(Number(e.target.value) as GameLevel)}
                className="w-full h-16 bg-slate-800 border-2 border-slate-700 rounded-xl px-4 text-white appearance-none focus:outline-none focus:border-indigo-500 font-bold transition-all"
              >
                <option value={GameLevel.BASIC}>Básico (Tabuada)</option>
                <option value={GameLevel.INTERMEDIATE}>Intermédio (+ Frações)</option>
                <option value={GameLevel.ADVANCED}>Avançado (Expressões)</option>
                <option value={GameLevel.EXPERT}>Expert (3 Dígitos)</option>
                <option value={GameLevel.EXPERT_PLUS}>Expert Plus (Misto)</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <Settings size={20} />
              </div>
            </div>
          </div>

          {history.length > 0 && (
            <div className="max-w-md mx-auto bg-slate-800/30 rounded-2xl p-6 border border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-center gap-2">
                <History size={16} /> Últimos Vencedores
              </h3>
              <div className="space-y-2">
                {history.map((h, i) => (
                  <div key={i} className="flex justify-between items-center text-sm py-2 border-b border-slate-800 last:border-0">
                    <span className="text-white font-medium">{h.winner}</span>
                    <span className="text-slate-500">{h.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'SETUP' && (
        <PlayerSetup 
          onBack={() => setGameState('HOME')} 
          onComplete={handleStartGame} 
        />
      )}

      {gameState === 'PLAYING' && (
        <QuizGame 
          initialPlayers={players.map(p => p.name)} 
          initialLevel={level} 
          onFinish={handleGameFinish} 
        />
      )}

      {gameState === 'RESULTS' && (
        <div className="max-w-2xl w-full text-center space-y-8 animate-in zoom-in duration-500">
          <div className="flex justify-center">
            <div className="bg-yellow-500/10 p-6 rounded-full border-4 border-yellow-500/20">
              <Trophy size={64} className="text-yellow-500" />
            </div>
          </div>
          
          <h2 className="text-4xl font-black text-white">Fim de Jogo!</h2>
          
          <div className="bg-slate-800/50 backdrop-blur rounded-3xl border border-slate-700 p-8 shadow-xl">
            <div className="space-y-4">
              {players.sort((a, b) => b.score - a.score).map((p, i) => (
                <div key={p.id} className={`flex items-center justify-between p-4 rounded-xl ${i === 0 ? 'bg-indigo-600/20 border border-indigo-500/50' : 'bg-slate-900/30'}`}>
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${i === 0 ? 'text-yellow-500' : 'text-slate-500'}`}>
                      #{i + 1}
                    </span>
                    <span className="text-xl font-bold text-white">{p.name}</span>
                  </div>
                  <span className="text-2xl font-black text-indigo-400">{p.score} pts</span>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-8 border-t border-slate-700">
              {(() => {
                const max = Math.max(...players.map(p => p.score));
                const winners = players.filter(p => p.score === max);
                if (max === 0) return <p className="text-slate-400">Ninguém pontuou! Foi um empate amigável.</p>;
                if (winners.length > 1) return <p className="text-xl font-bold text-indigo-400">Houve um EMPATE entre os melhores!</p>;
                return <p className="text-2xl font-bold text-white"><span className="text-indigo-400">{winners[0].name}</span> é o campeão!</p>;
              })()}
            </div>
          </div>

          <Button onClick={() => setGameState('HOME')} className="w-full py-4 text-xl">
            Voltar ao Início
          </Button>
        </div>
      )}
    </div>
  );
};

export default App;
