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

import { cmToFeetInches } from "@/utils/units";

import { spacing } from "@/constants/theme";

type HeightFieldProps = {
  heightCm: number | null;
  // Feet and inches for who measures distance in miles.
  imperial: boolean;
  onSave: (heightCm: number | null) => void;
};

// The height, typed in cm or in feet and inches and kept in cm. Saved when the
// box is left: what isn't a possible height goes back to the saved one, and
// leaving it empty clears it.
export function HeightField({ heightCm, imperial, onSave }: HeightFieldProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  const saved = heightCm === null ? null : cmToFeetInches(heightCm);
  const [cm, setCm] = useState(heightCm === null ? "" : String(heightCm));
  const [feet, setFeet] = useState(saved === null ? "" : String(saved.feet));
  const [inches, setInches] = useState(
    saved === null ? "" : String(saved.inches),
  );

  function restore() {
    setCm(heightCm === null ? "" : String(heightCm));
    setFeet(saved === null ? "" : String(saved.feet));
    setInches(saved === null ? "" : String(saved.inches));
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
      <Text style={globalStyles.inputLabel}>{t.settings.user.height}</Text>
      <View style={styles.row}>
        {imperial ? (
          <>
            <ProfileField
              value={feet}
              onChangeText={setFeet}
              onEndEditing={save}
              placeholder={t.settings.user.feet}
              maxLength={1}
              accessibilityLabel={`${t.settings.user.height} (${t.settings.user.feet})`}
            />
            <ProfileField
              value={inches}
              onChangeText={setInches}
              onEndEditing={save}
              placeholder={t.settings.user.inches}
              maxLength={2}
              accessibilityLabel={`${t.settings.user.height} (${t.settings.user.inches})`}
            />
          </>
        ) : (
          <ProfileField
            value={cm}
            onChangeText={setCm}
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
