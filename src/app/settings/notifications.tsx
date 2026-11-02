import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SwitchRow } from "@/components/ui/inputs/switch-row";
import { TimeStepper } from "@/components/ui/inputs/time-stepper";
import { WeekdayPicker } from "@/components/ui/inputs/weekday-picker";
import { BackHeader } from "@/components/ui/layout/back-header";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useNotificationSettings } from "@/features/notifications/use-notification-settings";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const settings = useNotificationSettings();
  const texts = t.settings.notifications;
  const { reminder } = settings;

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.notifications}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    content: {
      gap: spacing.lg,
      paddingBottom: spacing.lg,
    },
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
