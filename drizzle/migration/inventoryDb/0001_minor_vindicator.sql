ALTER TABLE `labeling` RENAME COLUMN "scan_flag" TO "save_flag";--> statement-breakpoint
DROP INDEX `labeling_save_flag_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `labeling_save_flag_unique` ON `labeling` (`label`,`save_flag`);