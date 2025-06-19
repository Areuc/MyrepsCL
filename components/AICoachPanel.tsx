
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { AICoachPanelProps, AICoachMessage, WorkoutLog, UserGoal } from '../types';
import { GEMINI_MODEL_NAME, GEMINI_SAFETY_SETTINGS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

const AICoachPanel: React.FC<AICoachPanelProps> = ({ userId, userGoal, lastWorkoutLog }) => {
  const [messages, setMessages] = useState<AICoachMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender, timestamp: new Date().toISOString() }]);
  };
  
  const constructPrompt = useCallback(() => {
    let prompt = `Eres Myreps AI Coach, un entrenador personal virtual experto y motivador para la app Myreps. Estás hablando con un usuario. El objetivo principal del usuario es "${userGoal || 'mejorar su condición física general'}".\n\n`;

    if (lastWorkoutLog) {
      prompt += `El usuario acaba de registrar un entrenamiento:
      - Nombre/Tipo: ${lastWorkoutLog.routineName || 'Entrenamiento personalizado'}
      - Fecha: ${new Date(lastWorkoutLog.date).toLocaleDateString('es-ES')}
      - Duración: ${lastWorkoutLog.durationMinutes || 'No registrada'} minutos\n`;
      
      if (lastWorkoutLog.completedExercises.length > 0) {
        const firstExercise = lastWorkoutLog.completedExercises[0];
        // TODO: Enhance prompt with actual exercise name if MOCK_EXERCISES is accessible here or passed.
        prompt += `- Primer ejercicio registrado (ID): ${firstExercise.exerciseId}, realizó ${firstExercise.setsPerformed.length} series. Por ejemplo, en la primera serie hizo ${firstExercise.setsPerformed[0]?.reps || 'N/A'} repeticiones con ${firstExercise.setsPerformed[0]?.weight || 'N/A'}kg.\n`;
        if (firstExercise.difficultyRating) {
           prompt += `- Calificó este ejercicio (o el entrenamiento general) como: "${firstExercise.difficultyRating}".\n`;
        }
      }
    } else {
      prompt += "El usuario no ha registrado un entrenamiento recientemente.\n";
    }

    prompt += `\nBasado en esta información (especialmente su objetivo y su último entrenamiento, si está disponible), proporciona un consejo corto, específico, práctico y motivador en español. El consejo debe ser de 2-4 frases. Anímale y ayúdale a progresar hacia su objetivo. Si el entrenamiento fue calificado como 'Difícil', sugiere cómo ajustarlo o la importancia del descanso. Si fue 'Fácil', sugiere cómo progresar. Si fue 'Justo', refuerza positivamente. Sé directo y útil.`;
    return prompt;
  }, [userGoal, lastWorkoutLog]);


  const fetchCoachAdvice = useCallback(async (isInitial: boolean = false) => {
    if (!process.env.API_KEY) {
      setError("La API Key de Gemini no está configurada.");
      addMessage("Error: La API Key no está configurada. Por favor, contacta al administrador.", 'ai');
      return;
    }
    setIsLoading(true);
    setError(null);

    const prompt = constructPrompt();
    if (!isInitial) {
        // Not adding user's "Get advice" as a message, AI response will be direct
    }

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: GEMINI_MODEL_NAME,
        contents: prompt,
        // safetySettings: GEMINI_SAFETY_SETTINGS, // Removed: Not a direct property of GenerateContentParameters
        config: { temperature: 0.7 }
      });
      
      const adviceText = response.text;
      if (adviceText) {
        addMessage(adviceText, 'ai');
      } else {
        addMessage("No pude generar un consejo en este momento. Inténtalo de nuevo.", 'ai');
      }
    } catch (e: any) {
      console.error("Error fetching advice from Gemini:", e);
      setError(`Error al obtener consejo: ${e.message}`);
      addMessage(`Lo siento, tuve un problema al generar un consejo: ${e.message}. Intenta más tarde.`, 'ai');
    } finally {
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, userGoal, lastWorkoutLog, constructPrompt]); // Dependencies for useCallback
  
  // Fetch initial advice when component mounts or user data changes
  useEffect(() => {
    const initialGreeting = `¡Hola! Soy tu Myreps AI Coach. Estoy aquí para ayudarte a alcanzar tus metas de "${userGoal || 'fitness general'}". ¿Listo para un consejo?`;
    // Clear previous messages and add greeting, or just add greeting if messages are desired to persist across views.
    setMessages([{ id: Date.now().toString(), text: initialGreeting, sender: 'ai', timestamp: new Date().toISOString() }]);
    // fetchCoachAdvice(true); // Optional: fetch advice immediately
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userGoal]); // Re-greet if goal changes

  // This useEffect will now trigger if lastWorkoutLog changes AFTER the initial greeting.
  useEffect(() => {
    if (lastWorkoutLog && messages.length > 0 && messages[messages.length-1].text.startsWith("¡Hola! Soy tu Myreps AI Coach.")) {
      fetchCoachAdvice(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastWorkoutLog]); // Only depends on lastWorkoutLog now to react to new workouts


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
      <h3 className="text-2xl font-bold text-cyan-400 mb-4">Consejos del Coach AI</h3>
      <div className="h-64 overflow-y-auto mb-4 p-3 border border-gray-700 rounded-md bg-gray-700 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg shadow ${
                msg.sender === 'ai' ? 'bg-cyan-900 bg-opacity-50 text-cyan-200' : 'bg-gray-600 text-gray-100' // User message style if ever implemented
            }`}>
              <p className="text-sm">{msg.text}</p>
              <p className="text-xs text-gray-400 mt-1 text-right">{new Date(msg.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-center py-2"><LoadingSpinner size="sm" /></div>}
        {error && <p className="text-sm text-red-400 p-2 bg-red-900 bg-opacity-30 rounded-md">{error}</p>}
      </div>
      <button
        onClick={() => fetchCoachAdvice(false)}
        disabled={isLoading}
        className="w-full bg-cyan-600 text-white py-2.5 px-4 rounded-md hover:bg-cyan-700 transition-colors disabled:bg-gray-600 flex items-center justify-center font-semibold"
      >
        {isLoading ? <LoadingSpinner size="sm" textColor="text-white"/> : (
            <>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 7.924C9.842 7.611 10.278 7.426 10.743 7.375C11.378 7.311 12.012 7.498 12.512 7.898L12.512 7.898C12.871 8.194 13.068 8.643 13.049 9.102C13.029 9.561 12.805 9.988 12.437 10.27L12.437 10.27L7.43702 14.27C7.03902 14.593 6.53602 14.777 6.00002 14.777C5.46402 14.777 4.96102 14.593 4.56302 14.27L4.56302 14.27C4.16402 13.948 3.94502 13.486 3.94502 13C3.94502 12.514 4.16402 12.052 4.56302 11.73L4.56302 11.73L9.53 7.924Z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M12.969 16.574C12.657 16.887 12.221 17.072 11.756 17.123C11.121 17.187 10.487 16.999 9.98703 16.6L9.98703 16.6C9.62803 16.304 9.43103 15.855 9.45003 15.396C9.47003 14.937 9.69403 14.51 10.062 14.228L10.062 14.228L15.062 10.228C15.46 9.90499 15.963 9.72099 16.5 9.72099C17.036 9.72099 17.539 9.90499 17.937 10.228L17.937 10.228C18.336 10.55 18.555 11.012 18.555 11.5C18.555 11.986 18.336 12.448 17.937 12.77L17.937 12.77L12.969 16.574Z" />
                 <path strokeLinecap="round" strokeLinejoin="round" d="M16 3V6M12 3V6M8 3V6M5 10H7M5 14H7M19 10H17M19 14H17M16 21V18M12 21V18M8 21V18" />
            </svg>
            Obtener Consejo del Coach
            </>
        )}
      </button>
       <p className="text-xs text-gray-500 mt-2">Nota: Los consejos son generados por IA y pueden no ser siempre perfectos. Consulta a un profesional para asesoramiento médico o de fitness específico.</p>
    </div>
  );
};

export default AICoachPanel;
