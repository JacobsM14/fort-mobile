import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
} from "@/constants/theme";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type SettingsRowProps = {
  icon: SymbolViewProps["name"];
  label: string;
  // Shown on the right instead of the chevron, for read-only rows.
  value?: string;
  onPress?: () => void;
};

export function SettingsRow({ icon, label, value, onPress }: SettingsRowProps) {
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const handlePress = useFocusedPress(onPress);

  return (
    <Pressable
      style={({ pressed }) => [
        globalStyles.card,
        pressed && globalStyles.cardPressed,
      ]}
      onPress={handlePress}
      disabled={onPress === undefined}
      accessibilityRole={onPress === undefined ? "text" : "button"}
    >
      {({ pressed }) => (
        <>
          <SymbolView
            name={icon}
            tintColor={colors.primary}
            size={iconSizes.lg}
          />
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
                size={iconSizes.sm}
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
    label: {
      flex: 1,
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    value: {
      fontSize: fontSizes.detail,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
  }),
);
