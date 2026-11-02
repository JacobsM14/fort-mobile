import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type SelectFieldProps = {
  label: string;
  // The option chosen now, as it reads.
  valueLabel: string;
  // Whether the list is open, which the screen owns: the list is drawn outside
  // the scroll view that holds the field (see OptionsSheet).
  open: boolean;
  onPress: () => void;
};

// A field that shows the chosen option and opens a list to change it.
export function SelectField({
  label,
  valueLabel,
  open,
  onPress,
}: SelectFieldProps) {
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <View style={globalStyles.formCage}>
      <Text style={globalStyles.inputLabel}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.box,
          (open || pressed) && styles.boxActive,
        ]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${valueLabel}`}
        accessibilityState={{ expanded: open }}
      >
        {({ pressed }) => (
          <>
            <Text style={styles.value} numberOfLines={1}>
              {valueLabel}
            </Text>
            <SymbolView
              name={{
                ios: "chevron.down",
                android: "expand_more",
                web: "expand_more",
              }}
              tintColor={
                open
                  ? colors.primary
                  : pressed
                    ? colors.primary
                    : colors.disabled
              }
              size={iconSizes.sm}
            />
          </>
        )}
      </Pressable>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    box: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      minHeight: controlHeights.md,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.xs,
    },
    boxActive: {
      borderColor: colors.primary,
    },
    value: {
      flex: 1,
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
  }),
);
