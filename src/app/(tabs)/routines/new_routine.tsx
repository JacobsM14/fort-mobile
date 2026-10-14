import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Animated, {
    Easing,
    FadeIn,
    FadeOut,
    LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import {
    colors,
    fontsJetBrainsMono,
    globalStyles,
    spacing,
} from "@/constants/theme";
import { MUSCLES, type MuscleId } from "@/features/exercises/catalog";
import { useTranslation } from "@/i18n";

// MUSCLES can list the same muscle under several groups (e.g. traps), so
// dedupe to render one button per muscle.
const MUSCLE_IDS: readonly MuscleId[] = [
  ...new Set(MUSCLES.map((muscle) => muscle.id)),
];

const COLLAPSED_MUSCLE_COUNT = 6;

const TRANSITION_MS = 300;
const LAYOUT_TRANSITION = LinearTransition.duration(TRANSITION_MS).easing(
  Easing.inOut(Easing.ease),
);

export default function NewRoutinesScreen() {
  const { t } = useTranslation();
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleId[]>([]);
  const [musclesExpanded, setMusclesExpanded] = useState(false);

  function toggleMuscle(id: MuscleId) {
    setSelectedMuscles((current) =>
      current.includes(id)
        ? current.filter((muscle) => muscle !== id)
        : [...current, id],
    );
  }

  // When collapsed, selected muscles stay visible even if they fall outside
  // the first rows, so the user never loses sight of what they picked.
  const visibleMuscles = musclesExpanded
    ? MUSCLE_IDS
    : MUSCLE_IDS.filter(
        (id, index) =>
          index < COLLAPSED_MUSCLE_COUNT || selectedMuscles.includes(id),
      );

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          style={globalStyles.breadCrumbPress}
          onPress={() => router.back()}
          hitSlop={spacing.sm}
          accessibilityRole="link"
        >
          <SymbolView
            name={{
              ios: "chevron.left",
              android: "chevron_left",
              web: "chevron_left",
            }}
            tintColor={colors.primary}
            size={22}
          />
          <Text style={globalStyles.breadCrumbText}>
            {t.new_routine.bread_crumb}
          </Text>
        </Pressable>
        <Text style={globalStyles.title}>{t.new_routine.title1}</Text>
        <Text style={globalStyles.title}>{t.new_routine.title2}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.formCage}>
          <Text style={globalStyles.inputLabel}>{t.new_routine.nameLabel}</Text>
          <TextInput
            style={globalStyles.boxInput}
            placeholder={t.new_routine.namePlaceholder}
            placeholderTextColor={colors.disabled}
          />
        </View>
        <View style={globalStyles.formCage}>
          <View style={styles.labelRow}>
            <Text style={globalStyles.inputLabel}>
              {t.new_routine.muscleLabel}
            </Text>
            <Pressable
              onPress={() => setMusclesExpanded((expanded) => !expanded)}
              hitSlop={spacing.sm}
              accessibilityRole="button"
              accessibilityLabel={
                musclesExpanded
                  ? t.new_routine.showLess
                  : t.new_routine.showMore
              }
              accessibilityState={{ expanded: musclesExpanded }}
            >
              <SymbolView
                name={
                  musclesExpanded
                    ? {
                        ios: "chevron.up",
                        android: "expand_less",
                        web: "expand_less",
                      }
                    : {
                        ios: "chevron.down",
                        android: "expand_more",
                        web: "expand_more",
                      }
                }
                tintColor={colors.disabled}
                size={18}
              />
            </Pressable>
          </View>
          <Animated.View style={styles.muscleList} layout={LAYOUT_TRANSITION}>
            {visibleMuscles.map((id) => {
              const selected = selectedMuscles.includes(id);
              return (
                <Animated.View
                  key={id}
                  entering={FadeIn.duration(TRANSITION_MS)}
                  exiting={FadeOut.duration(TRANSITION_MS)}
                  layout={LAYOUT_TRANSITION}
                >
                  <Pressable
                    style={
                      selected
                        ? globalStyles.pressedButton
                        : globalStyles.notPressedButton
                    }
                    onPress={() => toggleMuscle(id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: selected }}
                  >
                    <Text
                      style={
                        selected
                          ? globalStyles.pressedButtonText
                          : globalStyles.notPressedButtonText
                      }
                    >
                      {t.muscles[id]}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </Animated.View>
        </View>
        <Animated.View style={globalStyles.formCage} layout={LAYOUT_TRANSITION}>
          <View style={styles.labelRow}>
            <Text style={globalStyles.inputLabel}>
              {t.new_routine.exercisesLabel} · 0
            </Text>
            <Text
              style={{
                fontFamily: fontsJetBrainsMono.medium,
                fontSize: 12,
                color: colors.disabled,
                letterSpacing: 0.08,
              }}
            >
              {t.new_routine.exercisesLabelSecondary}
            </Text>
          </View>
          <Pressable
            style={styles.addButton}
            onPress={() => {
              router.push("/routines/new_exercises");
            }}
          >
            <Text style={styles.addButtonText}>
              {t.new_routine.addExercise}
            </Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
  header: {
    gap: spacing.xs,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  muscleList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addButton: {
    ...globalStyles.submitButtom,
    flexDirection: "row",
    borderColor: colors.disabled,
  },
  addButtonText: {
    ...globalStyles.submitButtonText,
    color: colors.disabled,
  },
});
