CREATE TABLE `body_weights` (
	`id` text PRIMARY KEY,
	`measured_at` integer NOT NULL,
	`weight_kg` real NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `exercise_muscles` (
	`exercise_id` text NOT NULL,
	`muscle_id` text NOT NULL,
	`role` text NOT NULL,
	CONSTRAINT `exercise_muscles_pk` PRIMARY KEY(`exercise_id`, `muscle_id`),
	CONSTRAINT `fk_exercise_muscles_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_exercise_muscles_muscle_id_muscles_id_fk` FOREIGN KEY (`muscle_id`) REFERENCES `muscles`(`id`) ON DELETE RESTRICT,
	CONSTRAINT "exercise_muscles_role_check" CHECK(role IN ('primary', 'secondary'))
);
--> statement-breakpoint
CREATE TABLE `exercises` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`equipment` text,
	`tracking_type` text NOT NULL,
	`is_custom` integer DEFAULT false NOT NULL,
	`archived_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "exercises_equipment_check" CHECK(equipment IN ('barbell', 'dumbbell', 'cable', 'machine', 'kettlebells', 'bands', 'medicine_ball', 'exercise_ball', 'foam_roll', 'ez_bar', 'bodyweight', 'other')),
	CONSTRAINT "exercises_tracking_type_check" CHECK(tracking_type IN ('weight_reps', 'bodyweight_reps', 'duration', 'distance_duration'))
);
--> statement-breakpoint
CREATE TABLE `muscles` (
	`id` text PRIMARY KEY,
	`group_key` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT "muscles_group_key_check" CHECK(group_key IN ('chest', 'back', 'shoulders', 'arms', 'legs', 'core'))
);
--> statement-breakpoint
CREATE TABLE `routine_exercises` (
	`id` text PRIMARY KEY,
	`routine_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`rest_s` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_routine_exercises_routine_id_routines_id_fk` FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_routine_exercises_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `routine_sets` (
	`id` text PRIMARY KEY,
	`routine_exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`set_type` text DEFAULT 'normal' NOT NULL,
	`weight_kg` real,
	`reps` integer,
	`duration_s` integer,
	`distance_m` real,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_routine_sets_routine_exercise_id_routine_exercises_id_fk` FOREIGN KEY (`routine_exercise_id`) REFERENCES `routine_exercises`(`id`) ON DELETE CASCADE,
	CONSTRAINT "routine_sets_set_type_check" CHECK(set_type IN ('normal', 'warmup', 'drop', 'failure'))
);
--> statement-breakpoint
CREATE TABLE `routines` (
	`id` text PRIMARY KEY,
	`name` text NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workout_exercises` (
	`id` text PRIMARY KEY,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_workout_exercises_workout_id_workouts_id_fk` FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON DELETE CASCADE,
	CONSTRAINT `fk_workout_exercises_exercise_id_exercises_id_fk` FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON DELETE RESTRICT
);
--> statement-breakpoint
CREATE TABLE `workout_sets` (
	`id` text PRIMARY KEY,
	`workout_exercise_id` text NOT NULL,
	`position` integer NOT NULL,
	`set_type` text DEFAULT 'normal' NOT NULL,
	`weight_kg` real,
	`reps` integer,
	`duration_s` integer,
	`distance_m` real,
	`completed_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_workout_sets_workout_exercise_id_workout_exercises_id_fk` FOREIGN KEY (`workout_exercise_id`) REFERENCES `workout_exercises`(`id`) ON DELETE CASCADE,
	CONSTRAINT "workout_sets_set_type_check" CHECK(set_type IN ('normal', 'warmup', 'drop', 'failure'))
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY,
	`routine_id` text,
	`name` text,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	`notes` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT `fk_workouts_routine_id_routines_id_fk` FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE INDEX `body_weights_measured_at_idx` ON `body_weights` (`measured_at`);--> statement-breakpoint
CREATE INDEX `exercise_muscles_muscle_id_idx` ON `exercise_muscles` (`muscle_id`);--> statement-breakpoint
CREATE INDEX `routine_exercises_routine_id_idx` ON `routine_exercises` (`routine_id`);--> statement-breakpoint
CREATE INDEX `routine_exercises_exercise_id_idx` ON `routine_exercises` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `routine_sets_routine_exercise_id_idx` ON `routine_sets` (`routine_exercise_id`);--> statement-breakpoint
CREATE INDEX `workout_exercises_workout_id_idx` ON `workout_exercises` (`workout_id`);--> statement-breakpoint
CREATE INDEX `workout_exercises_exercise_id_idx` ON `workout_exercises` (`exercise_id`);--> statement-breakpoint
CREATE INDEX `workout_sets_workout_exercise_id_idx` ON `workout_sets` (`workout_exercise_id`);--> statement-breakpoint
CREATE INDEX `workouts_routine_id_idx` ON `workouts` (`routine_id`);--> statement-breakpoint
CREATE INDEX `workouts_started_at_idx` ON `workouts` (`started_at`);