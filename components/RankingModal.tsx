// components/RankingModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { synth } from '@/lib/audioSynth';
import { Trophy, Target, Award, Trash2, Calendar } from 'lucide-react';

export interface GameRecord {
  id: string;
  date: string;
  score: number;
  accuracy: number;
  totalNotes: number;
  clef: string;
  speed: string;
}

interface RankingModalProps {
  onClose: () => void;
}

export const RankingModal: React.FC<RankingModalProps> = ({ onClose }) => {
  const [history, setHistory] = useState<GameRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('music_game_history');
        if (saved) return JSON.parse(saved);
      } catch {
        // Ignore
      }
    }
    return [];
  });

  const handleClearHistory = () => {
    synth.playClick();
    if (window.confirm('Deseja realmente limpar todo o histórico de pontuações?')) {
      localStorage.removeItem('music_game_history');
      setHistory([]);
    }
  };

  const highScore = history.reduce((max, r) => Math.max(max, r.score), 0);
  const bestAccuracy = history.reduce((max, r) => Math.max(max, r.accuracy), 0);
  const totalNotesPlayed = history.reduce((sum, r) => sum + r.totalNotes, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl border border-amber-900/40 my-auto text-stone-900"
        style={{
          background: 'linear-gradient(180deg, #b67332 0%, #874b1e 40%, #582e0e 100%)',
        }}
      >
        {/* Header */}
        <div className="pt-6 pb-4 px-6 text-center border-b border-amber-950/20 bg-black/15">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Trophy className="w-7 h-7 text-amber-300" />
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Ranking & Estatísticas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-amber-200/90">
            Acompanhe a sua evolução e precisão na leitura das partituras
          </p>
        </div>

        {/* Inner Content */}
        <div
          className="p-5 sm:p-6 space-y-5"
          style={{
            background: 'linear-gradient(180deg, #ede0cf 0%, #f4e9d8 100%)',
          }}
        >
          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-amber-100/70 p-3 rounded-xl border border-stone-300 shadow-xs">
              <Award className="w-5 h-5 mx-auto text-amber-700 mb-1" />
              <span className="text-[11px] text-stone-600 block font-medium">Recorde</span>
              <strong className="text-2xl font-black text-amber-900 tabular-nums">
                {highScore}
              </strong>
            </div>

            <div className="bg-amber-100/70 p-3 rounded-xl border border-stone-300 shadow-xs">
              <Target className="w-5 h-5 mx-auto text-emerald-700 mb-1" />
              <span className="text-[11px] text-stone-600 block font-medium">Melhor Precisão</span>
              <strong className="text-2xl font-black text-emerald-800 tabular-nums">
                {bestAccuracy}%
              </strong>
            </div>

            <div className="bg-amber-100/70 p-3 rounded-xl border border-stone-300 shadow-xs">
              <Trophy className="w-5 h-5 mx-auto text-blue-700 mb-1" />
              <span className="text-[11px] text-stone-600 block font-medium">Partidas</span>
              <strong className="text-2xl font-black text-stone-800 tabular-nums">
                {history.length}
              </strong>
            </div>
          </div>

          {/* History List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Últimas Partidas
              </span>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearHistory}
                  className="text-xs text-stone-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Limpar
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-8 bg-amber-100/40 rounded-xl border border-stone-300 text-stone-600 text-xs">
                Nenhuma partida registrada ainda.
                <br />
                <span className="text-stone-500 mt-1 block">
                  Jogue uma partida no menu principal para gravar seu desempenho!
                </span>
              </div>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {history.slice(0, 10).map((record, index) => (
                  <div
                    key={record.id}
                    className="p-3 bg-white rounded-lg border border-stone-300 shadow-2xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-stone-200 font-bold text-[11px] text-stone-700 flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <div>
                        <strong className="text-stone-900 block font-bold">
                          {record.score} pontos
                        </strong>
                        <span className="text-[10px] text-stone-500">
                          {record.date} · {record.clef} · {record.speed}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span
                        className={`font-black font-mono px-2 py-0.5 rounded text-[11px] ${
                          record.accuracy >= 80
                            ? 'bg-emerald-100 text-emerald-800'
                            : record.accuracy >= 60
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {record.accuracy}% precisão
                      </span>
                      <span className="block text-[10px] text-stone-400 mt-0.5">
                        {record.totalNotes} notas
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar with VOLTAR button */}
        <div className="p-5 text-center border-t border-amber-950/20 bg-black/20 flex justify-center">
          <button
            type="button"
            onClick={() => {
              synth.playClick();
              onClose();
            }}
            className="w-48 py-2.5 bg-[#52525b] hover:bg-[#3f3f46] text-white font-bold text-base tracking-wider rounded-md uppercase shadow-md transition-transform active:scale-95 border border-stone-500/40"
          >
            VOLTAR
          </button>
        </div>
      </div>
    </div>
  );
};
