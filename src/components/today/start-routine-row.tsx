import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { TRACKING_TYPES, type TrackingType } from "@/constants/enums";
import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  spacing,
} from "@/constants/theme";
import { TRACKING_TYPE_ICONS } from "@/constants/tracking-type-icons";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

type StartRoutineRowProps = {
  name: string;
  muscles: string;
  trackingTypes: readonly TrackingType[];
  // A workout of this routine is in progress: the row stands out and its
  // button continues it.
  active?: boolean;
  onStart?: () => void;
};

export function StartRoutineRow({
  name,
  muscles,
  trackingTypes,
  active = false,
  onStart,
}: StartRoutineRowProps) {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const start = useFocusedPress(onStart);
  // Always in the same order, so the icons line up from one row to the next.
  const types = TRACKING_TYPES.filter((type) => trackingTypes.includes(type));

  return (
    <View style={[globalStyles.card, active && styles.activeCard]}>
      <View style={styles.info}>
        {active && (
          <Text style={[globalStyles.inputLabel, styles.status]}>
            {t.today.inProgress}
          </Text>
        )}
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {muscles !== "" && (
          <Text style={styles.muscles} numberOfLines={2}>
            {muscles}
          </Text>
        )}
        {types.length > 0 && (
          <View
            style={styles.types}
            accessible
            accessibilityLabel={types
              .map((type) => t.exercises.trackingTypes[type])
              .join(", ")}
          >
            {types.map((type) => (
              <SymbolView
                key={type}
                name={TRACKING_TYPE_ICONS[type]}
                tintColor={colors.disabled}
                size={iconSizes.sm}
              />
            ))}
          </View>
        )}
      </View>
      <Pressable
        style={({ pressed }) => [
          globalStyles.pressedButton,
          pressed && styles.startPressed,
        ]}
        onPress={start}
        accessibilityRole="button"
        accessibilityLabel={
          active ? t.today.continueRoutine(name) : t.today.startRoutine(name)
        }
      >
        <Text style={globalStyles.pressedButtonText}>
          {active ? t.today.continue : t.today.start}
        </Text>
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    activeCard: {
      backgroundColor: colors.primaryTint,
      borderColor: colors.primary,
    },
    info: {
      flex: 1,
      gap: spacing.xs,
    },
    status: {
      color: colors.primary,
    },
    name: {
      fontSize: fontSizes.heading,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    muscles: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
    types: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    startPressed: {
      opacity: 0.85,
    },
  }),
);
