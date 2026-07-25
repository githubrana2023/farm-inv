PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_shelf` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`shelf_no` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employeeId`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_shelf`("id", "employee_id", "shelf_no", "createdAt", "updatedAt") SELECT "id", "employee_id", "shelf_no", "createdAt", "updatedAt" FROM `shelf`;--> statement-breakpoint
DROP TABLE `shelf`;--> statement-breakpoint
ALTER TABLE `__new_shelf` RENAME TO `shelf`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `shelf_id_unique` ON `shelf` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `shelf_no_employee_unique` ON `shelf` (`shelf_no`,`employee_id`);--> statement-breakpoint
CREATE TABLE `__new_remindBefore` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`remindBefore_no` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employeeId`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_remindBefore`("id", "employee_id", "remindBefore_no", "createdAt", "updatedAt") SELECT "id", "employee_id", "remindBefore_no", "createdAt", "updatedAt" FROM `remindBefore`;--> statement-breakpoint
DROP TABLE `remindBefore`;--> statement-breakpoint
ALTER TABLE `__new_remindBefore` RENAME TO `remindBefore`;--> statement-breakpoint
CREATE UNIQUE INDEX `remindBefore_id_unique` ON `remindBefore` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `remind_before_unique` ON `remindBefore` (`remindBefore_no`,`employee_id`);