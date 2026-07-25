CREATE TABLE `remindBefore` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`remindBefore_no` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employeeId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `remindBefore_id_unique` ON `remindBefore` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `remind_before_unique` ON `remindBefore` (`remindBefore_no`,`employee_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `shelf_no_employee_unique` ON `shelf` (`shelf_no`,`employee_id`);