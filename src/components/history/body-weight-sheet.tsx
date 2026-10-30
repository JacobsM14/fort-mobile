import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedKeyboard,
  useAnimatedStyle,
} from "react-native-reanimated";

import {
  BodyWeightEntry,
  ENTRY_BUTTON_SIZE,
} from "@/components/progress/body-weight-entry";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { BottomSheet } from "@/components/ui/overlays/bottom-sheet";
import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { formatShortDay } from "@/utils/date";

import { fontsInstrument, fontSizes, radii, spacing } from "@/constants/theme";

type BodyWeightSheetProps = {
  visible: boolean;
  onClose: () => void;
  day: Date;
  initialKg: number;
  savedKg?: number;
  onSave: (kg: number) => void;
  // Only offered when the day has a saved weight.
  onDelete: () => void;
};

// The weight of one day, typed or stepped in a sheet from the bottom.
export function BodyWeightSheet({
  visible,
  onClose,
  day,
  initialKg,
  savedKg,
  onSave,
  onDelete,
}: BodyWeightSheetProps) {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const close = useFocusedPress(onClose);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const dayLabel = formatShortDay(day, language);

  return (
    <>
      <BottomSheet
        visible={visible}
        onClose={onClose}
        closeLabel={t.history.closeWeight}
        header={
          <View style={[globalStyles.dualheader, styles.header]}>
            <View>
              <Text style={globalStyles.subtitle}>{dayLabel}</Text>
              <Text style={styles.title}>{t.history.weight}</Text>
            </View>
            {savedKg !== undefined && (
              <IconButton
                icon={{ ios: "trash", android: "delete", web: "delete" }}
                accessibilityLabel={t.history.deleteWeight}
                tone="danger"
                onPress={() => setConfirmingDelete(true)}
              />
            )}
          </View>
        }
      >
        <BodyWeightEntry
          initialKg={initialKg}
          savedKg={savedKg}
          onSave={onSave}
        />
        <Pressable
          style={({ pressed }) => [styles.cancel, pressed && styles.pressed]}
          onPress={close}
          accessibilityRole="button"
        >
          <Text style={styles.cancelLabel}>{t.history.cancel}</Text>
        </Pressable>
        <KeyboardSpacer />
      </BottomSheet>
      <ConfirmDialog
        visible={visible && confirmingDelete}
        tone="danger"
        title={t.history.deleteWeightTitle}
        message={t.history.deleteWeightMessage(dayLabel)}
        confirmLabel={t.history.deleteWeightConfirm}
        cancelLabel={t.history.cancel}
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete();
        }}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  );
}

// The sheet sits at the bottom of the screen, where the keyboard would cover
// the input: this lifts it by the keyboard's height. It only mounts while the
// sheet is open.
function KeyboardSpacer() {
  const keyboard = useAnimatedKeyboard();
  const style = useAnimatedStyle(() => ({ height: keyboard.height.get() }));

  return <Animated.View style={style} />;
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    header: {
      paddingBottom: spacing.md,
    },
    title: {
      fontSize: fontSizes.heading,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    cancel: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minHeight: ENTRY_BUTTON_SIZE,
      borderWidth: 1,
      borderColor: colors.disabled,
      borderRadius: radii.xs,
    },
    pressed: {
      opacity: 0.6,
    },
    cancelLabel: {
      fontSize: fontSizes.button,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
  }),
);
