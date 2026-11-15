export type Point = readonly [number, number];

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function format([x, y]: Point) {
  return `${round(x)} ${round(y)}`;
}

function samePoint(a: Point, b: Point) {
  return a[0] === b[0] && a[1] === b[1];
}

export function curvePath(points: readonly Point[], closed = false) {
  const unique: Point[] = [];
  const corners: boolean[] = [];
  for (const point of points) {
    const last = unique.at(-1);
    if (last !== undefined && samePoint(last, point)) {
      corners[corners.length - 1] = true;
    } else {
      unique.push(point);
      corners.push(false);
    }
  }
  const first = unique.at(0);
  if (first === undefined || unique.length < 2) {
    return "";
  }

  const count = unique.length;
  const pointAt = (index: number) =>
    closed
      ? unique[(index + count) % count]
      : unique[Math.min(Math.max(index, 0), count - 1)];
  const tangents = unique.map((point, index): Point => {
    if (corners[index]) {
      return [0, 0];
    }
    const previous = pointAt(index - 1);
    const next = pointAt(index + 1);
    return [(next[0] - previous[0]) / 6, (next[1] - previous[1]) / 6];
  });

  const segments = closed ? count : count - 1;
  const curves = Array.from({ length: segments }, (_, index) => {
    const from = unique[index];
    const to = pointAt(index + 1);
    const out = tangents[index];
    const into = tangents[(index + 1) % count];
    return `C${format([from[0] + out[0], from[1] + out[1]])} ${format([to[0] - into[0], to[1] - into[1]])} ${format(to)}`;
  });
  return `M${format(first)} ${curves.join(" ")}${closed ? " Z" : ""}`;
}
