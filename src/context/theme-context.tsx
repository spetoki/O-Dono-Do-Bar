
'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { themes, type Theme, type ThemeName } from '@/lib/themes';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>('red');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('app-theme') as ThemeName;
    if (storedTheme && themes.find(t => t.name === storedTheme)) {
      setThemeName(storedTheme);
    }
    setIsMounted(true);
  }, []);
  
  const theme = useMemo(() => themes.find(t => t.name === themeName) || themes[0], [themeName]);

  useEffect(() => {
    if (isMounted) {
      document.documentElement.classList.remove(...themes.map(t => t.name));
      document.documentElement.classList.add(theme.name);
      localStorage.setItem('app-theme', theme.name);
    }
  }, [theme, isMounted]);

  const value = {
    theme,
    setTheme: (name: ThemeName) => {
       const newTheme = themes.find(t => t.name === name);
       if (newTheme) {
        setThemeName(name);
       }
    },
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
