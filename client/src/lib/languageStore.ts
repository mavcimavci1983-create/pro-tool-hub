import { create } from 'zustand';

type Language = 'en' | 'tr';

interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: (localStorage.getItem('language') as Language) || 'en',
  setLanguage: (lang: Language) => {
    localStorage.setItem('language', lang);
    set({ language: lang });
  },
}));
