import React from 'react';
import { Activity } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

function Header() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const displayName = user?.user_metadata?.name || 'Guest';

  return (
    <header className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Activity 
              className="text-blue-600 dark:text-blue-400 transform transition-transform group-hover:scale-110" 
              size={32} 
            />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Shuukan</h1>
          </Link>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-300">Hello, {displayName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header