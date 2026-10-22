// components/RankingModal.tsx
'use client';

import React, { useState, useSyncExternalStore } from 'react';
import { synth } from '@/lib/audioSynth';
import { Trophy, Target, Award, Trash2, Calendar, AlertTriangle } from 'lucide-react';

export interface GameRecord {
  id: string;
  date: string;
  score: number;
  accuracy: number;
  totalNotes: number;
  clef: string;
  speed: string;
}

const HISTORY_KEY = 'music_game_history';
const HISTORY_EVENT = 'music_game_history_updated';
const defaultHistoryStr = '[]';

function subscribeHistory(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(HISTORY_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(HISTORY_EVENT, callback);
  };
}

function getHistorySnapshot(): string {
  if (typeof window === 'undefined') return defaultHistoryStr;
  try {
    return localStorage.getItem(HISTORY_KEY) || defaultHistoryStr;
  } catch {
    return defaultHistoryStr;
  }
}

function getHistoryServerSnapshot(): string {
  return defaultHistoryStr;
}

interface RankingModalProps {
  onClose: () => void;
}

export const RankingModal: React.FC<RankingModalProps> = ({ onClose }) => {
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  const historyStr = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getHistoryServerSnapshot
  );

  let history: GameRecord[] = [];
  try {
    history = JSON.parse(historyStr);
  } catch {
    history = [];
  }

  const handleOpenConfirm = () => {
    synth.playClick();
    setShowConfirmModal(true);
  };

  const handleCancelDelete = () => {
    synth.playClick();
    setShowConfirmModal(false);
  };

  const handleConfirmDelete = () => {
    synth.playClick();
    try {
      localStorage.removeItem(HISTORY_KEY);
      window.dispatchEvent(new Event(HISTORY_EVENT));
    } catch {
      // Ignore
    }
    setShowConfirmModal(false);
  };

  const highScore = history.reduce((max, r) => Math.max(max, r.score), 0);
  const bestAccuracy = history.reduce((max, r) => Math.max(max, r.accuracy), 0);

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
                  onClick={handleOpenConfirm}
                  className="text-xs font-semibold text-stone-600 hover:text-red-700 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-stone-200/90 hover:bg-red-50 border border-stone-300 transition-all cursor-pointer shadow-2xs active:scale-95"
                  title="Excluir Histórico"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  <span>Limpar Histórico</span>
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
            className="w-48 py-2.5 bg-[#52525b] hover:bg-[#3f3f46] text-white font-bold text-base tracking-wider rounded-md uppercase shadow-md transition-transform active:scale-95 border border-stone-500/40 cursor-pointer"
          >
            VOLTAR
          </button>
        </div>
      </div>

      {/* CONFIRMATION POPUP MODAL REQUESTED BY USER:
          "abre uma pequena janela com botão ( Não) na cor vermelha e ( Sim) na cor verde com uma mensagem ( Deseja excluir Histórico)" */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs">
          <div className="relative w-full max-w-xs rounded-2xl overflow-hidden shadow-2xl border border-stone-600 bg-stone-900 text-white p-6 text-center animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-950/90 border border-red-500/60 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-black text-white mb-2 leading-tight">
              Deseja excluir Histórico?
            </h3>
            <p className="text-xs text-stone-400 mb-6">
              Todos os recordes e partidas gravadas serão apagados.
            </p>

            <div className="flex items-center justify-center gap-3">
              {/* Botão Não (na cor vermelha) */}
              <button
                type="button"
                onClick={handleCancelDelete}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-sm rounded-lg shadow-md transition-all active:scale-95 cursor-pointer border border-red-500/50"
              >
                Não
              </button>

              {/* Botão Sim (na cor verde) */}
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-lg shadow-md transition-all active:scale-95 cursor-pointer border border-emerald-500/50"
              >
                Sim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
