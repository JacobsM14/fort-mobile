import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { globalStyles } from "@/constants/theme";
import { useTranslation } from "@/i18n";

export default function ProgressScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <Text style={globalStyles.title}>{t.tabs.progress}</Text>
    </SafeAreaView>
  );
}
