import { Image } from "expo-image";
import { useEffect, useState } from "react";
import {
  BackHandler,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { CornerFrame } from "@/components/ui/corner-frame";
import {
  fontsInstrument,
  fontSizes,
  lineHeights,
  radii,
  spacing,
} from "@/constants/theme";
import type { ExerciseInfo } from "@/features/exercises/catalog";
import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

type ExerciseInfoSheetProps = {
  exercise: ExerciseInfo | null;
  onClose: () => void;
};

export function ExerciseInfoSheet({
  exercise,
  onClose,
}: ExerciseInfoSheetProps) {
  const { t } = useTranslation();
  const styles = useStyles();
  const open = exercise !== null;
  const [zoomedImage, setZoomedImage] = useState<number | null>(null);

  function close() {
    setZoomedImage(null);
    onClose();
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    Keyboard.dismiss();
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (zoomedImage !== null) {
          setZoomedImage(null);
        } else {
          onClose();
        }
        return true;
      },
    );
    return () => subscription.remove();
  }, [open, zoomedImage, onClose]);

  if (exercise === null) {
    return null;
  }

  return (
    <>
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={[StyleSheet.absoluteFill, styles.backdrop]}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel={t.exercises.closeInfo}
        />
      </Animated.View>
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.center}
        accessibilityViewIsModal
      >
        <View style={styles.panel}>
          {/* The ScrollView sits inside the frame so it doesn't clip the
              corners, which are drawn outside the content. */}
          <CornerFrame style={styles.content}>
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.title}>{exercise.name}</Text>
              <View style={styles.divider} />
              {exercise.muscles.length > 0 && (
                <View style={styles.muscles}>
                  {exercise.muscles.map((muscle) => (
                    <View key={muscle} style={styles.muscleChip}>
                      <Text style={styles.muscleText}>{muscle}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Text style={styles.description}>
                {exercise.description ?? t.exercises.noDescription}
              </Text>
              {exercise.images.length > 0 && (
                <View style={styles.images}>
                  {exercise.images.map((image) => (
                    <Pressable
                      key={image}
                      style={({ pressed }) => [
                        styles.imageButton,
                        pressed && styles.imageButtonPressed,
                      ]}
                      onPress={() => setZoomedImage(image)}
                      accessibilityRole="imagebutton"
                      accessibilityLabel={t.exercises.enlargeImage}
                    >
                      <Image
                        source={image}
                        style={styles.image}
                        contentFit="contain"
                      />
                    </Pressable>
                  ))}
                </View>
              )}
              {exercise.equipment.length > 0 && (
                <Text style={styles.description}>
                  <Text style={styles.equipmentLabel}>
                    {t.exercises.equipmentLabel}:
                  </Text>{" "}
                  {exercise.equipment.join(", ")}
                </Text>
              )}
            </ScrollView>
          </CornerFrame>
        </View>
      </Animated.View>
      {zoomedImage !== null && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          style={[StyleSheet.absoluteFill, styles.zoomBackdrop]}
          accessibilityViewIsModal
        >
          <Pressable
            style={styles.zoom}
            onPress={() => setZoomedImage(null)}
            accessibilityRole="button"
            accessibilityLabel={t.exercises.closeImage}
          >
            <Image
              source={zoomedImage}
              style={styles.zoomImage}
              contentFit="contain"
            />
          </Pressable>
        </Animated.View>
      )}
    </>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    backdrop: {
      backgroundColor: colors.scrim,
    },
    // Lets taps outside the panel through to the backdrop, which closes it.
    center: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: "center",
      justifyContent: "center",
      pointerEvents: "box-none",
    },
    panel: {
      width: "90%",
      height: "60%",
      padding: spacing.lg,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.primary,
    },
    content: {
      flex: 1,
    },
    scrollContent: {
      gap: spacing.sm,
    },
    title: {
      fontSize: fontSizes.heading,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    divider: {
      height: 1,
      width: "100%",
      backgroundColor: colors.primary,
    },
    description: {
      fontSize: fontSizes.detail,
      lineHeight: lineHeights.body,
      fontFamily: fontsInstrument.regular,
      color: colors.text,
    },
    equipmentLabel: {
      fontFamily: fontsInstrument.semiBold,
    },
    muscles: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
    },
    muscleChip: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.sm,
      backgroundColor: colors.background,
    },
    muscleText: {
      fontSize: fontSizes.caption,
      fontFamily: fontsInstrument.medium,
      color: colors.text,
    },
    images: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    imageButton: {
      flex: 1,
    },
    imageButtonPressed: {
      opacity: 0.7,
    },
    image: {
      width: "100%",
      aspectRatio: 3 / 2,
      borderRadius: radii.sm,
      backgroundColor: colors.background,
    },
    zoomBackdrop: {
      backgroundColor: colors.scrim,
    },
    zoom: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.md,
    },
    zoomImage: {
      width: "100%",
      height: "60%",
    },
  }),
);
