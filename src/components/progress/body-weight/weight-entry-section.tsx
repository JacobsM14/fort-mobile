import { Alert, StyleSheet, Text, View } from "react-native";

import { BodyWeightEntry } from "@/components/progress/body-weight/body-weight-entry";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useToday } from "@/hooks/use-today";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import {
  bodyWeightOnDay,
  latestBodyWeightKg,
  saveBodyWeight,
} from "@/features/body/queries";

import type { BodyWeightEntry as BodyWeightRecord } from "@/features/body/queries";

import { formatShortDay, toDateKey } from "@/utils/date";

import { fontSizes, fontsJetBrainsMono } from "@/constants/theme";

type WeightEntrySectionProps = {
  entries: readonly BodyWeightRecord[];
  loaded: boolean;
};

export function WeightEntrySection({
  entries,
  loaded,
}: WeightEntrySectionProps) {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const units = useUnits();
  const styles = useStyles();
  const today = useToday();

  // The box starts from the latest weigh-in, whatever the range filtered.
  const latestWeightKg = latestBodyWeightKg(entries);
  const todayWeight = bodyWeightOnDay(entries, toDateKey(today));

  function saveWeight(kg: number) {
    try {
      saveBodyWeight(today, kg);
    } catch {
      Alert.alert(t.progress.saveWeightError);
    }
  }

  return (
    <View style={globalStyles.titledSection}>
      <View style={styles.header}>
        <Text style={globalStyles.sectionTitle}>
          {t.progress.registerWeight}
        </Text>
        <Text style={styles.today}>
          {t.progress.today} · {formatShortDay(today, language)}
        </Text>
      </View>
      {loaded && (
        <BodyWeightEntry
          key={units.weight}
          initialKg={latestWeightKg}
          savedKg={todayWeight?.weightKg}
          onSave={saveWeight}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    today: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.primary,
    },
  }),
);
