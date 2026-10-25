import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { WorkoutHistoryItem } from "@/features/workouts/queries";

import { formatDateTime } from "@/utils/date";
import { formatDuration } from "@/utils/duration";

import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  spacing,
} from "@/constants/theme";

type WorkoutCardProps = {
  workout: WorkoutHistoryItem;
  onPress?: () => void;
};

// A workout in one row: its name, when and how long, and how much was done.
export function WorkoutCard({ workout, onPress }: WorkoutCardProps) {
  const { t, language } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const press = useFocusedPress(onPress);
  const inProgress = workout.endedAt === null;

  return (
    <Pressable
      style={({ pressed }) => [
        globalStyles.card,
        pressed && globalStyles.cardPressed,
      ]}
      onPress={press}
      disabled={onPress === undefined}
      accessibilityRole={onPress === undefined ? undefined : "button"}
    >
      <View style={styles.info}>
        {inProgress && (
          <Text style={[globalStyles.inputLabel, styles.status]}>
            {t.progress.inProgress}
          </Text>
        )}
        <Text style={styles.name} numberOfLines={1}>
          {workout.name ?? t.workout.title}
        </Text>
        <Text style={styles.detail}>
          {[
            formatDateTime(workout.startedAt, language),
            workout.endedAt === null
              ? null
              : formatDuration(
                  (workout.endedAt.getTime() - workout.startedAt.getTime()) /
                    1000,
                ),
          ]
            .filter((part) => part !== null)
            .join(" · ")}
        </Text>
        <Text style={styles.detail}>
          {t.progress.summary(workout.exercises.length, workout.setCount)}
        </Text>
      </View>
      {onPress !== undefined && (
        <SymbolView
          name={{
            ios: "chevron.right",
            android: "chevron_right",
            web: "chevron_right",
          }}
          tintColor={colors.disabled}
          size={iconSizes.md}
        />
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    info: {
      flex: 1,
      gap: spacing.xs,
    },
    status: {
      color: colors.primary,
    },
    name: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    detail: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
