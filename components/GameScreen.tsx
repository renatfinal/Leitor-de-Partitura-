// components/GameScreen.tsx
'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameSettings,
  NoteDefinition,
  getAvailableNotes,
  SPEED_CONFIG,
  NOTE_MAP,
} from '@/lib/musicTheory';
import { StaffView } from '@/components/StaffView';
import { synth } from '@/lib/audioSynth';
import {
  Trophy,
  RotateCcw,
  Home,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Zap,
  Target,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface GameScreenProps {
  settings: GameSettings;
  onExit: () => void;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onRecordResult?: (score: number, accuracy: number, totalNotes: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  settings,
  onExit,
  onRecordResult,
}) => {
  // Initialize available notes pool based on clef and ledger lines using useMemo (derived state)
  const availableNotes = React.useMemo(
    () => getAvailableNotes(settings.clef, settings.ledgerLines),
    [settings.clef, settings.ledgerLines]
  );

  const [currentNote, setCurrentNote] = useState<NoteDefinition | null>(() => {
    const initialPool = getAvailableNotes(settings.clef, settings.ledgerLines);
    return initialPool.length > 0 ? initialPool[Math.floor(Math.random() * initialPool.length)] : null;
  });

  const [score, setScore] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [totalAttempts, setTotalAttempts] = useState<number>(0);
  const [correctAttempts, setCorrectAttempts] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(!settings.soundEnabled);

  // Determine initial time allowed per note
  const initialTime = React.useMemo(() => {
    if (settings.speed === 'unlimited') return 0;
    if (settings.speed === 'progressive') return 5.0;
    return SPEED_CONFIG[settings.speed].initialSeconds;
  }, [settings.speed]);

  // Time remaining for current note (in seconds)
  const [timeRemaining, setTimeRemaining] = useState<number>(initialTime);
  const [maxTimeForNote, setMaxTimeForNote] = useState<number>(initialTime);

  // Feedback state for current interaction: 'idle' | 'correct' | 'wrong' | 'timeout'
  const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong' | 'timeout'>('idle');
  const [lastClickedNote, setLastClickedNote] = useState<string | null>(null);
  const [revealedAnswer, setRevealedAnswer] = useState<string | null>(null);
  const [avgResponseTime, setAvgResponseTime] = useState<number>(0);

  // Reaction time tracking
  const noteStartTimeRef = useRef<number>(0);
  const responseTimesRef = useRef<number[]>([]);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isEvaluatingRef = useRef<boolean>(false);

  // Set initial start time on mount
  useEffect(() => {
    noteStartTimeRef.current = Date.now();
  }, []);

  // Determine time allowed per note
  const calculateTimeForNote = useCallback(
    (currentScore: number) => {
      if (settings.speed === 'unlimited') return 0;

      if (settings.speed === 'progressive') {
        // Starts at 5s, gets progressively faster every 50 points down to 0.9s
        const speedReduction = Math.min(4.1, Math.floor(currentScore / 50) * 0.35);
        return Math.max(0.9, 5.0 - speedReduction);
      }

      return SPEED_CONFIG[settings.speed].initialSeconds;
    },
    [settings.speed]
  );

  // Pick next random note (different from current one)
  const pickNextNote = useCallback(
    (notePool: NoteDefinition[], prevNoteId?: string) => {
      if (notePool.length === 0) return null;
      const candidates = notePool.filter((n) => n.id !== prevNoteId);
      const chosen =
        candidates.length > 0
          ? candidates[Math.floor(Math.random() * candidates.length)]
          : notePool[0];
      return chosen;
    },
    []
  );

  // Advance to next round / note
  const advanceToNextNote = useCallback(() => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    setFeedbackState('idle');
    setLastClickedNote(null);
    setRevealedAnswer(null);
    isEvaluatingRef.current = false;

    if (availableNotes.length === 0) return;

    const next = pickNextNote(availableNotes, currentNote?.id);
    setCurrentNote(next);

    const allowedTime = calculateTimeForNote(score);
    setMaxTimeForNote(allowedTime);
    setTimeRemaining(allowedTime);
    noteStartTimeRef.current = Date.now();
  }, [availableNotes, currentNote, pickNextNote, calculateTimeForNote, score]);

  // Sound muting synchronization
  const toggleSound = () => {
    synth.playClick();
    const nextMuted = !isSoundMuted;
    setIsSoundMuted(nextMuted);
    synth.setMuted(nextMuted);
  };

  // Trigger Game Over
  const triggerGameOver = useCallback(
    (finalScore: number, finalCorrect: number, finalTotal: number) => {
      setIsGameOver(true);
      synth.playGameOver();

      const calculatedAccuracy = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 0;
      if (onRecordResult) {
        onRecordResult(finalScore, calculatedAccuracy, finalTotal);
      }
    },
    [onRecordResult]
  );

  // Handle Timeout
  const handleTimeout = useCallback(() => {
    if (isEvaluatingRef.current || !currentNote) return;
    isEvaluatingRef.current = true;

    synth.playTimeout();
    setFeedbackState('timeout');
    setMistakes((m) => {
      const nextMistakes = m + 1;
      if (nextMistakes >= settings.maxMistakes) {
        setTimeout(() => triggerGameOver(score, correctAttempts, totalAttempts + 1), 600);
      }
      return nextMistakes;
    });
    setStreak(0);
    setTotalAttempts((t) => t + 1);
    setRevealedAnswer(
      settings.noteFormat === 'ciphers' ? currentNote.nameCipher : currentNote.nameLatin
    );

    feedbackTimeoutRef.current = setTimeout(() => {
      if (mistakes + 1 < settings.maxMistakes) {
        advanceToNextNote();
      }
    }, 1100);
  }, [
    currentNote,
    correctAttempts,
    mistakes,
    score,
    settings.maxMistakes,
    settings.noteFormat,
    totalAttempts,
    triggerGameOver,
    advanceToNextNote,
  ]);

  // Stable timeout ref for interval
  const handleTimeoutRef = useRef(handleTimeout);
  useEffect(() => {
    handleTimeoutRef.current = handleTimeout;
  });

  // Timer countdown loop
  useEffect(() => {
    if (isPaused || isGameOver || maxTimeForNote <= 0 || feedbackState !== 'idle') {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0.05) {
          handleTimeoutRef.current();
          return 0;
        }
        return Math.max(0, prev - 0.05);
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, isGameOver, maxTimeForNote, feedbackState]);

  // Evaluate note button press
  const handleNoteSelect = (pressedNoteName: string) => {
    if (isPaused || isGameOver || isEvaluatingRef.current || !currentNote) return;
    isEvaluatingRef.current = true;

    setLastClickedNote(pressedNoteName);
    const timeSpent = Date.now() - noteStartTimeRef.current;
    responseTimesRef.current.push(timeSpent);
    const newAvg = Math.round(
      responseTimesRef.current.reduce((a, b) => a + b, 0) / responseTimesRef.current.length
    );
    setAvgResponseTime(newAvg);

    const isCorrect =
      settings.noteFormat === 'ciphers'
        ? currentNote.nameCipher === pressedNoteName
        : currentNote.nameLatin === pressedNoteName;

    setTotalAttempts((t) => t + 1);

    if (isCorrect) {
      // Correct! Play ding + note pitch
      synth.playCorrect(currentNote.frequency);
      setFeedbackState('correct');

      // Streak calculation & bonus
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }

      // Bonus points for quick answers & streak
      const streakMultiplier = newStreak >= 5 ? 2 : 1;
      const speedBonus = maxTimeForNote > 0 ? Math.round((timeRemaining / maxTimeForNote) * 10) : 5;
      const pointsEarned = (10 + speedBonus) * streakMultiplier;
      setScore((s) => s + pointsEarned);
      setCorrectAttempts((c) => c + 1);

      feedbackTimeoutRef.current = setTimeout(() => {
        advanceToNextNote();
      }, 550);
    } else {
      // Wrong! Play buzz tone + show correct note
      synth.playWrong();
      setFeedbackState('wrong');
      setStreak(0);

      const nextMistakes = mistakes + 1;
      setMistakes(nextMistakes);
      setRevealedAnswer(
        settings.noteFormat === 'ciphers' ? currentNote.nameCipher : currentNote.nameLatin
      );

      if (nextMistakes >= settings.maxMistakes) {
        setTimeout(() => {
          triggerGameOver(score, correctAttempts, totalAttempts + 1);
        }, 900);
      } else {
        feedbackTimeoutRef.current = setTimeout(() => {
          advanceToNextNote();
        }, 1100);
      }
    }
  };

  // Restart Game
  const handleRestart = () => {
    synth.playClick();
    setScore(0);
    setMistakes(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalAttempts(0);
    setCorrectAttempts(0);
    setIsGameOver(false);
    setIsPaused(false);
    setAvgResponseTime(0);
    responseTimesRef.current = [];
    advanceToNextNote();
  };

  // Keep a stable ref for handleNoteSelect to avoid effect churn
  const handleNoteSelectRef = useRef(handleNoteSelect);
  useEffect(() => {
    handleNoteSelectRef.current = handleNoteSelect;
  });

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isGameOver) return;

      const key = e.key.toUpperCase();

      // If note format is Ciphers: C, D, E, F, G, A, B
      if (settings.noteFormat === 'ciphers') {
        if (['C', 'D', 'E', 'F', 'G', 'A', 'B'].includes(key)) {
          handleNoteSelectRef.current(key);
          return;
        }
      }

      // Latin map with 1-7 or standard keys
      const numMap: Record<string, string> = {
        '1': settings.noteFormat === 'ciphers' ? 'C' : 'DÓ',
        '2': settings.noteFormat === 'ciphers' ? 'D' : 'RÉ',
        '3': settings.noteFormat === 'ciphers' ? 'E' : 'MI',
        '4': settings.noteFormat === 'ciphers' ? 'F' : 'FÁ',
        '5': settings.noteFormat === 'ciphers' ? 'G' : 'SOL',
        '6': settings.noteFormat === 'ciphers' ? 'A' : 'LÁ',
        '7': settings.noteFormat === 'ciphers' ? 'B' : 'SI',
      };

      if (numMap[e.key]) {
        handleNoteSelectRef.current(numMap[e.key]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.noteFormat, isPaused, isGameOver]);

  const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 100;

  return (
    <div
      className="relative flex flex-col justify-between min-h-screen w-full select-none"
      style={{
        // Authentic dark cedar/wood texture background matching screenshot
        background: 'linear-gradient(180deg, #3d2110 0%, #2a1509 50%, #4a2815 100%)',
      }}
    >
      {/* Wood texture styling overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(
            0deg,
            rgba(255,255,255,0.03) 0px,
            rgba(255,255,255,0.03) 2px,
            transparent 2px,
            transparent 12px
          )`,
        }}
      />

      {/* TOP HEADER: Points, Speed/Timer, Mistakes - matching screenshot 6f4480cf */}
      <header className="relative z-10 px-4 py-3 sm:px-6 flex items-center justify-between border-b border-amber-950/40 bg-black/25 backdrop-blur-xs">
        {/* Left: Pontos */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              Pontos: {score}
            </span>
            {streak >= 3 && (
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-amber-400" /> Combo x
                {streak >= 5 ? '2' : '1.5'} ({streak} seguidos!)
              </span>
            )}
          </div>
        </div>

        {/* Center: Timer Countdown indicator */}
        {maxTimeForNote > 0 && (
          <div className="flex flex-col items-center max-w-[140px] sm:max-w-[200px] w-full px-2">
            <div className="w-full bg-stone-900/80 rounded-full h-3 border border-stone-600 overflow-hidden shadow-inner">
              <motion.div
                className={`h-full rounded-full transition-all duration-75 ${
                  timeRemaining / maxTimeForNote > 0.5
                    ? 'bg-emerald-500'
                    : timeRemaining / maxTimeForNote > 0.25
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{
                  width: `${Math.min(100, Math.max(0, (timeRemaining / maxTimeForNote) * 100))}%`,
                }}
              />
            </div>
            <span className="text-[11px] text-stone-300 font-mono mt-0.5 tabular-nums">
              {timeRemaining.toFixed(1)}s
            </span>
          </div>
        )}

        {/* Right: Erros & Controls */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-1 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
              <span>Erros:</span>
              <div className="flex gap-1 items-center ml-1">
                {Array.from({ length: Math.min(settings.maxMistakes, 5) }).map((_, i) => (
                  <span
                    key={i}
                    className={`font-bold text-lg sm:text-xl transition-colors ${
                      i < mistakes ? 'text-red-500 scale-110 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]' : 'text-stone-500/60'
                    }`}
                  >
                    ✕
                  </span>
                ))}
              </div>
            </div>
            {settings.maxMistakes > 5 && (
              <span className="text-[10px] text-stone-400">
                {mistakes} / {settings.maxMistakes}
              </span>
            )}
          </div>

          {/* Quick buttons: Mute, Pause, Exit */}
          <div className="flex items-center gap-1 pl-2 border-l border-amber-900/40">
            <button
              onClick={toggleSound}
              title={isSoundMuted ? 'Ativar Som' : 'Silenciar Som'}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800/60 transition-colors"
            >
              {isSoundMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? 'Continuar' : 'Pausar'}
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800/60 transition-colors"
            >
              {isPaused ? <Play className="w-5 h-5 text-emerald-400" /> : <Pause className="w-5 h-5" />}
            </button>
            <button
              onClick={onExit}
              title="Voltar ao Menu"
              className="p-2 text-stone-300 hover:text-white rounded-lg hover:bg-stone-800/60 transition-colors"
            >
              <Home className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN PLAY AREA: Staff View */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-3 sm:p-6 max-w-4xl w-full mx-auto">
        {/* Pause Banner */}
        {isPaused ? (
          <div className="w-full py-16 text-center bg-stone-900/90 rounded-2xl border border-amber-800/60 shadow-xl p-6 text-white space-y-4">
            <h3 className="text-3xl font-bold text-amber-300">Jogo Pausado</h3>
            <p className="text-stone-300 text-sm max-w-md mx-auto">
              Respire fundo. A leitura de partitura é uma habilidade visual que se aprimora a cada tentativa!
            </p>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 mx-auto"
            >
              <Play className="w-4 h-4 fill-white" /> Continuar Partida
            </button>
          </div>
        ) : (
          <div className="w-full">
            {/* Staff notation canvas */}
            <StaffView
              currentNote={currentNote}
              clef={settings.clef}
              feedbackState={feedbackState}
              format={settings.noteFormat}
              revealedAnswer={revealedAnswer}
            />

            {/* Quick Helper Subtitle */}
            <div className="mt-2 flex items-center justify-between text-xs text-amber-200/70 px-2 font-medium">
              <span>
                Clave:{' '}
                <strong className="text-amber-100 uppercase">
                  {settings.clef === 'sol' ? 'Sol' : settings.clef === 'fa' ? 'Fá (4ª l.)' : 'Dó (3ª l.)'}
                </strong>
              </span>
              <span>
                Precisão:{' '}
                <strong className="text-amber-100 font-mono tabular-nums">{accuracy}%</strong>
              </span>
              <span>
                Velocidade:{' '}
                <strong className="text-amber-100">{SPEED_CONFIG[settings.speed].name}</strong>
              </span>
            </div>
          </div>
        )}
      </main>

      {/* BOTTOM BUTTONS BAR: Exactly matching screenshot with DÓ, RÉ, MI, FÁ, SOL, LÁ, SI */}
      <footer
        className="relative z-10 p-3 sm:p-5 border-t border-amber-950/40"
        style={{
          background: 'linear-gradient(180deg, #442412 0%, #30170a 100%)',
        }}
      >
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {NOTE_MAP.map((item, index) => {
              const label = settings.noteFormat === 'ciphers' ? item.cipher : item.latin;
              const isSelected = lastClickedNote === label;
              const isCorrectTarget =
                feedbackState !== 'idle' &&
                (settings.noteFormat === 'ciphers'
                  ? currentNote?.nameCipher === item.cipher
                  : currentNote?.nameLatin === item.latin);

              let buttonColorClass = 'bg-[#64646b] hover:bg-[#52525a] active:bg-[#3f3f46] text-white';

              if (isSelected && feedbackState === 'correct') {
                buttonColorClass = 'bg-emerald-600 text-white shadow-lg ring-2 ring-emerald-300';
              } else if (isSelected && (feedbackState === 'wrong' || feedbackState === 'timeout')) {
                buttonColorClass = 'bg-red-600 text-white shadow-lg ring-2 ring-red-400';
              } else if (isCorrectTarget && (feedbackState === 'wrong' || feedbackState === 'timeout')) {
                buttonColorClass = 'bg-emerald-700/90 text-white animate-pulse ring-2 ring-emerald-400';
              }

              return (
                <button
                  key={item.latin}
                  type="button"
                  onClick={() => handleNoteSelect(label)}
                  disabled={isPaused || isGameOver}
                  className={`py-3.5 sm:py-5 px-1 rounded-md sm:rounded-lg font-bold text-base sm:text-xl tracking-wider text-center shadow-md transition-all active:scale-95 border border-stone-500/40 relative flex flex-col items-center justify-center ${buttonColorClass}`}
                >
                  <span>{label}</span>
                  {/* Subtle hotkey label */}
                  <span className="text-[9px] sm:text-[10px] text-stone-300/60 font-mono font-normal">
                    [{index + 1}]
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </footer>

      {/* GAME OVER MODAL */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border border-amber-900/50 text-stone-900"
              style={{
                background: 'linear-gradient(180deg, #ede0cf 0%, #f4e9d8 100%)',
              }}
            >
              {/* Header */}
              <div className="py-6 px-6 text-center bg-gradient-to-b from-[#6b3512] to-[#452009] text-white border-b border-amber-950">
                <Trophy className="w-12 h-12 mx-auto text-amber-300 mb-2 drop-shadow-md" />
                <h3 className="text-3xl font-extrabold tracking-wide drop-shadow-md">
                  Fim de Partida!
                </h3>
                <p className="text-xs text-amber-200 mt-1">
                  Treino concluído com sucesso na {settings.clef === 'sol' ? 'Clave de Sol' : settings.clef === 'fa' ? 'Clave de Fá' : 'Clave de Dó'}
                </p>
              </div>

              {/* Stats */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-amber-100/70 p-3 rounded-xl border border-stone-300 shadow-xs">
                    <span className="text-xs text-stone-600 block font-medium">Pontuação</span>
                    <strong className="text-3xl font-black text-amber-900 tabular-nums">
                      {score}
                    </strong>
                  </div>

                  <div className="bg-amber-100/70 p-3 rounded-xl border border-stone-300 shadow-xs">
                    <span className="text-xs text-stone-600 block font-medium">Precisão</span>
                    <strong className="text-3xl font-black text-emerald-800 tabular-nums">
                      {accuracy}%
                    </strong>
                  </div>

                  <div className="bg-amber-100/70 p-3 rounded-xl border border-stone-300 shadow-xs">
                    <span className="text-xs text-stone-600 block font-medium">Acertos / Total</span>
                    <strong className="text-xl font-bold text-stone-800 tabular-nums">
                      {correctAttempts} / {totalAttempts}
                    </strong>
                  </div>

                  <div className="bg-amber-100/70 p-3 rounded-xl border border-stone-300 shadow-xs">
                    <span className="text-xs text-stone-600 block font-medium">Maior Sequência</span>
                    <strong className="text-xl font-bold text-amber-800 tabular-nums">
                      {maxStreak} seguidos
                    </strong>
                  </div>
                </div>

                {avgResponseTime > 0 && (
                  <div className="text-center text-xs text-stone-600 font-medium">
                    Tempo médio de resposta:{' '}
                    <span className="font-mono font-bold text-stone-800">
                      {(avgResponseTime / 1000).toFixed(2)}s
                    </span>
                  </div>
                )}

                {accuracy >= 80 && (
                  <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>
                      Excelente precisão! Seu reflexo e leitura visual estão afiados.
                    </span>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="p-5 bg-stone-200/80 border-t border-stone-300 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onExit}
                  className="flex-1 py-3 px-4 bg-stone-600 hover:bg-stone-700 text-white font-bold rounded-lg shadow-sm transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  <Home className="w-4 h-4" /> Menu
                </button>
                <button
                  type="button"
                  onClick={handleRestart}
                  className="flex-1 py-3 px-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-lg shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 text-sm"
                >
                  <RotateCcw className="w-4 h-4" /> Jogar de Novo
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
