import { StyleSheet } from "react-native";

export const colors = {
  background: "#0C0C0D",
  backgroundSecondary: "#161618",
  text: "#F2F2F0",
  disabled: "#A0A0A8",
  primary: "#FF6A3D",
};

// Cada peso es una familia distinta (así los registra useFonts en
// src/app/_layout.tsx). Usa estas en vez de fontWeight.
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

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
    paddingVertical: 56,
    paddingHorizontal: 20,
    gap: 22,
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
});
