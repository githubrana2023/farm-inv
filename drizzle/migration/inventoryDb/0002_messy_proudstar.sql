PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_labeling` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`save_flag` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_labeling`("id", "label", "save_flag", "createdAt", "updatedAt") SELECT "id", "label", "save_flag", "createdAt", "updatedAt" FROM `labeling`;--> statement-breakpoint
DROP TABLE `labeling`;--> statement-breakpoint
ALTER TABLE `__new_labeling` RENAME TO `labeling`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `labeling_id_unique` ON `labeling` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `labeling_save_flag_unique` ON `labeling` (`label`,`save_flag`);