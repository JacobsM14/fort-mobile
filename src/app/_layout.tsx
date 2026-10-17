import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from "@expo-google-fonts/instrument-sans";
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
  JetBrainsMono_600SemiBold,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useDatabase } from "@/db/use-database";
import { makeStyles, ThemeProvider } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

SplashScreen.preventAutoHideAsync();

// Keeps the tabs underneath when a modal is opened directly (e.g. a deep
// link), so dismissing it doesn't leave an empty stack.
export const unstable_settings = {
  anchor: "(tabs)",
};

const MODAL_OPTIONS = {
  presentation: "modal",
  animation: "slide_from_bottom",
} as const;

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootNavigator />
    </ThemeProvider>
  );
}

function RootNavigator() {
  const styles = useStyles();
  const { ready, error } = useDatabase();
  const [fontsLoaded, fontsError] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    JetBrainsMono_600SemiBold,
    JetBrainsMono_700Bold,
  });
  const { t } = useTranslation();

  // Si la fuente falla se sigue adelante con la del sistema.
  const fontsDone = fontsLoaded || fontsError !== null;
  const done = (ready && fontsDone) || error !== undefined;

  useEffect(() => {
    if (done) {
      SplashScreen.hideAsync();
    }
  }, [done]);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          {t.errors.database}: {error.message}
        </Text>
      </View>
    );
  }

  if (!done) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="routine/[id]" options={MODAL_OPTIONS} />
      <Stack.Screen name="settings" options={MODAL_OPTIONS} />
    </Stack>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 56,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },
    errorText: {
      color: colors.text,
    },
  }),
);
