import { View } from "react-native";

import { MuscleMap } from "@/components/progress/muscles/muscle-map";
import { SectionTitle } from "@/components/progress/today/section-title";

import { useTranslation } from "@/i18n";

import { muscleShares } from "@/features/progress/today";

import type { TodayEntry } from "@/features/progress/today";

type TodayMusclesProps = {
  entries: readonly TodayEntry[];
};

export function TodayMuscles({ entries }: TodayMusclesProps) {
  const { t } = useTranslation();

  const shares = muscleShares(entries);

  if (Object.keys(shares).length === 0) {
    return null;
  }

  return (
    <View>
      <SectionTitle label={t.progress.musclesWorked} />
      <MuscleMap shares={shares} />
    </View>
  );
}
