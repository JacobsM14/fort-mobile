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
  onStart?: () => void;
};

export function StartRoutineRow({
  name,
  muscles,
  trackingTypes,
  onStart,
}: StartRoutineRowProps) {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const start = useFocusedPress(onStart);
  const types = TRACKING_TYPES.filter((type) => trackingTypes.includes(type));

  return (
    <View style={globalStyles.card}>
      <View style={styles.info}>
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
        accessibilityLabel={t.today.startRoutine(name)}
      >
        <Text style={globalStyles.pressedButtonText}>{t.today.start}</Text>
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    info: {
      flex: 1,
      gap: spacing.xs,
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
