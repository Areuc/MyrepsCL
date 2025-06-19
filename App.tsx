
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ExercisesPage from './pages/ExercisesPage';
import RoutinesPage from './pages/RoutinesPage';
import WorkoutPage from './pages/WorkoutPage';
import ProfilePage from './pages/ProfilePage';
import AuthPage from './pages/AuthPage';
import { useAuth } from './hooks/useAuth';
import { APP_NAME } from './constants';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    // Optionally, return a global loading spinner here
    return <div className="flex justify-center items-center h-screen bg-gray-900"><p className="text-cyan-400">Cargando aplicación...</p></div>;
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-gray-900">
        {user && <Navbar />}
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/auth" element={!user ? <AuthPage /> : <Navigate to="/" />} />
            
            <Route path="/" element={user ? <HomePage /> : <Navigate to="/auth" />} />
            <Route path="/exercises" element={user ? <ExercisesPage /> : <Navigate to="/auth" />} />
            <Route path="/routines" element={user ? <RoutinesPage /> : <Navigate to="/auth" />} />
            <Route path="/workout/:routineId" element={user ? <WorkoutPage /> : <Navigate to="/auth" />} />
            <Route path="/workout" element={user ? <WorkoutPage /> : <Navigate to="/auth" />} /> {/* For custom workouts */}
            <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" />} />
            
            <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />} />
          </Routes>
        </main>
        {user && (
          <footer className="bg-black text-gray-400 text-center p-4 border-t border-gray-700">
            <p>&copy; ${new Date().getFullYear()} {APP_NAME}. Todos los derechos reservados.</p>
          </footer>
        )}
      </div>
    </HashRouter>
  );
};

export default App;