// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  GameSettings,
  DEFAULT_SETTINGS,
  SPEED_CONFIG,
} from '@/lib/musicTheory';
import { synth } from '@/lib/audioSynth';
import { GameScreen } from '@/components/GameScreen';
import { SettingsModal } from '@/components/SettingsModal';
import { LearnNotesModal } from '@/components/LearnNotesModal';
import { RankingModal, GameRecord } from '@/components/RankingModal';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<
    'menu' | 'playing' | 'settings' | 'ranking' | 'learn'
  >('menu');

  const [settings, setSettings] = useState<GameSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('music_game_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          synth.setMuted(!parsed.soundEnabled);
          return { ...DEFAULT_SETTINGS, ...parsed };
        }
      } catch {
        // Use defaults
      }
    }
    return DEFAULT_SETTINGS;
  });

  // Save settings helper
  const handleSaveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    synth.setMuted(!newSettings.soundEnabled);
    try {
      localStorage.setItem('music_game_settings', JSON.stringify(newSettings));
    } catch {
      // Ignore
    }
  };

  // Record game match result to history
  const handleRecordResult = (score: number, accuracy: number, totalNotes: number) => {
    try {
      const existing = localStorage.getItem('music_game_history');
      const history: GameRecord[] = existing ? JSON.parse(existing) : [];

      const newRecord: GameRecord = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        }),
        score,
        accuracy,
        totalNotes,
        clef:
          settings.clef === 'sol'
            ? 'Clave de Sol'
            : settings.clef === 'fa'
            ? 'Clave de Fá'
            : 'Clave de Dó',
        speed: SPEED_CONFIG[settings.speed].name,
      };

      const updated = [newRecord, ...history].slice(0, 30);
      localStorage.setItem('music_game_history', JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Menu action handler
  const handleMenuClick = (screen: 'playing' | 'settings' | 'ranking' | 'learn') => {
    synth.playClick();
    setCurrentScreen(screen);
  };

  // Active Game Screen
  if (currentScreen === 'playing') {
    return (
      <GameScreen
        settings={settings}
        onExit={() => setCurrentScreen('menu')}
        onUpdateSettings={handleSaveSettings}
        onRecordResult={handleRecordResult}
      />
    );
  }

  return (
    <div
      className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none"
      style={{
        // Authentic dark cedar/wood texture background matching screenshot
        background: 'linear-gradient(180deg, #603417 0%, #3e1e0a 35%, #2a1306 100%)',
      }}
    >
      {/* Subtle wood grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.02) 0px,
            rgba(255,255,255,0.02) 2px,
            transparent 2px,
            transparent 16px
          ), repeating-linear-gradient(
            90deg,
            rgba(0,0,0,0.04) 0px,
            rgba(0,0,0,0.04) 1px,
            transparent 1px,
            transparent 30px
          )`,
        }}
      />

      {/* TOP HEADER - matching screenshot 5b888cbb */}
      <header className="relative z-10 pt-8 sm:pt-12 pb-4 px-4 text-center">
        <div className="inline-block relative">
          <motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl sm:text-6xl font-black text-white tracking-wide drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.8), 0 0 16px rgba(255,230,180,0.3)',
            }}
          >
            Leitura de Partitura
          </motion.h1>
          <p className="text-amber-200/80 text-xs sm:text-sm font-medium mt-1 tracking-wider uppercase">
            Jogo & Treino de Precisão Musical
          </p>
        </div>
      </header>

      {/* MAIN MENU CONTAINER - matching screenshot parchment list */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 sm:px-0 my-auto">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="rounded-2xl overflow-hidden shadow-2xl border border-amber-900/40 divide-y divide-amber-900/10"
          style={{
            background: 'linear-gradient(180deg, #ede0cf 0%, #f7efe2 50%, #e6d7c2 100%)',
          }}
        >
          {/* Menu Option 1: Iniciar Jogo */}
          <button
            type="button"
            onClick={() => handleMenuClick('playing')}
            className="w-full py-4 sm:py-5 px-6 text-left flex items-center gap-4 hover:bg-amber-100/70 active:bg-amber-200/70 transition-colors group cursor-pointer"
          >
            {/* Styled musical note icon matching screenshot */}
            <div className="w-9 h-9 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-600 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
              <span className="text-xl">🎵</span>
            </div>
            <div className="flex-1">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 block group-hover:text-amber-950 transition-colors">
                Iniciar Jogo
              </span>
              <span className="text-xs text-stone-600 block">
                Treine com notas ao vivo e tempo configurável
              </span>
            </div>
            <div className="text-stone-400 group-hover:text-stone-700 text-lg transition-transform group-hover:translate-x-1">
              ▶
            </div>
          </button>

          {/* Menu Option 2: Ranking */}
          <button
            type="button"
            onClick={() => handleMenuClick('ranking')}
            className="w-full py-4 sm:py-5 px-6 text-left flex items-center gap-4 hover:bg-amber-100/70 active:bg-amber-200/70 transition-colors group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
              <span className="text-xl">🎵</span>
            </div>
            <div className="flex-1">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 block group-hover:text-amber-950 transition-colors">
                Ranking
              </span>
              <span className="text-xs text-stone-600 block">
                Recordes, precisão e histórico de partidas
              </span>
            </div>
            <div className="text-stone-400 group-hover:text-stone-700 text-lg transition-transform group-hover:translate-x-1">
              ▶
            </div>
          </button>

          {/* Menu Option 3: Conhecendo as notas */}
          <button
            type="button"
            onClick={() => handleMenuClick('learn')}
            className="w-full py-4 sm:py-5 px-6 text-left flex items-center gap-4 hover:bg-amber-100/70 active:bg-amber-200/70 transition-colors group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center text-pink-600 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
              <span className="text-xl">🎵</span>
            </div>
            <div className="flex-1">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 block group-hover:text-amber-950 transition-colors">
                Conhecendo as notas
              </span>
              <span className="text-xs text-stone-600 block">
                Guia visual interativo com áudio das claves
              </span>
            </div>
            <div className="text-stone-400 group-hover:text-stone-700 text-lg transition-transform group-hover:translate-x-1">
              ▶
            </div>
          </button>

          {/* Menu Option 4: Configurações */}
          <button
            type="button"
            onClick={() => handleMenuClick('settings')}
            className="w-full py-4 sm:py-5 px-6 text-left flex items-center gap-4 hover:bg-amber-100/70 active:bg-amber-200/70 transition-colors group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
              <span className="text-xl">🎵</span>
            </div>
            <div className="flex-1">
              <span className="text-xl sm:text-2xl font-bold text-stone-900 block group-hover:text-amber-950 transition-colors">
                Configurações
              </span>
              <span className="text-xs text-stone-600 block">
                Som, clave, velocidade e linhas suplementares
              </span>
            </div>
            <div className="text-stone-400 group-hover:text-stone-700 text-lg transition-transform group-hover:translate-x-1">
              ▶
            </div>
          </button>
        </motion.div>

        {/* Current Active Mode Quick Badge */}
        <div className="mt-3 text-center text-xs text-amber-200/70 flex items-center justify-center gap-2">
          <span>
            Clave:{' '}
            <strong className="text-white">
              {settings.clef === 'sol' ? 'Sol' : settings.clef === 'fa' ? 'Fá 4ª' : 'Dó 3ª'}
            </strong>
          </span>
          <span>·</span>
          <span>
            Velocidade:{' '}
            <strong className="text-white">{SPEED_CONFIG[settings.speed].name}</strong>
          </span>
          <span>·</span>
          <span>
            Som:{' '}
            <strong className="text-white">{settings.soundEnabled ? 'Ligado' : 'Mudo'}</strong>
          </span>
        </div>
      </main>

      {/* BOTTOM ARTWORK BANNER - Faithful vector illustration recreating the glowing staff & notes from the screenshot */}
      <footer className="relative z-10 w-full overflow-hidden pointer-events-none mt-6">
        <svg
          viewBox="0 0 800 240"
          className="w-full h-auto max-h-56 object-cover object-bottom opacity-90 drop-shadow-[0_-4px_12px_rgba(0,0,0,0.5)]"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="purpleNoteGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d8b4fe" />
              <stop offset="50%" stopColor="#9333ea" />
              <stop offset="100%" stopColor="#581c87" />
            </linearGradient>
            <linearGradient id="greenNoteGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </linearGradient>
            <filter id="glowEffect" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Flowing Curved Staff Lines */}
          <path
            d="M -50 180 Q 200 80 500 120 T 850 100"
            fill="none"
            stroke="#1c1917"
            strokeWidth="5"
            opacity="0.85"
          />
          <path
            d="M -50 195 Q 200 95 500 135 T 850 115"
            fill="none"
            stroke="#1c1917"
            strokeWidth="5"
            opacity="0.85"
          />
          <path
            d="M -50 210 Q 200 110 500 150 T 850 130"
            fill="none"
            stroke="#1c1917"
            strokeWidth="5"
            opacity="0.85"
          />
          <path
            d="M -50 225 Q 200 125 500 165 T 850 145"
            fill="none"
            stroke="#1c1917"
            strokeWidth="5"
            opacity="0.85"
          />
          <path
            d="M -50 240 Q 200 140 500 180 T 850 160"
            fill="none"
            stroke="#1c1917"
            strokeWidth="5"
            opacity="0.85"
          />

          {/* Large Black Treble Clef on the Left */}
          <g transform="translate(40, 60) scale(1.1)" fill="#1c1917">
            <path d="M42.8,118 C40,119.5 36.5,120.2 33,119.4 C25.8,117.8 21.2,110.8 22.8,103.5 C24.1,97.7 29.2,93.5 35.1,93.9 C36.2,94 37.3,94.3 38.3,94.8 L38.3,58 C38.3,42 41.5,23.5 47.8,8.2 C48.5,6.5 50.8,6.2 51.7,7.7 C54.5,12.4 56.4,19.2 55.2,28.5 C54.1,37.2 49.3,52.4 44.5,67.8 L44.5,92.5 C49.2,90.2 54.8,89.5 60.1,91.3 C70,94.7 75.8,104.5 73.6,115 C71.3,125.8 61.6,133.5 50.2,133.2 C44.5,133 39.2,130.6 35.5,126.8 L35.5,135.5 C35.5,145.8 33.1,154 28.5,157.5 C24.5,160.5 19.5,160.2 16.5,157.2 C13.5,154.2 13.5,148.8 17.2,145.5 C20.2,142.8 24.5,143.5 26.2,147 C27,148.6 27,150.8 26.2,152 C28.2,150.2 29.5,145 29.5,136.5 L29.5,123.5 C33.2,127 38.2,129 43.5,128.8 C51.5,128.5 58.5,122.8 60.2,114.5 C61.8,106.5 57.5,99.2 49.8,96.8 C45.5,95.5 40.5,96.5 36.8,99.5 C34.8,101.2 33.5,103.5 33.2,106.2 C32.5,111.5 36.2,116 41.8,116.5 C43.2,116.6 44.5,116.2 45.5,115.5 L42.8,118 Z" />
          </g>

          {/* Central Glowing Purple Eighth Note */}
          <g transform="translate(360, 110)" filter="url(#glowEffect)">
            {/* Note head */}
            <ellipse
              cx="0"
              cy="65"
              rx="30"
              ry="22"
              transform="rotate(-25 0 65)"
              fill="url(#purpleNoteGlow)"
              stroke="#ffffff"
              strokeWidth="4"
            />
            {/* Stem */}
            <rect x="22" y="-40" width="10" height="105" fill="#f3e8ff" rx="4" />
            {/* Flag */}
            <path
              d="M32,-40 C75,-25 85,25 60,45 C50,30 45,0 32,-15 Z"
              fill="url(#purpleNoteGlow)"
              stroke="#ffffff"
              strokeWidth="2.5"
            />
          </g>

          {/* Glowing Green Beamed Notes on the Right */}
          <g transform="translate(560, 120)" filter="url(#glowEffect)">
            {/* First note head */}
            <ellipse
              cx="0"
              cy="70"
              rx="28"
              ry="20"
              transform="rotate(-25 0 70)"
              fill="url(#greenNoteGlow)"
              stroke="#ffffff"
              strokeWidth="4"
            />
            {/* Second note head */}
            <ellipse
              cx="120"
              cy="60"
              rx="28"
              ry="20"
              transform="rotate(-25 120 60)"
              fill="url(#greenNoteGlow)"
              stroke="#ffffff"
              strokeWidth="4"
            />
            {/* Left stem */}
            <rect x="20" y="-30" width="9" height="100" fill="#dcfce7" rx="3" />
            {/* Right stem */}
            <rect x="140" y="-40" width="9" height="100" fill="#dcfce7" rx="3" />
            {/* Beam bar */}
            <polygon points="20,-30 149,-40 149,-25 20,-15" fill="url(#greenNoteGlow)" stroke="#ffffff" strokeWidth="2" />
          </g>
        </svg>
      </footer>

      {/* MODALS */}
      <AnimatePresence>
        {currentScreen === 'settings' && (
          <SettingsModal
            settings={settings}
            onSave={handleSaveSettings}
            onClose={() => setCurrentScreen('menu')}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentScreen === 'learn' && (
          <LearnNotesModal onClose={() => setCurrentScreen('menu')} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {currentScreen === 'ranking' && (
          <RankingModal onClose={() => setCurrentScreen('menu')} />
        )}
      </AnimatePresence>
    </div>
  );
}
