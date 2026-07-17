ALTER TABLE `inventory` RENAME COLUMN "employeeId" TO "barcode";--> statement-breakpoint
ALTER TABLE `inventory` ADD `item_number` integer NOT NULL;