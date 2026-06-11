// src/store/useAppStore.ts
import { create } from 'zustand';

interface AppState {
  user: any | null;
  isAuthenticated: boolean;
  isPro: boolean;
  selectedMediaUris: string[];
  editorMode: 'video' | 'photo' | 'collage' | null;

  setUser: (user: any | null) => void;
  setSelectedMedia: (uris: string[]) => void;
  setEditorMode: (mode: 'video' | 'photo' | 'collage' | null) => void;
  clearEditor: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  isPro: false,
  selectedMediaUris: [],
  editorMode: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setSelectedMedia: (uris) => set({ selectedMediaUris: uris }),
  setEditorMode: (mode) => set({ editorMode: mode }),
  clearEditor: () => set({ selectedMediaUris: [], editorMode: null }),
}));