import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { BodyWeightField } from "@/components/onboarding/body-weight-field";
import { AppearanceFields } from "@/components/settings/appearance-fields";
import { NotificationFields } from "@/components/settings/notification-fields";
import { ProfileFields } from "@/components/settings/profile-fields";
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
  fontsInstrument,
  fontSizes,
  iconSizes,
  lineHeights,
  radii,
  spacing,
} from "@/constants/theme";

const APP_ICON_SIZE = iconSizes.hero * 2;
const ICON_ZOOM = 1.4;

export function WelcomeStep() {
  const styles = useStyles();
  const { colors, globalStyles } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.centered}>
      <View style={styles.appIcon}>
        <Image
          source={require("@/assets/images/android-icon-monochrome.png")}
          style={styles.appIconImage}
          tintColor={colors.primary}
          accessibilityIgnoresInvertColors
        />
      </View>
      <View style={styles.intro}>
        <Text
          style={[globalStyles.title, styles.introTitle]}
          accessibilityRole="header"
        >
          {t.onboarding.welcomeTitle(APP_NAME)}
        </Text>
        <Text style={styles.message}>{t.onboarding.welcomeMessage}</Text>
      </View>
    </View>
  );
}

export function PreferencesStep() {
  const styles = useStyles();
  const { globalStyles } = useTheme();
  const { t, preference, setPreference } = useTranslation();
  const {
    weightPreference,
    distancePreference,
    setWeightPreference,
    setDistancePreference,
    systemWeight,
    systemDistance,
  } = useUnits();

  return (
    <>
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
    </>
  );
}

type ProfileStepProps = {
  weightText: string;
  onWeightTextChange: (text: string) => void;
  onHeightDraftChange: (heightCm: number | null) => void;
};

export function ProfileStep({
  weightText,
  onWeightTextChange,
  onHeightDraftChange,
}: ProfileStepProps) {
  return (
    <>
      <BodyWeightField value={weightText} onChangeText={onWeightTextChange} />
      <ProfileFields heightRequired onHeightDraftChange={onHeightDraftChange} />
    </>
  );
}

export function NotificationsStep() {
  return <NotificationFields />;
}

export function DoneStep() {
  const styles = useStyles();
  const { globalStyles } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.centered}>
      <View style={styles.intro}>
        <Text
          style={[globalStyles.title, styles.introTitle]}
          accessibilityRole="header"
        >
          {t.onboarding.doneTitle}
        </Text>
        <Text style={styles.message}>{t.onboarding.doneMessage}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.lg,
    },
    intro: {
      gap: spacing.sm,
    },
    introTitle: {
      textAlign: "center",
    },
    appIcon: {
      width: APP_ICON_SIZE,
      height: APP_ICON_SIZE,
      borderRadius: radii.lg,
      backgroundColor: colors.backgroundSecondary,
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    appIconImage: {
      width: APP_ICON_SIZE * ICON_ZOOM,
      height: APP_ICON_SIZE * ICON_ZOOM,
    },
    message: {
      textAlign: "center",
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      fontFamily: fontsInstrument.regular,
      color: colors.disabled,
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
  }),
);
