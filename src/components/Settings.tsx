import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useTheme } from '../hooks/useTheme';

interface SettingsProps {
  user: any;
}

function Settings({ user }: SettingsProps) {
  const { theme, setTheme } = useTheme();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  const updateProfile = async () => {
    try {
      setIsSaving(true);
      setSaveMessage('');

      const { error } = await supabase.auth.updateUser({
        data: { name }
      });

      if (error) throw error;
      setSaveMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setSaveMessage('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (saveMessage) {
      const timer = setTimeout(() => setSaveMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveMessage]);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Settings</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <button
                onClick={updateProfile}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Update Profile'}
              </button>
              {saveMessage && (
                <p className={`mt-2 text-sm ${saveMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                  {saveMessage}
                </p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">Theme</h3>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'light'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;