import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TRACKING_TYPES, type TrackingType } from "@/constants/enums";
import {
  colors,
  fontsInstrument,
  globalStyles,
  spacing,
} from "@/constants/theme";
import { getExerciseText } from "@/features/exercises/catalog";
import { createExercise, useExercises } from "@/features/exercises/queries";
import { useTranslation } from "@/i18n";

export default function RoutinesScreen() {
  const { t } = useTranslation();
  const { data: exerciseList } = useExercises();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [trackingType, setTrackingType] = useState<TrackingType>("weight_reps");
  const [saveFailed, setSaveFailed] = useState(false);

  const canSave = name.trim() !== "";

  const addExercise = async () => {
    try {
      await createExercise({ name, description, trackingType });
      setName("");
      setDescription("");
      setTrackingType("weight_reps");
      setSaveFailed(false);
    } catch (error) {
      console.error(error);
      setSaveFailed(true);
    }
  };

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <Text style={globalStyles.title}>{t.tabs.routines}</Text>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TextInput
          style={styles.input}
          placeholder={t.exercises.namePlaceholder}
          placeholderTextColor={colors.disabled}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={t.exercises.descriptionPlaceholder}
          placeholderTextColor={colors.disabled}
          value={description}
          onChangeText={setDescription}
        />

        <View style={styles.chips}>
          {TRACKING_TYPES.map((type) => {
            const selected = type === trackingType;
            return (
              <Pressable
                key={type}
                onPress={() => setTrackingType(type)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {t.exercises.trackingTypes[type]}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={addExercise}
          disabled={!canSave}
          style={[styles.button, !canSave && styles.buttonDisabled]}
        >
          <Text style={styles.buttonText}>{t.exercises.add}</Text>
        </Pressable>

        {saveFailed ? (
          <Text style={styles.error}>{t.exercises.saveError}</Text>
        ) : null}

        {exerciseList.length === 0 ? (
          <Text style={styles.empty}>{t.exercises.empty}</Text>
        ) : (
          exerciseList.map((exercise) => {
            const text = getExerciseText(exercise, t);
            return (
              <View key={exercise.id} style={styles.item}>
                <Text style={styles.itemName}>{text.name}</Text>
                <Text style={styles.itemMeta}>
                  {t.exercises.trackingTypes[exercise.trackingType]}
                </Text>
                {text.description ? (
                  <Text style={styles.itemDescription}>{text.description}</Text>
                ) : null}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
  },
  input: {
    height: 44,
    paddingHorizontal: spacing.sm,
    borderWidth: 1,
    borderColor: colors.disabled,
    borderRadius: 2,
    fontSize: 15,
    fontFamily: fontsInstrument.regular,
    color: colors.text,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  chip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.disabled,
    borderRadius: 2,
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontFamily: fontsInstrument.medium,
    color: colors.disabled,
  },
  chipTextSelected: {
    color: colors.background,
  },
  button: {
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: fontsInstrument.semiBold,
    color: colors.background,
  },
  error: {
    fontSize: 13,
    fontFamily: fontsInstrument.medium,
    color: colors.primary,
  },
  empty: {
    fontSize: 15,
    fontFamily: fontsInstrument.regular,
    color: colors.disabled,
  },
  item: {
    gap: 2,
    padding: spacing.sm,
    borderRadius: 2,
    backgroundColor: colors.backgroundSecondary,
  },
  itemName: {
    fontSize: 15,
    fontFamily: fontsInstrument.semiBold,
    color: colors.text,
  },
  itemMeta: {
    fontSize: 13,
    fontFamily: fontsInstrument.medium,
    color: colors.primary,
  },
  itemDescription: {
    fontSize: 13,
    fontFamily: fontsInstrument.regular,
    color: colors.disabled,
  },
});
