import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WeekDays } from "@/components/ui/week-days";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { formatDayHeader } from "@/utils/date";

export default function TodayScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <View>
        <Text style={globalStyles.subtitle}>
          {formatDayHeader(new Date(), language)}
        </Text>
        <Text style={globalStyles.title}>{t.today.title}</Text>
      </View>
      <WeekDays />
    </SafeAreaView>
  );
}
