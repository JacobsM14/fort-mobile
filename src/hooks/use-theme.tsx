import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
  type Theme as NavigationTheme,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { createContext, use, useEffect, useState, type ReactNode } from "react";
import { Appearance, Platform, useColorScheme } from "react-native";

import {
  loadAccentColor,
  saveAccentColor,
} from "@/features/settings/accent-color";
import {
  loadThemePreference,
  saveThemePreference,
} from "@/features/settings/theme-preference";

import type { AccentColor, ThemePreference } from "@/constants/enums";

import {
  mapAccents,
  themes,
  type ColorScheme,
  type Theme,
} from "@/constants/theme";

type ThemeContextValue = Theme & {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  setAccent: (accent: AccentColor) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function toNavigationTheme({ scheme, colors }: Theme): NavigationTheme {
  const base = scheme === "dark" ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.backgroundSecondary,
      text: colors.text,
      border: colors.border,
    },
  };
}

const navigationThemes: Record<
  ColorScheme,
  Record<AccentColor, NavigationTheme>
> = {
  light: mapAccents((accent) => toNavigationTheme(themes.light[accent])),
  dark: mapAccents((accent) => toNavigationTheme(themes.dark[accent])),
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreferenceState] = useState(loadThemePreference);
  const [accent, setAccentState] = useState(loadAccentColor);
  const systemScheme = useColorScheme();
  // The app was designed dark first, so an unknown system scheme stays dark.
  const scheme: ColorScheme =
    preference === "system"
      ? systemScheme === "light"
        ? "light"
        : "dark"
      : preference;
  const theme = themes[scheme][accent];

  useEffect(() => {
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(
        preference === "system" ? "unspecified" : preference,
      );
    }
  }, [preference]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(theme.colors.background);
  }, [theme]);

  function setPreference(next: ThemePreference) {
    saveThemePreference(next);
    setPreferenceState(next);
  }

  function setAccent(next: AccentColor) {
    saveAccentColor(next);
    setAccentState(next);
  }

  return (
    <ThemeContext value={{ ...theme, preference, setPreference, setAccent }}>
      <NavigationThemeProvider value={navigationThemes[scheme][accent]}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        {children}
      </NavigationThemeProvider>
    </ThemeContext>
  );
}

export function useTheme(): ThemeContextValue {
  const theme = use(ThemeContext);
  if (theme === null) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return theme;
}

export function makeStyles<T>(factory: (theme: Theme) => T): () => T {
  const byTheme: Record<ColorScheme, Record<AccentColor, T>> = {
    light: mapAccents((accent) => factory(themes.light[accent])),
    dark: mapAccents((accent) => factory(themes.dark[accent])),
  };
  return function useStyles() {
    const { scheme, accent } = useTheme();
    return byTheme[scheme][accent];
  };
}
