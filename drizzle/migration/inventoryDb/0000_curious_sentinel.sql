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
CREATE TABLE `expiry_monitor` (
	`id` text PRIMARY KEY NOT NULL,
	`empId` text NOT NULL,
	`barcode` text NOT NULL,
	`item_number` text NOT NULL,
	`description` text NOT NULL,
	`quantity` integer NOT NULL,
	`shelfNo` text NOT NULL,
	`remind_before` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`empId`) REFERENCES `employee`(`employeeId`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `expiry_monitor_id_unique` ON `expiry_monitor` (`id`);--> statement-breakpoint
CREATE TABLE `grab_and_go` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`quantity` text NOT NULL,
	`description` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `grab_and_go_id_unique` ON `grab_and_go` (`id`);--> statement-breakpoint
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
CREATE TABLE `no_return_able_supplier` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_code` text NOT NULL,
	`short_vendor_name` text NOT NULL,
	`return_able` integer NOT NULL,
	`non_return_able` integer NOT NULL,
	`branch_throwing` integer NOT NULL,
	`near_expiry_discount` integer NOT NULL,
	`return_exception` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `no_return_able_supplier_id_unique` ON `no_return_able_supplier` (`id`);--> statement-breakpoint
CREATE TABLE `remindBefore` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`remindBefore_no` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employeeId`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `remindBefore_id_unique` ON `remindBefore` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `remind_before_unique` ON `remindBefore` (`remindBefore_no`,`employee_id`);--> statement-breakpoint
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
CREATE UNIQUE INDEX `employee_settings_id_unique` ON `employee_settings` (`id`);--> statement-breakpoint
CREATE TABLE `shelf` (
	`id` text PRIMARY KEY NOT NULL,
	`employee_id` text NOT NULL,
	`shelf_no` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`employee_id`) REFERENCES `employee`(`employeeId`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `shelf_id_unique` ON `shelf` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `shelf_no_employee_unique` ON `shelf` (`shelf_no`,`employee_id`);--> statement-breakpoint
CREATE TABLE `throwable_allowed_supplier` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_code` text NOT NULL,
	`short_vendor_name` text NOT NULL,
	`is_currently_allow` integer DEFAULT true NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `throwable_allowed_supplier_id_unique` ON `throwable_allowed_supplier` (`id`);--> statement-breakpoint
CREATE TABLE `throwable` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_code` text NOT NULL,
	`short_vendor_name` text NOT NULL,
	`type` text NOT NULL,
	`barcode` text NOT NULL,
	`itemCode` text NOT NULL,
	`description` text NOT NULL,
	`uom` text NOT NULL,
	`salesPrice` text NOT NULL,
	`quantity` text NOT NULL,
	`expireIn` integer NOT NULL,
	`has_imported_label` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `throwable_id_unique` ON `throwable` (`id`);