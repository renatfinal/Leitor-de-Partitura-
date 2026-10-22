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
          <g transform="translate(42, 60) scale(0.95)" fill="#1c1917">
            {/* Treble Clef (Clave de Sol) SVG path */}
            <path d="M42.8,118 C40,119.5 36.5,120.2 33,119.4 C25.8,117.8 21.2,110.8 22.8,103.5 C24.1,97.7 29.2,93.5 35.1,93.9 C36.2,94 37.3,94.3 38.3,94.8 L38.3,58 C38.3,42 41.5,23.5 47.8,8.2 C48.5,6.5 50.8,6.2 51.7,7.7 C54.5,12.4 56.4,19.2 55.2,28.5 C54.1,37.2 49.3,52.4 44.5,67.8 L44.5,92.5 C49.2,90.2 54.8,89.5 60.1,91.3 C70,94.7 75.8,104.5 73.6,115 C71.3,125.8 61.6,133.5 50.2,133.2 C44.5,133 39.2,130.6 35.5,126.8 L35.5,135.5 C35.5,145.8 33.1,154 28.5,157.5 C24.5,160.5 19.5,160.2 16.5,157.2 C13.5,154.2 13.5,148.8 17.2,145.5 C20.2,142.8 24.5,143.5 26.2,147 C27,148.6 27,150.8 26.2,152 C28.2,150.2 29.5,145 29.5,136.5 L29.5,123.5 C33.2,127 38.2,129 43.5,128.8 C51.5,128.5 58.5,122.8 60.2,114.5 C61.8,106.5 57.5,99.2 49.8,96.8 C45.5,95.5 40.5,96.5 36.8,99.5 C34.8,101.2 33.5,103.5 33.2,106.2 C32.5,111.5 36.2,116 41.8,116.5 C43.2,116.6 44.5,116.2 45.5,115.5 L42.8,118 Z M44.5,58.5 C47.5,47.2 50.5,35 50.5,25.5 C50.5,18.8 49.2,13.8 47.8,11.2 C44.2,22.2 41.8,37.5 41.8,50 L41.8,67 C42.8,64 43.6,61.2 44.5,58.5 Z" />
          </g>
        )}

        {clef === 'fa' && (
          <g transform="translate(48, 86) scale(0.9)" fill="#1c1917">
            {/* Bass Clef (Clave de Fá na 4ª linha) */}
            <path d="M12,18 C12,8 20,0 32,0 C46,0 56,10 56,26 C56,44 42,62 16,74 L14,70 C34,60 45,46 45,28 C45,16 38,9 29,9 C21,9 15,15 15,22 C15,26 17,29 20,31 C22,32 23,34 23,36 C23,40 19,43 14,43 C6,43 0,34 0,25 C0,13 8,3 18,1 L19,5 C14,7 12,12 12,18 Z" />
            {/* Two dots flanking 4th line */}
            <circle cx="68" cy="8" r="5.5" />
            <circle cx="68" cy="28" r="5.5" />
          </g>
        )}

        {clef === 'do' && (
          <g transform="translate(46, 75) scale(0.85)" fill="#1c1917">
            {/* Alto Clef (Clave de Dó na 3ª linha) */}
            <rect x="0" y="6" width="6" height="92" />
            <rect x="12" y="6" width="3.5" height="92" />
            {/* Top curved bracket */}
            <path d="M15,6 C28,6 40,16 40,28 C40,40 28,48 20,52 C28,56 40,64 40,76 C40,88 28,98 15,98 L15,88 C24,88 30,81 30,75 C30,68 23,60 15,60 L15,44 C23,44 30,36 30,29 C30,23 24,16 15,16 Z" />
            {/* Central arrow pointing directly at Line 3 */}
            <polygon points="15,46 26,52 15,58" fill="#1c1917" />
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
