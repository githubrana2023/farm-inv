CREATE TABLE `no_return_able_supplier` (
	`id` text PRIMARY KEY NOT NULL,
	`vendor_code` text NOT NULL,
	`short_vendor_name` text NOT NULL,
	`return_able` integer NOT NULL,
	`non_return_able` integer NOT NULL,
	`branch_throwing` integer NOT NULL,
	`near_expiry_discount` integer NOT NULL,
	`return_exception` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `no_return_able_supplier_id_unique` ON `no_return_able_supplier` (`id`);--> statement-breakpoint
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
CREATE UNIQUE INDEX `throwable_id_unique` ON `throwable` (`id`);--> statement-breakpoint
CREATE TABLE `grab_and_go` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`quantity` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `grab_and_go_id_unique` ON `grab_and_go` (`id`);