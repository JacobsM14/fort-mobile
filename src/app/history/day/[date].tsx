import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

export default function HistoryDayScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  // Local day as YYYY-MM-DD.
  const { date } = useLocalSearchParams<{ date: string }>();

  return (
    <SafeAreaView style={globalStyles.modalScreen} edges={["top", "bottom"]}>
      <BackHeader backLabel={t.history.title} title={date} />
    </SafeAreaView>
  );
}
