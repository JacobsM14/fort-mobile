import { createContext, use, useRef, type ReactNode } from "react";

type ExerciseAddedListener = (workoutExerciseId: string) => void;

type WorkoutSession = {
  workoutId: string;
  // add_exercises is pushed on top of the workout screen, which stays mounted
  // underneath: this tells it which exercise to switch to.
  subscribeExerciseAdded: (listener: ExerciseAddedListener) => () => void;
  notifyExerciseAdded: (workoutExerciseId: string) => void;
};

type WorkoutSessionProviderProps = {
  workoutId: string;
  children: ReactNode;
};

const WorkoutSessionContext = createContext<WorkoutSession | null>(null);

export function WorkoutSessionProvider({
  workoutId,
  children,
}: WorkoutSessionProviderProps) {
  const exerciseAddedListener = useRef<ExerciseAddedListener | null>(null);

  function subscribeExerciseAdded(listener: ExerciseAddedListener) {
    exerciseAddedListener.current = listener;
    return () => {
      if (exerciseAddedListener.current === listener) {
        exerciseAddedListener.current = null;
      }
    };
  }

  function notifyExerciseAdded(workoutExerciseId: string) {
    exerciseAddedListener.current?.(workoutExerciseId);
  }

  return (
    <WorkoutSessionContext
      value={{ workoutId, subscribeExerciseAdded, notifyExerciseAdded }}
    >
      {children}
    </WorkoutSessionContext>
  );
}

export function useWorkoutSession(): WorkoutSession {
  const session = use(WorkoutSessionContext);
  if (session === null) {
    throw new Error(
      "useWorkoutSession must be used inside WorkoutSessionProvider",
    );
  }
  return session;
}
