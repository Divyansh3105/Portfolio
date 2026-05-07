import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

const STORAGE_KEY = 'dg-theme';

/** Duration must match the CSS transition length in index.css */
const TRANSITION_DURATION = 450;

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Check localStorage
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored === 'light' || stored === 'dark') return stored;
    // 2. Respect OS preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = () => {
    const root = document.documentElement;
    // Add transition class BEFORE changing the theme so browsers paint it first
    root.classList.add('theme-transitioning');
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
    // Remove after transition completes — keeps normal interactions snappy
    setTimeout(() => root.classList.remove('theme-transitioning'), TRANSITION_DURATION);
  };

  return { theme, toggle, isDark: theme === 'dark' };
}
