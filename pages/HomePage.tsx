
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AICoachPanel from '../components/AICoachPanel';
import { useAuth } from '../hooks/useAuth';
import { WorkoutLog, Routine } from '../types'; 
import LoadingSpinner from '../components/LoadingSpinner';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const [lastWorkout, setLastWorkout] = useState<WorkoutLog | null>(null);
  const [totalWorkouts, setTotalWorkouts] = useState<number>(0);
  const [routinesCount, setRoutinesCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data from localStorage or an API
    if (user) {
      const storedWorkoutLogs = JSON.parse(localStorage.getItem(`workoutLogs_${user.id}`) || '[]') as WorkoutLog[];
      if (storedWorkoutLogs.length > 0) {
        setLastWorkout(storedWorkoutLogs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]);
        setTotalWorkouts(storedWorkoutLogs.length);
      }

      const storedRoutines = JSON.parse(localStorage.getItem(`routines_${user.id}`) || '[]') as Routine[];
      setRoutinesCount(storedRoutines.length);
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner text="Cargando tu panel de control..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-cyan-400 mb-2">¡Bienvenido de nuevo, {user.name}!</h1>
        <p className="text-gray-300">Tu objetivo actual es: <span className="font-semibold text-cyan-300">{user.goal || 'No establecido'}</span>. ¡Sigue así!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">Entrenamientos Completados</h2>
          <p className="text-4xl font-bold text-cyan-400">{totalWorkouts}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center border border-gray-700">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">Rutinas Creadas</h2>
          <p className="text-4xl font-bold text-cyan-400">{routinesCount}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center border border-gray-700 flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Próximo Entrenamiento</h2>
            {routinesCount > 0 ? (
                <Link to="/routines" className="mt-2 inline-block bg-cyan-600 text-white py-3 px-6 rounded-md hover:bg-cyan-700 transition-colors text-lg font-semibold">
                    Iniciar Rutina
                </Link>
            ) : (
                 <Link to="/routines" className="mt-2 inline-block bg-cyan-500 text-white py-3 px-6 rounded-md hover:bg-cyan-600 transition-colors text-lg font-semibold">
                    Crear Rutina
                </Link>
            )}
        </div>
      </div>
      
      <AICoachPanel userId={user.id} userGoal={user.goal} lastWorkoutLog={lastWorkout || undefined} />

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
          <h3 className="text-xl font-semibold text-cyan-400 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link to="/routines" className="block w-full text-center bg-cyan-500 text-white py-3 px-4 rounded-md hover:bg-cyan-600 transition-colors font-medium">
              Ver/Crear Rutinas
            </Link>
            <Link to="/exercises" className="block w-full text-center bg-cyan-500 opacity-90 text-white py-3 px-4 rounded-md hover:bg-cyan-600 transition-colors font-medium">
              Explorar Ejercicios
            </Link>
             <Link to="/profile" className="block w-full text-center bg-gray-600 text-white py-3 px-4 rounded-md hover:bg-gray-500 transition-colors font-medium">
              Actualizar Perfil y Metas
            </Link>
          </div>
        </div>
        {lastWorkout && (
           <div className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700">
            <h3 className="text-xl font-semibold text-cyan-400 mb-4">Último Entrenamiento Registrado</h3>
            <p className="text-gray-300"><span className="font-medium text-gray-100">Nombre:</span> {lastWorkout.routineName || 'Entrenamiento personalizado'}</p>
            <p className="text-gray-300"><span className="font-medium text-gray-100">Fecha:</span> {new Date(lastWorkout.date).toLocaleDateString('es-ES')}</p>
            <p className="text-gray-300"><span className="font-medium text-gray-100">Duración:</span> {lastWorkout.durationMinutes} minutos</p>
             {/* Add more details if needed */}
           </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;