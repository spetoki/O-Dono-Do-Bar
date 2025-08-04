
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { themes, type Theme, type ThemeName } from '@/lib/themes';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (name: ThemeName) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('zinc');
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') as ThemeName;
    const storedMode = localStorage.getItem('app-mode') as ThemeMode;

    if (storedTheme && themes.find(t => t.name === storedTheme)) {
      setThemeName(storedTheme);
    }
     if (storedMode && ['light', 'dark'].includes(storedMode)) {
      setMode(storedMode);
    }
    setIsMounted(true);
  }, []);
  
  const theme = useMemo(() => themes.find(t => t.name === themeName) || themes[0], [themeName]);

  useEffect(() => {
    if (isMounted) {
      const doc = document.documentElement;
      
      doc.classList.remove(...themes.map(t => t.name), 'dark', 'light');
      doc.classList.add(theme.name);
      doc.classList.add(mode);

      localStorage.setItem('app-theme', theme.name);
      localStorage.setItem('app-mode', mode);
    }
  }, [theme, mode, isMounted]);

  const value = {
    theme,
    setTheme: (name: ThemeName) => {
       const newTheme = themes.find(t => t.name === name);
       if (newTheme) {
        setThemeName(name);
       }
    },
    mode,
    setMode: (newMode: ThemeMode) => {
      if (['light', 'dark'].includes(newMode)) {
        setMode(newMode);
      }
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
