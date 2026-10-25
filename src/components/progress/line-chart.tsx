import * as Haptics from "expo-haptics";
import { useId, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type AccessibilityActionEvent,
  type LayoutChangeEvent,
} from "react-native";
import {
  GestureDetector,
  useCompetingGestures,
  usePanGesture,
  useTapGesture,
} from "react-native-gesture-handler";
import Svg, {
  Defs,
  Line,
  Path,
  Pattern,
  Polygon,
  Rect,
} from "react-native-svg";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { Language } from "@/i18n";

import {
  areaPath,
  linePath,
  nearestIndex,
  scalePoints,
  type ChartPoint,
  type PlottedPoint,
} from "@/utils/chart";

import {
  fontSizes,
  fontsInstrument,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

const CHART_HEIGHT = 200;
// The strip on the right where the selected value's block sits.
const BLOCK_WIDTH = 84;
const BLOCK_HEIGHT = 44;
// Room above and below the line so the markers aren't cut off.
const PLOT_INSET = 14;
const MARKER_SIZE = 10;
const SELECTED_MARKER_SIZE = 14;
const HATCH_GAP = 7;
// A drag this far sideways selects; up and down first, it's the page's scroll.
const DRAG_SLOP = 8;

type LineChartProps = {
  points: readonly ChartPoint[];
  formatValue: (value: number) => string;
  // The accent by default; any color can be passed for other charts.
  color?: string;
  // Read by screen readers instead of the drawing, e.g. "Estimated 1RM: from
  // 70 to 85 kg over 11 days".
  accessibilityLabel: string;
};

function formatShortDate(date: Date, language: Language) {
  return date
    .toLocaleDateString(language, { day: "numeric", month: "short" })
    .replace(".", "");
}

// A triangle pointing up, centered on the point.
function trianglePoints({ x, y }: PlottedPoint, size: number) {
  const half = size / 2;
  return `${x},${y - half} ${x + half},${y + half * 0.8} ${x - half},${y + half * 0.8}`;
}

// One value per day: a line over a hatched body, a triangle on each day and a
// square on the last. Dragging or tapping picks the closest day; the last one
// is picked to begin with.
export function LineChart({
  points,
  formatValue,
  color,
  accessibilityLabel,
}: LineChartProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const lineColor = color ?? colors.primary;
  // SVG ids can't hold the colons useId makes.
  const hatchId = `hatch${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const [width, setWidth] = useState(0);
  const [selected, setSelected] = useState(points.length - 1);
  const index = Math.min(selected, points.length - 1);

  const plotRight = Math.max(0, width - BLOCK_WIDTH - spacing.sm);
  const baseline = CHART_HEIGHT - 1;
  const plotted = scalePoints(
    points.map((point) => point.value),
    {
      left: SELECTED_MARKER_SIZE / 2,
      top: PLOT_INSET,
      width: Math.max(0, plotRight - SELECTED_MARKER_SIZE),
      height: CHART_HEIGHT - PLOT_INSET * 2,
    },
  );
  const current = plotted.at(index);
  const currentPoint = points.at(index);

  function select(next: number) {
    if (next >= 0 && next < points.length && next !== index) {
      setSelected(next);
      void Haptics.selectionAsync();
    }
  }

  function selectAt(x: number) {
    select(nearestIndex(x, plotted));
  }

  const pan = usePanGesture({
    activeOffsetX: [-DRAG_SLOP, DRAG_SLOP],
    failOffsetY: [-DRAG_SLOP, DRAG_SLOP],
    runOnJS: true,
    onActivate: (event) => selectAt(event.x),
    onUpdate: (event) => selectAt(event.x),
  });
  const tap = useTapGesture({
    runOnJS: true,
    onActivate: (event) => selectAt(event.x),
  });
  const gesture = useCompetingGestures(pan, tap);

  function onAccessibilityAction(event: AccessibilityActionEvent) {
    if (event.nativeEvent.actionName === "increment") {
      select(index + 1);
    } else if (event.nativeEvent.actionName === "decrement") {
      select(index - 1);
    }
  }

  function measure(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  const first = points.at(0);
  const last = points.at(-1);
  const selectedText =
    currentPoint === undefined
      ? ""
      : `${formatValue(currentPoint.value)}, ${formatShortDate(currentPoint.date, language)}`;
  const blockTop =
    current === undefined
      ? 0
      : Math.min(
          Math.max(current.y - BLOCK_HEIGHT / 2, 0),
          CHART_HEIGHT - BLOCK_HEIGHT,
        );

  return (
    <View style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View
          style={styles.chart}
          onLayout={measure}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={accessibilityLabel}
          accessibilityHint={t.progress.chartHint}
          accessibilityValue={{ text: selectedText }}
          accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
          onAccessibilityAction={onAccessibilityAction}
        >
          {width > 0 && (
            <Svg width={width} height={CHART_HEIGHT}>
              <Defs>
                <Pattern
                  id={hatchId}
                  patternUnits="userSpaceOnUse"
                  width={HATCH_GAP}
                  height={HATCH_GAP}
                  patternTransform="rotate(45)"
                >
                  <Line
                    x1={0}
                    y1={0}
                    x2={0}
                    y2={HATCH_GAP}
                    stroke={lineColor}
                    strokeWidth={1}
                    strokeOpacity={0.35}
                  />
                </Pattern>
              </Defs>
              <Path d={areaPath(plotted, baseline)} fill={`url(#${hatchId})`} />
              <Line
                x1={0}
                y1={baseline}
                x2={plotRight}
                y2={baseline}
                stroke={colors.border}
                strokeWidth={1}
              />
              {current !== undefined && (
                <>
                  <Line
                    x1={current.x}
                    y1={baseline}
                    x2={current.x}
                    y2={current.y}
                    stroke={lineColor}
                    strokeWidth={1}
                  />
                  <Line
                    x1={current.x}
                    y1={current.y}
                    x2={width}
                    y2={current.y}
                    stroke={lineColor}
                    strokeWidth={1}
                  />
                </>
              )}
              <Path
                d={linePath(plotted)}
                fill="none"
                stroke={lineColor}
                strokeWidth={2}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {plotted.map((point, pointIndex) => {
                const size =
                  pointIndex === index ? SELECTED_MARKER_SIZE : MARKER_SIZE;
                // The ring in the background color keeps a marker readable
                // where it sits on the line.
                return pointIndex === plotted.length - 1 ? (
                  <Rect
                    key={pointIndex}
                    x={point.x - size / 2}
                    y={point.y - size / 2}
                    width={size}
                    height={size}
                    fill={lineColor}
                    stroke={colors.background}
                    strokeWidth={2}
                  />
                ) : (
                  <Polygon
                    key={pointIndex}
                    points={trianglePoints(point, size)}
                    fill={lineColor}
                    stroke={colors.background}
                    strokeWidth={2}
                    strokeLinejoin="round"
                  />
                );
              })}
            </Svg>
          )}
          {currentPoint !== undefined && width > 0 && (
            <View
              style={[
                styles.block,
                { top: blockTop, backgroundColor: lineColor },
              ]}
            >
              <Text
                style={styles.blockValue}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatValue(currentPoint.value)}
              </Text>
              <Text style={styles.blockDate} numberOfLines={1}>
                {formatShortDate(currentPoint.date, language)}
              </Text>
            </View>
          )}
        </View>
      </GestureDetector>
      {first !== undefined && last !== undefined && (
        <View style={[styles.dates, { width: plotRight }]}>
          <Text style={styles.date}>
            {formatShortDate(first.date, language)}
          </Text>
          {points.length > 1 && (
            <Text style={styles.date}>
              {formatShortDate(last.date, language)}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    chart: {
      height: CHART_HEIGHT,
    },
    block: {
      position: "absolute",
      right: 0,
      width: BLOCK_WIDTH,
      height: BLOCK_HEIGHT,
      justifyContent: "center",
      paddingHorizontal: spacing.xs,
      borderRadius: radii.sm,
    },
    blockValue: {
      fontSize: fontSizes.label,
      fontFamily: fontsInstrument.bold,
      color: colors.onPrimary,
      textAlign: "center",
    },
    blockDate: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.onPrimary,
      textAlign: "center",
    },
    dates: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    date: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
  }),
);
