
import React, { useState } from 'react';
import { Button } from './Button';
import { UserPlus, Users, Trash2 } from 'lucide-react';

interface PlayerSetupProps {
  onComplete: (names: string[]) => void;
  onBack: () => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({ onComplete, onBack }) => {
  const [name, setName] = useState('');
  const [players, setPlayers] = useState<string[]>([]);

  const addPlayer = () => {
    if (name.trim() && !players.includes(name.trim())) {
      setPlayers([...players, name.trim()]);
      setName('');
    }
  };

  const removePlayer = (index: number) => {
    setPlayers(players.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-md w-full mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-extrabold text-white mb-2">Quem vai jogar?</h2>
        <p className="text-slate-400">Adicione os nomes dos competidores</p>
      </div>

      <div className="flex gap-2">
        <input 
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
          placeholder="Nome do jogador..."
          className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <Button onClick={addPlayer}>
          <UserPlus size={20} />
        </Button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
        {players.map((p, idx) => (
          <div key={idx} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                {idx + 1}
              </div>
              <span className="text-white font-medium">{p}</span>
            </div>
            <button onClick={() => removePlayer(idx)} className="text-rose-400 hover:text-rose-300 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {players.length === 0 && (
          <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
            Nenhum jogador adicionado ainda
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Button 
          disabled={players.length < 1}
          onClick={() => onComplete(players)}
          className="w-full py-4 text-lg"
        >
          Iniciar Partida
        </Button>
        <Button variant="ghost" onClick={onBack}>Voltar</Button>
      </div>
    </div>
  );
};
