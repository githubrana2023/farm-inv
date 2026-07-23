CREATE TABLE `expiry_monitor` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`quantity` integer NOT NULL,
	`shelfNo` text NOT NULL,
	`remind_before` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `expiry_monitor_id_unique` ON `expiry_monitor` (`id`);--> statement-breakpoint
CREATE TABLE `shelf` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`shelf_no` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employeeId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shelf_id_unique` ON `shelf` (`id`);