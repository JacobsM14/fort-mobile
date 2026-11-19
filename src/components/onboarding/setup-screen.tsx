import { useEffect, useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  DoneStep,
  NotificationsStep,
  PreferencesStep,
  ProfileStep,
  WelcomeStep,
} from "@/components/onboarding/setup-steps";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";

import { useOnboarding } from "@/hooks/use-onboarding";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTranslation } from "@/i18n";

import { saveBodyWeight } from "@/features/body/queries";
import { parseBodyWeightKg } from "@/features/settings/profile-input";

import { controlHeights, spacing } from "@/constants/theme";

type SetupStep =
  "welcome" | "preferences" | "profile" | "notifications" | "done";

const STEPS: readonly SetupStep[] = [
  "welcome",
  "preferences",
  "profile",
  ...(Platform.OS === "android" ? (["notifications"] as const) : []),
  "done",
];

export function SetupScreen() {
  const styles = useStyles();
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  const { completeSetup } = useOnboarding();
  const { weight } = useUnits();
  const { profile } = useUserProfile();

  const [index, setIndex] = useState(0);
  const [weightDraft, setWeightDraft] = useState({ text: "", unit: weight });
  const [heightDraft, setHeightDraft] = useState(profile.heightCm);

  const step = STEPS[index];
  const isFirst = index === 0;
  const isLast = index === STEPS.length - 1;
  const isBeforeLast = index === STEPS.length - 2;

  const weightText = weightDraft.unit === weight ? weightDraft.text : "";
  const weightKg = parseBodyWeightKg(weightText, weight);

  const weightOk = weightText.trim() === "" || weightKg !== null;
  const canContinue = step !== "profile" || (weightOk && heightDraft !== null);

  const titles: Record<SetupStep, string | null> = {
    welcome: null,
    preferences: t.settings.sections.preferences,
    profile: t.settings.sections.user,
    notifications: t.settings.sections.notifications,
    done: null,
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (index === 0) {
          return false;
        }
        // Swallowed instead of exiting, which would leave the setup unfinished.
        if (index === STEPS.length - 1) {
          return true;
        }
        setIndex(index - 1);
        return true;
      },
    );
    return () => subscription.remove();
  }, [index]);

  function next() {
    if (step === "profile" && weightKg !== null) {
      try {
        saveBodyWeight(new Date(), weightKg);
      } catch {
        Alert.alert(t.progress.saveWeightError);
        return;
      }
    }
    setIndex(index + 1);
  }

  return (
    <SafeAreaView
      style={[globalStyles.screen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <View style={styles.progress}>
          {STEPS.map((item, position) => (
            <View
              key={item}
              style={[
                styles.segment,
                position <= index && styles.segmentReached,
              ]}
            />
          ))}
        </View>
        <Text style={globalStyles.subtitle}>
          {t.onboarding.setup} ·{" "}
          {t.onboarding.progress(index + 1, STEPS.length)}
        </Text>
        {titles[step] !== null && (
          <Text style={globalStyles.title} accessibilityRole="header">
            {titles[step]}
          </Text>
        )}
      </View>
      <KeyboardAvoidingView style={styles.body} behavior="padding">
        <ScrollView
          key={step}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {step === "welcome" && <WelcomeStep />}
          {step === "preferences" && <PreferencesStep />}
          {step === "profile" && (
            <ProfileStep
              weightText={weightText}
              onWeightTextChange={(text) =>
                setWeightDraft({ text, unit: weight })
              }
              onHeightDraftChange={setHeightDraft}
            />
          )}
          {step === "notifications" && <NotificationsStep />}
          {step === "done" && <DoneStep />}
        </ScrollView>
        <View style={styles.actions}>
          {isLast ? (
            <>
              <SecondaryButton
                label={t.onboarding.skip}
                onPress={() => completeSetup(false)}
                style={styles.button}
              />
              <PrimaryButton
                label={t.onboarding.seeTutorial}
                onPress={() => completeSetup(true)}
                style={styles.button}
              />
            </>
          ) : (
            <>
              {!isFirst && (
                <SecondaryButton
                  label={t.onboarding.previous}
                  onPress={() => setIndex(index - 1)}
                  style={styles.button}
                />
              )}
              <PrimaryButton
                label={isBeforeLast ? t.onboarding.finish : t.onboarding.next}
                onPress={next}
                disabled={!canContinue}
                style={styles.button}
              />
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    screen: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.lg,
    },
    header: {
      gap: spacing.sm,
    },
    progress: {
      flexDirection: "row",
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    segment: {
      flex: 1,
      height: 2,
      backgroundColor: colors.border,
    },
    segmentReached: {
      backgroundColor: colors.primary,
    },
    body: {
      flex: 1,
      gap: spacing.md,
    },
    content: {
      flexGrow: 1,
      gap: spacing.md,
    },
    actions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    button: {
      flex: 1,
      width: "auto",
      minHeight: controlHeights.lg,
    },
  }),
);
