import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { IconButton } from "@/components/ui/buttons/icon-button";
import { CheckBox } from "@/components/ui/inputs/check-box";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import { TRACKING_TYPE_ICONS } from "@/constants/tracking-type-icons";

import type { TrackingType } from "@/constants/enums";

import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  spacing,
} from "@/constants/theme";

type ExerciseRowProps = {
  name: string;
  detail: string;
  trackingType: TrackingType;
} & (
  | { onInfo?: undefined; infoLabel?: undefined }
  | { onInfo: () => void; infoLabel: string }
) &
  (
    | { selected: boolean; onToggle: () => void }
    | { removeLabel: string; onRemove: () => void }
  );

export function ExerciseRow(props: ExerciseRowProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <View>
        <SymbolView
          name={TRACKING_TYPE_ICONS[props.trackingType]}
          tintColor={colors.text}
          size={iconSizes.md}
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={2}>
          {props.name}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          {props.detail}
        </Text>
      </View>
      {props.onInfo !== undefined && (
        <IconButton
          tone="muted"
          icon={{ ios: "info.circle", android: "info", web: "info" }}
          accessibilityLabel={props.infoLabel}
          onPress={props.onInfo}
        />
      )}
      {"onRemove" in props ? (
        <IconButton
          tone="muted"
          icon={{ ios: "xmark", android: "close", web: "close" }}
          iconSize={iconSizes.sm}
          accessibilityLabel={props.removeLabel}
          onPress={props.onRemove}
        />
      ) : (
        <CheckBox
          checked={props.selected}
          uncheckedIcon={{ ios: "plus", android: "add", web: "add" }}
          accessibilityLabel={props.name}
          onPress={props.onToggle}
        />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    text: {
      flex: 1,
    },
    name: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    detail: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
