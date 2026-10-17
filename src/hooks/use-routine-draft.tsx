import {
  createContext,
  use,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

// Route id that opens the routine modal to create one; any other id edits it.
export const NEW_ROUTINE_ID = "new";

type RoutineDraft = {
  // null while creating a new routine.
  routineId: string | null;
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  exerciseIds: string[];
  setExerciseIds: Dispatch<SetStateAction<string[]>>;
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

  return (
    <RoutineDraftContext
      value={{ routineId, name, setName, exerciseIds, setExerciseIds }}
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
