
import React, { useState, useEffect } from 'react';
import { Routine, ExerciseInRoutine, Exercise, RoutineFormProps } from '../types';
import { MOCK_EXERCISES } from '../constants'; // For selecting exercises

const RoutineForm: React.FC<RoutineFormProps> = ({ onSubmit, initialRoutine, availableExercises }) => {
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [selectedExercises, setSelectedExercises] = useState<ExerciseInRoutine[]>([]);
  const [exerciseToAdd, setExerciseToAdd] = useState<string>('');
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<string>('8-12');
  const [restTime, setRestTime] = useState<number>(60);

  useEffect(() => {
    if (initialRoutine) {
      setRoutineName(initialRoutine.name);
      setRoutineDescription(initialRoutine.description || '');
      setSelectedExercises(initialRoutine.exercises);
    }
  }, [initialRoutine]);

  const handleAddExerciseToRoutine = () => {
    if (!exerciseToAdd) return;
    const exerciseExists = selectedExercises.find(ex => ex.exerciseId === exerciseToAdd);
    if (exerciseExists) {
        alert("Este ejercicio ya está en la rutina.");
        return;
    }
    setSelectedExercises([
      ...selectedExercises,
      { exerciseId: exerciseToAdd, sets, reps, restTimeSeconds: restTime },
    ]);
    setExerciseToAdd(''); // Reset select
  };

  const handleRemoveExercise = (exerciseIdToRemove: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.exerciseId !== exerciseIdToRemove));
  };
  
  const handleUpdateExerciseInRoutine = (index: number, field: keyof ExerciseInRoutine, value: string | number) => {
    const updatedExercises = [...selectedExercises];
    if (typeof updatedExercises[index][field] === 'number' && typeof value === 'string') {
        (updatedExercises[index] as any)[field] = parseInt(value, 10);
    } else {
        (updatedExercises[index] as any)[field] = value;
    }
    setSelectedExercises(updatedExercises);
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!routineName.trim() || selectedExercises.length === 0) {
      alert('Por favor, asigna un nombre a la rutina y añade al menos un ejercicio.');
      return;
    }
    onSubmit({
      name: routineName,
      description: routineDescription,
      exercises: selectedExercises,
    });
    // Reset form (optional, could be handled by parent)
    setRoutineName('');
    setRoutineDescription('');
    setSelectedExercises([]);
  };
  
  const commonInputClasses = "w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 bg-gray-700 text-gray-200 placeholder-gray-400";

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-xl space-y-6 border border-gray-700">
      <div>
        <label htmlFor="routineName" className="block text-sm font-medium text-gray-300 mb-1">Nombre de la Rutina:</label>
        <input
          type="text"
          id="routineName"
          value={routineName}
          onChange={(e) => setRoutineName(e.target.value)}
          required
          className={commonInputClasses}
        />
      </div>
      <div>
        <label htmlFor="routineDescription" className="block text-sm font-medium text-gray-300 mb-1">Descripción (Opcional):</label>
        <textarea
          id="routineDescription"
          value={routineDescription}
          onChange={(e) => setRoutineDescription(e.target.value)}
          rows={3}
          className={commonInputClasses}
        />
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h4 className="text-lg font-semibold text-cyan-400 mb-3">Añadir Ejercicio a la Rutina:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label htmlFor="exerciseSelect" className="block text-sm font-medium text-gray-300 mb-1">Ejercicio:</label>
            <select
              id="exerciseSelect"
              value={exerciseToAdd}
              onChange={(e) => setExerciseToAdd(e.target.value)}
              className={commonInputClasses}
            >
              <option value="">Selecciona un ejercicio</option>
              {availableExercises.map(ex => (
                <option key={ex.id} value={ex.id} className="bg-gray-700 text-gray-200">{ex.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sets" className="block text-sm font-medium text-gray-300 mb-1">Series:</label>
            <input type="number" id="sets" value={sets} onChange={(e) => setSets(Number(e.target.value))} min="1" className={commonInputClasses}/>
          </div>
          <div>
            <label htmlFor="reps" className="block text-sm font-medium text-gray-300 mb-1">Repeticiones (ej. 8-12, AMRAP):</label>
            <input type="text" id="reps" value={reps} onChange={(e) => setReps(e.target.value)} className={commonInputClasses}/>
          </div>
          <div>
            <label htmlFor="restTime" className="block text-sm font-medium text-gray-300 mb-1">Descanso (segundos):</label>
            <input type="number" id="restTime" value={restTime} onChange={(e) => setRestTime(Number(e.target.value))} min="0" step="5" className={commonInputClasses}/>
          </div>
          <button
            type="button"
            onClick={handleAddExerciseToRoutine}
            className="md:col-span-2 w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors"
          >
            Añadir Ejercicio Seleccionado
          </button>
        </div>
      </div>
      
      {selectedExercises.length > 0 && (
        <div className="border-t border-gray-700 pt-6">
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">Ejercicios en la Rutina:</h4>
          <ul className="space-y-4">
            {selectedExercises.map((se, index) => {
              const exerciseDetail = availableExercises.find(ex => ex.id === se.exerciseId);
              return (
                <li key={`${se.exerciseId}-${index}`} className="p-4 border border-gray-700 rounded-md bg-gray-700">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-cyan-300">{exerciseDetail?.name || 'Ejercicio Desconocido'}</p>
                    <button type="button" onClick={() => handleRemoveExercise(se.exerciseId)} className="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    <div>
                        <label className="block text-xs font-medium text-gray-400">Series</label>
                        <input type="number" value={se.sets} onChange={(e) => handleUpdateExerciseInRoutine(index, 'sets', e.target.value)} className={`${commonInputClasses} p-1 text-sm`}/>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400">Reps</label>
                        <input type="text" value={se.reps} onChange={(e) => handleUpdateExerciseInRoutine(index, 'reps', e.target.value)} className={`${commonInputClasses} p-1 text-sm`}/>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400">Descanso (s)</label>
                        <input type="number" value={se.restTimeSeconds} onChange={(e) => handleUpdateExerciseInRoutine(index, 'restTimeSeconds', e.target.value)} className={`${commonInputClasses} p-1 text-sm`}/>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-cyan-500 text-white py-3 px-4 rounded-md hover:bg-cyan-600 transition-colors text-lg font-semibold"
      >
        {initialRoutine ? 'Actualizar Rutina' : 'Crear Rutina'}
      </button>
    </form>
  );
};

export default RoutineForm;