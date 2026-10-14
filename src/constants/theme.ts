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
  submitButtom: {
    borderRadius: 2,
    borderWidth: 1.5,
    borderStyle: "dashed",
    fontSize: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    height: 56,
  },
  submitButtonText: {
    fontWeight: "bold",
    fontFamily: fontsInstrument.bold,
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
    borderColor: "#6A6A72",
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
    color: colors.background,
  },
});
