import { View } from "react-native";

import { MuscleMap } from "@/components/progress/muscles/muscle-map";
import { SectionTitle } from "@/components/progress/today/section-title";

import { useTranslation } from "@/i18n";

import type { MuscleId } from "@/features/exercises/catalog";

const SHARES = {
  chest: 0.33,
  front_delts: 0.17,
  lats: 0.17,
  abs: 0.17,
  quads: 0.16,
} satisfies Partial<Record<MuscleId, number>>;

export function TodayMuscles() {
  const { t } = useTranslation();

  return (
    <View>
      <SectionTitle label={t.progress.musclesWorked} />
      <MuscleMap shares={SHARES} />
    </View>
  );
}
