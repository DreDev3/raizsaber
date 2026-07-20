'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme === 'dark' || (!savedTheme && systemPrefersDark) ? 'dark' : 'light';

    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (nextTheme: 'light' | 'dark') => {
    const root = document.documentElement;

    root.classList.toggle('dark', nextTheme === 'dark');
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem('theme', nextTheme);
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <Button
      type='button'
      variant='outline'
      size='icon'
      onClick={toggleTheme}
      className=' z-10 rounded-full border-border bg-background/80 shadow-sm backdrop-blur'
      aria-label={`Alternar para tema ${theme === 'dark' ? 'claro' : 'escuro'}`}
    >
      {theme === 'dark' ? <Sun className='size-4' /> : <Moon className='size-4' />}
    </Button>
  );
}
