import { StyleSheet } from "react-native";

import { ACCENT_COLORS, type AccentColor } from "@/constants/enums";

export type ColorScheme = "light" | "dark";

type BaseColors = {
  background: string;
  backgroundSecondary: string;
  text: string;
  disabled: string;
  border: string;
  scrim: string;
};

type AccentShades = {
  primary: string;
  onPrimary: string;
};

export type Colors = BaseColors & AccentShades;

const baseColors: Record<ColorScheme, BaseColors> = {
  dark: {
    background: "#0C0C0D",
    backgroundSecondary: "#161618",
    text: "#F2F2F0",
    disabled: "#A0A0A8",
    border: "#6A6A72",
    scrim: "#00000099",
  },
  light: {
    background: "#F4F4F1",
    backgroundSecondary: "#FFFFFF",
    text: "#121214",
    disabled: "#64646C",
    border: "#85858D",
    scrim: "#00000066",
  },
};

export const accentColors: Record<
  AccentColor,
  Record<ColorScheme, AccentShades>
> = {
  orange: {
    dark: { primary: "#FF6A3D", onPrimary: "#0C0C0D" },
    light: { primary: "#C7401A", onPrimary: "#FFFFFF" },
  },
  blue: {
    dark: { primary: "#4D9FFF", onPrimary: "#0C0C0D" },
    light: { primary: "#1F5FC4", onPrimary: "#FFFFFF" },
  },
  green: {
    dark: { primary: "#3DD68C", onPrimary: "#0C0C0D" },
    light: { primary: "#12804B", onPrimary: "#FFFFFF" },
  },
  purple: {
    dark: { primary: "#A98BFF", onPrimary: "#0C0C0D" },
    light: { primary: "#6B45D9", onPrimary: "#FFFFFF" },
  },
  pink: {
    dark: { primary: "#FF5C9A", onPrimary: "#0C0C0D" },
    light: { primary: "#C2185B", onPrimary: "#FFFFFF" },
  },
  amber: {
    dark: { primary: "#FFC23D", onPrimary: "#0C0C0D" },
    light: { primary: "#8A5A00", onPrimary: "#FFFFFF" },
  },
};

export function mapAccents<T>(
  fn: (accent: AccentColor) => T,
): Record<AccentColor, T> {
  return Object.fromEntries(
    ACCENT_COLORS.map((accent) => [accent, fn(accent)]),
  ) as Record<AccentColor, T>;
}

export const fontsInstrument = {
  regular: "InstrumentSans_400Regular",
  medium: "InstrumentSans_500Medium",
  semiBold: "InstrumentSans_600SemiBold",
  bold: "InstrumentSans_700Bold",
};

export const fontsJetBrainsMono = {
  regular: "JetBrainsMono_400Regular",
  medium: "JetBrainsMono_500Medium",
  semiBold: "JetBrainsMono_600SemiBold",
  bold: "JetBrainsMono_700Bold",
};

export const spacing = {
  xs: 4,
  sm: 12,
  md: 16,
  lg: 24,
};

function createGlobalStyles(colors: Colors) {
  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.md,
      paddingVertical: 56,
      paddingHorizontal: 20,
      gap: 22,
    },
    modalScreen: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.md,
      paddingVertical: 30,
      paddingHorizontal: 20,
      gap: 22,
    },
    dualheader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacing.sm,
    },
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      fontSize: 46,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    subtitle: {
      fontSize: 12,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    breadCrumbPress: {
      minHeight: 44,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      color: colors.primary,
    },
    breadCrumbText: {
      fontSize: 15,
      fontFamily: fontsInstrument.semiBold,
      color: colors.primary,
    },
    formCage: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
    },
    inputLabel: {
      fontSize: 12,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
      letterSpacing: 0.8,
      textTransform: "uppercase",
    },
    boxInput: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 2,
      paddingHorizontal: 14,
      boxSizing: "border-box",
      fontSize: 18,
      fontFamily: fontsInstrument.semiBold,
      fontWeight: "600",
      color: colors.text,
    },
    notPressedButton: {
      height: 44,
      paddingHorizontal: 14,
      justifyContent: "center",
      backgroundColor: "transparent",
      borderWidth: 1,
      borderColor: colors.disabled,
      borderRadius: 2,
    },
    pressedButton: {
      height: 44,
      paddingHorizontal: 14,
      justifyContent: "center",
      backgroundColor: colors.primary,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: 2,
    },
    notPressedButtonText: {
      fontSize: 15,
      fontFamily: fontsInstrument.semiBold,
      color: colors.disabled,
    },
    pressedButtonText: {
      fontSize: 15,
      fontFamily: fontsInstrument.semiBold,
      color: colors.onPrimary,
    },
  });
}

export type GlobalStyles = ReturnType<typeof createGlobalStyles>;

export type Theme = {
  scheme: ColorScheme;
  accent: AccentColor;
  colors: Colors;
  globalStyles: GlobalStyles;
};

function createTheme(scheme: ColorScheme, accent: AccentColor): Theme {
  const colors = { ...baseColors[scheme], ...accentColors[accent][scheme] };
  return { scheme, accent, colors, globalStyles: createGlobalStyles(colors) };
}

export const themes: Record<ColorScheme, Record<AccentColor, Theme>> = {
  light: mapAccents((accent) => createTheme("light", accent)),
  dark: mapAccents((accent) => createTheme("dark", accent)),
};
