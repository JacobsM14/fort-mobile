import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
  InstrumentSans_700Bold,
} from "@expo-google-fonts/instrument-sans";
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from "@expo-google-fonts/jetbrains-mono";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { SetupScreen } from "@/components/onboarding/setup-screen";
import { TutorialDialog } from "@/components/onboarding/tutorial-dialog";

import { LanguageProvider } from "@/hooks/use-language";
import { OnboardingProvider, useOnboarding } from "@/hooks/use-onboarding";
import { makeStyles, ThemeProvider, useTheme } from "@/hooks/use-theme";
import { UnitsProvider } from "@/hooks/use-units";
import { UserProfileProvider } from "@/hooks/use-user-profile";
import { useTranslation } from "@/i18n";

import { useDatabase } from "@/db/use-database";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: "(tabs)",
};

const MODAL_OPTIONS = {
  presentation: "modal",
  animation: "slide_from_bottom",
} as const;

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={rootStyles.root}>
      <LanguageProvider>
        <UnitsProvider>
          <UserProfileProvider>
            <ThemeProvider>
              <OnboardingProvider>
                <RootNavigator />
              </OnboardingProvider>
            </ThemeProvider>
          </UserProfileProvider>
        </UnitsProvider>
      </LanguageProvider>
    </GestureHandlerRootView>
  );
}

function RootNavigator() {
  const styles = useStyles();
  const { globalStyles } = useTheme();
  const { ready, error } = useDatabase();
  const [fontsLoaded, fontsError] = useFonts({
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    InstrumentSans_700Bold,
    JetBrainsMono_500Medium,
    JetBrainsMono_700Bold,
  });
  const { t } = useTranslation();
  const { setupCompleted, tutorialVisible, closeTutorial } = useOnboarding();

  // If a font fails to load, carry on with the system font.
  const fontsDone = fontsLoaded || fontsError !== null;
  const done = (ready && fontsDone) || error !== undefined;

  useEffect(() => {
    if (done) {
      SplashScreen.hideAsync();
    }
  }, [done]);

  if (error) {
    return (
      <View style={[globalStyles.screen, globalStyles.centered]}>
        <Text style={styles.errorText}>
          {__DEV__
            ? `${t.errors.database}: ${error.message}`
            : t.errors.database}
        </Text>
      </View>
    );
  }

  if (!done) {
    return null;
  }

  if (!setupCompleted) {
    return <SetupScreen />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="routine/[id]" options={MODAL_OPTIONS} />
        <Stack.Screen name="workout/[id]" options={MODAL_OPTIONS} />
        <Stack.Screen name="history" options={MODAL_OPTIONS} />
        <Stack.Screen name="settings" options={MODAL_OPTIONS} />
      </Stack>
      <TutorialDialog visible={tutorialVisible} onClose={closeTutorial} />
    </>
  );
}

const rootStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    errorText: {
      color: colors.text,
    },
  }),
);
