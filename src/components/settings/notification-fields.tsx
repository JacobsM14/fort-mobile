import {
  Alert,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { SwitchRow } from "@/components/ui/inputs/switch-row";
import { TimeStepper } from "@/components/ui/inputs/time-stepper";
import { WeekdayPicker } from "@/components/ui/inputs/weekday-picker";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useNotificationSettings } from "@/features/notifications/use-notification-settings";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

// Returns sibling fields so the parent's gap spaces them like the rest of
// its fields.
export function NotificationFields() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const settings = useNotificationSettings();
  const texts = t.settings.notifications;
  const { reminder } = settings;

  return (
    <>
      <View style={styles.list}>
        <SwitchRow
          label={texts.enabled}
          description={texts.enabledDescription}
          value={settings.enabled}
          onValueChange={(enabled) => void settings.setEnabled(enabled)}
        />
        {settings.blocked && (
          <View style={styles.blocked}>
            <Text style={styles.blockedText} accessibilityRole="alert">
              {texts.blocked}
            </Text>
            <Pressable
              style={globalStyles.breadCrumbPress}
              onPress={() =>
                Linking.openSettings().catch(() =>
                  Alert.alert(t.errors.openUrl),
                )
              }
              accessibilityRole="button"
            >
              <Text style={globalStyles.breadCrumbText}>
                {texts.openSystemSettings}
              </Text>
            </Pressable>
          </View>
        )}
      </View>
      <View style={globalStyles.formCage}>
        <Text style={globalStyles.inputLabel}>{texts.types}</Text>
        <View style={styles.list}>
          <SwitchRow
            label={texts.workout}
            description={texts.workoutDescription}
            value={settings.workout}
            onValueChange={settings.setWorkout}
            disabled={!settings.enabled}
          />
          <SwitchRow
            label={texts.weightReminder}
            description={texts.weightReminderDescription}
            value={settings.weightReminder}
            onValueChange={settings.setWeightReminder}
            disabled={!settings.enabled}
          />
          {settings.enabled && settings.weightReminder && (
            <View style={[globalStyles.panel, styles.reminder]}>
              <View style={globalStyles.formCage}>
                <Text style={globalStyles.inputLabel}>{texts.day}</Text>
                <WeekdayPicker
                  value={reminder.weekday}
                  onChange={(weekday) =>
                    settings.setReminder({ ...reminder, weekday })
                  }
                />
              </View>
              <View style={globalStyles.formCage}>
                <Text style={globalStyles.inputLabel}>{texts.time}</Text>
                <TimeStepper
                  value={reminder}
                  onChange={({ hour, minute }) =>
                    settings.setReminder({ ...reminder, hour, minute })
                  }
                />
              </View>
            </View>
          )}
        </View>
      </View>
    </>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    list: {
      gap: spacing.xs,
    },
    blocked: {
      gap: spacing.xs,
      paddingHorizontal: spacing.md,
      paddingTop: spacing.xs,
    },
    blockedText: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.regular,
      color: colors.danger,
    },
    reminder: {
      gap: spacing.md,
    },
  }),
);
