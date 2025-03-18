import React, { useState } from 'react';
import { X, Clock } from 'lucide-react';
import type { Habit } from '../App';

interface EditHabitModalProps {
  habit: Habit;
  onSave: (habit: Habit) => void;
  onClose: () => void;
}

function EditHabitModal({ habit, onSave, onClose }: EditHabitModalProps) {
  const [name, setName] = useState(habit.name);
  const [hours, setHours] = useState(habit.timer?.hours || 0);
  const [minutes, setMinutes] = useState(habit.timer?.minutes || 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...habit,
      name,
      timer: { hours, minutes }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {habit.id ? 'Edit Habit' : 'New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter habit name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timer
            </label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="hours" className="block text-sm text-gray-600 mb-1">
                  Hours
                </label>
                <input
                  type="number"
                  id="hours"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="minutes" className="block text-sm text-gray-600 mb-1">
                  Minutes
                </label>
                <input
                  type="number"
                  id="minutes"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Number(e.target.value))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditHabitModal;