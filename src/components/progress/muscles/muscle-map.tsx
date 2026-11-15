import { StyleSheet, Text, View } from "react-native";
import Svg, { Path } from "react-native-svg";

import {
  BODY_BACK,
  BODY_FRONT,
  BODY_VIEWBOX,
  shapeSides,
} from "@/components/progress/muscles/body-shapes";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { MUSCLE_IDS } from "@/features/exercises/catalog";

import type { BodyView } from "@/components/progress/muscles/body-shapes";
import type { MuscleId } from "@/features/exercises/catalog";

import { formatPercent } from "@/utils/number";
import { curvePath } from "@/utils/shape";

import {
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

const OUTLINE_WIDTH = 1.5;
const LINE_WIDTH = 1;

const LABEL_WIDTH = 48;
const LABEL_HEIGHT = 18;
const LEVELS = 4;

type Mark = {
  level: number;
  share: number;
};

type MuscleMapProps = {
  // Each muscle's part of the workout, from 0 to 1.
  shares: Partial<Record<MuscleId, number>>;
};

export function MuscleMap({ shares }: MuscleMapProps) {
  const { t, language } = useTranslation();
  const styles = useStyles();

  const worked = MUSCLE_IDS.flatMap((muscle) => {
    const share = shares[muscle] ?? 0;
    return share > 0 ? [{ muscle, share }] : [];
  }).sort((a, b) => b.share - a.share);
  const maxShare = worked.at(0)?.share ?? 0;

  const marks = new Map<MuscleId, Mark>(
    worked.map(({ muscle, share }) => [
      muscle,
      { level: Math.ceil((LEVELS * share) / maxShare), share },
    ]),
  );
  const description = worked
    .map(
      ({ muscle, share }) =>
        `${t.muscles[muscle]} ${formatPercent(share, language)}`,
    )
    .join(", ");

  return (
    <View
      style={styles.map}
      accessible
      accessibilityRole="image"
      accessibilityLabel={description}
    >
      <BodyFigure
        view={BODY_FRONT}
        caption={t.progress.bodyFront}
        marks={marks}
      />
      <BodyFigure
        view={BODY_BACK}
        caption={t.progress.bodyBack}
        marks={marks}
      />
    </View>
  );
}

type BodyFigureProps = {
  view: BodyView;
  caption: string;
  marks: ReadonlyMap<MuscleId, Mark>;
};

function BodyFigure({ view, caption, marks }: BodyFigureProps) {
  const { language } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.figureColumn}>
      <View style={styles.figure}>
        <Svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${BODY_VIEWBOX.width} ${BODY_VIEWBOX.height}`}
        >
          {view.areas.flatMap((area, index) => {
            const mark = marks.get(area.muscle);
            if (mark === undefined) {
              return [];
            }
            return shapeSides(area).map((points, side) => (
              <Path
                key={`${area.muscle}-${index}-${side}`}
                d={curvePath(points, true)}
                fill={colors.intensity[mark.level - 1]}
              />
            ));
          })}
          {view.lines.flatMap((line, index) =>
            shapeSides(line).map((points, side) => (
              <Path
                key={`line-${index}-${side}`}
                d={curvePath(points, line.closed)}
                fill="none"
                stroke={colors.text}
                strokeWidth={line.outline ? OUTLINE_WIDTH : LINE_WIDTH}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            )),
          )}
        </Svg>
        {view.areas.map((area) => {
          const mark = marks.get(area.muscle);
          if (area.label === undefined || mark === undefined) {
            return null;
          }
          const [x, y] = area.label;
          return (
            <View
              key={area.muscle}
              style={[
                styles.label,
                {
                  left: `${(x / BODY_VIEWBOX.width) * 100}%`,
                  top: `${(y / BODY_VIEWBOX.height) * 100}%`,
                },
              ]}
            >
              <Text style={styles.labelText}>
                {formatPercent(mark.share, language)}
              </Text>
            </View>
          );
        })}
      </View>
      <Text style={globalStyles.inputLabel}>{caption}</Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    map: {
      flexDirection: "row",
      gap: spacing.md,
    },
    figureColumn: {
      flex: 1,
      alignItems: "center",
      gap: spacing.sm,
    },
    figure: {
      width: "100%",
      aspectRatio: BODY_VIEWBOX.width / BODY_VIEWBOX.height,
    },
    label: {
      position: "absolute",
      width: LABEL_WIDTH,
      height: LABEL_HEIGHT,
      marginLeft: -LABEL_WIDTH / 2,
      marginTop: -LABEL_HEIGHT / 2,
      alignItems: "center",
      justifyContent: "center",
    },
    labelText: {
      paddingHorizontal: spacing.xs,
      borderRadius: radii.xs,
      overflow: "hidden",
      backgroundColor: colors.background,
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.disabled,
    },
  }),
);
