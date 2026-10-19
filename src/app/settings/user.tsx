import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/ui/layout/back-header";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

export default function UserScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.user}
      />
    </SafeAreaView>
  );
}
