import {
  createContext,
  use,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

// Route id that opens the routine modal to create one; any other id edits it.
export const NEW_ROUTINE_ID = "new";

type ExerciseCreatedListener = (exerciseId: string) => void;

type RoutineDraft = {
  // null while creating a new routine.
  routineId: string | null;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  exerciseIds: string[];
  setExerciseIds: Dispatch<SetStateAction<string[]>>;
  // new_custom_exercise is pushed on top of the exercise picker, which stays
  // mounted underneath: this hands it the exercise that was just created.
  subscribeExerciseCreated: (listener: ExerciseCreatedListener) => () => void;
  notifyExerciseCreated: (exerciseId: string) => void;
};

type RoutineDraftProviderProps = {
  routineId: string | null;
  initial?: { name: string; exerciseIds: string[] };
  children: ReactNode;
};

const RoutineDraftContext = createContext<RoutineDraft | null>(null);

export function RoutineDraftProvider({
  routineId,
  initial,
  children,
}: RoutineDraftProviderProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [exerciseIds, setExerciseIds] = useState<string[]>(
    initial?.exerciseIds ?? [],
  );
  const exerciseCreatedListener = useRef<ExerciseCreatedListener | null>(null);

  function subscribeExerciseCreated(listener: ExerciseCreatedListener) {
    exerciseCreatedListener.current = listener;
    return () => {
      if (exerciseCreatedListener.current === listener) {
        exerciseCreatedListener.current = null;
      }
    };
  }

  function notifyExerciseCreated(exerciseId: string) {
    exerciseCreatedListener.current?.(exerciseId);
  }

  return (
    <RoutineDraftContext
      value={{
        routineId,
        name,
        setName,
        exerciseIds,
        setExerciseIds,
        subscribeExerciseCreated,
        notifyExerciseCreated,
      }}
    >
      {children}
    </RoutineDraftContext>
  );
}

export function useRoutineDraft(): RoutineDraft {
  const draft = use(RoutineDraftContext);
  if (draft === null) {
    throw new Error("useRoutineDraft must be used inside RoutineDraftProvider");
  }
  return draft;
}
