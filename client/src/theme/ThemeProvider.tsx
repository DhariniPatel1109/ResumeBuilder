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
  const [isDark, setIsDark] = useState(false); // Default to light theme
  const [customTheme, setCustomTheme] = useState<Theme>(theme);

  // Load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('resume-builder-theme');
    if (savedTheme) {
      try {
        const { isDark: savedIsDark, customTheme: savedCustomTheme } = JSON.parse(savedTheme);
        setIsDark(savedIsDark || false); // Default to false if invalid
        if (savedCustomTheme) {
          setCustomTheme({ ...theme, ...savedCustomTheme });
        }
      } catch (error) {
        console.warn('Failed to parse saved theme, using default light theme');
        setIsDark(false);
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
    console.log('Theme toggle clicked, current isDark:', isDark);
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

  // Debug theme state
  useEffect(() => {
    console.log('Theme state changed:', { isDark, darkClass: isDark ? 'dark' : '' });
  }, [isDark]);

  // Apply dark class to HTML element
  useEffect(() => {
    const htmlElement = document.documentElement;
    console.log('Applying dark mode:', isDark);
    if (isDark) {
      htmlElement.classList.add('dark');
      console.log('Dark class added to HTML');
    } else {
      htmlElement.classList.remove('dark');
      console.log('Dark class removed from HTML');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
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
