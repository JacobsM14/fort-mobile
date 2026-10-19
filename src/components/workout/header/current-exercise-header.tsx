import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/ui/buttons/icon-button";
import { ExerciseSelectButton } from "@/components/workout/header/exercise-select";

import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { MuscleId } from "@/features/exercises/catalog";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

type CurrentExerciseHeaderProps = {
  name: string;
  muscles: readonly MuscleId[];
  position: number;
  total: number;
  menuOpen: boolean;
  onShowInfo: () => void;
  onToggleMenu: () => void;
};

export function CurrentExerciseHeader({
  name,
  muscles,
  position,
  total,
  menuOpen,
  onShowInfo,
  onToggleMenu,
}: CurrentExerciseHeaderProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <View style={styles.text}>
        <Text style={styles.name}>{name}</Text>
        {muscles.length > 0 && (
          <Text style={styles.muscles}>
            {muscles.map((muscle) => t.muscles[muscle]).join(", ")}
          </Text>
        )}
      </View>
      <IconButton
        tone="muted"
        icon={{ ios: "info.circle", android: "info", web: "info" }}
        accessibilityLabel={t.exercises.showInfo}
        onPress={onShowInfo}
      />
      <ExerciseSelectButton
        position={position}
        total={total}
        open={menuOpen}
        onPress={onToggleMenu}
      />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    text: {
      flex: 1,
      gap: spacing.xs,
    },
    name: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    muscles: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
