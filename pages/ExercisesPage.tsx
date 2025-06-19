
import React, { useState, useMemo } from 'react';
import ExerciseCard from '../components/ExerciseCard';
import { MOCK_EXERCISES } from '../constants';
import { Exercise } from '../types';

const ExercisesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [muscleGroupFilter, setMuscleGroupFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  const muscleGroups = useMemo(() => Array.from(new Set(MOCK_EXERCISES.map(ex => ex.muscleGroup))), []);
  const equipmentTypes = useMemo(() => Array.from(new Set(MOCK_EXERCISES.map(ex => ex.equipmentNeeded))), []);
  const difficulties = useMemo(() => Array.from(new Set(MOCK_EXERCISES.map(ex => ex.difficulty))), []);

  const commonInputClasses = "w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 bg-gray-700 text-gray-200 placeholder-gray-400";

  const filteredExercises = useMemo(() => {
    return MOCK_EXERCISES.filter(exercise => {
      const nameMatch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase());
      const muscleGroupMatch = !muscleGroupFilter || exercise.muscleGroup === muscleGroupFilter;
      const equipmentMatch = !equipmentFilter || exercise.equipmentNeeded.includes(equipmentFilter);
      const difficultyMatch = !difficultyFilter || exercise.difficulty === difficultyFilter;
      return nameMatch && muscleGroupMatch && equipmentMatch && difficultyMatch;
    });
  }, [searchTerm, muscleGroupFilter, equipmentFilter, difficultyFilter]);

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
        <h1 className="text-3xl font-bold text-cyan-400 mb-4">Biblioteca de Ejercicios</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Buscar ejercicio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={commonInputClasses}
          />
          <select 
            value={muscleGroupFilter} 
            onChange={(e) => setMuscleGroupFilter(e.target.value)}
            className={commonInputClasses}
          >
            <option value="" className="bg-gray-700">Todos los Grupos Musculares</option>
            {muscleGroups.map(mg => <option key={mg} value={mg} className="bg-gray-700">{mg}</option>)}
          </select>
          <select 
            value={equipmentFilter} 
            onChange={(e) => setEquipmentFilter(e.target.value)}
            className={commonInputClasses}
          >
            <option value="" className="bg-gray-700">Todo el Equipamiento</option>
            {equipmentTypes.map(eq => <option key={eq} value={eq} className="bg-gray-700">{eq}</option>)}
          </select>
          <select 
            value={difficultyFilter} 
            onChange={(e) => setDifficultyFilter(e.target.value)}
            className={commonInputClasses}
          >
            <option value="" className="bg-gray-700">Todas las Dificultades</option>
            {difficulties.map(df => <option key={df} value={df} className="bg-gray-700">{df}</option>)}
          </select>
        </div>
      </div>

      {filteredExercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExercises.map(exercise => (
            <ExerciseCard key={exercise.id} exercise={exercise} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-xl py-10">No se encontraron ejercicios con los filtros seleccionados.</p>
      )}
    </div>
  );
};

export default ExercisesPage;