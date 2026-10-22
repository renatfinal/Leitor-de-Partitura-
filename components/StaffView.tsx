// components/StaffView.tsx
'use client';

import React from 'react';
import { ClefType, NoteDefinition, getLedgerLinesForStep } from '@/lib/musicTheory';
import { motion, AnimatePresence } from 'motion/react';

interface StaffViewProps {
  currentNote: NoteDefinition | null;
  clef: ClefType;
  feedbackState?: 'idle' | 'correct' | 'wrong' | 'timeout';
  showNoteName?: boolean;
  format?: 'latin' | 'ciphers';
  className?: string;
  revealedAnswer?: string | null;
}

export const StaffView: React.FC<StaffViewProps> = ({
  currentNote,
  clef,
  feedbackState = 'idle',
  showNoteName = false,
  format = 'latin',
  className = '',
  revealedAnswer = null,
}) => {
  // SVG dimensions
  const width = 680;
  const height = 240;

  // Staff line geometry: 5 lines, line 1 (bottom) at Y=160, line 5 (top) at Y=80
  // Each diatonic step is 10px vertically
  const lineSpacing = 20;
  const bottomLineY = 160;
  const staffLines = [0, 1, 2, 3, 4].map((i) => bottomLineY - i * lineSpacing);

  const step = currentNote ? currentNote.clefSteps[clef] : 4;
  const noteY = bottomLineY - step * 10;
  // Position of the note horizontally on the staff
  const noteX = 460;

  // Ledger lines calculation
  const ledgerSteps = getLedgerLinesForStep(step);

  return (
    <div
      className={`relative w-full select-none overflow-hidden rounded-xl border border-amber-900/30 shadow-md ${className}`}
      style={{
        // Replicating the warm light pine/parchment wood background from the screenshots
        background: 'linear-gradient(180deg, #ede1cf 0%, #f4ebd9 40%, #e8dcbf 100%)',
      }}
    >
      {/* Subtle wood grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25 mix-blend-multiply"
        style={{
          backgroundImage: `repeating-linear-gradient(
            90deg,
            rgba(180, 140, 90, 0.05) 0px,
            rgba(180, 140, 90, 0.05) 2px,
            transparent 2px,
            transparent 8px
          ), repeating-linear-gradient(
            0deg,
            rgba(160, 110, 60, 0.04) 0px,
            rgba(160, 110, 60, 0.04) 1px,
            transparent 1px,
            transparent 24px
          )`,
        }}
      />

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[300px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <filter id="note-glow-correct" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#22c55e" floodOpacity="0.8" />
          </filter>
          <filter id="note-glow-wrong" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* 5 Main Staff Lines */}
        {staffLines.map((y, index) => (
          <line
            key={index}
            x1="30"
            y1={y}
            x2={width - 25}
            y2={y}
            stroke="#1c1917"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        ))}

        {/* Staff vertical bar lines (measures) on left and right */}
        {/* Start bar line */}
        <line x1="30" y1="80" x2="30" y2="160" stroke="#1c1917" strokeWidth="3" />
        {/* End double bar line */}
        <line x1={width - 32} y1="80" x2={width - 32} y2="160" stroke="#1c1917" strokeWidth="2" />
        <line x1={width - 25} y1="80" x2={width - 25} y2="160" stroke="#1c1917" strokeWidth="4.5" />

        {/* Clefs */}
        {clef === 'sol' && (
          <g transform="translate(8, -136) scale(0.03387)" fill="#1c1917">
            {/* Authentic classical Treble Clef (G-clef) with spiral wrapping Line 2 (Sol) */}
            <path d="M 2002,7851 C 1941,7868 1886,7906 1835,7964 C 1784,8023 1759,8088 1759,8158 C 1759,8202 1774,8252 1803,8305 C 1832,8359 1876,8398 1933,8423 C 1952,8427 1961,8437 1961,8451 C 1961,8456 1954,8461 1937,8465 C 1846,8442 1771,8393 1713,8320 C 1655,8246 1625,8162 1623,8066 C 1626,7963 1657,7867 1716,7779 C 1776,7690 1853,7627 1947,7590 L 1878,7235 C 1724,7363 1599,7496 1502,7636 C 1405,7775 1355,7926 1351,8089 C 1353,8162 1368,8233 1396,8301 C 1424,8370 1466,8432 1522,8489 C 1635,8602 1782,8661 1961,8667 C 2022,8663 2087,8652 2157,8634 L 2002,7851 z M 2074,7841 L 2230,8610 C 2384,8548 2461,8413 2461,8207 C 2452,8138 2432,8076 2398,8021 C 2365,7965 2321,7921 2265,7889 C 2209,7857 2146,7841 2074,7841 z M 1869,6801 C 1902,6781 1940,6746 1981,6697 C 2022,6649 2062,6592 2100,6528 C 2139,6463 2170,6397 2193,6330 C 2216,6264 2227,6201 2227,6143 C 2227,6118 2225,6093 2220,6071 C 2216,6035 2205,6007 2186,5988 C 2167,5970 2143,5960 2113,5960 C 2053,5960 1999,5997 1951,6071 C 1914,6135 1883,6211 1861,6297 C 1838,6384 1825,6470 1823,6557 C 1828,6656 1844,6737 1869,6801 z M 1806,6859 C 1761,6697 1736,6532 1731,6364 C 1732,6256 1743,6155 1764,6061 C 1784,5967 1813,5886 1851,5816 C 1888,5746 1931,5693 1979,5657 C 2022,5625 2053,5608 2070,5608 C 2083,5608 2094,5613 2104,5622 C 2114,5631 2127,5646 2143,5666 C 2262,5835 2322,6039 2322,6277 C 2322,6390 2307,6500 2277,6610 C 2248,6719 2205,6823 2148,6920 C 2090,7018 2022,7103 1943,7176 L 2024,7570 C 2068,7565 2098,7561 2115,7561 C 2191,7561 2259,7577 2322,7609 C 2385,7641 2439,7684 2483,7739 C 2527,7793 2561,7855 2585,7925 C 2608,7995 2621,8068 2621,8144 C 2621,8262 2590,8370 2528,8467 C 2466,8564 2373,8635 2248,8681 C 2256,8730 2270,8801 2291,8892 C 2311,8984 2326,9057 2336,9111 C 2346,9165 2350,9217 2350,9268 C 2350,9347 2331,9417 2293,9479 C 2254,9541 2202,9589 2136,9623 C 2071,9657 1999,9674 1921,9674 C 1811,9674 1715,9643 1633,9582 C 1551,9520 1507,9437 1503,9331 C 1506,9284 1517,9240 1537,9198 C 1557,9156 1584,9122 1619,9096 C 1653,9069 1694,9055 1741,9052 C 1780,9052 1817,9063 1852,9084 C 1886,9106 1914,9135 1935,9172 C 1955,9209 1966,9250 1966,9294 C 1966,9353 1946,9403 1906,9444 C 1866,9485 1815,9506 1754,9506 L 1731,9506 C 1770,9566 1834,9597 1923,9597 C 1968,9597 2014,9587 2060,9569 C 2107,9550 2146,9525 2179,9493 C 2212,9461 2234,9427 2243,9391 C 2260,9350 2268,9293 2268,9222 C 2268,9174 2263,9126 2254,9078 C 2245,9031 2231,8968 2212,8890 C 2193,8813 2179,8753 2171,8712 C 2111,8727 2049,8735 1984,8735 C 1875,8735 1772,8713 1675,8668 C 1578,8623 1493,8561 1419,8481 C 1346,8401 1289,8311 1248,8209 C 1208,8108 1187,8002 1186,7892 C 1190,7790 1209,7692 1245,7600 C 1281,7507 1327,7419 1384,7337 C 1441,7255 1500,7180 1561,7113 C 1623,7047 1704,6962 1806,6859 z " />
          </g>
        )}

        {clef === 'fa' && (
          <g transform="translate(48, 75) scale(0.95)" fill="#1c1917">
            {/* Bass Clef (Clave de Fá na 4ª linha) - Line 4 is at Y=100 (relative y=25) */}
            <path d="M12,25 C12,12 22,2 35,2 C49,2 60,13 60,28 C60,46 44,65 18,77 L15,72 C35,62 48,47 48,29 C48,16 40,9 31,9 C23,9 17,15 17,23 C17,27 19,30 22,32 C24,33 25,35 25,38 C25,43 20,46 15,46 C6,46 0,37 0,27 C0,14 8,3 18,1 L19,6 C14,8 12,13 12,25 Z" />
            {/* Two dots flanking Line 4 (Space 4 at Y=90, Space 3 at Y=110) */}
            <circle cx="70" cy="15" r="5" />
            <circle cx="70" cy="35" r="5" />
          </g>
        )}

        {clef === 'do' && (
          <g transform="translate(46, 74) scale(0.92)" fill="#1c1917">
            {/* Alto Clef (Clave de Dó na 3ª linha) - Line 3 is at Y=120 (relative y=46) */}
            <rect x="0" y="6" width="6" height="92" rx="1" />
            <rect x="12" y="6" width="3.5" height="92" rx="0.5" />
            {/* Symmetrical brackets */}
            <path d="M15,6 C28,6 40,16 40,28 C40,40 28,48 20,50 C28,52 40,60 40,72 C40,84 28,94 15,94 L15,84 C24,84 30,77 30,71 C30,64 23,56 15,56 L15,44 C23,44 30,36 30,29 C30,23 24,16 15,16 Z" />
            {/* Center pointer directly marking Line 3 (Dó central) */}
            <polygon points="15,44 26,50 15,56" fill="#1c1917" />
          </g>
        )}

        {/* Ledger Lines for Current Note */}
        {currentNote &&
          ledgerSteps.map((lStep) => {
            const ly = bottomLineY - lStep * 10;
            return (
              <line
                key={`ledger-${lStep}`}
                x1={noteX - 26}
                y1={ly}
                x2={noteX + 26}
                y2={ly}
                stroke="#1c1917"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            );
          })}

        {/* Current Musical Note (Semibreve / Whole note matching the screenshot) */}
        {currentNote && (
          <g
            transform={`translate(${noteX}, ${noteY})`}
            filter={
              feedbackState === 'correct'
                ? 'url(#note-glow-correct)'
                : feedbackState === 'wrong'
                ? 'url(#note-glow-wrong)'
                : undefined
            }
          >
            {/* Authentic Whole Note (Semibreve) Glyph: oval with tilted thick outline */}
            <ellipse
              cx="0"
              cy="0"
              rx="15"
              ry="10.5"
              transform="rotate(-15)"
              fill="#1c1917"
            />
            {/* Hollow oval center */}
            <ellipse
              cx="0"
              cy="0"
              rx="10"
              ry="5.5"
              transform="rotate(-40)"
              fill="#f4ebd9"
            />
          </g>
        )}

        {/* Visual Feedback Overlays on Staff */}
        {feedbackState === 'correct' && (
          <g transform={`translate(${noteX + 50}, ${noteY - 10})`}>
            {/* Big Green 'V' Checkmark as requested */}
            <circle cx="20" cy="10" r="28" fill="#15803d" opacity="0.95" />
            <path
              d="M10,10 L17,17 L30,3"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {(feedbackState === 'wrong' || feedbackState === 'timeout') && (
          <g transform={`translate(${noteX + 50}, ${noteY - 10})`}>
            {/* Big Red 'X' Cross as requested */}
            <circle cx="20" cy="10" r="28" fill="#dc2626" opacity="0.95" />
            <path
              d="M10,0 L30,20 M30,0 L10,20"
              fill="none"
              stroke="#ffffff"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </g>
        )}
      </svg>

      {/* Answer notification bar / reveal banner if wrong or timeout during game - placed at top margin clear of notes */}
      <AnimatePresence>
        {revealedAnswer && currentNote && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-xs sm:text-sm font-semibold tracking-wide shadow-md flex items-center gap-1.5 bg-red-900/95 text-white border border-red-700/60 z-20 pointer-events-none"
          >
            <span>
              Nota correta:{' '}
              <strong className="text-amber-200 font-bold underline">
                {revealedAnswer}
              </strong>{' '}
              ({currentNote.id})
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
