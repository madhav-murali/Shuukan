import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  useEffect(() => {
    const updateTheme = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.auth.updateUser({
            data: { ...user.user_metadata, theme }
          });
        }
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    };

    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    updateTheme();
  }, [theme]);

  // Load theme from user preferences when logged in
  useEffect(() => {
    const loadUserTheme = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.user_metadata?.theme) {
          setTheme(user.user_metadata.theme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadUserTheme();
  }, []);

  return { theme, setTheme };
}