// Geometry for the line chart, kept apart from the drawing so it can be tested.

export type ChartPoint = {
  date: Date;
  value: number;
};

export type PlotArea = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type PlottedPoint = {
  x: number;
  y: number;
};

// Spread evenly across the width, one per day with data, and scaled so the
// lowest value sits on the bottom and the highest on the top. A single point,
// or values all equal, sit in the middle instead of dividing by zero.
export function scalePoints(
  values: readonly number[],
  plot: PlotArea,
): PlottedPoint[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const step = values.length > 1 ? plot.width / (values.length - 1) : 0;

  return values.map((value, index) => ({
    x:
      values.length > 1 ? plot.left + index * step : plot.left + plot.width / 2,
    y:
      max === min
        ? plot.top + plot.height / 2
        : plot.top + (1 - (value - min) / (max - min)) * plot.height,
  }));
}

// The point under the finger: the closest by x, so the selection snaps from
// day to day. -1 when there are none.
export function nearestIndex(x: number, points: readonly PlottedPoint[]) {
  let best = -1;
  let bestDistance = Infinity;
  points.forEach((point, index) => {
    const distance = Math.abs(point.x - x);
    if (distance < bestDistance) {
      best = index;
      bestDistance = distance;
    }
  });
  return best;
}

export function linePath(points: readonly PlottedPoint[]) {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`)
    .join(" ");
}

// The line closed down to the baseline, for the shading under it.
export function areaPath(points: readonly PlottedPoint[], baseline: number) {
  const first = points.at(0);
  const last = points.at(-1);
  if (first === undefined || last === undefined) {
    return "";
  }
  return `${linePath(points)} L${last.x} ${baseline} L${first.x} ${baseline} Z`;
}
