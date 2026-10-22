// components/LearnNotesModal.tsx
'use client';

import React, { useState } from 'react';
import {
  ClefType,
  NoteDefinition,
  getAvailableNotes,
  CLEF_CONFIG,
  getStaffPositionDescription,
} from '@/lib/musicTheory';
import { StaffView } from '@/components/StaffView';
import { synth } from '@/lib/audioSynth';
import { Volume2, BookOpen, Sparkles } from 'lucide-react';

interface LearnNotesModalProps {
  onClose: () => void;
}

export const LearnNotesModal: React.FC<LearnNotesModalProps> = ({ onClose }) => {
  const [clef, setClef] = useState<ClefType>('sol');
  const [selectedNote, setSelectedNote] = useState<NoteDefinition | null>(null);

  const notes = getAvailableNotes(clef, 1);

  // Set default note on clef change
  const handleClefChange = (newClef: ClefType) => {
    synth.playClick();
    setClef(newClef);
    const newNotes = getAvailableNotes(newClef, 1);
    const midNote = newNotes[Math.floor(newNotes.length / 2)];
    setSelectedNote(midNote);
  };

  const handleNoteClick = (note: NoteDefinition) => {
    synth.playClick();
    setSelectedNote(note);
    synth.playNote(note.frequency, 0.9);
  };

  const currentDisplayNote = selectedNote || notes[Math.floor(notes.length / 2)];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div
        className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl border border-amber-900/40 my-auto text-stone-900"
        style={{
          background: 'linear-gradient(180deg, #b67332 0%, #874b1e 40%, #582e0e 100%)',
        }}
      >
        {/* Header */}
        <div className="pt-6 pb-4 px-6 text-center border-b border-amber-950/20 bg-black/15">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="w-6 h-6 text-amber-300" />
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              Conhecendo as Notas
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-amber-200/90 max-w-md mx-auto">
            Selecione uma clave e clique em cada nota para ouvir sua frequência e aprender sua posição na pauta musical.
          </p>
        </div>

        {/* Inner Content */}
        <div
          className="p-5 sm:p-6 space-y-5"
          style={{
            background: 'linear-gradient(180deg, #ede0cf 0%, #f4e9d8 100%)',
          }}
        >
          {/* Clef selector tabs */}
          <div className="flex items-center justify-center gap-2">
            {[
              { id: 'sol' as ClefType, label: 'Clave de Sol' },
              { id: 'fa' as ClefType, label: 'Clave de Fá' },
              { id: 'do' as ClefType, label: 'Clave de Dó' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleClefChange(item.id)}
                className={`py-2 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all shadow-xs ${
                  clef === item.id
                    ? 'bg-amber-900 text-white shadow-md ring-2 ring-amber-600'
                    : 'bg-stone-300/80 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Clef Description Card */}
          <div className="bg-amber-100/60 p-3 rounded-lg border border-amber-200 text-xs text-stone-700 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-950 font-bold block mb-0.5">
                {CLEF_CONFIG[clef].name} ({CLEF_CONFIG[clef].referenceLine})
              </strong>
              <span>{CLEF_CONFIG[clef].description}</span>
            </div>
          </div>

          {/* Staff Display - clean and unobstructed */}
          <div className="relative">
            <StaffView
              currentNote={currentDisplayNote}
              clef={clef}
              showNoteName={false}
              format="latin"
            />
          </div>

          {/* Note details card - placed safely below the staff */}
          <div className="p-3.5 bg-stone-800 text-white rounded-xl shadow-md border border-stone-700 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-400 font-bold uppercase tracking-wider block">
                  Nota Selecionada
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl font-black text-white">
                    {currentDisplayNote.nameLatin}
                  </span>
                  <span className="text-lg font-bold text-amber-300">
                    ({currentDisplayNote.nameCipher})
                  </span>
                  <span className="text-xs text-stone-300 font-mono">
                    {currentDisplayNote.id} · {currentDisplayNote.frequency.toFixed(1)} Hz
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => synth.playNote(currentDisplayNote.frequency, 1.2)}
                className="py-2.5 px-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <Volume2 className="w-4 h-4" /> Tocar Som
              </button>
            </div>

            {/* Position indicator */}
            <div className="pt-2 border-t border-stone-700/80 flex items-center justify-between text-xs">
              <span className="text-stone-300">
                Posição na Pauta:
              </span>
              <strong className="text-amber-200 font-bold bg-stone-900/80 px-2.5 py-0.5 rounded border border-stone-700">
                {getStaffPositionDescription(currentDisplayNote.clefSteps[clef])}
              </strong>
            </div>
          </div>

          {/* Horizontal scrollable note chips */}
          <div>
            <span className="block text-xs font-bold text-stone-700 mb-2">
              Clique em uma nota para visualizar:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-stone-200/50 rounded-lg border border-stone-300">
              {notes.map((note) => {
                const isSelected = selectedNote?.id === note.id;
                return (
                  <button
                    key={note.id}
                    onClick={() => handleNoteClick(note)}
                    className={`py-1.5 px-2.5 rounded-md text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-800 text-white shadow-md scale-105'
                        : 'bg-white hover:bg-amber-50 text-stone-800 border border-stone-300'
                    }`}
                  >
                    <span>{note.nameLatin}</span>
                    <span className="text-[10px] text-stone-500 ml-1 font-mono">
                      {note.octave}
                    </span>
                  </button>
                );
              })}
            </div>
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
