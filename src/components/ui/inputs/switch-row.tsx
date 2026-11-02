import { Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

type SwitchRowProps = {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
};

// A setting turned on and off. The whole row toggles it, not just the switch.
export function SwitchRow({
  label,
  description,
  value,
  onValueChange,
  disabled = false,
}: SwitchRowProps) {
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      style={[globalStyles.card, disabled && styles.disabled]}
      onPress={() => onValueChange(!value)}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityHint={description}
      accessibilityState={{ checked: value, disabled }}
    >
      <View style={styles.texts}>
        <Text style={styles.label}>{label}</Text>
        {description !== undefined && (
          <Text style={styles.description}>{description}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ false: colors.border, true: colors.primarySoft }}
        thumbColor={value ? colors.primary : colors.disabled}
        ios_backgroundColor={colors.border}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    disabled: {
      opacity: 0.4,
    },
    texts: {
      flex: 1,
      gap: spacing.xs,
    },
    label: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    description: {
      fontSize: fontSizes.footnote,
      fontFamily: fontsInstrument.regular,
      color: colors.disabled,
    },
  }),
);
