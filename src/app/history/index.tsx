import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  return (
    <SafeAreaView style={globalStyles.modalScreen} edges={["top", "bottom"]}>
      <BackHeader backLabel={t.tabs.progress} title={t.history.title} />
    </SafeAreaView>
  );
}
