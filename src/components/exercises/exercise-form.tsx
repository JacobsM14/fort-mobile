import { useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { Chip } from "@/components/ui/inputs/chip";
import {
  EQUIPMENT,
  TRACKING_TYPES,
  type Equipment,
  type TrackingType,
} from "@/constants/enums";
import {
  fontsInstrument,
  fontSizes,
  lineHeights,
  spacing,
} from "@/constants/theme";
import { MUSCLE_IDS, type MuscleId } from "@/features/exercises/catalog";
import type { ExerciseInput } from "@/features/exercises/queries";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { toggleItem } from "@/utils/array";

type ExerciseFormProps = {
  // Values to start from when editing; a new exercise starts empty.
  initial?: ExerciseInput;
  submitLabel: string;
  onSubmit: (input: ExerciseInput) => void;
};

export function ExerciseForm({
  initial,
  submitLabel,
  onSubmit,
}: ExerciseFormProps) {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const [name, setName] = useState(initial?.name ?? "");
  const [trackingType, setTrackingType] = useState<TrackingType>(
    initial?.trackingType ?? "weight_reps",
  );
  const [equipment, setEquipment] = useState<Equipment | null>(
    initial?.equipment ?? null,
  );
  const [muscles, setMuscles] = useState<readonly MuscleId[]>(
    initial?.primaryMuscles ?? [],
  );
  const [description, setDescription] = useState(initial?.description ?? "");

  const canSave = name.trim() !== "";

  function toggleEquipment(item: Equipment) {
    setEquipment((current) => (current === item ? null : item));
  }

  function toggleMuscle(id: MuscleId) {
    setMuscles((current) => toggleItem(current, id));
  }

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
      showsVerticalScrollIndicator={false}
    >
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>{t.exerciseForm.nameLabel}</Text>
        <TextInput
          style={globalStyles.boxInput}
          value={name}
          onChangeText={setName}
          placeholder={t.exercises.namePlaceholder}
          placeholderTextColor={colors.disabled}
        />
      </View>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>
          {t.exerciseForm.trackingLabel}
        </Text>
        <View style={styles.chips} accessibilityRole="radiogroup">
          {TRACKING_TYPES.map((type) => (
            <Chip
              key={type}
              role="radio"
              label={t.exercises.trackingTypes[type]}
              selected={trackingType === type}
              onPress={() => setTrackingType(type)}
            />
          ))}
        </View>
      </View>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>
          {t.exercises.equipmentLabel}
        </Text>
        <View style={styles.chips} accessibilityRole="radiogroup">
          {EQUIPMENT.map((item) => (
            <Chip
              key={item}
              role="radio"
              label={t.equipment[item]}
              selected={equipment === item}
              onPress={() => toggleEquipment(item)}
            />
          ))}
        </View>
      </View>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>
          {t.exerciseForm.musclesLabel}
        </Text>
        <View style={styles.chips}>
          {MUSCLE_IDS.map((id) => (
            <Chip
              key={id}
              label={t.muscles[id]}
              selected={muscles.includes(id)}
              onPress={() => toggleMuscle(id)}
            />
          ))}
        </View>
      </View>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>
          {t.exerciseForm.descriptionLabel}
        </Text>
        <TextInput
          style={[globalStyles.boxInput, styles.descriptionInput]}
          value={description}
          onChangeText={setDescription}
          placeholder={t.exercises.descriptionPlaceholder}
          placeholderTextColor={colors.disabled}
          multiline
        />
      </View>

      <PrimaryButton
        label={submitLabel}
        onPress={() =>
          onSubmit({
            name,
            description,
            trackingType,
            equipment,
            primaryMuscles: muscles,
          })
        }
        disabled={!canSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  descriptionInput: {
    minHeight: 96,
    paddingVertical: spacing.sm,
    textAlignVertical: "top",
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    fontFamily: fontsInstrument.regular,
  },
});
