
import React, { useState, useEffect, useCallback } from 'react';
import { Routine, LoggedExercise, LoggedSet, WorkoutLoggerProps, Exercise } from '../types';
import { MOCK_EXERCISES } from '../constants'; // To get exercise names
import LoadingSpinner from './LoadingSpinner';

const WorkoutLogger: React.FC<WorkoutLoggerProps> = ({ routine, onWorkoutComplete }) => {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loggedExercises, setLoggedExercises] = useState<LoggedExercise[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timer, setTimer] = useState<number | null>(null);
  const [timerDisplay, setTimerDisplay] = useState<string>("00:00");
  const [workoutDifficulty, setWorkoutDifficulty] = useState<'Fácil' | 'Justo' | 'Difícil' | undefined>(undefined);


  // Initialize loggedExercises based on the routine
   useEffect(() => {
    setLoggedExercises(
      routine.exercises.map(exInRoutine => ({
        exerciseId: exInRoutine.exerciseId,
        setsPerformed: Array(exInRoutine.sets).fill(null).map(() => ({ reps: 0, weight: 0 })),
        notes: '',
      }))
    );
    setStartTime(Date.now());
  }, [routine]);


  const updateTimer = useCallback(() => {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    setTimerDisplay(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  }, [startTime]);

  useEffect(() => {
    const intervalId = window.setInterval(updateTimer, 1000);
    setTimer(intervalId);
    return () => window.clearInterval(intervalId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTime, updateTimer]);


  const handleSetChange = (exerciseLogIndex: number, setIndex: number, field: keyof LoggedSet, value: string) => {
    const updatedLogs = [...loggedExercises];
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) || value === "") { // Allow empty string to clear input
      (updatedLogs[exerciseLogIndex].setsPerformed[setIndex] as any)[field] = value === "" ? 0 : numValue; // Store 0 if empty
      setLoggedExercises(updatedLogs);
    }
  };
  
  const handleNotesChange = (exerciseLogIndex: number, notes: string) => {
    const updatedLogs = [...loggedExercises];
    updatedLogs[exerciseLogIndex].notes = notes;
    setLoggedExercises(updatedLogs);
  };

  const currentExerciseInRoutine = routine.exercises[currentExerciseIndex];
  const currentLoggedExercise = loggedExercises[currentExerciseIndex];
  const exerciseDetails = MOCK_EXERCISES.find(ex => ex.id === currentExerciseInRoutine?.exerciseId);

  const goToNextExercise = () => {
    if (currentExerciseIndex < routine.exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
    } else {
      // Workout finished, prompt for difficulty
       setShowDifficultyPrompt(true);
    }
  };
  
  const [showDifficultyPrompt, setShowDifficultyPrompt] = useState(false);

  const handleFinishWorkout = (difficulty?: 'Fácil' | 'Justo' | 'Difícil') => {
    if (timer) window.clearInterval(timer);
    const durationMinutes = Math.floor((Date.now() - startTime) / 60000);
    
    const finalLoggedExercises = loggedExercises.map(log => ({
      ...log,
      difficultyRating: currentExerciseIndex === loggedExercises.indexOf(log) ? difficulty : undefined // Only for last exercise, or overall
    }));

    onWorkoutComplete(finalLoggedExercises, durationMinutes, difficulty);
  };
  
  const commonInputClasses = "w-full px-2 py-1 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500";

  if (!exerciseDetails || !currentLoggedExercise) {
    return <div className="p-6 bg-gray-800 rounded-lg shadow-xl"><LoadingSpinner text="Cargando ejercicio..." /></div>;
  }

  if (showDifficultyPrompt) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl text-center border border-gray-700">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">¡Entrenamiento Completado!</h2>
        <p className="text-gray-300 mb-4">¿Cómo calificarías la dificultad general de este entrenamiento?</p>
        <div className="flex justify-center space-x-3 mb-6">
          {(['Fácil', 'Justo', 'Difícil'] as const).map(level => (
            <button
              key={level}
              onClick={() => { setWorkoutDifficulty(level); handleFinishWorkout(level); }}
              className={`px-4 py-2 rounded-md font-medium transition-colors
                ${workoutDifficulty === level ? 'bg-cyan-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-cyan-500 hover:text-white'}`}
            >
              {level}
            </button>
          ))}
        </div>
         <button
          onClick={() => handleFinishWorkout(undefined)}
          className="bg-gray-600 text-gray-200 py-2 px-6 rounded-md hover:bg-gray-500 transition-colors"
        >
          Omitir y Finalizar
        </button>
      </div>
    );
  }


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-cyan-400">{routine.name}</h2>
        <div className="text-xl font-semibold text-gray-200">Tiempo: {timerDisplay}</div>
      </div>
      
      <div className="mb-8 p-4 border border-gray-700 rounded-lg bg-gray-700">
        <h3 className="text-xl font-semibold text-cyan-300 mb-2">{exerciseDetails.name}</h3>
        <p className="text-sm text-gray-400 mb-1">Grupo Muscular: {exerciseDetails.muscleGroup}</p>
        <p className="text-sm text-gray-400 mb-2">Instrucciones: {exerciseDetails.instructions}</p>
        {exerciseDetails.imageUrl && <img src={exerciseDetails.imageUrl} alt={exerciseDetails.name} className="w-full max-w-xs mx-auto rounded-md my-2" />}
      </div>

      <div className="space-y-4">
        {currentLoggedExercise.setsPerformed.map((set, setIndex) => (
          <div key={setIndex} className="grid grid-cols-3 gap-4 items-center p-3 bg-gray-700 rounded-md">
            <p className="font-medium text-gray-300">Serie {setIndex + 1}</p>
            <div>
              <label htmlFor={`reps-${setIndex}`} className="block text-xs font-medium text-gray-400 mb-1">Reps:</label>
              <input
                type="number"
                id={`reps-${setIndex}`}
                value={set.reps === 0 && !document.getElementById(`reps-${setIndex}`)?.matches(':focus') ? '' : set.reps} // Show empty if 0 and not focused
                onChange={(e) => handleSetChange(currentExerciseIndex, setIndex, 'reps', e.target.value)}
                placeholder="0"
                className={commonInputClasses}
              />
            </div>
            <div>
              <label htmlFor={`weight-${setIndex}`} className="block text-xs font-medium text-gray-400 mb-1">Peso (kg):</label>
              <input
                type="number"
                id={`weight-${setIndex}`}
                value={set.weight === 0 && !document.getElementById(`weight-${setIndex}`)?.matches(':focus') ? '' : set.weight} // Show empty if 0 and not focused
                onChange={(e) => handleSetChange(currentExerciseIndex, setIndex, 'weight', e.target.value)}
                placeholder="0"
                className={commonInputClasses}
              />
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6">
        <label htmlFor="exerciseNotes" className="block text-sm font-medium text-gray-300 mb-1">Notas del Ejercicio (opcional):</label>
        <textarea
          id="exerciseNotes"
          value={currentLoggedExercise.notes || ''}
          onChange={(e) => handleNotesChange(currentExerciseIndex, e.target.value)}
          rows={2}
          className={`${commonInputClasses} placeholder-gray-500`}
          placeholder="Ej: Aumentar peso la próxima vez, buena forma..."
        />
      </div>

      <div className="mt-8 flex justify-between items-center">
        <button
            onClick={() => {
                if (currentExerciseIndex > 0) setCurrentExerciseIndex(currentExerciseIndex - 1);
            }}
            disabled={currentExerciseIndex === 0}
            className="bg-gray-600 text-gray-300 py-2 px-4 rounded-md hover:bg-gray-500 disabled:opacity-50 transition-colors"
        >
          Ejercicio Anterior
        </button>
        <button
          onClick={goToNextExercise}
          className="bg-cyan-500 text-white py-2 px-6 rounded-md hover:bg-cyan-600 transition-colors text-lg font-semibold"
        >
          {currentExerciseIndex === routine.exercises.length - 1 ? 'Finalizar Entrenamiento' : 'Siguiente Ejercicio'}
        </button>
      </div>
    </div>
  );
};

export default WorkoutLogger;