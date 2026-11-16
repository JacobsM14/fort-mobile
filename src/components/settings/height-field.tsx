import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ProfileField } from "@/components/settings/profile-field";

import { useSaveOnUnmount } from "@/hooks/use-save-on-unmount";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  parseHeightCm,
  parseHeightFeetInches,
} from "@/features/settings/profile-input";

import { requiredLabel } from "@/utils/text";
import { cmToFeetInches } from "@/utils/units";

import { spacing } from "@/constants/theme";

type HeightFieldProps = {
  heightCm: number | null;
  imperial: boolean;
  onSave: (heightCm: number | null) => void;
  onDraftChange?: (heightCm: number | null) => void;
  required?: boolean;
};

// The height, typed in cm or in feet and inches and kept in cm. Saved when the
// box is left: what isn't a possible height goes back to the saved one, and
// leaving it empty clears it.
export function HeightField({
  heightCm,
  imperial,
  onSave,
  onDraftChange,
  required = false,
}: HeightFieldProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  const saved = heightCm === null ? null : cmToFeetInches(heightCm);
  const [cm, setCm] = useState(heightCm === null ? "" : String(heightCm));
  const [feet, setFeet] = useState(saved === null ? "" : String(saved.feet));
  const [inches, setInches] = useState(
    saved === null ? "" : String(saved.inches),
  );

  function changeCm(text: string) {
    setCm(text);
    onDraftChange?.(parseHeightCm(text));
  }

  function changeFeet(text: string) {
    setFeet(text);
    onDraftChange?.(parseHeightFeetInches(text, inches));
  }

  function changeInches(text: string) {
    setInches(text);
    onDraftChange?.(parseHeightFeetInches(feet, text));
  }

  function restore() {
    setCm(heightCm === null ? "" : String(heightCm));
    setFeet(saved === null ? "" : String(saved.feet));
    setInches(saved === null ? "" : String(saved.inches));
    onDraftChange?.(heightCm);
  }

  function save() {
    const empty = imperial ? feet === "" && inches === "" : cm === "";
    if (empty) {
      onSave(null);
      return;
    }
    const typed = imperial
      ? parseHeightFeetInches(feet, inches)
      : parseHeightCm(cm);
    if (typed === null) {
      restore();
    } else {
      onSave(typed);
    }
  }

  useSaveOnUnmount(save);

  return (
    <View style={globalStyles.formCage}>
      <Text style={globalStyles.inputLabel}>
        {requiredLabel(t.settings.user.height, required)}
      </Text>
      <View style={styles.row}>
        {imperial ? (
          <>
            <ProfileField
              value={feet}
              onChangeText={changeFeet}
              onEndEditing={save}
              placeholder={t.settings.user.feet}
              maxLength={1}
              accessibilityLabel={`${t.settings.user.height} (${t.settings.user.feet})`}
            />
            <ProfileField
              value={inches}
              onChangeText={changeInches}
              onEndEditing={save}
              placeholder={t.settings.user.inches}
              maxLength={2}
              accessibilityLabel={`${t.settings.user.height} (${t.settings.user.inches})`}
            />
          </>
        ) : (
          <ProfileField
            value={cm}
            onChangeText={changeCm}
            onEndEditing={save}
            placeholder={t.settings.user.cm}
            maxLength={3}
            accessibilityLabel={`${t.settings.user.height} (${t.settings.user.cm})`}
          />
        )}
      </View>
    </View>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      gap: spacing.sm,
    },
  }),
);
