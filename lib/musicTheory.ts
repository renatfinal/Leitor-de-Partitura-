// lib/musicTheory.ts
// Comprehensive music theory definitions for sheet music reading game

export type ClefType = 'sol' | 'fa' | 'do';
export type NoteFormat = 'latin' | 'ciphers';
export type GameSpeed =
  | 'progressive'
  | 'semibreve'
  | 'minima'
  | 'seminima'
  | 'colcheia'
  | 'semicolcheia'
  | 'fusa'
  | 'unlimited';

export type LedgerLinesSetting = 0 | 1 | 2 | 3;

export interface GameSettings {
  soundEnabled: boolean;
  clef: ClefType;
  speed: GameSpeed;
  ledgerLines: LedgerLinesSetting;
  noteFormat: NoteFormat;
  maxMistakes: number; // e.g. 3 mistakes allowed before game over (or unlimited)
}

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  clef: 'sol',
  speed: 'progressive',
  ledgerLines: 1,
  noteFormat: 'latin',
  maxMistakes: 3,
};

export interface NoteDefinition {
  id: string; // e.g. "C4", "A5"
  nameLatin: 'DÓ' | 'RÉ' | 'MI' | 'FÁ' | 'SOL' | 'LÁ' | 'SI';
  nameCipher: 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
  octave: number;
  frequency: number; // in Hz
  // Diatonic step relative to the bottom line (line 1) of the 5-line staff:
  // step 0 = Line 1
  // step 1 = Space 1
  // step 2 = Line 2
  // step 3 = Space 2
  // step 4 = Line 3
  // step 5 = Space 3
  // step 6 = Line 4
  // step 7 = Space 4
  // step 8 = Line 5 (top line)
  // Negative steps are below line 1:
  // step -1 = Space below line 1
  // step -2 = 1st ledger line below (e.g. C4 in Treble clef)
  // step -3 = Space below 1st ledger line
  // step -4 = 2nd ledger line below
  // step -5 = Space below 2nd ledger line
  // step -6 = 3rd ledger line below
  // Positive steps above line 5:
  // step 9 = Space above line 5
  // step 10 = 1st ledger line above (e.g. A5 in Treble clef)
  // step 11 = Space above 1st ledger line
  // step 12 = 2nd ledger line above (e.g. C6 in Treble clef)
  // step 13 = Space above 2nd ledger line
  // step 14 = 3rd ledger line above (e.g. E6 in Treble clef)
  clefSteps: {
    sol: number;
    fa: number;
    do: number;
  };
}

export const SPEED_CONFIG: Record<
  GameSpeed,
  { label: string; initialSeconds: number; name: string }
> = {
  progressive: {
    label: 'Progressiva',
    initialSeconds: 5.0,
    name: 'Progressiva',
  },
  semibreve: {
    label: '1 - Semibreve',
    initialSeconds: 4.0,
    name: 'Semibreve (~4s)',
  },
  minima: {
    label: '2 - Mínima',
    initialSeconds: 3.0,
    name: 'Mínima (~3s)',
  },
  seminima: {
    label: '3 - Semínima',
    initialSeconds: 2.0,
    name: 'Semínima (~2s)',
  },
  colcheia: {
    label: '4 - Colcheia',
    initialSeconds: 1.5,
    name: 'Colcheia (~1.5s)',
  },
  semicolcheia: {
    label: '5 - Semicolcheia',
    initialSeconds: 1.0,
    name: 'Semicolcheia (~1s)',
  },
  fusa: {
    label: '6 - Fusa',
    initialSeconds: 0.75,
    name: 'Fusa (~0.75s)',
  },
  unlimited: {
    label: 'Treino Livre (Sem tempo)',
    initialSeconds: 0,
    name: 'Sem limite',
  },
};

export const NOTE_NAMES_LATIN = ['DÓ', 'RÉ', 'MI', 'FÁ', 'SOL', 'LÁ', 'SI'] as const;
export const NOTE_NAMES_CIPHER = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;

export const NOTE_MAP: { latin: string; cipher: string }[] = [
  { latin: 'DÓ', cipher: 'C' },
  { latin: 'RÉ', cipher: 'D' },
  { latin: 'MI', cipher: 'E' },
  { latin: 'FÁ', cipher: 'F' },
  { latin: 'SOL', cipher: 'G' },
  { latin: 'LÁ', cipher: 'A' },
  { latin: 'SI', cipher: 'B' },
];

// All standard natural diatonic notes across octaves 2 to 6
export const ALL_NOTES: NoteDefinition[] = [
  // Octave 2
  { id: 'C2', nameLatin: 'DÓ', nameCipher: 'C', octave: 2, frequency: 65.41, clefSteps: { sol: -16, fa: -4, do: -10 } },
  { id: 'D2', nameLatin: 'RÉ', nameCipher: 'D', octave: 2, frequency: 73.42, clefSteps: { sol: -15, fa: -3, do: -9 } },
  { id: 'E2', nameLatin: 'MI', nameCipher: 'E', octave: 2, frequency: 82.41, clefSteps: { sol: -14, fa: -2, do: -8 } },
  { id: 'F2', nameLatin: 'FÁ', nameCipher: 'F', octave: 2, frequency: 87.31, clefSteps: { sol: -13, fa: -1, do: -7 } },
  { id: 'G2', nameLatin: 'SOL', nameCipher: 'G', octave: 2, frequency: 98.00, clefSteps: { sol: -12, fa: 0, do: -6 } },
  { id: 'A2', nameLatin: 'LÁ', nameCipher: 'A', octave: 2, frequency: 110.00, clefSteps: { sol: -11, fa: 1, do: -5 } },
  { id: 'B2', nameLatin: 'SI', nameCipher: 'B', octave: 2, frequency: 123.47, clefSteps: { sol: -10, fa: 2, do: -4 } },

  // Octave 3
  { id: 'C3', nameLatin: 'DÓ', nameCipher: 'C', octave: 3, frequency: 130.81, clefSteps: { sol: -9, fa: 3, do: -3 } },
  { id: 'D3', nameLatin: 'RÉ', nameCipher: 'D', octave: 3, frequency: 146.83, clefSteps: { sol: -8, fa: 4, do: -2 } },
  { id: 'E3', nameLatin: 'MI', nameCipher: 'E', octave: 3, frequency: 164.81, clefSteps: { sol: -7, fa: 5, do: -1 } },
  { id: 'F3', nameLatin: 'FÁ', nameCipher: 'F', octave: 3, frequency: 174.61, clefSteps: { sol: -6, fa: 6, do: 0 } },
  { id: 'G3', nameLatin: 'SOL', nameCipher: 'G', octave: 3, frequency: 196.00, clefSteps: { sol: -5, fa: 7, do: 1 } },
  { id: 'A3', nameLatin: 'LÁ', nameCipher: 'A', octave: 3, frequency: 220.00, clefSteps: { sol: -4, fa: 8, do: 2 } },
  { id: 'B3', nameLatin: 'SI', nameCipher: 'B', octave: 3, frequency: 246.94, clefSteps: { sol: -3, fa: 9, do: 3 } },

  // Octave 4
  { id: 'C4', nameLatin: 'DÓ', nameCipher: 'C', octave: 4, frequency: 261.63, clefSteps: { sol: -2, fa: 10, do: 4 } }, // Dó central!
  { id: 'D4', nameLatin: 'RÉ', nameCipher: 'D', octave: 4, frequency: 293.66, clefSteps: { sol: -1, fa: 11, do: 5 } },
  { id: 'E4', nameLatin: 'MI', nameCipher: 'E', octave: 4, frequency: 329.63, clefSteps: { sol: 0, fa: 12, do: 6 } },  // Treble Line 1
  { id: 'F4', nameLatin: 'FÁ', nameCipher: 'F', octave: 4, frequency: 349.23, clefSteps: { sol: 1, fa: 13, do: 7 } },
  { id: 'G4', nameLatin: 'SOL', nameCipher: 'G', octave: 4, frequency: 392.00, clefSteps: { sol: 2, fa: 14, do: 8 } },  // Treble Line 2 (G-line)
  { id: 'A4', nameLatin: 'LÁ', nameCipher: 'A', octave: 4, frequency: 440.00, clefSteps: { sol: 3, fa: 15, do: 9 } },
  { id: 'B4', nameLatin: 'SI', nameCipher: 'B', octave: 4, frequency: 493.88, clefSteps: { sol: 4, fa: 16, do: 10 } }, // Treble Line 3

  // Octave 5
  { id: 'C5', nameLatin: 'DÓ', nameCipher: 'C', octave: 5, frequency: 523.25, clefSteps: { sol: 5, fa: 17, do: 11 } },
  { id: 'D5', nameLatin: 'RÉ', nameCipher: 'D', octave: 5, frequency: 587.33, clefSteps: { sol: 6, fa: 18, do: 12 } }, // Treble Line 4
  { id: 'E5', nameLatin: 'MI', nameCipher: 'E', octave: 5, frequency: 659.25, clefSteps: { sol: 7, fa: 19, do: 13 } },
  { id: 'F5', nameLatin: 'FÁ', nameCipher: 'F', octave: 5, frequency: 698.46, clefSteps: { sol: 8, fa: 20, do: 14 } }, // Treble Line 5
  { id: 'G5', nameLatin: 'SOL', nameCipher: 'G', octave: 5, frequency: 783.99, clefSteps: { sol: 9, fa: 21, do: 15 } }, // Space above line 5
  { id: 'A5', nameLatin: 'LÁ', nameCipher: 'A', octave: 5, frequency: 880.00, clefSteps: { sol: 10, fa: 22, do: 16 } }, // 1st ledger line above!
  { id: 'B5', nameLatin: 'SI', nameCipher: 'B', octave: 5, frequency: 987.77, clefSteps: { sol: 11, fa: 23, do: 17 } },

  // Octave 6
  { id: 'C6', nameLatin: 'DÓ', nameCipher: 'C', octave: 6, frequency: 1046.50, clefSteps: { sol: 12, fa: 24, do: 18 } }, // 2nd ledger line above!
  { id: 'D6', nameLatin: 'RÉ', nameCipher: 'D', octave: 6, frequency: 1174.66, clefSteps: { sol: 13, fa: 25, do: 19 } },
  { id: 'E6', nameLatin: 'MI', nameCipher: 'E', octave: 6, frequency: 1318.51, clefSteps: { sol: 14, fa: 26, do: 20 } }, // 3rd ledger line above!
];

/**
 * Filter available notes based on clef and ledger line count setting.
 * In a 5-line staff:
 * Inner notes are step 0 to step 8 (Line 1 to Line 5).
 * - 0 ledger lines: steps 0 to 8
 * - 1 ledger line: steps -2 to 10
 * - 2 ledger lines: steps -4 to 12
 * - 3 ledger lines: steps -6 to 14
 */
export function getAvailableNotes(clef: ClefType, ledgerLines: LedgerLinesSetting): NoteDefinition[] {
  const minStep = -2 * ledgerLines;
  const maxStep = 8 + 2 * ledgerLines;

  return ALL_NOTES.filter((note) => {
    const step = note.clefSteps[clef];
    return step >= minStep && step <= maxStep;
  });
}

/**
 * Returns ledger lines needed for a given step.
 * For example, in step -2, returns [-2]
 * For step -4, returns [-2, -4]
 * For step 10, returns [10]
 * For step 12, returns [10, 12]
 */
export function getLedgerLinesForStep(step: number): number[] {
  const lines: number[] = [];

  // Below line 1 (even numbers -2, -4, -6...)
  if (step < 0) {
    let currentLine = -2;
    while (currentLine >= step - (step % 2 !== 0 ? 1 : 0)) {
      lines.push(currentLine);
      currentLine -= 2;
    }
  }

  // Above line 5 (even numbers 10, 12, 14...)
  if (step > 8) {
    let currentLine = 10;
    while (currentLine <= step + (step % 2 !== 0 ? 1 : 0)) {
      lines.push(currentLine);
      currentLine += 2;
    }
  }

  return lines;
}

/**
 * Returns human-readable description of note position on the staff
 */
export function getStaffPositionDescription(step: number): string {
  switch (step) {
    case 0:
      return '1ª Linha';
    case 1:
      return '1º Espaço';
    case 2:
      return '2ª Linha';
    case 3:
      return '2º Espaço';
    case 4:
      return '3ª Linha';
    case 5:
      return '3º Espaço';
    case 6:
      return '4ª Linha';
    case 7:
      return '4º Espaço';
    case 8:
      return '5ª Linha';
    case -1:
      return 'Espaço abaixo da 1ª linha';
    case -2:
      return '1ª Linha suplementar inferior';
    case -3:
      return '1º Espaço suplementar inferior';
    case -4:
      return '2ª Linha suplementar inferior';
    case -5:
      return '2º Espaço suplementar inferior';
    case -6:
      return '3ª Linha suplementar inferior';
    case 9:
      return 'Espaço acima da 5ª linha';
    case 10:
      return '1ª Linha suplementar superior';
    case 11:
      return '1º Espaço suplementar superior';
    case 12:
      return '2ª Linha suplementar superior';
    case 13:
      return '2º Espaço suplementar superior';
    case 14:
      return '3ª Linha suplementar superior';
    default:
      if (step < 0) return `${Math.abs(Math.round(step / 2))}ª Linha suplementar inferior`;
      return `${Math.round((step - 8) / 2)}ª Linha suplementar superior`;
  }
}

/**
 * Clef information for display and teaching
 */
export const CLEF_CONFIG: Record<
  ClefType,
  {
    name: string;
    description: string;
    referenceLine: string;
    referenceNote: string;
    subtitle: string;
  }
> = {
  sol: {
    name: 'Clave de Sol',
    description: 'Fixa a nota SOL na 2ª linha da pauta. Utilizada para vozes agudas e instrumentos como violino, flauta, violão e mão direita do piano.',
    referenceLine: '2ª Linha',
    referenceNote: 'SOL 4 (392 Hz)',
    subtitle: 'Sol',
  },
  fa: {
    name: 'Clave de Fá na 4ª linha',
    description: 'Fixa a nota FÁ na 4ª linha da pauta. Utilizada para vozes graves e instrumentos como violoncelo, contrabaixo, trombone e mão esquerda do piano.',
    referenceLine: '4ª Linha',
    referenceNote: 'FÁ 3 (174.6 Hz)',
    subtitle: 'Fá 4ª linha',
  },
  do: {
    name: 'Clave de Dó na 3ª linha',
    description: 'Fixa a nota DÓ na 3ª linha (Dó Central - C4). Utilizada principalmente pela viola de arco e trombones tenores.',
    referenceLine: '3ª Linha',
    referenceNote: 'DÓ 4 (261.6 Hz - Central)',
    subtitle: 'Dó 3ª linha',
  },
};
