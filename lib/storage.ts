// lib/storage.ts
'use client';

import { useSyncExternalStore, useCallback } from 'react';
import { GameSettings, DEFAULT_SETTINGS } from './musicTheory';

const SETTINGS_KEY = 'music_game_settings';
const SETTINGS_EVENT = 'music_game_settings_updated';

// Default snapshot string for SSR and fallback
const defaultSettingsStr = JSON.stringify(DEFAULT_SETTINGS);

function subscribeSettings(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  window.addEventListener('storage', callback);
  window.addEventListener(SETTINGS_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(SETTINGS_EVENT, callback);
  };
}

function getSettingsSnapshot(): string {
  if (typeof window === 'undefined') return defaultSettingsStr;
  try {
    return localStorage.getItem(SETTINGS_KEY) || defaultSettingsStr;
  } catch {
    return defaultSettingsStr;
  }
}

function getSettingsServerSnapshot(): string {
  return defaultSettingsStr;
}

export function useGameSettings(): [GameSettings, (newSettings: GameSettings) => void] {
  const settingsStr = useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    getSettingsServerSnapshot
  );

  let currentSettings: GameSettings = DEFAULT_SETTINGS;
  try {
    currentSettings = { ...DEFAULT_SETTINGS, ...JSON.parse(settingsStr) };
  } catch {
    currentSettings = DEFAULT_SETTINGS;
  }

  const setSettings = useCallback((newSettings: GameSettings) => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      window.dispatchEvent(new Event(SETTINGS_EVENT));
    } catch {
      // Ignore
    }
  }, []);

  return [currentSettings, setSettings];
}
