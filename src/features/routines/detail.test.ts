import { describe, expect, it } from "@jest/globals";

import { es } from "@/i18n/es";

import { getRoutineDetail, getRoutineMuscleGroups } from "./detail";

describe("getRoutineMuscleGroups", () => {
  it("lists each group once, in the order the routine works them", () => {
    expect(
      getRoutineMuscleGroups(
        { muscles: ["front_delts", "chest", "side_delts", "triceps"] },
        es,
      ),
    ).toBe("Hombros, Pecho, Brazos");
  });

  it("counts glutes as legs and the lower back as back", () => {
    expect(
      getRoutineMuscleGroups({ muscles: ["quads", "glutes"] }, es),
    ).toBe("Piernas");
    expect(
      getRoutineMuscleGroups({ muscles: ["lats", "lower_back"] }, es),
    ).toBe("Espalda");
  });

  it("is empty when no exercise has muscles", () => {
    expect(getRoutineMuscleGroups({ muscles: [] }, es)).toBe("");
  });
});

describe("getRoutineDetail", () => {
  it("joins the exercise count and the muscles", () => {
    expect(
      getRoutineDetail({ exerciseCount: 1, muscles: ["chest", "triceps"] }, es),
    ).toBe("1 ejercicio · Pecho, Tríceps");
  });

  it("leaves out the muscles when there are none", () => {
    expect(getRoutineDetail({ exerciseCount: 2, muscles: [] }, es)).toBe(
      "2 ejercicios",
    );
  });
});
