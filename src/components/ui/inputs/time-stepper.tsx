import type { SymbolViewProps } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/ui/buttons/icon-button";

import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { wrap } from "@/utils/number";

import { fontSizes, fontsJetBrainsMono, spacing } from "@/constants/theme";

const MINUTE_STEP = 15;
const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;

export type TimeOfDay = { hour: number; minute: number };

type TimeStepperProps = {
  value: TimeOfDay;
  onChange: (value: TimeOfDay) => void;
};

const MINUS: SymbolViewProps["name"] = {
  ios: "minus",
  android: "remove",
  web: "remove",
};
const PLUS: SymbolViewProps["name"] = {
  ios: "plus",
  android: "add",
  web: "add",
};

// Hours and minutes, each with its own - and +. Both wrap around on their own:
// past 23 comes 00, and past 45 minutes comes 00 of the same hour, so no hour
// is more than 12 taps away.
export function TimeStepper({ value, onChange }: TimeStepperProps) {
  const { t } = useTranslation();
  const texts = t.settings.notifications;
  const styles = useStyles();

  function stepHour(delta: number) {
    onChange({ ...value, hour: wrap(value.hour + delta, HOURS_IN_DAY) });
  }

  function stepMinute(delta: number) {
    onChange({ ...value, minute: wrap(value.minute + delta, MINUTES_IN_HOUR) });
  }

  return (
    <View style={styles.row}>
      <View style={styles.part}>
        <IconButton
          icon={MINUS}
          tone="muted"
          accessibilityLabel={texts.hourEarlier}
          onPress={() => stepHour(-1)}
        />
        <Text style={styles.value}>{twoDigits(value.hour)}</Text>
        <IconButton
          icon={PLUS}
          tone="muted"
          accessibilityLabel={texts.hourLater}
          onPress={() => stepHour(1)}
        />
      </View>
      <Text style={styles.separator}>:</Text>
      <View style={styles.part}>
        <IconButton
          icon={MINUS}
          tone="muted"
          accessibilityLabel={texts.minutesEarlier(MINUTE_STEP)}
          onPress={() => stepMinute(-MINUTE_STEP)}
        />
        <Text style={styles.value}>{twoDigits(value.minute)}</Text>
        <IconButton
          icon={PLUS}
          tone="muted"
          accessibilityLabel={texts.minutesLater(MINUTE_STEP)}
          onPress={() => stepMinute(MINUTE_STEP)}
        />
      </View>
    </View>
  );
}

function twoDigits(value: number) {
  return String(value).padStart(2, "0");
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    part: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    value: {
      fontSize: fontSizes.heading,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.text,
    },
    separator: {
      fontSize: fontSizes.heading,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.disabled,
    },
  }),
);
