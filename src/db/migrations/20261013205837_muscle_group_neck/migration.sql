PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_muscles` (
	`id` text PRIMARY KEY,
	`group_key` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	CONSTRAINT "muscles_group_key_check" CHECK(group_key IN ('chest', 'back', 'shoulders', 'arms', 'neck', 'legs', 'core'))
);
--> statement-breakpoint
INSERT INTO `__new_muscles`(`id`, `group_key`, `sort_order`) SELECT `id`, `group_key`, `sort_order` FROM `muscles`;--> statement-breakpoint
DROP TABLE `muscles`;--> statement-breakpoint
ALTER TABLE `__new_muscles` RENAME TO `muscles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;