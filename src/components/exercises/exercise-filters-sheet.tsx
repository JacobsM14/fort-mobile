import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { Chip } from "@/components/ui/inputs/chip";
import { BottomSheet } from "@/components/ui/overlays/bottom-sheet";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  TRACKING_TYPES,
  type MuscleGroup,
  type TrackingType,
} from "@/constants/enums";
import { TRACKING_TYPE_ICONS } from "@/constants/tracking-type-icons";

import type { MuscleId } from "@/features/exercises/catalog";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

type ExerciseFiltersSheetProps = {
  visible: boolean;
  onClose: () => void;
  typeFilter: readonly TrackingType[];
  groupFilter: readonly MuscleGroup[];
  muscleFilter: readonly MuscleId[];
  groups: readonly MuscleGroup[];
  muscles: readonly MuscleId[];
  resultCount: number;
  onToggleType: (type: TrackingType) => void;
  onToggleGroup: (group: MuscleGroup) => void;
  onToggleMuscle: (muscle: MuscleId) => void;
  onClear: () => void;
};

export function ExerciseFiltersSheet({
  visible,
  onClose,
  typeFilter,
  groupFilter,
  muscleFilter,
  groups,
  muscles,
  resultCount,
  onToggleType,
  onToggleGroup,
  onToggleMuscle,
  onClear,
}: ExerciseFiltersSheetProps) {
  const { t } = useTranslation();
  const { globalStyles, colors } = useTheme();
  const styles = useStyles();
  const hasFilters =
    typeFilter.length > 0 || groupFilter.length > 0 || muscleFilter.length > 0;

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
            {t.newExercises.groupLabel}
          </Text>
          <View style={styles.chips}>
            {groups.map((group) => (
              <Chip
                key={group}
                label={t.muscleGroups[group]}
                selected={groupFilter.includes(group)}
                onPress={() => onToggleGroup(group)}
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
