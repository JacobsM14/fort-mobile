import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { Chip } from "@/components/ui/inputs/chip";
import { BottomSheet } from "@/components/ui/overlays/bottom-sheet";
import { TRACKING_TYPES, type TrackingType } from "@/constants/enums";
import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";
import { TRACKING_TYPE_ICONS } from "@/constants/tracking-type-icons";
import type { MuscleId } from "@/features/exercises/catalog";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

type ExerciseFiltersSheetProps = {
  visible: boolean;
  onClose: () => void;
  typeFilter: readonly TrackingType[];
  muscleFilter: readonly MuscleId[];
  // Only muscles that some exercise works, so no chip leads to an empty list.
  muscles: readonly MuscleId[];
  resultCount: number;
  onToggleType: (type: TrackingType) => void;
  onToggleMuscle: (muscle: MuscleId) => void;
  onClear: () => void;
};

export function ExerciseFiltersSheet({
  visible,
  onClose,
  typeFilter,
  muscleFilter,
  muscles,
  resultCount,
  onToggleType,
  onToggleMuscle,
  onClear,
}: ExerciseFiltersSheetProps) {
  const { t } = useTranslation();
  const { globalStyles, colors } = useTheme();
  const styles = useStyles();
  const hasFilters = typeFilter.length > 0 || muscleFilter.length > 0;

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      closeLabel={t.newExercises.closeFilters}
      header={
        <View
          style={[
            globalStyles.dualheader,
            { borderBottomWidth: 1, borderBottomColor: colors.primary },
          ]}
        >
          <Text style={styles.title}>{t.newExercises.filters}</Text>
          <Pressable
            style={!hasFilters && styles.clearDisabled}
            onPress={onClear}
            disabled={!hasFilters}
            hitSlop={spacing.sm}
            accessibilityRole="button"
            accessibilityState={{ disabled: !hasFilters }}
          >
            <Text style={globalStyles.breadCrumbText}>
              {t.newExercises.clearFilters}
            </Text>
          </Pressable>
        </View>
      }
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.sections}
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.formCage}>
          <Text style={globalStyles.inputLabel}>
            {t.newExercises.typeLabel}
          </Text>
          <View style={styles.chips}>
            {TRACKING_TYPES.map((type) => (
              <Chip
                key={type}
                icon={TRACKING_TYPE_ICONS[type]}
                label={t.exercises.trackingTypes[type]}
                selected={typeFilter.includes(type)}
                onPress={() => onToggleType(type)}
              />
            ))}
          </View>
        </View>
        <View style={globalStyles.formCage}>
          <Text style={globalStyles.inputLabel}>
            {t.newExercises.muscleLabel}
          </Text>
          <View style={styles.chips}>
            {muscles.map((muscle) => (
              <Chip
                key={muscle}
                label={t.muscles[muscle]}
                selected={muscleFilter.includes(muscle)}
                onPress={() => onToggleMuscle(muscle)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <PrimaryButton
        label={t.newExercises.showResults(resultCount)}
        onPress={onClose}
      />
    </BottomSheet>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    title: {
      fontSize: fontSizes.heading,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    clearDisabled: {
      opacity: 0.4,
    },
    // Lets the chips scroll when the sheet reaches its max height, keeping the
    // header and the button in view.
    scroll: {
      flexShrink: 1,
    },
    sections: {
      gap: spacing.lg,
    },
    chips: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
  }),
);
