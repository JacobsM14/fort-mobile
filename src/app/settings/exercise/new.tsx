import { CreateExerciseScreen } from "@/components/exercises/create-exercise-screen";
import { useTranslation } from "@/i18n";

export default function NewExerciseScreen() {
  const { t } = useTranslation();

  return (
    <CreateExerciseScreen
      backLabel={t.settings.sections.exercises}
      screenStyle="screen"
    />
  );
}
