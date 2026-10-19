import { CreateExerciseScreen } from "@/components/exercises/create-exercise-screen";
import { useRoutineDraft } from "@/hooks/use-routine-draft";
import { useTranslation } from "@/i18n";

export default function NewCustomExerciseScreen() {
  const { t } = useTranslation();
  const { notifyExerciseCreated } = useRoutineDraft();

  return (
    <CreateExerciseScreen
      backLabel={t.newCustomExercise.breadCrumb}
      screenStyle="modalScreen"
      onCreated={notifyExerciseCreated}
    />
  );
}
