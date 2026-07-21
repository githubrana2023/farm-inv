CREATE TABLE `employee` (
	`employeeId` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`employee_title` text NOT NULL,
	`password` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employee_employeeId_unique` ON `employee` (`employeeId`);--> statement-breakpoint
CREATE TABLE `inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`item_number` text NOT NULL,
	`description` text NOT NULL,
	`uom` text NOT NULL,
	`packing` text NOT NULL,
	`quantity` text NOT NULL,
	`scan_flag` text,
	`pflag` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_id_unique` ON `inventory` (`id`);--> statement-breakpoint
CREATE TABLE `labeling` (
	`id` text PRIMARY KEY NOT NULL,
	`label` text NOT NULL,
	`save_flag` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `labeling_id_unique` ON `labeling` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `labeling_save_flag_unique` ON `labeling` (`label`,`save_flag`);--> statement-breakpoint
CREATE TABLE `app_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`password` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_settings_id_unique` ON `app_settings` (`id`);--> statement-breakpoint
CREATE TABLE `employee_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`employeeId` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`employeeId`) REFERENCES `employee`(`employeeId`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `employee_settings_id_unique` ON `employee_settings` (`id`);