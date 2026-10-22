// components/SettingsModal.tsx
'use client';

import React, { useState } from 'react';
import {
  GameSettings,
  ClefType,
  GameSpeed,
  LedgerLinesSetting,
  NoteFormat,
  SPEED_CONFIG,
} from '@/lib/musicTheory';
import { synth } from '@/lib/audioSynth';
import { Volume2, VolumeX, Music, Gauge, Sliders, Check } from 'lucide-react';

interface SettingsModalProps {
  settings: GameSettings;
  onSave: (newSettings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onSave,
  onClose,
}) => {
  const [current, setCurrent] = useState<GameSettings>({ ...settings });

  // Open dropdown state
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (id: string) => {
    synth.playClick();
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  const handleSelect = <K extends keyof GameSettings>(key: K, value: GameSettings[K]) => {
    synth.playClick();
    const updated = { ...current, [key]: value };
    setCurrent(updated);
    setActiveDropdown(null);
    if (key === 'soundEnabled') {
      synth.setMuted(!value);
    }
  };

  const handleBack = () => {
    synth.playClick();
    onSave(current);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl border border-amber-900/40 my-auto text-stone-900"
        style={{
          // Authentic warm wood background texture matching screenshot
          background: 'linear-gradient(180deg, #b67332 0%, #874b1e 40%, #582e0e 100%)',
        }}
      >
        {/* Top Header */}
        <div className="pt-6 pb-4 px-6 text-center border-b border-amber-950/20 bg-black/15">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Configurações
          </h2>
        </div>

        {/* Parchment inner box for settings list */}
        <div
          className="p-5 sm:p-7 space-y-5"
          style={{
            background: 'linear-gradient(180deg, #ede0cf 0%, #f4e9d8 100%)',
          }}
        >
          {/* 1. Som das notas */}
          <div className="relative">
            <label className="block text-sm font-bold text-stone-800 mb-1 flex items-center gap-1.5">
              {current.soundEnabled ? (
                <Volume2 className="w-4 h-4 text-amber-800" />
              ) : (
                <VolumeX className="w-4 h-4 text-stone-500" />
              )}
              Som das notas
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('sound')}
              className="w-full text-left py-2 px-3.5 bg-amber-100/60 hover:bg-amber-100 border border-stone-400/60 rounded-md shadow-xs flex items-center justify-between text-stone-800 font-medium transition-colors"
            >
              <span>{current.soundEnabled ? 'Ligado' : 'Desligado'}</span>
              <span className="text-stone-500 text-xs">▼</span>
            </button>

            {activeDropdown === 'sound' && (
              <div className="absolute z-20 mt-1 w-full bg-stone-800 text-white rounded-md shadow-xl border border-stone-700 py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleSelect('soundEnabled', true)}
                  className={`w-full text-left px-4 py-2 hover:bg-stone-700 flex items-center justify-between ${
                    current.soundEnabled ? 'bg-stone-700 font-bold text-amber-300' : ''
                  }`}
                >
                  <span>Ligado</span>
                  {current.soundEnabled && <Check className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('soundEnabled', false)}
                  className={`w-full text-left px-4 py-2 hover:bg-stone-700 flex items-center justify-between ${
                    !current.soundEnabled ? 'bg-stone-700 font-bold text-amber-300' : ''
                  }`}
                >
                  <span>Desligado</span>
                  {!current.soundEnabled && <Check className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* 2. Clave */}
          <div className="relative">
            <label className="block text-sm font-bold text-stone-800 mb-1 flex items-center gap-1.5">
              <Music className="w-4 h-4 text-amber-800" />
              Clave
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('clef')}
              className="w-full text-left py-2 px-3.5 bg-amber-100/60 hover:bg-amber-100 border border-stone-400/60 rounded-md shadow-xs flex items-center justify-between text-stone-800 font-medium transition-colors"
            >
              <span>
                {current.clef === 'sol' && 'Sol'}
                {current.clef === 'fa' && 'Fá 4ª linha'}
                {current.clef === 'do' && 'Dó 3ª linha'}
              </span>
              <span className="text-stone-500 text-xs">▼</span>
            </button>

            {activeDropdown === 'clef' && (
              <div className="absolute z-20 mt-1 w-full bg-stone-800 text-white rounded-md shadow-xl border border-stone-700 py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleSelect('clef', 'sol')}
                  className={`w-full text-left px-4 py-2.5 hover:bg-stone-700 flex items-center justify-between ${
                    current.clef === 'sol' ? 'bg-stone-700 font-bold text-amber-300' : ''
                  }`}
                >
                  <div>
                    <span className="block font-medium">Sol</span>
                    <span className="block text-xs text-stone-400">Padrão agudo (Violino, Piano MD, Flauta)</span>
                  </div>
                  {current.clef === 'sol' && <Check className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('clef', 'fa')}
                  className={`w-full text-left px-4 py-2.5 hover:bg-stone-700 flex items-center justify-between ${
                    current.clef === 'fa' ? 'bg-stone-700 font-bold text-amber-300' : ''
                  }`}
                >
                  <div>
                    <span className="block font-medium">Fá 4ª linha</span>
                    <span className="block text-xs text-stone-400">Padrão grave (Baixo, Piano ME, Violoncelo)</span>
                  </div>
                  {current.clef === 'fa' && <Check className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('clef', 'do')}
                  className={`w-full text-left px-4 py-2.5 hover:bg-stone-700 flex items-center justify-between ${
                    current.clef === 'do' ? 'bg-stone-700 font-bold text-amber-300' : ''
                  }`}
                >
                  <div>
                    <span className="block font-medium">Dó 3ª linha</span>
                    <span className="block text-xs text-stone-400">Dó central (Viola de arco, Trombone tenor)</span>
                  </div>
                  {current.clef === 'do' && <Check className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* 3. Velocidade do jogo */}
          <div className="relative">
            <label className="block text-sm font-bold text-stone-800 mb-1 flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-amber-800" />
              Velocidade do jogo
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('speed')}
              className="w-full text-left py-2 px-3.5 bg-amber-100/60 hover:bg-amber-100 border border-stone-400/60 rounded-md shadow-xs flex items-center justify-between text-stone-800 font-medium transition-colors"
            >
              <span>{SPEED_CONFIG[current.speed].label}</span>
              <span className="text-stone-500 text-xs">▼</span>
            </button>

            {activeDropdown === 'speed' && (
              <div className="absolute z-20 mt-1 w-full bg-stone-800 text-white rounded-md shadow-xl border border-stone-700 py-1 max-h-60 overflow-y-auto">
                {(Object.keys(SPEED_CONFIG) as GameSpeed[]).map((speedKey) => (
                  <button
                    key={speedKey}
                    type="button"
                    onClick={() => handleSelect('speed', speedKey)}
                    className={`w-full text-left px-4 py-2 hover:bg-stone-700 flex items-center justify-between text-sm ${
                      current.speed === speedKey ? 'bg-stone-700 font-bold text-amber-300' : ''
                    }`}
                  >
                    <span>{SPEED_CONFIG[speedKey].label}</span>
                    {current.speed === speedKey && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 4. Linhas suplementares */}
          <div className="relative">
            <label className="block text-sm font-bold text-stone-800 mb-1 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-800" />
              Linhas suplementares
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('ledger')}
              className="w-full text-left py-2 px-3.5 bg-amber-100/60 hover:bg-amber-100 border border-stone-400/60 rounded-md shadow-xs flex items-center justify-between text-stone-800 font-medium transition-colors"
            >
              <span>
                {current.ledgerLines === 0 && 'Nenhuma'}
                {current.ledgerLines === 1 && '1 linha'}
                {current.ledgerLines === 2 && '2 linhas'}
                {current.ledgerLines === 3 && '3 linhas'}
              </span>
              <span className="text-stone-500 text-xs">▼</span>
            </button>

            {activeDropdown === 'ledger' && (
              <div className="absolute z-20 mt-1 w-full bg-stone-800 text-white rounded-md shadow-xl border border-stone-700 py-1 overflow-hidden">
                {[
                  { val: 0 as LedgerLinesSetting, label: 'Nenhuma (Apenas dentro da pauta)' },
                  { val: 1 as LedgerLinesSetting, label: '1 linha' },
                  { val: 2 as LedgerLinesSetting, label: '2 linhas' },
                  { val: 3 as LedgerLinesSetting, label: '3 linhas' },
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleSelect('ledgerLines', item.val)}
                    className={`w-full text-left px-4 py-2 hover:bg-stone-700 flex items-center justify-between text-sm ${
                      current.ledgerLines === item.val
                        ? 'bg-stone-700 font-bold text-amber-300'
                        : ''
                    }`}
                  >
                    <span>{item.label}</span>
                    {current.ledgerLines === item.val && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 5. Formato das notas */}
          <div className="relative">
            <label className="block text-sm font-bold text-stone-800 mb-1 flex items-center gap-1.5">
              Formato das notas
            </label>
            <button
              type="button"
              onClick={() => toggleDropdown('format')}
              className="w-full text-left py-2 px-3.5 bg-amber-100/60 hover:bg-amber-100 border border-stone-400/60 rounded-md shadow-xs flex items-center justify-between text-stone-800 font-medium transition-colors"
            >
              <span>
                {current.noteFormat === 'latin'
                  ? 'Notas (DÓ, RÉ, MI, FÁ, SOL, LÁ, SI)'
                  : 'Cifras (C D E F G A B)'}
              </span>
              <span className="text-stone-500 text-xs">▼</span>
            </button>

            {activeDropdown === 'format' && (
              <div className="absolute z-20 mt-1 w-full bg-stone-800 text-white rounded-md shadow-xl border border-stone-700 py-1 overflow-hidden">
                <button
                  type="button"
                  onClick={() => handleSelect('noteFormat', 'latin')}
                  className={`w-full text-left px-4 py-2 hover:bg-stone-700 flex items-center justify-between text-sm ${
                    current.noteFormat === 'latin'
                      ? 'bg-stone-700 font-bold text-amber-300'
                      : ''
                  }`}
                >
                  <span>Notas (DÓ, RÉ, MI, FÁ, SOL, LÁ, SI)</span>
                  {current.noteFormat === 'latin' && <Check className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSelect('noteFormat', 'ciphers')}
                  className={`w-full text-left px-4 py-2 hover:bg-stone-700 flex items-center justify-between text-sm ${
                    current.noteFormat === 'ciphers'
                      ? 'bg-stone-700 font-bold text-amber-300'
                      : ''
                  }`}
                >
                  <span>Cifras (C D E F G A B)</span>
                  {current.noteFormat === 'ciphers' && <Check className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>

          {/* 6. Limite de erros por partida */}
          <div className="relative">
            <label className="block text-sm font-bold text-stone-800 mb-1 flex items-center gap-1.5">
              Vidas / Limite de Erros
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: 3, label: '3 Erros (Normal)' },
                { val: 5, label: '5 Erros (Treino)' },
                { val: 999, label: 'Infinito' },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => handleSelect('maxMistakes', item.val)}
                  className={`py-2 px-2 text-xs font-semibold rounded-md border text-center transition-colors ${
                    current.maxMistakes === item.val
                      ? 'bg-amber-900 text-white border-amber-950 shadow-sm'
                      : 'bg-stone-200/80 text-stone-700 border-stone-300 hover:bg-stone-300'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with VOLTAR button - matching screenshots */}
        <div className="p-6 text-center border-t border-amber-950/20 bg-black/20 flex justify-center">
          <button
            type="button"
            onClick={handleBack}
            className="w-48 py-3 bg-[#52525b] hover:bg-[#3f3f46] active:bg-[#27272a] text-white font-bold text-base tracking-wider rounded-md uppercase shadow-md transition-transform active:scale-95 border border-stone-500/40"
          >
            VOLTAR
          </button>
        </div>
      </div>
    </div>
  );
};
