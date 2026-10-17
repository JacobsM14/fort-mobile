import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";

import { fontsInstrument, fontsJetBrainsMono, spacing } from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type SettingsRowProps = {
  icon: SymbolViewProps["name"];
  label: string;
  // Shown on the right instead of the chevron, for read-only rows.
  value?: string;
  onPress?: () => void;
};

export function SettingsRow({ icon, label, value, onPress }: SettingsRowProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={onPress}
      disabled={onPress === undefined}
      accessibilityRole={onPress === undefined ? "text" : "button"}
    >
      {({ pressed }) => (
        <>
          <SymbolView name={icon} tintColor={colors.primary} size={22} />
          <Text style={styles.label}>{label}</Text>
          {value !== undefined ? (
            <Text style={styles.value}>{value}</Text>
          ) : (
            onPress !== undefined && (
              <SymbolView
                name={{
                  ios: "chevron.right",
                  android: "chevron_right",
                  web: "chevron_right",
                }}
                tintColor={pressed ? colors.primary : colors.disabled}
                size={18}
              />
            )
          )}
        </>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: 56,
      paddingHorizontal: spacing.md,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 2,
    },
    rowPressed: {
      borderColor: colors.primary,
    },
    label: {
      flex: 1,
      fontSize: 16,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    value: {
      fontSize: 14,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
  }),
);
