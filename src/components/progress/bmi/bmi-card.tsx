import { StyleSheet, Text, View } from "react-native";

import { BmiScale } from "@/components/progress/bmi/bmi-scale";
import { EmptyStateCard } from "@/components/ui/content/empty-state-card";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { formatBodyWeight } from "@/features/body/format";

import type {
  BmiAssessment,
  BmiCategory,
  BmiMissing,
} from "@/features/body/bmi";
import type { Translations } from "@/i18n/es";

import { formatDecimal } from "@/utils/number";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  spacing,
} from "@/constants/theme";

type BmiCardProps = {
  assessment: BmiAssessment;
  onCompleteProfile: () => void;
};

// The BMI section of Progress, for whatever assessBmi could work out: the
// scale, the value alone, or what is missing to get there.
export function BmiCard({ assessment, onCompleteProfile }: BmiCardProps) {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const units = useUnits();
  const styles = useStyles();

  // Under five the BMI isn't read this way: nothing to show.
  if (assessment.status === "unsupported") {
    return null;
  }
  if (assessment.status === "missing") {
    // The weight is logged right above: only what the settings ask sends there.
    const inSettings = assessment.missing.some(
      (item) => item === "height" || item === "gender",
    );
    return (
      <EmptyStateCard
        title={t.progress.bmiTitleEmpty}
        message={t.progress.bmiMissing[missingMessage(assessment.missing)]}
        actionLabel={inSettings ? t.progress.bmiEmptyAction : undefined}
        onAction={inSettings ? onCompleteProfile : undefined}
      />
    );
  }

  const score = formatDecimal(assessment.value, language);

  return (
    <View style={globalStyles.titledSection}>
      <Text style={globalStyles.sectionTitle}>{t.progress.bmi}</Text>
      {assessment.status === "uncategorized" ? (
        <View style={styles.text}>
          <Text style={styles.score}>{score}</Text>
          <Text style={styles.hint}>{t.progress.bmiNoReference}</Text>
        </View>
      ) : (
        <View
          accessible
          accessibilityLabel={t.progress.bmiSummary(
            score,
            t.progress.bmiCategories[assessment.category],
          )}
        >
          <View style={styles.row}>
            <BmiScale value={assessment.value} bands={assessment.bands} />
            <View style={styles.text}>
              <Text style={styles.score}>{score}</Text>
              <Text style={styles.category}>
                {t.progress.bmiCategories[assessment.category]}
              </Text>
              <Text style={styles.hint}>
                {idealHint(
                  t,
                  assessment.category,
                  formatBodyWeight(assessment.toIdealKg, units, language),
                )}
              </Text>
              {assessment.assumedAdult && (
                <Text style={styles.hint}>{t.progress.bmiAssumedAdult}</Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

// assessBmi only asks for the gender once the height and a weigh-in are there.
function missingMessage(
  missing: readonly BmiMissing[],
): keyof Translations["progress"]["bmiMissing"] {
  if (missing.includes("gender")) {
    return "gender";
  }
  if (missing.includes("height")) {
    return missing.includes("weight") ? "heightAndWeight" : "height";
  }
  return "weight";
}

function idealHint(t: Translations, category: BmiCategory, distance: string) {
  return category === "normal"
    ? t.progress.bmiToIdeal.inRange(distance)
    : category === "underweight"
      ? t.progress.bmiToIdeal.under(distance)
      : t.progress.bmiToIdeal.over(distance);
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    text: {
      flex: 1,
      gap: spacing.xs,
    },
    score: {
      fontSize: fontSizes.score,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.text,
    },
    category: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    hint: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
  }),
);
