
export interface User {
  id: string;
  email: string;
  name: string;
  goal?: UserGoal;
  // Add other relevant user details
}

export enum UserGoal {
  MUSCLE_GAIN = 'Ganar Músculo',
  WEIGHT_LOSS = 'Perder Peso',
  ENDURANCE = 'Mejorar Resistencia',
  GENERAL_FITNESS = 'Fitness General',
}

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
  equipmentNeeded: string;
  instructions: string;
  videoUrl?: string; // Placeholder for video
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  imageUrl?: string; 
  gifUrl?: string; // URL for the exercise GIF
}

export interface ExerciseInRoutine {
  exerciseId: string;
  sets: number;
  reps: string; // e.g., "8-12" or "AMRAP"
  restTimeSeconds: number; // Rest time in seconds
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  exercises: ExerciseInRoutine[];
  createdBy: string; // userId
}

export interface LoggedSet {
  reps: number;
  weight: number;
}

export interface LoggedExercise {
  exerciseId: string;
  setsPerformed: LoggedSet[];
  notes?: string;
  difficultyRating?: 'Fácil' | 'Justo' | 'Difícil';
}

export interface WorkoutLog {
  id: string;
  userId: string;
  routineId?: string; // Optional if it's a custom workout
  routineName?: string; // Store name for display
  date: string; // ISO string
  completedExercises: LoggedExercise[];
  durationMinutes?: number;
}

export interface AICoachMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

// Props for components
export interface ExerciseCardProps {
  exercise: Exercise;
  onAddToRoutine?: (exerciseId: string) => void;
}

export interface RoutineFormProps {
  onSubmit: (routine: Omit<Routine, 'id' | 'createdBy'>) => void;
  initialRoutine?: Omit<Routine, 'id' | 'createdBy'>;
  availableExercises: Exercise[];
}

export interface WorkoutLoggerProps {
  routine: Routine;
  onWorkoutComplete: (loggedExercises: LoggedExercise[], durationMinutes: number, difficultyRating?: 'Fácil' | 'Justo' | 'Difícil') => void;
}

export interface AICoachPanelProps {
  userId: string;
  userGoal?: UserGoal;
  lastWorkoutLog?: WorkoutLog;
}