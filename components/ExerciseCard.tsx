
import React, { useState } from 'react';
import { Exercise, ExerciseCardProps } from '../types';

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onAddToRoutine }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300 border border-gray-700">
      {exercise.gifUrl ? (
        <img src={exercise.gifUrl} alt={`${exercise.name} GIF`} className="w-full h-48 object-cover"/>
      ) : exercise.imageUrl && (
        <img src={exercise.imageUrl} alt={exercise.name} className="w-full h-48 object-cover"/>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-cyan-400 mb-2">{exercise.name}</h3>
        <p className="text-sm text-gray-400 mb-1"><span className="font-medium text-gray-300">Grupo Muscular:</span> {exercise.muscleGroup}</p>
        <p className="text-sm text-gray-400 mb-1"><span className="font-medium text-gray-300">Equipamiento:</span> {exercise.equipmentNeeded}</p>
        <p className="text-sm text-gray-400 mb-2"><span className="font-medium text-gray-300">Dificultad:</span> {exercise.difficulty}</p>
        
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-cyan-500 hover:text-cyan-400 text-sm font-medium mb-2"
          aria-expanded={showDetails}
          aria-controls={`details-${exercise.id}`}
        >
          {showDetails ? 'Ocultar Detalles' : 'Mostrar Detalles'}
        </button>

        {showDetails && (
          <div id={`details-${exercise.id}`} className="mt-2 text-sm text-gray-300">
            <p className="font-semibold mb-1 text-gray-200">Instrucciones:</p>
            <p>{exercise.instructions}</p>
            {exercise.videoUrl && (
                 <a href={exercise.videoUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-500 hover:underline mt-2 inline-block">Ver Video Ejemplo</a>
            )}
          </div>
        )}

        {onAddToRoutine && (
          <button
            onClick={() => onAddToRoutine(exercise.id)}
            className="mt-4 w-full bg-cyan-600 text-white py-2 px-4 rounded-md hover:bg-cyan-700 transition-colors duration-300"
          >
            Añadir a Rutina
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseCard;