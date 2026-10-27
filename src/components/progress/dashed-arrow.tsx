import { View } from "react-native";
import Svg, { Line, Polyline } from "react-native-svg";

import { useTheme } from "@/hooks/use-theme";

const HEIGHT = 10;
const HEAD_WIDTH = 6;
const STROKE = 1;
const DASH = 3;
const GAP = 6;

// A dashed line ending in an arrow head, filling the room it is given. The
// dashes and the head have a fixed size: only the line gets longer.
export function DashedArrow() {
  const { colors } = useTheme();
  const middle = HEIGHT / 2;

  return (
    <View
      style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg
        height={HEIGHT}
        style={{ flex: 1, marginRight: -(HEAD_WIDTH - STROKE) }}
      >
        <Line
          x1="0"
          y1={middle}
          x2="100%"
          y2={middle}
          stroke={colors.text}
          strokeWidth={STROKE}
          strokeDasharray={`${DASH} ${GAP}`}
        />
      </Svg>
      <Svg width={HEAD_WIDTH} height={HEIGHT}>
        <Polyline
          points={`0,0 ${HEAD_WIDTH - STROKE},${middle} 0,${HEIGHT}`}
          fill="none"
          stroke={colors.text}
          strokeWidth={STROKE}
        />
      </Svg>
    </View>
  );
}
