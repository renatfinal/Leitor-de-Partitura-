// app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import {
  GameSettings,
  DEFAULT_SETTINGS,
  SPEED_CONFIG,
} from '@/lib/musicTheory';
import { useGameSettings } from '@/lib/storage';
import { synth } from '@/lib/audioSynth';
import { GameScreen } from '@/components/GameScreen';
import { SettingsModal } from '@/components/SettingsModal';
import { LearnNotesModal } from '@/components/LearnNotesModal';
import { RankingModal, GameRecord } from '@/components/RankingModal';
import { PWAInstallButton } from '@/components/PWAInstallButton';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<
    'menu' | 'playing' | 'settings' | 'ranking' | 'learn'
  >('menu');

  const [settings, setSettings] = useGameSettings();

  // Save settings helper
  const handleSaveSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    synth.setMuted(!newSettings.soundEnabled);
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
      window.dispatchEvent(new Event('music_game_history_updated'));
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
      <header className="relative z-10 pt-4 sm:pt-8 pb-3 px-4 text-center">
        {/* Top App Bar Install Prompt */}
        <div className="w-full max-w-md mx-auto flex items-center justify-end mb-2 px-1">
          <PWAInstallButton />
        </div>

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
        <div suppressHydrationWarning className="mt-3 text-center text-xs text-amber-200/70 flex items-center justify-center gap-2">
          <span suppressHydrationWarning>
            Clave:{' '}
            <strong suppressHydrationWarning className="text-white">
              {settings.clef === 'sol' ? 'Sol' : settings.clef === 'fa' ? 'Fá 4ª' : 'Dó 3ª'}
            </strong>
          </span>
          <span>·</span>
          <span suppressHydrationWarning>
            Velocidade:{' '}
            <strong suppressHydrationWarning className="text-white">{SPEED_CONFIG[settings.speed].name}</strong>
          </span>
          <span>·</span>
          <span suppressHydrationWarning>
            Som:{' '}
            <strong suppressHydrationWarning className="text-white">{settings.soundEnabled ? 'Ligado' : 'Mudo'}</strong>
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
          <g transform="translate(10, -170) scale(0.042)" fill="#1c1917">
            <path d="M 2002,7851 C 1941,7868 1886,7906 1835,7964 C 1784,8023 1759,8088 1759,8158 C 1759,8202 1774,8252 1803,8305 C 1832,8359 1876,8398 1933,8423 C 1952,8427 1961,8437 1961,8451 C 1961,8456 1954,8461 1937,8465 C 1846,8442 1771,8393 1713,8320 C 1655,8246 1625,8162 1623,8066 C 1626,7963 1657,7867 1716,7779 C 1776,7690 1853,7627 1947,7590 L 1878,7235 C 1724,7363 1599,7496 1502,7636 C 1405,7775 1355,7926 1351,8089 C 1353,8162 1368,8233 1396,8301 C 1424,8370 1466,8432 1522,8489 C 1635,8602 1782,8661 1961,8667 C 2022,8663 2087,8652 2157,8634 L 2002,7851 z M 2074,7841 L 2230,8610 C 2384,8548 2461,8413 2461,8207 C 2452,8138 2432,8076 2398,8021 C 2365,7965 2321,7921 2265,7889 C 2209,7857 2146,7841 2074,7841 z M 1869,6801 C 1902,6781 1940,6746 1981,6697 C 2022,6649 2062,6592 2100,6528 C 2139,6463 2170,6397 2193,6330 C 2216,6264 2227,6201 2227,6143 C 2227,6118 2225,6093 2220,6071 C 2216,6035 2205,6007 2186,5988 C 2167,5970 2143,5960 2113,5960 C 2053,5960 1999,5997 1951,6071 C 1914,6135 1883,6211 1861,6297 C 1838,6384 1825,6470 1823,6557 C 1828,6656 1844,6737 1869,6801 z M 1806,6859 C 1761,6697 1736,6532 1731,6364 C 1732,6256 1743,6155 1764,6061 C 1784,5967 1813,5886 1851,5816 C 1888,5746 1931,5693 1979,5657 C 2022,5625 2053,5608 2070,5608 C 2083,5608 2094,5613 2104,5622 C 2114,5631 2127,5646 2143,5666 C 2262,5835 2322,6039 2322,6277 C 2322,6390 2307,6500 2277,6610 C 2248,6719 2205,6823 2148,6920 C 2090,7018 2022,7103 1943,7176 L 2024,7570 C 2068,7565 2098,7561 2115,7561 C 2191,7561 2259,7577 2322,7609 C 2385,7641 2439,7684 2483,7739 C 2527,7793 2561,7855 2585,7925 C 2608,7995 2621,8068 2621,8144 C 2621,8262 2590,8370 2528,8467 C 2466,8564 2373,8635 2248,8681 C 2256,8730 2270,8801 2291,8892 C 2311,8984 2326,9057 2336,9111 C 2346,9165 2350,9217 2350,9268 C 2350,9347 2331,9417 2293,9479 C 2254,9541 2202,9589 2136,9623 C 2071,9657 1999,9674 1921,9674 C 1811,9674 1715,9643 1633,9582 C 1551,9520 1507,9437 1503,9331 C 1506,9284 1517,9240 1537,9198 C 1557,9156 1584,9122 1619,9096 C 1653,9069 1694,9055 1741,9052 C 1780,9052 1817,9063 1852,9084 C 1886,9106 1914,9135 1935,9172 C 1955,9209 1966,9250 1966,9294 C 1966,9353 1946,9403 1906,9444 C 1866,9485 1815,9506 1754,9506 L 1731,9506 C 1770,9566 1834,9597 1923,9597 C 1968,9597 2014,9587 2060,9569 C 2107,9550 2146,9525 2179,9493 C 2212,9461 2234,9427 2243,9391 C 2260,9350 2268,9293 2268,9222 C 2268,9174 2263,9126 2254,9078 C 2245,9031 2231,8968 2212,8890 C 2193,8813 2179,8753 2171,8712 C 2111,8727 2049,8735 1984,8735 C 1875,8735 1772,8713 1675,8668 C 1578,8623 1493,8561 1419,8481 C 1346,8401 1289,8311 1248,8209 C 1208,8108 1187,8002 1186,7892 C 1190,7790 1209,7692 1245,7600 C 1281,7507 1327,7419 1384,7337 C 1441,7255 1500,7180 1561,7113 C 1623,7047 1704,6962 1806,6859 z " />
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
