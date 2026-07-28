import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '@/lib/dataStore';
import { STORAGE_KEYS } from '@/lib/constants';

const ThemeContext = createContext({ isDark: false, toggleTheme: () => {} });

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = storage.get(STORAGE_KEYS.SETTINGS, { theme: 'light' });
    return saved.theme === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    const settings = storage.get(STORAGE_KEYS.SETTINGS, {});
    storage.set(STORAGE_KEYS.SETTINGS, { ...settings, theme: isDark ? 'dark' : 'light' });
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
      <ThemeContext.Provider value={{ isDark, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);