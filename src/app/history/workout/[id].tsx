import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

export default function HistoryWorkoutScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView style={globalStyles.modalScreen} edges={["top", "bottom"]}>
      <BackHeader backLabel={t.history.day} title={id} />
    </SafeAreaView>
  );
}
