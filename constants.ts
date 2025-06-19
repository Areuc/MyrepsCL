
import { Exercise, UserGoal } from './types';
import { HarmCategory, HarmBlockThreshold } from "@google/genai";

export const APP_NAME = "Myreps";

let idCounter = 1;
const newId = () => `ex${idCounter++}`;

// Corrected function signature: 6 parameters
const createExercise = (
  name: string,
  muscleGroup: string,
  equipmentNeeded: string,
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado',
  customInstructions?: string,
  gifUrl?: string
): Exercise => {
  const sanitizedName = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/gi, '');
  return {
    id: newId(),
    name,
    muscleGroup,
    equipmentNeeded,
    instructions: customInstructions || `Realiza este ejercicio manteniendo una buena forma y controlando el movimiento. Consulta a un profesional si tienes dudas sobre la técnica correcta para ${name}.`,
    difficulty, // Uses the 4th parameter
    imageUrl: `https://picsum.photos/seed/${sanitizedName}/300/200`,
    gifUrl,     // Uses the 6th parameter
  };
};

export const MOCK_EXERCISES: Exercise[] = [
  // Pecho
  // Calls now match the 6-parameter signature
  createExercise('Press de Banca con Barra', 'Pecho', 'Barra, Banco', 'Intermedio', undefined, 'https://media1.tenor.com/m/0hoNLcggDG0AAAAC/bench-press.gif'),
  createExercise('Press Inclinado con Mancuernas', 'Pecho', 'Mancuernas, Banco Inclinado', 'Intermedio', undefined, 'https://media1.tenor.com/m/Nw3QMwEoJTcAAAAC/chest-incline-100.gif'),
  createExercise('Aperturas con Mancuernas', 'Pecho', 'Mancuernas, Banco', 'Intermedio', undefined, 'https://media1.tenor.com/m/oJXOnsC72qMAAAAC/crussifixo-no-banco-com-halteres.gif'),
  createExercise('Press Declinado con Barra', 'Pecho', 'Barra, Banco Declinado', 'Intermedio', undefined, 'https://media1.tenor.com/m/OgjLzf5LkqAAAAAC/decline-press.gif'),
  createExercise('Press de Pecho en Máquina', 'Pecho', 'Máquina de Press de Pecho', 'Intermedio', undefined, 'https://media1.tenor.com/m/2eqEvsYtMMIAAAAC/chest-press-dwayne-johnson.gif'),
  createExercise('Aperturas en Máquina Contractora (Pec Deck)', 'Pecho', 'Máquina Contractora (Pec Deck)', 'Intermedio', undefined, 'https://media1.tenor.com/m/k5ahyb6VmUkAAAAC/pec.gif'),
  createExercise('Cruce Poleas', 'Pecho', 'Poleas', 'Intermedio', undefined, 'https://fitcron.com/wp-content/uploads/2021/03/01881301-Cable-Middle-Fly_Chest_720.gif'),
  createExercise('Flexiones (Push-ups)', 'Pecho, Hombros, Tríceps', 'Peso Corporal', 'Principiante', undefined, 'https://fitcron.com/wp-content/uploads/2021/03/13111301-Wide-Hand-Push-up_Chest_720.gif'),
  // Corrected call for 'Press Frontal Cerrado con Poleas' (6 arguments)
  // Original 7-arg call was: ('Press Frontal Cerrado con Poleas', 'Pecho (inferior), Tríceps','Máquina Poleas', 'Intermedio', 'Principiante', undefined, 'GIF_URL')
  // 'Intermedio' was lost (p0), 'Principiante' was used as difficulty.
  createExercise('Press Frontal Cerrado con Poleas', 'Pecho (inferior), Tríceps','Máquina Poleas', 'Principiante', undefined, 'https://fitcron.com/wp-content/uploads/2021/03/33641301-Cable-Seating-Close-Press_Upper-Arms_720.gif'),
  createExercise('Flexiones Declinadas', 'Pecho (superior), Hombros, Tríceps', 'Peso Corporal, Elevación para pies', 'Intermedio', undefined, 'https://fitcron.com/wp-content/uploads/2021/03/02791301-Decline-Push-Up-m_chest_720.gif'),

  // Espalda
  createExercise('Peso Muerto Convencional', 'Espalda, Piernas (Global)', 'Barra', 'Avanzado', undefined, ''),
  createExercise('Remo con Barra (Pendlay o Yates)', 'Espalda', 'Barra', 'Intermedio', undefined, ''),
  createExercise('Remo con Mancuerna (a una mano)', 'Espalda', 'Mancuerna, Banco', 'Intermedio', undefined, ''),
  createExercise('Dominadas (Pull-ups) con Lastre', 'Espalda, Bíceps', 'Barra de Dominadas, Lastre', 'Avanzado', undefined, ''),
  createExercise('Jalón al Pecho (Lat Pulldown)', 'Espalda', 'Máquina de Jalón (Polea Alta)', 'Intermedio', undefined, ''),
  createExercise('Remo Sentado en Máquina (Polea Baja)', 'Espalda', 'Máquina de Remo (Polea Baja)', 'Intermedio', undefined, ''),
  createExercise('Jalón Tras Nuca', 'Espalda', 'Máquina de Jalón (Polea Alta)', 'Intermedio', 'Con cuidado y buena movilidad de hombros.', ''),
  createExercise('Dominadas (Pull-ups)', 'Espalda, Bíceps', 'Barra de Dominadas', 'Intermedio', undefined, ''),
  createExercise('Remo Invertido (Australian Pull-ups)', 'Espalda, Bíceps', 'Barra Baja o Anillas', 'Principiante', undefined, ''),
  createExercise('Superman', 'Espalda (Lumbar)', 'Peso Corporal', 'Principiante', undefined, ''),

  // Piernas (cuádriceps)
  createExercise('Sentadilla con Barra Trasera', 'Piernas (Cuádriceps, Glúteos)', 'Barra, Rack', 'Avanzado', undefined, ''),
  createExercise('Zancadas (Lunges) con Mancuernas', 'Piernas (Cuádriceps, Glúteos)', 'Mancuernas (opcional)', 'Intermedio', undefined, ''),
  createExercise('Sentadilla Frontal con Barra', 'Piernas (Cuádriceps)', 'Barra, Rack', 'Avanzado', undefined, ''),
  createExercise('Extensión de Piernas en Máquina', 'Piernas (Cuádriceps)', 'Máquina de Extensión de Piernas', 'Intermedio', undefined, ''),
  createExercise('Sentadilla Hack en Máquina', 'Piernas (Cuádriceps)', 'Máquina Hack Squat', 'Intermedio', undefined, ''),
  createExercise('Prensa de Piernas 45°', 'Piernas (Cuádriceps, Glúteos)', 'Máquina Prensa de Piernas', 'Intermedio', undefined, ''),
  createExercise('Sentadillas con Salto (Jump Squats)', 'Piernas (Cuádriceps, Glúteos)', 'Peso Corporal', 'Intermedio', undefined, ''),
  createExercise('Zancadas Caminando', 'Piernas (Cuádriceps, Glúteos)', 'Peso Corporal', 'Principiante', undefined, ''),

  // Piernas (isquiotibiales y glúteos)
  createExercise('Peso Muerto Rumano (RDL)', 'Piernas (Isquiotibiales, Glúteos)', 'Barra o Mancuernas', 'Intermedio', undefined, ''),
  createExercise('Hip Thrust con Barra', 'Piernas (Glúteos, Isquiotibiales)', 'Barra, Banco', 'Intermedio', undefined, ''),
  createExercise('Sentadilla Sumo con Barra o Mancuerna', 'Piernas (Aductores, Glúteos, Cuádriceps)', 'Barra o Mancuerna', 'Intermedio', undefined, ''),
  createExercise('Curl Femoral Tumbado en Máquina', 'Piernas (Isquiotibiales)', 'Máquina de Curl Femoral', 'Intermedio', undefined, ''),
  createExercise('Patada de Glúteo en Máquina o Polea', 'Piernas (Glúteos)', 'Máquina de Patada de Glúteo o Polea', 'Intermedio', undefined, ''),
  createExercise('Peso Muerto en Máquina Smith', 'Piernas (Isquiotibiales, Glúteos)', 'Máquina Smith', 'Intermedio', undefined, ''),
  createExercise('Elevaciones de Cadera (Glute Bridges)', 'Piernas (Glúteos)', 'Peso Corporal', 'Principiante', undefined, ''),
  createExercise('Puente de Glúteos a una Pierna', 'Piernas (Glúteos)', 'Peso Corporal', 'Intermedio', undefined, ''),

  // Hombros
  createExercise('Press Militar con Barra (De pie)', 'Hombros', 'Barra', 'Avanzado', undefined, ''),
  createExercise('Elevaciones Laterales con Mancuernas', 'Hombros (Lateral)', 'Mancuernas', 'Intermedio', undefined, ''),
  createExercise('Elevaciones Frontales con Mancuernas', 'Hombros (Anterior)', 'Mancuernas', 'Intermedio', undefined, ''),
  createExercise('Pájaros (Bent-Over Lateral Raises)', 'Hombros (Posterior)', 'Mancuernas', 'Intermedio', undefined, ''),
  createExercise('Press de Hombros en Máquina', 'Hombros', 'Máquina de Press de Hombros', 'Intermedio', undefined, ''),
  createExercise('Elevaciones Laterales en Polea', 'Hombros (Lateral)', 'Polea', 'Intermedio', undefined, ''),
  createExercise('Reverse Fly en Máquina Contractora (Pec Deck Inverso)', 'Hombros (Posterior)', 'Máquina Contractora (Pec Deck)', 'Intermedio', undefined, ''),
  createExercise('Pike Push-ups', 'Hombros, Tríceps', 'Peso Corporal', 'Intermedio', undefined, ''),
  createExercise('Wall Walks', 'Hombros, Core', 'Peso Corporal, Pared', 'Avanzado', undefined, ''),

  // Bíceps
  createExercise('Curl de Bíceps con Barra Recta o Z', 'Bíceps', 'Barra Recta o Z', 'Intermedio', undefined, ''),
  createExercise('Curl de Bíceps con Mancuernas (Alterno o Simultáneo)', 'Bíceps', 'Mancuernas', 'Intermedio', undefined, ''),
  createExercise('Curl Martillo con Mancuernas', 'Bíceps, Antebrazo', 'Mancuernas', 'Intermedio', undefined, ''),
  createExercise('Curl de Bíceps en Polea Baja', 'Bíceps', 'Polea Baja con Barra o Cuerda', 'Intermedio', undefined, ''),
  createExercise('Curl de Bíceps en Máquina Scott (Predicador)', 'Bíceps', 'Máquina Scott', 'Intermedio', undefined, ''),
  createExercise('Curl Concentrado con Mancuerna', 'Bíceps', 'Mancuerna, Banco', 'Intermedio', undefined, ''),
  createExercise('Chin-ups (Dominadas con Agarre Supino)', 'Bíceps, Espalda', 'Barra de Dominadas', 'Intermedio', undefined, ''),
  createExercise('Curl Isométrico con Toalla', 'Bíceps', 'Toalla', 'Principiante', undefined, ''),

  // Tríceps
  createExercise('Press Francés (Skullcrushers) con Barra', 'Tríceps', 'Barra Z o Recta, Banco', 'Intermedio', undefined, ''),
  createExercise('Extensiones de Tríceps con Mancuerna (Tras nuca, a una o dos manos)', 'Tríceps', 'Mancuerna', 'Intermedio', undefined, ''),
  createExercise('Patadas de Tríceps con Mancuerna', 'Tríceps', 'Mancuerna', 'Intermedio', undefined, ''),
  createExercise('Extensiones de Tríceps en Polea Alta (Jalón con Cuerda o Barra)', 'Tríceps', 'Polea Alta con Cuerda o Barra', 'Intermedio', undefined, ''),
  createExercise('Fondos en Máquina (Triceps Dips Machine)', 'Tríceps', 'Máquina de Fondos', 'Intermedio', undefined, ''),
  createExercise('Fondos en Paralelas (Dips)', 'Tríceps, Pecho, Hombros', 'Barras Paralelas', 'Avanzado', undefined, ''),
  createExercise('Fondos entre Bancos', 'Tríceps', 'Dos Bancos', 'Intermedio', undefined, ''),

  // Abdominales
  createExercise('Crunch con Peso (Disco sobre el pecho)', 'Abdominales', 'Disco o Mancuerna', 'Intermedio', undefined, ''),
  createExercise('Elevaciones de Piernas Colgado (con o sin mancuerna)', 'Abdominales (Inferior)', 'Barra de Dominadas, Mancuerna (opcional)', 'Avanzado', undefined, ''),
  createExercise('Crunch en Máquina de Abdominales', 'Abdominales', 'Máquina de Crunch', 'Intermedio', undefined, ''),
  createExercise('Elevaciones de Piernas en Banco Declinado', 'Abdominales (Inferior)', 'Banco Declinado', 'Intermedio', undefined, ''),
  createExercise('Plancha Abdominal (Plank)', 'Core (Abdominales, Lumbar)', 'Peso Corporal', 'Principiante', undefined, ''),
  createExercise('Crunches (Encogimientos Abdominales)', 'Abdominales (Superior)', 'Peso Corporal', 'Principiante', undefined, ''),
  createExercise('Bicycle Crunch (Encogimientos Bicicleta)', 'Abdominales (Oblicuos, Superior)', 'Peso Corporal', 'Intermedio', undefined, ''),
  createExercise('V-ups (Encogimientos en V)', 'Abdominales (Global)', 'Peso Corporal', 'Avanzado', undefined, ''),
  
  // Antebrazos
  createExercise('Curl de Antebrazo Inverso con Barra', 'Antebrazos (Extensores)', 'Barra', 'Intermedio', undefined, ''),
  createExercise('Curl de Muñeca con Barra o Mancuernas (Wrist Curls)', 'Antebrazos (Flexores)', 'Barra o Mancuernas, Banco', 'Intermedio', undefined, ''),
  createExercise('Paseo del Granjero (Farmer\'s Walk)', 'Antebrazos (Agarre), Trapecios, Core', 'Mancuernas Pesadas o Kettlebells', 'Intermedio', undefined, ''),
  createExercise('Curl de Muñeca en Máquina', 'Antebrazos', 'Máquina de Curl de Muñeca', 'Intermedio', undefined, ''),
  createExercise('Colgarse de Barra (Dead Hang)', 'Antebrazos (Agarre)', 'Barra de Dominadas', 'Principiante', undefined, ''),
  createExercise('Apretar Toalla/Pelota', 'Antebrazos (Agarre)', 'Toalla, Pelota de Tenis', 'Principiante', undefined, ''),

  // Trapecios
  createExercise('Encogimientos de Hombros con Barra (Shrugs)', 'Trapecios', 'Barra', 'Intermedio', undefined, ''),
  createExercise('Remo al Cuello con Barra (Upright Row)', 'Trapecios, Hombros', 'Barra', 'Intermedio', 'Realizar con precaución para evitar pinzamiento de hombro.', ''),
  createExercise('Encogimientos de Hombros en Máquina', 'Trapecios', 'Máquina de Encogimientos', 'Intermedio', undefined, ''),
  createExercise('Remo al Cuello en Polea Alta', 'Trapecios, Hombros', 'Polea Alta con Barra', 'Intermedio', undefined, ''),
  createExercise('Encogimientos de Hombros con Bandas Elásticas (Band Shrugs)', 'Trapecios', 'Banda Elástica', 'Principiante', undefined, '')
];

export const USER_GOALS_OPTIONS = Object.values(UserGoal);

export const GEMINI_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';

export const GEMINI_SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE}
];
