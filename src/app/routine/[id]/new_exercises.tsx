import { router } from "expo-router";

import { ExercisePickerScreen } from "@/components/exercises/exercise-picker-screen";

import { NEW_ROUTINE_ID, useRoutineDraft } from "@/hooks/use-routine-draft";
import { useTranslation } from "@/i18n";

export default function NewExercisesScreen() {
  const { t } = useTranslation();
  const { routineId, exerciseIds, setExerciseIds, subscribeExerciseCreated } =
    useRoutineDraft();

  return (
    <ExercisePickerScreen
      backLabel={
        routineId === null
          ? t.newExercises.breadCrumb
          : t.newExercises.breadCrumbEdit
      }
      initialSelectedIds={exerciseIds}
      doneLabel={t.newExercises.done}
      onDone={(selectedIds) => {
        setExerciseIds(selectedIds);
        router.back();
      }}
      onCreateCustom={() =>
        router.push({
          pathname: "/routine/[id]/new_custom_exercise",
          params: { id: routineId ?? NEW_ROUTINE_ID },
        })
      }
      subscribeExerciseCreated={subscribeExerciseCreated}
    />
  );
}
