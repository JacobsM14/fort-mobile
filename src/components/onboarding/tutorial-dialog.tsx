import { Image } from "expo-image";
import { useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import {
  TOUR_IMAGES,
  TOUR_SLIDES,
  type TourSlide,
} from "@/components/onboarding/tour-images";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SecondaryButton } from "@/components/ui/buttons/secondary-button";

import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  lineHeights,
  spacing,
} from "@/constants/theme";

const CARD_HEIGHT = 520;
const STEP_COUNT = TOUR_SLIDES.length;

type TutorialDialogProps = {
  visible: boolean;
  onClose: () => void;
};

// A slide per part of the app, over whatever screen opened it. It can be
// skipped from the first slide.
export function TutorialDialog({ visible, onClose }: TutorialDialogProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [wasVisible, setWasVisible] = useState(visible);
  const isFirst = step === 1;
  const isLast = step === STEP_COUNT;

  if (visible !== wasVisible) {
    setWasVisible(visible);
    if (visible) {
      setStep(1);
    }
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
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.root}>
        <View style={styles.backdrop}>
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
              <TourStep key={step} slide={TOUR_SLIDES[step - 1]} />
            </View>
            <View style={styles.actions}>
              <SecondaryButton
                label={isFirst ? t.onboarding.skip : t.onboarding.previous}
                onPress={isFirst ? onClose : previous}
                style={styles.button}
              />
              <PrimaryButton
                label={isLast ? t.onboarding.finish : t.onboarding.next}
                onPress={isLast ? onClose : next}
                style={styles.button}
              />
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
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
      gap: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      marginVertical: spacing.xl,
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.backgroundSecondary,
    },
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
    tour: {
      flex: 1,
      gap: spacing.md,
    },
    capture: {
      flex: 1,
    },
    textContainer: {
      gap: spacing.xs,
      marginVertical: spacing.md,
    },
    title: {
      fontSize: fontSizes.lead,
      textAlign: "center",
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    message: {
      textAlign: "center",
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      fontFamily: fontsInstrument.regular,
      color: colors.disabled,
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
