/**
 * Theme Provider - Global theme management
 * Provides theme context to all components
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { theme, Theme } from './index';

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  setTheme: (theme: Partial<Theme>) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [customTheme, setCustomTheme] = useState<Theme>(theme);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('resume-builder-theme');
    if (savedTheme) {
      const { isDark: savedIsDark, customTheme: savedCustomTheme } = JSON.parse(savedTheme);
      setIsDark(savedIsDark);
      if (savedCustomTheme) {
        setCustomTheme({ ...theme, ...savedCustomTheme });
      }
    }
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    localStorage.setItem('resume-builder-theme', JSON.stringify({
      isDark,
      customTheme: customTheme !== theme ? customTheme : null
    }));
  }, [isDark, customTheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const setTheme = (newTheme: Partial<Theme>) => {
    setCustomTheme(prev => ({ ...prev, ...newTheme }));
  };

  const value: ThemeContextType = {
    theme: customTheme,
    isDark,
    toggleTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <div className={isDark ? 'dark' : ''}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
