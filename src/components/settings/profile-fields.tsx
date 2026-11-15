import { StyleSheet, Text, View } from "react-native";

import { BirthDateField } from "@/components/settings/birth-date-field";
import { HeightField } from "@/components/settings/height-field";
import { Chip } from "@/components/ui/inputs/chip";

import { useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTranslation } from "@/i18n";

import { GENDERS } from "@/constants/enums";

import { spacing } from "@/constants/theme";

type ProfileFieldsProps = {
  heightRequired?: boolean;
  onHeightDraftChange?: (heightCm: number | null) => void;
};

// Returns sibling fields so the parent's gap spaces them like the rest of
// its fields.
export function ProfileFields({
  heightRequired = false,
  onHeightDraftChange,
}: ProfileFieldsProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const { distance } = useUnits();
  const { profile, updateProfile } = useUserProfile();
  const imperial = distance === "mi";

  return (
    <>
      <Text style={globalStyles.subtitle}>{t.settings.user.intro}</Text>
      <HeightField
        key={imperial ? "imperial" : "metric"}
        heightCm={profile.heightCm}
        imperial={imperial}
        onSave={(heightCm) => updateProfile({ heightCm })}
        onDraftChange={onHeightDraftChange}
        required={heightRequired}
      />
      <BirthDateField
        birthDate={profile.birthDate}
        onSave={(birthDate) => updateProfile({ birthDate })}
      />
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>{t.settings.user.gender}</Text>
        <View style={styles.options} accessibilityRole="radiogroup">
          {GENDERS.map((gender) => (
            <Chip
              key={gender}
              role="radio"
              label={t.settings.user.genders[gender]}
              selected={gender === profile.gender}
              onPress={() => updateProfile({ gender })}
            />
          ))}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
});
