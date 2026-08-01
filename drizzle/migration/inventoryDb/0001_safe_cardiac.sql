PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_throwable` (
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
	`has_imported_label` integer DEFAULT false NOT NULL,
	`is_allow` integer NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_throwable`("id", "vendor_code", "short_vendor_name", "type", "barcode", "itemCode", "description", "uom", "salesPrice", "quantity", "expireIn", "has_imported_label", "is_allow", "createdAt", "updatedAt") SELECT "id", "vendor_code", "short_vendor_name", "type", "barcode", "itemCode", "description", "uom", "salesPrice", "quantity", "expireIn", "has_imported_label", "is_allow", "createdAt", "updatedAt" FROM `throwable`;--> statement-breakpoint
DROP TABLE `throwable`;--> statement-breakpoint
ALTER TABLE `__new_throwable` RENAME TO `throwable`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `throwable_id_unique` ON `throwable` (`id`);--> statement-breakpoint
ALTER TABLE `expiry_monitor` ADD `is_one_plus_one` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `expiry_monitor` ADD `is_throwing` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `expiry_monitor` ADD `vendor_code` text NOT NULL;--> statement-breakpoint
ALTER TABLE `expiry_monitor` ADD `vendor` text NOT NULL;