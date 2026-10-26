ALTER TABLE `body_weights` ADD `measured_on` text NOT NULL;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_body_weights` (
	`id` text PRIMARY KEY,
	`measured_on` text NOT NULL UNIQUE,
	`weight_kg` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_body_weights`(`id`, `weight_kg`, `created_at`, `updated_at`) SELECT `id`, `weight_kg`, `created_at`, `updated_at` FROM `body_weights`;--> statement-breakpoint
DROP TABLE `body_weights`;--> statement-breakpoint
ALTER TABLE `__new_body_weights` RENAME TO `body_weights`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
DROP INDEX IF EXISTS `body_weights_measured_at_idx`;