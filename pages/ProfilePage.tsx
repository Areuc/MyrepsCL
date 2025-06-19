
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserGoal, WorkoutLog } from '../types';
import { USER_GOALS_OPTIONS } from '../constants';
import LoadingSpinner from '../components/LoadingSpinner';

const ProfilePage: React.FC = () => {
  const { user, updateUser, loading: authLoading } = useAuth();
  const [name, setName] = useState('');
  const [goal, setGoal] = useState<UserGoal | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [workoutStats, setWorkoutStats] = useState({ total: 0, lastDate: '' });
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setGoal(user.goal);

      const logs = JSON.parse(localStorage.getItem(`workoutLogs_${user.id}`) || '[]') as WorkoutLog[];
      setWorkoutStats({
        total: logs.length,
        lastDate: logs.length > 0 ? new Date(logs.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date).toLocaleDateString('es-ES') : 'N/A'
      });
      setPageLoading(false);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFeedback('');
    try {
      await updateUser({ ...user, name, goal });
      setFeedback('¡Perfil actualizado con éxito!');
      setIsEditing(false);
       setTimeout(() => setFeedback(''), 3000);
    } catch (error) {
      setFeedback('Error al actualizar el perfil.');
      console.error(error);
    }
  };

  const commonInputClasses = "w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-gray-200 placeholder-gray-400";
  const disabledInputClasses = "w-full px-3 py-2 border border-gray-700 rounded-md shadow-sm bg-gray-800 text-gray-400 cursor-not-allowed";
  const enabledInputClasses = `${commonInputClasses} focus:outline-none focus:ring-cyan-500 focus:border-cyan-500`;


  if (authLoading || pageLoading) {
    return <div className="flex justify-center items-center h-full"><LoadingSpinner text="Cargando perfil..." /></div>;
  }

  if (!user) {
    return <p className="text-center text-red-400">Usuario no encontrado.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-xl shadow-2xl space-y-8 border border-gray-700">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Tu Perfil</h1>
        <p className="text-gray-400">Gestiona tu información personal y tus objetivos de fitness.</p>
      </div>

      {feedback && <p className={`p-3 rounded-md text-center text-sm ${feedback.includes('Error') ? 'bg-red-900 bg-opacity-50 text-red-300' : 'bg-green-900 bg-opacity-50 text-green-300'}`}>{feedback}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            value={user.email}
            disabled
            className={disabledInputClasses}
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Nombre:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            required
            className={!isEditing ? disabledInputClasses : enabledInputClasses}
          />
        </div>
        <div>
          <label htmlFor="goal" className="block text-sm font-medium text-gray-300 mb-1">Objetivo Principal:</label>
          <select
            id="goal"
            value={goal || ''}
            onChange={(e) => setGoal(e.target.value as UserGoal)}
            disabled={!isEditing}
            className={`${!isEditing ? disabledInputClasses : enabledInputClasses} appearance-none`} // appearance-none for custom arrow if added
          >
            <option value="" disabled className="bg-gray-700 text-gray-400">Selecciona tu objetivo</option>
            {USER_GOALS_OPTIONS.map(g => (
              <option key={g} value={g} className="bg-gray-700 text-gray-200">{g}</option>
            ))}
          </select>
        </div>
        
        {isEditing ? (
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-cyan-600 text-white py-2.5 px-4 rounded-md hover:bg-cyan-700 transition-colors font-medium"
            >
              Guardar Cambios
            </button>
            <button
              type="button"
              onClick={() => { setIsEditing(false); setName(user.name); setGoal(user.goal); }}
              className="flex-1 bg-gray-600 text-gray-200 py-2.5 px-4 rounded-md hover:bg-gray-500 transition-colors font-medium"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="w-full bg-yellow-500 text-black py-2.5 px-4 rounded-md hover:bg-yellow-600 transition-colors font-medium"
          >
            Editar Perfil
          </button>
        )}
      </form>

      <div className="border-t border-gray-700 pt-6">
        <h2 className="text-2xl font-semibold text-cyan-300 mb-3">Estadísticas de Entrenamiento</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Entrenamientos Totales</p>
                <p className="text-2xl font-bold text-cyan-400">{workoutStats.total}</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-400 text-sm">Último Entrenamiento</p>
                <p className="text-lg font-semibold text-cyan-400">{workoutStats.lastDate}</p>
            </div>
        </div>
      </div>
       <p className="text-xs text-gray-500 mt-4 text-center">Tu información se almacena localmente en tu navegador.</p>
    </div>
  );
};

export default ProfilePage;