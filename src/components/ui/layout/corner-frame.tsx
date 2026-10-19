import type { ReactNode } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import { useTheme } from "@/hooks/use-theme";

type CornerFrameProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  // Length of each arm of the corner.
  size?: number;
  thickness?: number;
  // How far the corners float outside the content.
  offset?: number;
  color?: string;
};

export function CornerFrame({
  children,
  style,
  size = 16,
  thickness = 2,
  offset = 8,
  color,
}: CornerFrameProps) {
  const { colors } = useTheme();
  const corner: ViewStyle = {
    position: "absolute",
    width: size,
    height: size,
    borderColor: color ?? colors.primary,
    pointerEvents: "none",
  };

  return (
    <View style={style}>
      {children}
      <View
        style={[
          corner,
          {
            top: -offset,
            left: -offset,
            borderTopWidth: thickness,
            borderLeftWidth: thickness,
          },
        ]}
      />
      <View
        style={[
          corner,
          {
            top: -offset,
            right: -offset,
            borderTopWidth: thickness,
            borderRightWidth: thickness,
          },
        ]}
      />
      <View
        style={[
          corner,
          {
            bottom: -offset,
            left: -offset,
            borderBottomWidth: thickness,
            borderLeftWidth: thickness,
          },
        ]}
      />
      <View
        style={[
          corner,
          {
            bottom: -offset,
            right: -offset,
            borderBottomWidth: thickness,
            borderRightWidth: thickness,
          },
        ]}
      />
    </View>
  );
}
