
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RoutineForm from '../components/RoutineForm';
import { Routine, Exercise } from '../types';
import { useAuth } from '../hooks/useAuth';
import { MOCK_EXERCISES } from '../constants'; // For RoutineForm
import LoadingSpinner from '../components/LoadingSpinner';

const RoutinesPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      console.log('RoutinesPage: useEffect - User found, loading routines.');
      const storedRoutines = JSON.parse(localStorage.getItem(`routines_${user.id}`) || '[]') as Routine[];
      setRoutines(storedRoutines);
      setIsLoading(false);
    } else {
      console.log('RoutinesPage: useEffect - No user found.');
      setIsLoading(false); // Stop loading if no user
    }
  }, [user]);

  const saveRoutines = (updatedRoutines: Routine[]) => {
    if (user) {
      console.log('RoutinesPage: saveRoutines - Saving routines for user:', user.id, updatedRoutines);
      localStorage.setItem(`routines_${user.id}`, JSON.stringify(updatedRoutines));
      setRoutines(updatedRoutines);
    } else {
      console.warn('RoutinesPage: saveRoutines - Attempted to save routines without a user.');
    }
  };

  const handleCreateRoutine = (newRoutineData: Omit<Routine, 'id' | 'createdBy'>) => {
    if (!user) {
      console.warn('RoutinesPage: handleCreateRoutine - No user to create routine for.');
      return;
    }
    const newRoutine: Routine = {
      ...newRoutineData,
      id: Date.now().toString(),
      createdBy: user.id,
    };
    console.log('RoutinesPage: handleCreateRoutine - Creating new routine:', newRoutine);
    saveRoutines([...routines, newRoutine]);
    setShowForm(false);
  };
  
  const handleUpdateRoutine = (updatedRoutineData: Omit<Routine, 'id' | 'createdBy'>) => {
    if (!user || !editingRoutine) {
      console.warn('RoutinesPage: handleUpdateRoutine - No user or no routine being edited.');
      return;
    }
     const updatedRoutines = routines.map(r => 
        r.id === editingRoutine.id ? { ...editingRoutine, ...updatedRoutineData } : r
    );
    console.log('RoutinesPage: handleUpdateRoutine - Updating routine:', editingRoutine.id, updatedRoutines);
    saveRoutines(updatedRoutines);
    setShowForm(false);
    setEditingRoutine(null);
  };


  const handleDeleteRoutine = (routineId: string) => {
    console.log('RoutinesPage: handleDeleteRoutine - Attempting to delete routineId:', routineId);
    if (window.confirm('¿Estás seguro de que quieres eliminar esta rutina?')) {
      console.log('RoutinesPage: handleDeleteRoutine - User confirmed deletion.');
      if (!user) {
        console.warn('RoutinesPage: handleDeleteRoutine - No user found, cannot delete routine.');
        return;
      }
      const updatedRoutines = routines.filter(r => r.id !== routineId);
      saveRoutines(updatedRoutines);
    } else {
      console.log('RoutinesPage: handleDeleteRoutine - User cancelled deletion.');
    }
  };
  
  const handleStartEdit = (routine: Routine) => {
    setEditingRoutine(routine);
    setShowForm(true);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner text="Cargando rutinas..." /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-cyan-400">Mis Rutinas</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingRoutine(null); }}
          className="bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors font-semibold"
        >
          {showForm && !editingRoutine ? 'Cancelar' : (editingRoutine ? 'Cancelar Edición' : 'Crear Nueva Rutina')}
        </button>
      </div>

      {showForm && (
        <RoutineForm 
            onSubmit={editingRoutine ? handleUpdateRoutine : handleCreateRoutine} 
            availableExercises={MOCK_EXERCISES}
            initialRoutine={editingRoutine ? {name: editingRoutine.name, description: editingRoutine.description, exercises: editingRoutine.exercises} : undefined}
        />
      )}

      {routines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routines.map(routine => (
            <div key={routine.id} className="bg-gray-800 p-6 rounded-lg shadow-md border border-gray-700 flex flex-col justify-between">
              <div>
                <h2 className="text-xl font-semibold text-cyan-300 mb-2">{routine.name}</h2>
                <p className="text-sm text-gray-400 mb-1">Ejercicios: {routine.exercises.length}</p>
                {routine.description && <p className="text-sm text-gray-500 mb-3 italic">"{routine.description}"</p>}
                <ul className="text-xs text-gray-300 mb-4 list-disc list-inside max-h-24 overflow-y-auto custom-scrollbar">
                    {routine.exercises.map((exr, idx) => {
                        const exDetail = MOCK_EXERCISES.find(e => e.id === exr.exerciseId);
                        return <li key={idx}>{exDetail?.name || 'Ejercicio desconocido'} - {exr.sets} series x {exr.reps} reps</li>
                    })}
                </ul>
              </div>
              <div className="mt-auto space-y-2">
                <Link
                  to={`/workout/${routine.id}`}
                  className="block w-full text-center bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors font-medium"
                >
                  Iniciar Entrenamiento
                </Link>
                 <button
                  onClick={() => handleStartEdit(routine)}
                  className="block w-full text-center bg-yellow-500 text-black py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors font-medium"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteRoutine(routine.id)}
                  className="block w-full text-center bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && <p className="text-center text-gray-400 text-xl py-10">No has creado ninguna rutina todavía. ¡Empieza creando una!</p>
      )}
    </div>
  );
};

export default RoutinesPage;
