PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`barcode` text NOT NULL,
	`item_number` text NOT NULL,
	`uom` text NOT NULL,
	`packing` integer NOT NULL,
	`quantity` integer NOT NULL,
	`scan_flag` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_inventory`("id", "barcode", "item_number", "uom", "packing", "quantity", "scan_flag", "createdAt", "updatedAt") SELECT "id", "barcode", "item_number", "uom", "packing", "quantity", "scan_flag", "createdAt", "updatedAt" FROM `inventory`;--> statement-breakpoint
DROP TABLE `inventory`;--> statement-breakpoint
ALTER TABLE `__new_inventory` RENAME TO `inventory`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `inventory_id_unique` ON `inventory` (`id`);