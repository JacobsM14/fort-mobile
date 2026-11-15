import { Text, View } from "react-native";

import { MuscleMap } from "@/components/progress/muscles/muscle-map";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { muscleShares } from "@/features/progress/today";

import type { TodayEntry } from "@/features/progress/today";

type TodayMusclesProps = {
  entries: readonly TodayEntry[];
};

export function TodayMuscles({ entries }: TodayMusclesProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  const shares = muscleShares(entries);

  if (Object.keys(shares).length === 0) {
    return null;
  }

  return (
    <View style={globalStyles.titledSection}>
      <Text style={globalStyles.sectionTitle}>{t.progress.musclesWorked}</Text>
      <MuscleMap shares={shares} />
    </View>
  );
}
