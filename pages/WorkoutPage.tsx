
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkoutLogger from '../components/WorkoutLogger';
import { Routine, LoggedExercise, WorkoutLog } from '../types';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';
import AICoachPanel from '../components/AICoachPanel'; // For post-workout advice

const WorkoutPage: React.FC = () => {
  const { routineId } = useParams<{ routineId?: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);
  const [completedWorkoutLog, setCompletedWorkoutLog] = useState<WorkoutLog | null>(null);


  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    if (routineId) {
      const storedRoutines = JSON.parse(localStorage.getItem(`routines_${user.id}`) || '[]') as Routine[];
      const foundRoutine = storedRoutines.find(r => r.id === routineId);
      if (foundRoutine) {
        setRoutine(foundRoutine);
      } else {
        console.error("Rutina no encontrada");
        navigate('/routines'); 
      }
    } else {
       // Allow custom workout creation by providing a default empty routine.
       // The WorkoutLogger would need to be adapted or a new component created to add exercises on the fly.
       // For this version, if no routine ID, we create a shell.
       setRoutine({ 
           id: 'custom_' + Date.now(),
           name: 'Entrenamiento Personalizado',
           exercises: [], 
           createdBy: user.id,
           description: 'Un entrenamiento creado sobre la marcha.'
       });
       // A more robust solution might involve navigating to a routine builder or showing a message to select/create one.
    }
    setIsLoading(false);
  }, [routineId, user, navigate]);

  const handleWorkoutComplete = (
    loggedExercises: LoggedExercise[], 
    durationMinutes: number, 
    difficultyRating?: 'Fácil' | 'Justo' | 'Difícil'
  ) => {
    if (!user || !routine) return;

    const newWorkoutLog: WorkoutLog = {
      id: Date.now().toString(),
      userId: user.id,
      routineId: routine.id,
      routineName: routine.name,
      date: new Date().toISOString(),
      completedExercises: loggedExercises.map(exLog => ({
          ...exLog,
          difficultyRating: exLog.difficultyRating || difficultyRating 
      })),
      durationMinutes,
    };

    const storedWorkoutLogs = JSON.parse(localStorage.getItem(`workoutLogs_${user.id}`) || '[]') as WorkoutLog[];
    localStorage.setItem(`workoutLogs_${user.id}`, JSON.stringify([...storedWorkoutLogs, newWorkoutLog]));
    
    setCompletedWorkoutLog(newWorkoutLog);
    setWorkoutCompleted(true);
  };

  if (isLoading || !user) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner text="Cargando entrenamiento..." /></div>;
  }

  if (!routine) {
    return (
      <div className="text-center py-10 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
        <p className="text-xl text-red-400">Error: Rutina no encontrada o no se pudo cargar.</p>
        <button onClick={() => navigate('/routines')} className="mt-4 bg-cyan-500 text-white py-2 px-4 rounded hover:bg-cyan-600">
            Volver a Rutinas
        </button>
      </div>
    );
  }
  
  if (routine.exercises.length === 0 && !routine.id.startsWith('custom_')) { // Allow custom workout to start empty
      return (
        <div className="text-center py-10 bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Rutina Vacía</h2>
            <p className="text-gray-300 mb-6">Esta rutina ('{routine.name}') no tiene ejercicios. Por favor, edita la rutina y añade algunos ejercicios antes de empezar.</p>
            <button onClick={() => navigate('/routines')} className="bg-cyan-500 text-white py-2 px-6 rounded-md hover:bg-cyan-600 transition-colors">
                Ir a Mis Rutinas
            </button>
        </div>
      );
  }


  if (workoutCompleted && completedWorkoutLog) {
    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center border border-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-cyan-400 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15L15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-3xl font-bold text-cyan-400 mb-3">¡Entrenamiento Completado!</h2>
                <p className="text-gray-300 mb-2">Has completado la rutina: <span className="font-semibold text-gray-100">{completedWorkoutLog.routineName}</span>.</p>
                <p className="text-gray-300 mb-2">Duración: <span className="font-semibold text-gray-100">{completedWorkoutLog.durationMinutes} minutos</span>.</p>
                <p className="text-gray-300 mb-6">¡Buen trabajo!</p>
                
            </div>
            <AICoachPanel userId={user.id} userGoal={user.goal} lastWorkoutLog={completedWorkoutLog} />
            <div className="text-center mt-6">
                 <button onClick={() => navigate('/')} className="bg-cyan-600 text-white py-3 px-6 rounded-md hover:bg-cyan-700 transition-colors text-lg font-semibold">
                    Volver al Inicio
                </button>
            </div>
        </div>
    );
  }


  return (
    <div>
      <WorkoutLogger routine={routine} onWorkoutComplete={handleWorkoutComplete} />
    </div>
  );
};

export default WorkoutPage;
