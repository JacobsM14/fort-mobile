import type { HostInstance } from "react-native";

import { spacing } from "@/constants/theme";

// Where a menu opened from `target` goes, relative to `screen`, the view the
// menu covers: just below the target, with its left or right edge lined up
// with the target's.
export type MeasuredAnchor = {
  top: number;
  left: number;
  right: number;
  width: number;
};

// Measured when the menu opens: the target may have scrolled since it was
// laid out, so only the window knows where it is now.
export function measureMenuAnchor(
  screen: HostInstance | null,
  target: HostInstance | null | undefined,
  onMeasured: (anchor: MeasuredAnchor) => void,
) {
  screen?.measureInWindow((screenX, screenY, screenWidth) => {
    target?.measureInWindow((x, y, width, height) => {
      onMeasured({
        top: y - screenY + height + spacing.xs,
        left: x - screenX,
        right: screenWidth - (x - screenX + width),
        width,
      });
    });
  });
}
