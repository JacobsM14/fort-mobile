import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ProfileField } from "@/components/settings/profile-field";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { parseBirthDate } from "@/features/settings/profile-input";

import { parseDateKey } from "@/utils/date";

import { fontSizes, fontsInstrument, spacing } from "@/constants/theme";

type BirthDateFieldProps = {
  // "1994-03-07", or null while not given.
  birthDate: string | null;
  onSave: (birthDate: string | null) => void;
};

// The date of birth in three boxes, in the order each language writes it.
// A complete, real date is saved as it is typed; emptying the three clears it.
export function BirthDateField({ birthDate, onSave }: BirthDateFieldProps) {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  const saved = birthDate === null ? null : parseDateKey(birthDate);
  const [day, setDay] = useState(saved === null ? "" : String(saved.getDate()));
  const [month, setMonth] = useState(
    saved === null ? "" : String(saved.getMonth() + 1),
  );
  const [year, setYear] = useState(
    saved === null ? "" : String(saved.getFullYear()),
  );
  // Only says a date is wrong once a box has been left: while typing the year,
  // "19" isn't a mistake yet.
  const [checked, setChecked] = useState(false);

  const complete = day !== "" && month !== "" && year !== "";
  const invalid =
    checked &&
    complete &&
    parseBirthDate(day, month, year, new Date()) === null;

  function change(
    setter: (text: string) => void,
    next: { day: string; month: string; year: string },
    text: string,
  ) {
    setter(text);
    setChecked(false);
    const parsed = parseBirthDate(next.day, next.month, next.year, new Date());
    if (parsed !== null && parsed !== birthDate) {
      onSave(parsed);
    }
  }

  function endEditing() {
    setChecked(true);
    if (day === "" && month === "" && year === "") {
      onSave(null);
    }
  }

  const fields = {
    day: (
      <ProfileField
        key="day"
        value={day}
        onChangeText={(text) =>
          change(setDay, { day: text, month, year }, text)
        }
        onEndEditing={endEditing}
        placeholder={t.settings.user.day}
        maxLength={2}
        accessibilityLabel={`${t.settings.user.birthDate} (${t.settings.user.day})`}
      />
    ),
    month: (
      <ProfileField
        key="month"
        value={month}
        onChangeText={(text) =>
          change(setMonth, { day, month: text, year }, text)
        }
        onEndEditing={endEditing}
        placeholder={t.settings.user.month}
        maxLength={2}
        accessibilityLabel={`${t.settings.user.birthDate} (${t.settings.user.month})`}
      />
    ),
    year: (
      <ProfileField
        key="year"
        value={year}
        onChangeText={(text) =>
          change(setYear, { day, month, year: text }, text)
        }
        onEndEditing={endEditing}
        placeholder={t.settings.user.year}
        maxLength={4}
        grow={2}
        accessibilityLabel={`${t.settings.user.birthDate} (${t.settings.user.year})`}
      />
    ),
  };

  return (
    <View style={globalStyles.formCage}>
      <Text style={globalStyles.inputLabel}>{t.settings.user.birthDate}</Text>
      <View style={styles.row}>
        {language === "en"
          ? [fields.month, fields.day, fields.year]
          : [fields.day, fields.month, fields.year]}
      </View>
      {invalid && (
        <Text style={styles.error}>{t.settings.user.invalidDate}</Text>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    error: {
      fontSize: fontSizes.caption,
      fontFamily: fontsInstrument.medium,
      color: colors.danger,
    },
  }),
);
