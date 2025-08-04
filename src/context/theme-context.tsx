
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { themes, type Theme, type ThemeName, backgroundThemes, type BackgroundTheme, type BackgroundName } from '@/lib/themes';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (name: ThemeName) => void;
  background: BackgroundTheme,
  setBackground: (name: BackgroundName) => void,
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('zinc');
  const [backgroundName, setBackgroundName] = useState<BackgroundName>('default');
  const [mode, setMode] = useState<ThemeMode>('light');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Load theme and mode from localStorage
    const storedTheme = localStorage.getItem('app-theme') as ThemeName;
    const storedBackground = localStorage.getItem('app-background') as BackgroundName;
    const storedMode = localStorage.getItem('app-mode') as ThemeMode;

    if (storedTheme && themes.find(t => t.name === storedTheme)) {
      setThemeName(storedTheme);
    }
    if (storedBackground && backgroundThemes.find(b => b.name === storedBackground)) {
      setBackgroundName(storedBackground);
    }
     if (storedMode && ['light', 'dark'].includes(storedMode)) {
      setMode(storedMode);
    }
    setIsMounted(true);
  }, []);
  
  const theme = useMemo(() => themes.find(t => t.name === themeName) || themes[0], [themeName]);
  const background = useMemo(() => backgroundThemes.find(b => b.name === backgroundName) || backgroundThemes[0], [backgroundName]);

  useEffect(() => {
    if (isMounted) {
      const doc = document.documentElement;
      
      // Handle theme color class
      doc.classList.remove(...themes.map(t => t.name));
      doc.classList.add(theme.name);
      localStorage.setItem('app-theme', theme.name);
      
      // Handle dark/light mode class
      if (mode === 'dark') {
        doc.classList.add('dark');
         // Reset light mode custom properties
        doc.style.removeProperty('--background');
        doc.style.removeProperty('--card');
        doc.style.removeProperty('--popover');
      } else {
        doc.classList.remove('dark');
        // Apply light-mode background variables
        doc.style.setProperty('--background', `hsl(${background.light.background})`);
        doc.style.setProperty('--card', 'hsl(0 0% 100%)'); // Always white in light mode
        doc.style.setProperty('--popover', 'hsl(0 0% 100%)'); // Always white in light mode
      }
      localStorage.setItem('app-mode', mode);
      localStorage.setItem('app-background', background.name);

    }
  }, [theme, mode, background, isMounted]);

  const value = {
    theme,
    setTheme: (name: ThemeName) => {
       const newTheme = themes.find(t => t.name === name);
       if (newTheme) {
        setThemeName(name);
       }
    },
    background,
    setBackground: (name: BackgroundName) => {
       const newBackground = backgroundThemes.find(t => t.name === name);
       if (newBackground) {
        setBackgroundName(name);
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
    // Render nothing or a loader until the theme is mounted to prevent flash of default theme
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
