import React, { useState, useEffect } from 'react';
import { Calendar, CheckCircle2, Plus, Settings as SettingsIcon, Menu, X, LogOut } from 'lucide-react';
import HabitList from './components/HabitList';
import CalendarView from './components/CalendarView';
import Header from './components/Header';
import EditHabitModal from './components/EditHabitModal';
import AuthModal from './components/AuthModal';
import Settings from './components/Settings';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './lib/supabase';

export type Habit = {
  id: number;
  name: string;
  streak: number;
  completed: boolean;
  timer?: {
    hours: number;
    minutes: number;
  };
  completionHistory: { date: string; completed: boolean }[];
};

function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check current auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadHabits();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadHabits();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadHabits = async () => {
    try {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Transform the data to match our Habit type
      const transformedHabits = data.map((habit: any) => ({
        id: habit.id,
        name: habit.name,
        streak: habit.streak,
        completed: habit.completed,
        timer: habit.timer,
        completionHistory: habit.completion_history || []
      }));
      
      setHabits(transformedHabits);
    } catch (error) {
      console.error('Error loading habits:', error);
    }
  };

  const toggleHabit = async (habitId: number) => {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      const habit = habits.find(h => h.id === habitId);
      if (!habit) return;

      const newCompleted = !habit.completed;
      const { error } = await supabase
        .from('habits')
        .update({ 
          completed: newCompleted,
          streak: newCompleted ? habit.streak + 1 : habit.streak - 1,
          completion_history: [
            ...habit.completionHistory,
            { date: today, completed: newCompleted }
          ]
        })
        .eq('id', habitId);

      if (error) throw error;
      
      setHabits(habits.map(h => {
        if (h.id === habitId) {
          return {
            ...h,
            completed: newCompleted,
            streak: newCompleted ? h.streak + 1 : h.streak - 1,
            completionHistory: [
              ...h.completionHistory,
              { date: today, completed: newCompleted }
            ]
          };
        }
        return h;
      }));
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const addHabit = async () => {
    try {
      const newHabit = {
        user_id: user.id,
        name: 'New Habit',
        streak: 0,
        completed: false,
        timer: { hours: 0, minutes: 0 },
        completion_history: []
      };

      const { data, error } = await supabase
        .from('habits')
        .insert([newHabit])
        .select()
        .single();

      if (error) throw error;
      
      const transformedHabit = {
        id: data.id,
        name: data.name,
        streak: data.streak,
        completed: data.completed,
        timer: data.timer,
        completionHistory: data.completion_history || []
      };
      
      setHabits([...habits, transformedHabit]);
      setEditingHabit(transformedHabit);
    } catch (error) {
      console.error('Error adding habit:', error);
    }
  };

  const updateHabit = async (updatedHabit: Habit) => {
    try {
      const { error } = await supabase
        .from('habits')
        .update({
          name: updatedHabit.name,
          timer: updatedHabit.timer
        })
        .eq('id', updatedHabit.id);

      if (error) throw error;
      
      setHabits(habits.map(habit => 
        habit.id === updatedHabit.id ? updatedHabit : habit
      ));
      setEditingHabit(null);
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const deleteHabit = async (habitId: number) => {
    try {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId);

      if (error) throw error;
      
      setHabits(habits.filter(habit => habit.id !== habitId));
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setHabits([]);
    navigate('/');
  };

  const MainDashboard = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-12">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Today's Habits</h2>
            <button 
              onClick={addHabit}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} />
              Add Habit
            </button>
          </div>
          <HabitList 
            habits={habits} 
            onToggle={toggleHabit}
            onEdit={setEditingHabit}
            onDelete={deleteHabit}
          />
        </div>
      </div>
    </div>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In to Track Habits
          </button>
        </div>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 flex justify-between items-center border-b">
          <h2 className="text-xl font-semibold">Menu</h2>
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-4">
          <button 
            onClick={() => navigate('/')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
              location.pathname === '/' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 size={24} />
            <span>Habits</span>
          </button>
          <button 
            onClick={() => navigate('/calendar')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
              location.pathname === '/calendar' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Calendar size={24} />
            <span>Calendar</span>
          </button>
          <button 
            onClick={() => navigate('/settings')}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
              location.pathname === '/settings' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <SettingsIcon size={24} />
            <span>Settings</span>
          </button>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full p-3 text-red-600 hover:bg-gray-50 rounded-lg"
          >
            <LogOut size={24} />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="container mx-auto px-4 py-6">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden mb-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <Menu size={24} />
        </button>

        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/calendar" element={<CalendarView habits={habits} />} />
          <Route path="/settings" element={<Settings user={user} />} />
        </Routes>
      </main>

      {editingHabit && (
        <EditHabitModal
          habit={editingHabit}
          onSave={updateHabit}
          onClose={() => setEditingHabit(null)}
        />
      )}
    </div>
  );
}

export default App;