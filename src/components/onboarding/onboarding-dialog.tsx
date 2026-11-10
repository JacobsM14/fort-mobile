import { Image } from "expo-image";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

import {
  TOUR_IMAGES,
  TOUR_SLIDES,
  type TourSlide,
} from "@/components/onboarding/tour-images";
import { AppearanceFields } from "@/components/settings/appearance-fields";
import { NotificationFields } from "@/components/settings/notification-fields";
import { ProfileFields } from "@/components/settings/profile-fields";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { Chip } from "@/components/ui/inputs/chip";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { APP_NAME } from "@/constants/app-info";
import {
  DISTANCE_UNIT_PREFERENCES,
  LANGUAGE_PREFERENCES,
  WEIGHT_UNIT_PREFERENCES,
} from "@/constants/enums";
import {
  hasCompletedOnboarding,
  markOnboardingCompleted,
} from "@/features/onboarding/onboarding";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  iconSizes,
  lineHeights,
  radii,
  spacing,
} from "@/constants/theme";

const APP_ICON_SIZE = iconSizes.hero * 1.5;
const CARD_HEIGHT = 520;

const SETUP_STEPS = [Step1, Step2, Step3, Step4];
const STEP_COUNT = SETUP_STEPS.length + TOUR_SLIDES.length;

export function OnboardingDialog() {
  const styles = useStyles();
  const { t } = useTranslation();
  const [visible, setVisible] = useState(() => !hasCompletedOnboarding());

  const [step, setStep] = useState(1);
  const isFirst = step === 1;
  const isLast = step === STEP_COUNT;

  function complete() {
    markOnboardingCompleted();
    setVisible(false);
  }

  function previous() {
    setStep((current) => Math.max(1, current - 1));
  }

  function next() {
    setStep((current) => Math.min(STEP_COUNT, current + 1));
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}}
    >
      <GestureHandlerRootView style={styles.root}>
        <KeyboardAvoidingView style={styles.backdrop} behavior="padding">
          <View style={styles.card} accessibilityViewIsModal>
            <View
              style={styles.progress}
              accessible
              accessibilityLabel={t.onboarding.progress(step, STEP_COUNT)}
            >
              {Array.from({ length: STEP_COUNT }, (_, index) => (
                <View
                  key={index}
                  style={[
                    styles.segment,
                    index < step && styles.segmentReached,
                  ]}
                />
              ))}
            </View>
            <View style={styles.content}>
              <CurrentStep key={step} index={step - 1} />
            </View>
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.secondary,
                  styles.button,
                  pressed && styles.secondaryPressed,
                ]}
                onPress={isFirst ? complete : previous}
                accessibilityRole="button"
              >
                <Text style={styles.secondaryLabel}>
                  {isFirst ? t.onboarding.skip : t.onboarding.previous}
                </Text>
              </Pressable>
              <PrimaryButton
                label={isLast ? t.onboarding.finish : t.onboarding.next}
                onPress={isLast ? complete : next}
                style={[styles.primary, styles.button]}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
}

// The setup steps first, then one step per slide of the tour.
function CurrentStep({ index }: { index: number }) {
  if (index < SETUP_STEPS.length) {
    const SetupStep = SETUP_STEPS[index];
    return <SetupStep />;
  }
  return <TourStep slide={TOUR_SLIDES[index - SETUP_STEPS.length]} />;
}

function Step1() {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.welcome}>
      <Image
        source={require("@/assets/images/icon.png")}
        style={styles.appIcon}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} accessibilityRole="header">
          {t.onboarding.welcomeTitle(APP_NAME)}
        </Text>
        <Text style={styles.message}>{t.onboarding.welcomeMessage}</Text>
      </View>
    </View>
  );
}

function Step2() {
  const styles = useStyles();
  const { globalStyles } = useTheme();
  const { t, preference, setPreference } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.preferences}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title} accessibilityRole="header">
        {t.settings.sections.preferences}
      </Text>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>{t.settings.language}</Text>
        <View style={styles.languages} accessibilityRole="radiogroup">
          {LANGUAGE_PREFERENCES.map((option) => (
            <Chip
              key={option}
              role="radio"
              label={t.settings.languageOptions[option]}
              selected={option === preference}
              onPress={() => setPreference(option)}
            />
          ))}
        </View>
      </View>
      <AppearanceFields />
    </ScrollView>
  );
}

function Step3() {
  const styles = useStyles();
  const { globalStyles } = useTheme();
  const { t } = useTranslation();
  const {
    weightPreference,
    distancePreference,
    setWeightPreference,
    setDistancePreference,
    systemWeight,
    systemDistance,
  } = useUnits();

  return (
    <ScrollView
      contentContainerStyle={styles.preferences}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title} accessibilityRole="header">
        {t.settings.sections.user}
      </Text>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>{t.settings.units.weight}</Text>
        <View style={styles.units} accessibilityRole="radiogroup">
          {WEIGHT_UNIT_PREFERENCES.map((option) => (
            <Chip
              key={option}
              role="radio"
              label={
                option === "system"
                  ? `${t.settings.units.system} (${systemWeight})`
                  : option
              }
              selected={option === weightPreference}
              onPress={() => setWeightPreference(option)}
              style={styles.unit}
            />
          ))}
        </View>
      </View>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>{t.settings.units.distance}</Text>
        <View style={styles.units} accessibilityRole="radiogroup">
          {DISTANCE_UNIT_PREFERENCES.map((option) => (
            <Chip
              key={option}
              role="radio"
              label={
                option === "system"
                  ? `${t.settings.units.system} (${systemDistance})`
                  : option
              }
              selected={option === distancePreference}
              onPress={() => setDistancePreference(option)}
              style={styles.unit}
            />
          ))}
        </View>
      </View>
      <ProfileFields />
    </ScrollView>
  );
}

// The permission is asked here, when the notifications are turned on, rather
// than as soon as the app opens.
function Step4() {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <ScrollView
      contentContainerStyle={styles.preferences}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title} accessibilityRole="header">
        {t.settings.sections.notifications}
      </Text>
      <NotificationFields />
    </ScrollView>
  );
}

function TourStep({ slide }: { slide: TourSlide }) {
  const styles = useStyles();
  const { t, language } = useTranslation();
  const texts = t.onboarding.tour[slide];

  return (
    <View style={styles.tour}>
      <Image
        source={TOUR_IMAGES[language][slide]}
        style={styles.capture}
        contentFit="contain"
        accessibilityIgnoresInvertColors
      />
      <View style={styles.textContainer}>
        <Text style={styles.title} accessibilityRole="header">
          {texts.title}
        </Text>
        <Text style={styles.message}>{texts.message}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    textContainer: {
      gap: spacing.xs,
      marginVertical: spacing.md,
    },
    // Gesture handler's inputs don't work in a Modal without their own root.
    root: {
      flex: 1,
    },
    backdrop: {
      flex: 1,
      justifyContent: "center",
      padding: spacing.lg,
      backgroundColor: colors.scrim,
    },
    card: {
      height: CARD_HEIGHT,
      maxHeight: "100%",
      // Lets the card give up height to the keyboard.
      flexShrink: 1,
      gap: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      marginVertical: spacing.xl,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.backgroundSecondary,
    },
    title: {
      fontSize: fontSizes.lead,
      textAlign: "center",
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    welcome: {
      alignItems: "center",
      gap: spacing.md,
    },
    appIcon: {
      width: APP_ICON_SIZE,
      height: APP_ICON_SIZE,
      borderRadius: radii.lg,
    },
    message: {
      textAlign: "center",
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      fontFamily: fontsInstrument.regular,
      color: colors.disabled,
    },
    // Centered when it fits; on a small screen it scrolls instead.
    preferences: {
      flexGrow: 1,
      justifyContent: "center",
      gap: spacing.md,
    },
    languages: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
    },
    units: {
      flexDirection: "row",
      gap: spacing.xs,
    },
    unit: {
      flex: 1,
      alignItems: "center",
      paddingHorizontal: spacing.xs,
    },
    tour: {
      flex: 1,
      gap: spacing.md,
    },
    // Shrinks to the room the texts leave, keeping its proportions.
    capture: {
      flex: 1,
    },
    // One segment per step, filled up to the one on screen.
    progress: {
      flexDirection: "row",
      gap: spacing.xs,
    },
    segment: {
      flex: 1,
      height: 2,
      backgroundColor: colors.border,
    },
    segmentReached: {
      backgroundColor: colors.primary,
    },
    content: {
      flex: 1,
      justifyContent: "center",
    },
    actions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    button: {
      minHeight: controlHeights.lg,
    },
    primary: {
      flex: 1,
      width: "auto",
    },
    secondary: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.disabled,
      borderRadius: radii.xs,
    },
    secondaryPressed: {
      opacity: 0.6,
    },
    secondaryLabel: {
      fontSize: fontSizes.button,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
  }),
);
