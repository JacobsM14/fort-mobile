import { StyleSheet, Text, View } from "react-native";

import { ProfileField } from "@/components/settings/profile-field";

import { useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

type BodyWeightFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
};

// The first weigh-in, typed in the user's unit. The setup saves it when it
// moves on, so it can tell first whether it is a weight at all.
export function BodyWeightField({ value, onChangeText }: BodyWeightFieldProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const { weight } = useUnits();
  const label = `${t.progress.weightInput} (${weight})`;

  return (
    <View style={globalStyles.formCage}>
      <Text style={globalStyles.inputLabel}>{label}</Text>
      <View style={styles.row}>
        <ProfileField
          value={value}
          onChangeText={onChangeText}
          placeholder={weight}
          maxLength={5}
          decimal
          accessibilityLabel={label}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
