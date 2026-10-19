import { describe, expect, it } from "@jest/globals";

import { es } from "@/i18n/es";

import {
  EXERCISE_CATALOG,
  getExerciseDetail,
  getExerciseInfo,
  getExerciseText,
} from "./catalog";
import { EXERCISE_IMAGES } from "./images";

// The types already check keys, muscles and translations; these cover what
// they can't.
describe("catalog data", () => {
  const keys = EXERCISE_CATALOG.map((entry) => entry.key);

  it("has unique keys", () => {
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("lists each muscle once per exercise", () => {
    // syncCatalog stores (exercise, muscle) as a primary key, so a muscle in
    // both lists would make the whole sync fail.
    const broken = EXERCISE_CATALOG.filter((entry) => {
      const all = [...entry.primaryMuscles, ...entry.secondaryMuscles];
      return new Set(all).size !== all.length;
    }).map((entry) => entry.key);
    expect(broken).toEqual([]);
  });

  it("only has photos for exercises in the catalog", () => {
    const unknown = Object.keys(EXERCISE_IMAGES).filter(
      (key) => !keys.some((catalogKey) => catalogKey === key),
    );
    expect(unknown).toEqual([]);
  });
});

describe("getExerciseText", () => {
  it("translates catalog exercises", () => {
    expect(
      getExerciseText({ key: "bench_press", name: null, description: null }, es)
        .name,
    ).toBe(es.exerciseCatalog.bench_press.name);
  });

  it("uses the name and description the user typed", () => {
    const exercise = { key: null, name: "Mi press", description: "Lento" };
    expect(getExerciseText(exercise, es)).toEqual({
      name: "Mi press",
      description: "Lento",
    });
  });
});

describe("getExerciseDetail", () => {
  it("shows the main muscle and the equipment", () => {
    expect(
      getExerciseDetail(
        {
          equipment: "barbell",
          trackingType: "weight_reps",
          primaryMuscles: ["chest", "triceps"],
        },
        es,
      ),
    ).toBe("Pecho · Barra");
  });

  it("falls back to the tracking type when there's neither", () => {
    expect(
      getExerciseDetail(
        { equipment: null, trackingType: "duration", primaryMuscles: [] },
        es,
      ),
    ).toBe("Duración");
  });
});

describe("getExerciseInfo", () => {
  it("lists primary then secondary muscles and the catalog photos", () => {
    const info = getExerciseInfo(
      {
        key: "bench_press",
        name: null,
        description: null,
        equipment: "barbell",
        primaryMuscles: ["chest"],
        secondaryMuscles: ["front_delts", "triceps"],
      },
      es,
    );
    expect(info.muscles).toEqual(["Pecho", "Deltoides anterior", "Tríceps"]);
    expect(info.equipment).toEqual(["Barra"]);
    expect(info.images).toBe(EXERCISE_IMAGES.bench_press);
  });

  it("has no photos or equipment for a bare user exercise", () => {
    const info = getExerciseInfo(
      {
        key: null,
        name: "Mi ejercicio",
        description: null,
        equipment: null,
        primaryMuscles: [],
        secondaryMuscles: [],
      },
      es,
    );
    expect(info.images).toEqual([]);
    expect(info.equipment).toEqual([]);
  });
});
