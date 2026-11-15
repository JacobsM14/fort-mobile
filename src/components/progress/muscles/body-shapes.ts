import type { MuscleId } from "@/features/exercises/catalog";
import type { Point } from "@/utils/shape";

// The body is drawn as lines (the outline and the edges between muscles) over
// areas that only get filled when their muscle was worked. Lines and areas go
// through curvePath; areas sit a little inside their lines so a filled muscle
// reads within its edges.

export type BodyLine = {
  points: readonly Point[];
  closed?: boolean;
  // Drawn as is across the middle; any other line is drawn on the left half
  // only and mirrored, so both sides always match.
  center?: boolean;
  // The body's outline, drawn thicker than the lines inside it.
  outline?: boolean;
};

export type MuscleArea = {
  muscle: MuscleId;
  points: readonly Point[];
  center?: boolean;
  // Where the muscle's number goes. Only one area per muscle has it, in the
  // view where the muscle shows best, and next to a neighbor it goes on the
  // other side or higher up so their numbers don't overlap.
  label?: Point;
};

export type BodyView = {
  lines: readonly BodyLine[];
  areas: readonly MuscleArea[];
};

export const BODY_VIEWBOX = { width: 100, height: 200 };

function mirror([x, y]: Point): Point {
  return [BODY_VIEWBOX.width - x, y];
}

export function shapeSides(shape: {
  points: readonly Point[];
  center?: boolean;
}): (readonly Point[])[] {
  return shape.center
    ? [shape.points]
    : [shape.points, shape.points.map(mirror)];
}

// A closed shape across the middle from its left half, given from the top of
// the middle line down to its bottom.
function symmetric(left: readonly Point[]): Point[] {
  return [...left, ...left.slice(1, -1).reverse().map(mirror)];
}

const OUTLINE_LEFT: readonly Point[] = [
  [50, 2],
  [45.6, 2.9],
  [42.6, 6.4],
  [41.7, 11.5],
  [42.4, 16.4],
  [44.3, 20.4],
  [47.2, 23.2],
  [46.3, 24.4],
  [46.3, 24.4],
  [46.1, 27.4],
  [43.5, 29.6],
  [38.5, 31.3],
  [32.5, 32.4],
  [27.5, 33.3],
  [23.6, 35.2],
  [21.2, 39],
  [20.3, 44],
  [19.8, 50],
  [19.3, 57],
  [18.8, 63.5],
  [17.6, 70],
  [16.4, 78],
  [15.7, 86],
  [15.6, 92],
  [14.9, 96.5],
  [14.6, 101.5],
  [15.4, 106],
  [17.4, 108.6],
  [19.6, 107.6],
  [20.6, 103.5],
  [20.7, 98],
  [20.6, 93],
  [21.4, 86],
  [22.7, 78],
  [24.2, 71],
  [25.2, 66.5],
  [26, 60],
  [26.9, 53],
  [27.8, 47.5],
  [28.8, 45],
  [28.8, 45],
  [30.4, 50],
  [31.6, 57],
  [32.4, 64],
  [32.6, 71],
  [32.2, 78],
  [31.4, 85],
  [30.9, 92],
  [30.8, 100],
  [31.3, 110],
  [32.3, 120],
  [33.4, 130],
  [34.3, 139],
  [34.6, 146],
  [34.4, 152],
  [34, 158],
  [34.3, 166],
  [35.4, 175],
  [36.6, 184],
  [36.3, 189],
  [35.4, 194],
  [35.6, 197.2],
  [35.6, 197.2],
  [42.8, 197.6],
  [42.8, 197.6],
  [43.6, 193.5],
  [43.3, 188],
  [43.8, 180],
  [45, 170],
  [45.3, 161],
  [44.8, 154],
  [44.9, 147],
  [45.4, 139],
  [46.3, 128],
  [47.5, 117],
  [48.8, 109],
  [50, 105.5],
  [50, 105.5],
];

const OUTLINE: BodyLine = {
  points: symmetric(OUTLINE_LEFT),
  closed: true,
  center: true,
  outline: true,
};

const DELT_SPLIT: BodyLine = {
  points: [
    [26, 34.1],
    [24.9, 40],
    [24.1, 46],
    [23.6, 52.1],
  ],
};

const DELT_BOTTOM: BodyLine = {
  points: [
    [27.4, 49.5],
    [25.3, 51.5],
    [22.6, 52.5],
    [19.7, 52.4],
  ],
};

const ELBOW: BodyLine = {
  points: [
    [18.9, 64.5],
    [21.8, 65.8],
    [25.1, 66.4],
  ],
};

const WRIST: BodyLine = {
  points: [
    [15.6, 92],
    [18.1, 92.8],
    [20.6, 92.4],
  ],
};

const SIDE_DELT_AREA: readonly Point[] = [
  [25.4, 35.6],
  [24, 40],
  [23.1, 46],
  [22.6, 51],
  [21, 51],
  [20.9, 45],
  [21.6, 40],
  [23.2, 36.8],
];

const UPPER_ARM_AREA: readonly Point[] = [
  [21, 54.4],
  [24.6, 53.9],
  [26.2, 55],
  [25.8, 59],
  [25.1, 63.4],
  [22, 64.2],
  [20, 63.3],
  [20.3, 58],
];

const FOREARM_AREA: readonly Point[] = [
  [19.6, 67.4],
  [23.6, 68],
  [23, 73],
  [21.5, 80],
  [20.4, 86.5],
  [19.6, 91],
  [17, 91],
  [16.7, 85],
  [17.2, 77],
  [18, 70.4],
];

export const BODY_FRONT: BodyView = {
  lines: [
    OUTLINE,
    {
      points: [
        [46.8, 25.6],
        [48, 29.4],
        [49.2, 32.8],
      ],
    },
    {
      points: [
        [48.4, 33.2],
        [43, 33.6],
        [37, 34.4],
        [31.5, 35.4],
        [27.6, 36.2],
      ],
    },
    {
      points: [
        [31.5, 35.4],
        [31.1, 39.5],
        [30.2, 43],
        [28.8, 45],
      ],
    },
    DELT_SPLIT,
    DELT_BOTTOM,
    {
      points: [
        [28.8, 45],
        [30.5, 49.8],
        [34, 53.4],
        [39, 55.2],
        [44.5, 54.8],
        [50, 53],
      ],
    },
    {
      points: [
        [50, 33.5],
        [50, 97],
      ],
      center: true,
    },
    {
      points: [
        [43, 55],
        [42.2, 63],
        [42.1, 72],
        [42.6, 81],
        [43.8, 89],
        [46.2, 96.5],
      ],
    },
    {
      points: [
        [42.3, 63.6],
        [46, 62.9],
        [50, 63.4],
      ],
    },
    {
      points: [
        [42.1, 73.3],
        [46, 72.7],
        [50, 73.2],
      ],
    },
    {
      points: [
        [42.6, 83],
        [46.2, 82.5],
        [50, 83],
      ],
    },
    // Groin
    {
      points: [
        [31.6, 86],
        [35.5, 91.5],
        [40.2, 96.6],
        [44.6, 100.8],
        [48, 104],
      ],
    },
    // Outer thigh, around the abductors
    {
      points: [
        [31.4, 92],
        [34, 101],
        [35.6, 112],
        [36.4, 124],
      ],
    },
    // Top of the quads
    {
      points: [
        [33.9, 100.6],
        [37.5, 104],
        [41, 106.8],
        [44, 108.4],
      ],
    },
    {
      points: [
        [44, 108.4],
        [44.6, 117],
        [44.5, 128],
        [44.9, 138.5],
      ],
    },
    {
      points: [
        [39.8, 142.8],
        [42.6, 144.2],
        [43.2, 147.2],
        [41.7, 150.2],
        [39.8, 150.9],
        [37.9, 150.2],
        [36.6, 147.2],
        [37.2, 144.2],
      ],
      closed: true,
    },
    {
      points: [
        [40.2, 154],
        [39.8, 165],
        [39.9, 177],
        [40.4, 186],
      ],
    },
    ELBOW,
    WRIST,
  ],
  areas: [
    {
      muscle: "neck",
      points: [
        [47.2, 25.2],
        [52.8, 25.2],
        [53.1, 29],
        [51.6, 32.2],
        [48.4, 32.2],
        [46.9, 29],
      ],
      center: true,
      label: [50, 28.5],
    },
    {
      muscle: "traps",
      points: [
        [45.4, 28.9],
        [41.6, 31],
        [36, 32.6],
        [30.4, 33.9],
        [36.6, 33.5],
        [42.6, 32.9],
        [46.4, 32.2],
      ],
    },
    { muscle: "side_delts", points: SIDE_DELT_AREA, label: [22.4, 43] },
    {
      muscle: "front_delts",
      points: [
        [27.8, 37.3],
        [30.3, 36.9],
        [29.9, 40.6],
        [28.9, 43.8],
        [27.3, 47.2],
        [25.4, 50.3],
        [24.9, 46],
        [25.7, 40.2],
      ],
      label: [72.6, 43.4],
    },
    {
      muscle: "chest",
      points: [
        [33, 36.7],
        [40, 35.7],
        [48.9, 34.8],
        [48.9, 44],
        [48.9, 51.7],
        [44.5, 53.5],
        [39, 53.9],
        [34.6, 52.3],
        [31.6, 48.6],
        [31.8, 43.2],
        [32.4, 39.6],
      ],
      label: [50, 45.5],
    },
    { muscle: "biceps", points: UPPER_ARM_AREA, label: [22.9, 59] },
    { muscle: "forearms", points: FOREARM_AREA, label: [19.8, 79] },
    {
      muscle: "abs",
      points: symmetric([
        [50, 55.3],
        [44, 56.2],
        [42.9, 63],
        [42.8, 72],
        [43.3, 81],
        [44.5, 88.5],
        [46.5, 95],
        [50, 96],
      ]),
      center: true,
      label: [50, 68],
    },
    {
      muscle: "obliques",
      points: [
        [32.8, 56.4],
        [37, 56.8],
        [41.1, 57.2],
        [41.2, 64],
        [41, 72],
        [41.5, 81],
        [42.6, 88],
        [44, 94.4],
        [41.2, 94.6],
        [37.2, 90.8],
        [33.6, 86.2],
        [33, 78],
        [33.4, 71],
        [33.2, 64],
        [32.4, 58.6],
      ],
      label: [62.4, 80],
    },
    {
      muscle: "hip_flexors",
      points: [
        [33.4, 91.6],
        [36.4, 94.2],
        [40.6, 98.6],
        [44.4, 102.4],
        [46.6, 105.2],
        [43.2, 107],
        [39.8, 105],
        [36.2, 102.4],
        [34.4, 99.8],
      ],
      label: [39.6, 101],
    },
    {
      muscle: "abductors",
      points: [
        [32, 95.6],
        [33.3, 101],
        [34.4, 110],
        [35.1, 120],
        [33.9, 122],
        [32.7, 113],
        [31.9, 104],
      ],
    },
    {
      muscle: "quads",
      points: [
        [36.2, 105],
        [40.5, 107.9],
        [43.1, 109.8],
        [43.6, 117],
        [43.5, 128],
        [43.8, 137],
        [41.8, 141.4],
        [38, 141.6],
        [35.6, 138.4],
        [35, 131],
        [36, 126],
        [37.1, 121],
        [36.7, 113],
        [35.6, 107.4],
      ],
      label: [39.6, 124],
    },
    {
      muscle: "adductors",
      points: [
        [45.4, 110.6],
        [47.8, 110.4],
        [46.7, 117],
        [45.7, 126],
        [45.2, 131],
        [45.3, 124],
        [45.4, 117],
      ],
      label: [54.6, 114],
    },
    {
      muscle: "calves",
      points: [
        [41.4, 156],
        [44, 155.8],
        [44.4, 162],
        [44.2, 170],
        [43.1, 177.6],
        [41.6, 181.6],
        [41, 175],
        [40.9, 165],
      ],
    },
  ],
};

export const BODY_BACK: BodyView = {
  lines: [
    OUTLINE,
    {
      points: [
        [50, 26],
        [50, 96],
      ],
      center: true,
    },
    {
      points: [
        [28.6, 34.6],
        [33.5, 38.2],
        [39.5, 45],
        [44.8, 54.5],
        [50, 66],
      ],
    },
    {
      points: [
        [28.6, 34.6],
        [30.6, 39.4],
        [30.4, 43],
        [28.8, 45],
      ],
    },
    DELT_SPLIT,
    DELT_BOTTOM,
    {
      points: [
        [28.8, 45],
        [33.5, 49.5],
        [39, 52.8],
        [44.8, 54.5],
      ],
    },
    {
      points: [
        [47.3, 60],
        [46, 68],
        [43, 76],
        [38, 82],
        [31.6, 84.4],
      ],
    },
    {
      points: [
        [31.2, 91],
        [36, 92.4],
        [42, 93],
        [47, 94],
        [50, 95.5],
      ],
    },
    {
      points: [
        [35, 92.3],
        [36.2, 97],
        [35, 102.5],
        [31.1, 106.5],
      ],
    },
    {
      points: [
        [31.6, 113],
        [36, 116.6],
        [42, 117.4],
        [46.4, 115.2],
        [48.3, 111.4],
      ],
    },
    {
      points: [
        [50, 95.5],
        [50, 105.5],
      ],
      center: true,
    },
    {
      points: [
        [45.2, 116.4],
        [44.5, 127],
        [44, 137],
      ],
    },
    {
      points: [
        [40.2, 118],
        [39.7, 130],
        [39.9, 143],
      ],
    },
    {
      points: [
        [34.6, 146.5],
        [39.6, 147.6],
        [44.9, 146.6],
      ],
    },
    {
      points: [
        [40, 150],
        [39.8, 160],
        [40, 168],
      ],
    },
    {
      points: [
        [34.3, 164],
        [37.2, 170.5],
        [40, 173.2],
        [42.8, 170.5],
        [45.2, 163.5],
      ],
    },
    ELBOW,
    WRIST,
  ],
  areas: [
    {
      muscle: "traps",
      points: symmetric([
        [50, 25.2],
        [47, 25.6],
        [46.2, 28.4],
        [42.4, 30.6],
        [37, 32.2],
        [30.6, 33.8],
        [34.2, 37.2],
        [38.9, 43.2],
        [43.6, 51.6],
        [47.4, 59.4],
        [50, 64.4],
      ]),
      center: true,
      label: [50, 36],
    },
    {
      muscle: "rear_delts",
      points: [
        [28, 36.6],
        [29.8, 39.6],
        [29.6, 43.2],
        [28, 45.6],
        [26.6, 48.2],
        [25.2, 50.2],
        [24.9, 46],
        [25.8, 40.2],
        [26.8, 36.4],
      ],
      label: [27.2, 43],
    },
    { muscle: "side_delts", points: SIDE_DELT_AREA },
    {
      muscle: "upper_back",
      points: [
        [31.6, 38.6],
        [33.9, 39.8],
        [38.5, 45.2],
        [42.6, 52.4],
        [39, 51.6],
        [34, 48.8],
        [31, 45.8],
        [31.5, 41.8],
      ],
      label: [63, 46.5],
    },
    {
      muscle: "lats",
      points: [
        [31.4, 49.2],
        [35, 51.8],
        [40, 54.3],
        [45, 56.2],
        [46.4, 60.4],
        [45.1, 67.8],
        [42.2, 75],
        [37.6, 80.4],
        [33.4, 82.2],
        [33, 77.6],
        [33.4, 71],
        [33.2, 64],
        [32.6, 58.4],
        [31.6, 52.4],
      ],
      label: [38.6, 70],
    },
    {
      muscle: "lower_back",
      points: symmetric([
        [50, 67.6],
        [47.8, 63.2],
        [46.6, 68.4],
        [43.8, 76.4],
        [38.6, 83.4],
        [32.6, 85.8],
        [32.2, 89.2],
        [36, 90.8],
        [42, 91.6],
        [47, 92.6],
        [50, 94],
      ]),
      center: true,
      label: [50, 82],
    },
    { muscle: "triceps", points: UPPER_ARM_AREA, label: [22.9, 59] },
    { muscle: "forearms", points: FOREARM_AREA },
    {
      muscle: "glutes",
      points: [
        [37, 94.2],
        [42, 94.7],
        [47.6, 95.8],
        [48.9, 99],
        [48.9, 105.4],
        [47.8, 110.4],
        [46, 113.8],
        [42, 115.8],
        [36.8, 115],
        [33.2, 112.2],
        [32.6, 108.6],
        [35.6, 104.2],
        [37.3, 99],
      ],
      label: [41.5, 105],
    },
    {
      muscle: "abductors",
      points: [
        [32.2, 93],
        [34, 93.4],
        [35.1, 97.2],
        [34, 101.6],
        [31.9, 104.4],
        [31.6, 99],
      ],
      label: [67.4, 98.4],
    },
    {
      muscle: "hamstrings",
      points: [
        [33.4, 116.4],
        [37, 118.8],
        [42, 119.6],
        [43.8, 118.6],
        [43.6, 127],
        [43.2, 137],
        [42.8, 144.6],
        [39.6, 145.8],
        [35.8, 145],
        [35, 138],
        [34.2, 128],
        [33.1, 120.4],
      ],
      label: [39.4, 132],
    },
    {
      muscle: "adductors",
      points: [
        [45.8, 116.8],
        [46.7, 117.2],
        [46.3, 122],
        [45.6, 128],
        [45.1, 133],
        [45, 128],
        [45.4, 122],
      ],
    },
    {
      muscle: "calves",
      points: [
        [35.4, 149.8],
        [40, 149.6],
        [43.8, 149.8],
        [44.1, 155],
        [44.4, 162],
        [42.4, 168.4],
        [40, 171.2],
        [37.6, 168.4],
        [35.6, 162],
        [35, 155],
      ],
      label: [39.6, 159],
    },
  ],
};
