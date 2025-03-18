import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Habit } from '../App';

interface CalendarViewProps {
  habits: Habit[];
}

function CalendarView({ habits }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthData, setMonthData] = useState<Array<{ date: Date; completionRatio: number }>>([]);

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const calculateMonthData = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    const data = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      
      // Calculate completion ratio for the day
      const completedHabits = habits.filter(habit => 
        habit.completionHistory.some(h => h.date === dateStr && h.completed)
      ).length;
      
      const totalHabits = habits.length;
      const completionRatio = totalHabits > 0 ? completedHabits / totalHabits : 0;
      
      data.push({
        date,
        completionRatio
      });
    }
    
    setMonthData(data);
  };

  useEffect(() => {
    calculateMonthData();
  }, [currentDate, habits]);

  const getColorClass = (ratio: number) => {
    if (ratio === 0) return 'bg-gray-100 dark:bg-gray-700';
    if (ratio <= 0.3) return 'bg-blue-200 dark:bg-blue-800';
    if (ratio <= 0.7) return 'bg-blue-400 dark:bg-blue-600';
    return 'bg-blue-600 dark:bg-blue-400';
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">Progress Calendar</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="text-lg font-medium text-gray-800 dark:text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
            {day}
          </div>
        ))}
        
        {Array.from({ length: monthData[0]?.date.getDay() || 0 }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        
        {monthData.map((day, i) => (
          <div
            key={i}
            className={`aspect-square rounded-md ${getColorClass(day.completionRatio)} hover:opacity-75 transition-all transform hover:scale-105 cursor-pointer`}
            title={`${Math.round(day.completionRatio * 100)}% completed on ${day.date.toLocaleDateString()}`}
          />
        ))}
      </div>
    </div>
  );
}

export default CalendarView