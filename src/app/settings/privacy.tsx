import type { ReactNode } from "react";
import { Linking, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsRow } from "@/components/settings/settings-row";
import { BackHeader } from "@/components/ui/back-header";
import { CornerFrame } from "@/components/ui/corner-frame";
import {
  CONTACT_EMAIL,
  COPYRIGHT,
  EXERCISE_IMAGES_SOURCE,
  PRIVACY_UPDATED_AT,
} from "@/constants/app-info";
import { fontsInstrument, fontsJetBrainsMono, spacing } from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

const THIRD_PARTY = [
  { name: "React Native", license: "MIT" },
  { name: "Expo", license: "MIT" },
  { name: "Drizzle ORM", license: "Apache-2.0" },
  { name: "React Native Reanimated", license: "MIT" },
  { name: "Instrument Sans", license: "SIL OFL 1.1" },
  { name: "JetBrains Mono", license: "SIL OFL 1.1" },
  { name: "Material Symbols", license: "Apache-2.0" },
] as const;

export default function PrivacyScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.privacy}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <CornerFrame style={styles.summary}>
          <Text style={styles.summaryText}>{t.privacy.summary}</Text>
        </CornerFrame>

        <Section title={t.privacy.storedTitle}>
          <Text style={styles.body}>{t.privacy.storedIntro}</Text>
          {t.privacy.stored.map((item) => (
            <Bullet key={item} text={item} />
          ))}
        </Section>

        <Section title={t.privacy.notDoneTitle}>
          {t.privacy.notDone.map((item) => (
            <Bullet key={item} text={item} />
          ))}
        </Section>

        <Section title={t.privacy.backupsTitle}>
          <Text style={styles.body}>{t.privacy.backups}</Text>
        </Section>

        <Section title={t.privacy.deleteTitle}>
          <Text style={styles.body}>{t.privacy.delete}</Text>
        </Section>

        <Section title={t.privacy.changesTitle}>
          <Text style={styles.body}>{t.privacy.changes}</Text>
        </Section>

        <Section title={t.privacy.contactTitle}>
          <SettingsRow
            icon={{ ios: "envelope", android: "mail", web: "mail" }}
            label={t.privacy.contact}
            onPress={() => Linking.openURL(`mailto:${CONTACT_EMAIL}`)}
          />
        </Section>

        <Section title={t.privacy.licenseTitle}>
          <Text style={styles.body}>
            © {COPYRIGHT.year} {COPYRIGHT.holder}. {t.privacy.rightsReserved}
          </Text>
          <Text style={globalStyles.inputLabel}>{t.privacy.thirdParty}</Text>
          <View>
            {THIRD_PARTY.map(({ name, license }) => (
              <View key={name} style={styles.licenseRow}>
                <Text style={styles.licenseName}>{name}</Text>
                <Text style={styles.licenseValue}>{license}</Text>
              </View>
            ))}
          </View>
          <Text style={globalStyles.inputLabel}>{t.privacy.imagesTitle}</Text>
          <Text style={styles.body}>{t.privacy.images}</Text>
          <SettingsRow
            icon={{ ios: "photo", android: "image", web: "image" }}
            label={EXERCISE_IMAGES_SOURCE.name}
            value={EXERCISE_IMAGES_SOURCE.license}
            onPress={() => Linking.openURL(EXERCISE_IMAGES_SOURCE.url)}
          />
        </Section>

        <Text style={globalStyles.subtitle}>
          {t.privacy.lastUpdated}:{" "}
          {PRIVACY_UPDATED_AT.toLocaleDateString(language, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  const { globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.section}>
      <Text style={globalStyles.inputLabel}>{title}</Text>
      {children}
    </View>
  );
}

function Bullet({ text }: { text: string }) {
  const styles = useStyles();

  return (
    <View style={styles.bullet}>
      <View style={styles.bulletMark} />
      <Text style={[styles.body, styles.bulletText]}>{text}</Text>
    </View>
  );
}

const BODY_LINE_HEIGHT = 24;
const BULLET_SIZE = 6;

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    content: {
      gap: spacing.lg,
      paddingBottom: spacing.lg,
    },
    // The margin keeps the floating corners inside the ScrollView, which
    // clips anything drawn outside its bounds.
    summary: {
      margin: spacing.sm,
      padding: spacing.md,
    },
    summaryText: {
      fontSize: 18,
      lineHeight: 26,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    section: {
      gap: spacing.sm,
    },
    body: {
      fontSize: 16,
      lineHeight: BODY_LINE_HEIGHT,
      fontFamily: fontsInstrument.regular,
      color: colors.text,
    },
    bullet: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    bulletMark: {
      width: BULLET_SIZE,
      height: BULLET_SIZE,
      marginTop: (BODY_LINE_HEIGHT - BULLET_SIZE) / 2,
      backgroundColor: colors.primary,
    },
    bulletText: {
      flex: 1,
    },
    licenseRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
    },
    licenseName: {
      flex: 1,
      fontSize: 15,
      fontFamily: fontsInstrument.medium,
      color: colors.text,
    },
    licenseValue: {
      fontSize: 13,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
  }),
);
