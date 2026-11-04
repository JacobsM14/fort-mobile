import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BirthDateField } from "@/components/settings/birth-date-field";
import { HeightField } from "@/components/settings/height-field";
import { Chip } from "@/components/ui/inputs/chip";
import { BackHeader } from "@/components/ui/layout/back-header";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTranslation } from "@/i18n";

import { GENDERS } from "@/constants/enums";

import { spacing } from "@/constants/theme";

export default function UserScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const { distance } = useUnits();
  const { profile, updateProfile } = useUserProfile();
  const styles = useStyles();
  const imperial = distance === "mi";

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.user}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={globalStyles.subtitle}>{t.settings.user.intro}</Text>
        <HeightField
          key={imperial ? "imperial" : "metric"}
          heightCm={profile.heightCm}
          imperial={imperial}
          onSave={(heightCm) => updateProfile({ heightCm })}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    content: {
      gap: spacing.lg,
      paddingBottom: spacing.lg,
    },
    options: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
  }),
);
