import { StyleSheet, Text, View } from "react-native";
import Svg, { Polygon } from "react-native-svg";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  BMI_CATEGORIES,
  bmiBlockHeights,
  bmiScaleY,
} from "@/features/progress/bmi";

import type { BmiCategory } from "@/features/progress/bmi";

import { fontSizes, fontsJetBrainsMono, spacing } from "@/constants/theme";

const HEIGHT = 200;
const COLUMN_WIDTH = 34;
const GAP = 2;
// How far the line reaches past the right of the column.
const OVERHANG = 4;
const CONE_LENGTH = 10;
const CONE_HEIGHT = 10;
const INDICATOR_WIDTH = 2;
// Room above and below the column, so the cone isn't cut at the ends.
const PAD = CONE_HEIGHT / 2;

type BmiScaleProps = {
  value: number;
};

// The BMI bands as a column, the highest on top, each with its name, and the
// user's BMI pointed at from the left. It only draws: the numbers go next to it.
export function BmiScale({ value }: BmiScaleProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();

  // From faint to the full accent as the risk goes up.
  const blockColors: Record<BmiCategory, string> = {
    underweight: colors.disabled,
    normal: colors.text,
    overweight: colors.primarySoft,
    obese: colors.primary,
  };
  const heights = bmiBlockHeights(HEIGHT, GAP);
  const blocks = BMI_CATEGORIES.map((band, index) => ({
    id: band.id,
    height: heights[index],
  })).reverse();
  const valueY = PAD + bmiScaleY(value, HEIGHT, GAP);

  return (
    <View
      style={styles.scale}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <View style={styles.bands}>
        {blocks.map((block) => (
          <View key={block.id} style={[styles.band, { height: block.height }]}>
            <View
              style={[styles.block, { backgroundColor: blockColors[block.id] }]}
            />
            <Text style={styles.label} numberOfLines={1}>
              {t.progress.bmiBands[block.id]}
            </Text>
          </View>
        ))}
      </View>
      {/* Drawn last, over the blocks. The cone narrows into the column. */}
      <View style={[styles.indicator, { top: valueY - CONE_HEIGHT / 2 }]}>
        <Svg width={CONE_LENGTH} height={CONE_HEIGHT}>
          <Polygon
            points={`0,0 ${CONE_LENGTH},${CONE_HEIGHT / 2} 0,${CONE_HEIGHT}`}
            fill={colors.primary}
          />
        </Svg>
        <View style={styles.indicatorLine} />
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    scale: {
      height: HEIGHT + PAD * 2,
      paddingVertical: PAD,
      paddingLeft: CONE_LENGTH,
    },
    bands: {
      gap: GAP,
    },
    band: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    block: {
      width: COLUMN_WIDTH,
      height: "100%",
    },
    label: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    indicator: {
      position: "absolute",
      left: 0,
      height: CONE_HEIGHT,
      flexDirection: "row",
      alignItems: "center",
    },
    indicatorLine: {
      width: COLUMN_WIDTH + OVERHANG,
      height: INDICATOR_WIDTH,
      backgroundColor: colors.primary,
    },
  }),
);
