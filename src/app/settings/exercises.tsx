import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/ui/back-header";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

export default function ExercisesScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.exercises}
      />
    </SafeAreaView>
  );
}
