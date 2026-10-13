ALTER TABLE `exercises` ADD `key` text;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_exercises` (
	`id` text PRIMARY KEY,
	`key` text UNIQUE,
	`name` text,
	`description` text,
	`equipment` text,
	`tracking_type` text NOT NULL,
	`archived_at` integer,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	CONSTRAINT "exercises_key_or_name_check" CHECK(key IS NOT NULL OR name IS NOT NULL),
	CONSTRAINT "exercises_equipment_check" CHECK(equipment IN ('barbell', 'dumbbell', 'cable', 'machine', 'kettlebells', 'bands', 'medicine_ball', 'exercise_ball', 'foam_roll', 'ez_bar', 'bodyweight', 'other')),
	CONSTRAINT "exercises_tracking_type_check" CHECK(tracking_type IN ('weight_reps', 'bodyweight_reps', 'duration', 'distance_duration'))
);
--> statement-breakpoint
INSERT INTO `__new_exercises`(`id`, `name`, `description`, `equipment`, `tracking_type`, `archived_at`, `created_at`, `updated_at`) SELECT `id`, `name`, `description`, `equipment`, `tracking_type`, `archived_at`, `created_at`, `updated_at` FROM `exercises`;--> statement-breakpoint
DROP TABLE `exercises`;--> statement-breakpoint
ALTER TABLE `__new_exercises` RENAME TO `exercises`;--> statement-breakpoint
PRAGMA foreign_keys=ON;