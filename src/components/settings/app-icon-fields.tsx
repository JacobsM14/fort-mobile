import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { ACCENT_COLORS, type AccentColor } from "@/constants/enums";
import { changeAppIcon, loadAppIcon } from "@/features/settings/app-icon";

import {
  accentColors,
  baseColors,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

const ICON_SIZE = iconSizes.hero;

const ICON_ZOOM = 2;

export function AppIconFields() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const [icon, setIcon] = useState(loadAppIcon);

  function choose(option: AccentColor) {
    setIcon(option);
    changeAppIcon(option);
  }

  return (
    <View style={globalStyles.formCage}>
      <Text style={globalStyles.inputLabel}>{t.settings.appIcon.label}</Text>
      <Text style={[globalStyles.subtitle, styles.subtitle]}>
        {t.settings.appIcon.note}
      </Text>
      <View style={styles.icons} accessibilityRole="radiogroup">
        {ACCENT_COLORS.map((option) => {
          const selected = option === icon;
          return (
            <Pressable
              key={option}
              style={[styles.ring, selected && styles.ringSelected]}
              onPress={() => choose(option)}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={t.settings.accent.names[option]}
            >
              <View style={styles.icon}>
                <Image
                  source={require("@/assets/images/android-icon-monochrome.png")}
                  style={styles.iconImage}
                  tintColor={accentColors[option].dark.primary}
                  accessibilityIgnoresInvertColors
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    subtitle: {
      fontSize: fontSizes.lowFont,
      marginBottom: spacing.sm,
    },
    icons: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.md,
    },
    ring: {
      padding: spacing.xxs,
      borderWidth: 2,
      borderColor: "transparent",
      borderRadius: radii.md,
    },
    ringSelected: {
      borderColor: colors.text,
    },
    icon: {
      width: ICON_SIZE,
      height: ICON_SIZE,
      borderRadius: radii.md,
      backgroundColor: baseColors.dark.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    iconImage: {
      width: ICON_SIZE * ICON_ZOOM,
      height: ICON_SIZE * ICON_ZOOM,
    },
  }),
);
