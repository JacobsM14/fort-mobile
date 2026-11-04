import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type WorkoutFooterProps = {
  // The names of the exercises around the current one, if there are any.
  previousName?: string;
  nextName?: string;
  onPrevious: () => void;
  onNext: () => void;
  onCancel: () => void;
  onFinish: () => void;
};

// Fixed under the scrolling content. It steps through the exercises, and at
// either end it turns into the way out: cancel on the first, finish on the
// last.
export function WorkoutFooter({
  previousName,
  nextName,
  onPrevious,
  onNext,
  onCancel,
  onFinish,
}: WorkoutFooterProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.footer}>
      {previousName === undefined ? (
        <Pressable
          style={({ pressed }) => [
            globalStyles.notPressedButton,
            styles.cancel,
            pressed && styles.outlinePressed,
          ]}
          onPress={onCancel}
          accessibilityRole="button"
        >
          <Text style={globalStyles.notPressedButtonText}>
            {t.workout.cancel}
          </Text>
        </Pressable>
      ) : (
        <StepButton
          direction="previous"
          label={t.workout.previousExercise}
          name={previousName}
          onPress={onPrevious}
        />
      )}
      {nextName === undefined ? (
        <View style={styles.next}>
          <PrimaryButton label={t.workout.finish} onPress={onFinish} />
        </View>
      ) : (
        <StepButton
          direction="next"
          label={t.workout.nextExercise}
          name={nextName}
          onPress={onNext}
        />
      )}
    </View>
  );
}

type StepButtonProps = {
  direction: "previous" | "next";
  label: string;
  name: string;
  onPress: () => void;
};

const ARROWS: Record<StepButtonProps["direction"], SymbolViewProps["name"]> = {
  previous: {
    ios: "arrow.left",
    android: "arrow_back_ios",
    web: "arrow_back_ios",
  },
  next: {
    ios: "arrow.right",
    android: "arrow_forward_ios",
    web: "arrow_forward_ios",
  },
};

// The previous exercise is an outline on the narrow side; the next one is the
// filled button on the wide side, since moving forward is the usual step.
function StepButton({ direction, label, name, onPress }: StepButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const handlePress = useFocusedPress(onPress);
  const isNext = direction === "next";

  const arrow = (
    <SymbolView
      name={ARROWS[direction]}
      tintColor={isNext ? colors.onPrimary : colors.disabled}
      size={iconSizes.xs}
    />
  );

  return (
    <Pressable
      style={({ pressed }) => [
        styles.step,
        isNext ? styles.stepNext : styles.stepPrevious,
        pressed && (isNext ? styles.filledPressed : styles.outlinePressed),
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${label}, ${name}`}
    >
      {!isNext && arrow}
      <View style={styles.stepText}>
        <Text
          style={[
            styles.stepLabel,
            isNext ? styles.stepLabelNext : styles.alignRight,
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {label}
        </Text>
        <Text
          style={[
            styles.stepName,
            isNext ? styles.stepNameNext : styles.alignRight,
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>
      {isNext && arrow}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    footer: {
      flexDirection: "row",
      gap: spacing.sm,
      paddingBottom: spacing.sm,
      paddingTop: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    cancel: {
      flex: 1,
      alignItems: "center",
    },
    outlinePressed: {
      borderColor: colors.primary,
    },
    filledPressed: {
      opacity: 0.85,
    },
    next: {
      flex: 2,
    },
    // As tall as the primary button beside it.
    step: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: 64,
      paddingHorizontal: spacing.md,
      borderRadius: radii.xs,
    },
    stepPrevious: {
      flex: 1,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: colors.disabled,
    },
    stepNext: {
      flex: 2,
      backgroundColor: colors.primary,
    },
    stepText: {
      flex: 1,
      gap: 2,
    },
    stepLabel: {
      fontSize: fontSizes.lowFont,
      fontFamily: fontsJetBrainsMono.medium,
      letterSpacing: 0.4,
      textTransform: "uppercase",
      color: colors.disabled,
    },
    alignRight: {
      textAlign: "right",
    },
    stepLabelNext: {
      color: colors.onPrimary,
      opacity: 0.75,
    },
    stepName: {
      fontSize: fontSizes.label,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    stepNameNext: {
      fontSize: fontSizes.button,
      fontFamily: fontsInstrument.bold,
      color: colors.onPrimary,
    },
  }),
);
