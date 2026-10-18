import { sql } from "drizzle-orm";
import {
  check,
  index,
  integer,
  primaryKey,
  real,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

import {
  EQUIPMENT,
  MUSCLE_GROUPS,
  MUSCLE_ROLES,
  SET_TYPES,
  TRACKING_TYPES,
} from "@/constants/enums";

const timestamps = {
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date()),
};

function oneOf(column: string, values: readonly string[]) {
  return sql.raw(`${column} IN (${values.map((v) => `'${v}'`).join(", ")})`);
}

export const exercises = sqliteTable(
  "exercises",
  {
    id: text("id").primaryKey(),
    // Catalog exercises have a stable key ("bench_press"); their name and
    // description come from src/i18n, so a new language never touches the DB.
    key: text("key").unique(),
    name: text("name"),
    description: text("description"),
    equipment: text("equipment", { enum: EQUIPMENT }),
    trackingType: text("tracking_type", { enum: TRACKING_TYPES }).notNull(),
    archivedAt: integer("archived_at", { mode: "timestamp_ms" }),
    ...timestamps,
  },
  () => [
    check(
      "exercises_key_or_name_check",
      sql.raw("key IS NOT NULL OR name IS NOT NULL"),
    ),
    check("exercises_equipment_check", oneOf("equipment", EQUIPMENT)),
    check(
      "exercises_tracking_type_check",
      oneOf("tracking_type", TRACKING_TYPES),
    ),
  ],
);

export const muscles = sqliteTable(
  "muscles",
  {
    id: text("id").primaryKey(),
    groupKey: text("group_key", { enum: MUSCLE_GROUPS }).notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  () => [check("muscles_group_key_check", oneOf("group_key", MUSCLE_GROUPS))],
);

export const exerciseMuscles = sqliteTable(
  "exercise_muscles",
  {
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "cascade" }),
    muscleId: text("muscle_id")
      .notNull()
      .references(() => muscles.id, { onDelete: "restrict" }),
    role: text("role", { enum: MUSCLE_ROLES }).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.exerciseId, t.muscleId] }),
    index("exercise_muscles_muscle_id_idx").on(t.muscleId),
    check("exercise_muscles_role_check", oneOf("role", MUSCLE_ROLES)),
  ],
);

export const routines = sqliteTable("routines", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  notes: text("notes"),
  ...timestamps,
});

export const workouts = sqliteTable(
  "workouts",
  {
    id: text("id").primaryKey(),
    routineId: text("routine_id").references(() => routines.id, {
      onDelete: "set null",
    }),
    name: text("name"),
    startedAt: integer("started_at", { mode: "timestamp_ms" }).notNull(),
    endedAt: integer("ended_at", { mode: "timestamp_ms" }),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    index("workouts_routine_id_idx").on(t.routineId),
    index("workouts_started_at_idx").on(t.startedAt),
  ],
);

export const workoutExercises = sqliteTable(
  "workout_exercises",
  {
    id: text("id").primaryKey(),
    workoutId: text("workout_id")
      .notNull()
      .references(() => workouts.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "restrict" }),
    position: integer("position").notNull(),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    index("workout_exercises_workout_id_idx").on(t.workoutId),
    index("workout_exercises_exercise_id_idx").on(t.exerciseId),
  ],
);

export const workoutSets = sqliteTable(
  "workout_sets",
  {
    id: text("id").primaryKey(),
    workoutExerciseId: text("workout_exercise_id")
      .notNull()
      .references(() => workoutExercises.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    setType: text("set_type", { enum: SET_TYPES }).notNull().default("normal"),
    weightKg: real("weight_kg"),
    reps: integer("reps"),
    durationS: integer("duration_s"),
    distanceM: real("distance_m"),
    completedAt: integer("completed_at", { mode: "timestamp_ms" }),
    ...timestamps,
  },
  (t) => [
    index("workout_sets_workout_exercise_id_idx").on(t.workoutExerciseId),
    check("workout_sets_set_type_check", oneOf("set_type", SET_TYPES)),
  ],
);

export const routineExercises = sqliteTable(
  "routine_exercises",
  {
    id: text("id").primaryKey(),
    routineId: text("routine_id")
      .notNull()
      .references(() => routines.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercises.id, { onDelete: "restrict" }),
    position: integer("position").notNull(),
    restS: integer("rest_s"),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [
    index("routine_exercises_routine_id_idx").on(t.routineId),
    index("routine_exercises_exercise_id_idx").on(t.exerciseId),
  ],
);

export const routineSets = sqliteTable(
  "routine_sets",
  {
    id: text("id").primaryKey(),
    routineExerciseId: text("routine_exercise_id")
      .notNull()
      .references(() => routineExercises.id, { onDelete: "cascade" }),
    position: integer("position").notNull(),
    setType: text("set_type", { enum: SET_TYPES }).notNull().default("normal"),
    weightKg: real("weight_kg"),
    reps: integer("reps"),
    durationS: integer("duration_s"),
    distanceM: real("distance_m"),
    ...timestamps,
  },
  (t) => [
    index("routine_sets_routine_exercise_id_idx").on(t.routineExerciseId),
    check("routine_sets_set_type_check", oneOf("set_type", SET_TYPES)),
  ],
);

export const bodyWeights = sqliteTable(
  "body_weights",
  {
    id: text("id").primaryKey(),
    measuredAt: integer("measured_at", { mode: "timestamp_ms" }).notNull(),
    weightKg: real("weight_kg").notNull(),
    notes: text("notes"),
    ...timestamps,
  },
  (t) => [index("body_weights_measured_at_idx").on(t.measuredAt)],
);
