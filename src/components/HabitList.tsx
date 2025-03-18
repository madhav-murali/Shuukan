import React, { useState } from 'react';
import { CheckCircle2, MoreVertical, Clock, Edit, Trash } from 'lucide-react';
import type { Habit } from '../App';

interface HabitListProps {
  habits: Habit[];
  onToggle: (habitId: number) => void;
  onEdit: (habit: Habit) => void;
  onDelete: (habitId: number) => void;
}

function HabitList({ habits, onToggle, onEdit, onDelete }: HabitListProps) {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const formatTime = (hours: number, minutes: number) => {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    return parts.join(' ');
  };

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <div
          key={habit.id}
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => onToggle(habit.id)}
              className={`w-6 h-6 rounded-full border-2 ${
                habit.completed
                  ? 'bg-blue-600 border-blue-600'
                  : 'border-gray-300 hover:border-blue-600'
              } transition-colors`}
            >
              {habit.completed && <CheckCircle2 size={24} className="text-white" />}
            </button>
            <div>
              <h3 className="font-medium text-gray-900">{habit.name}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{habit.streak} day streak</span>
                {habit.timer && (habit.timer.hours > 0 || habit.timer.minutes > 0) && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{formatTime(habit.timer.hours, habit.timer.minutes)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button 
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => setActiveMenu(activeMenu === habit.id ? null : habit.id)}
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>

            {activeMenu === habit.id && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10">
                <button
                  onClick={() => {
                    onEdit(habit);
                    setActiveMenu(null);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete(habit.id);
                    setActiveMenu(null);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
                >
                  <Trash size={16} />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HabitList;