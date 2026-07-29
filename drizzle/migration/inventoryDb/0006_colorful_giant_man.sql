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
ALTER TABLE `no_return_able_supplier` ADD `createdAt` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `no_return_able_supplier` ADD `updatedAt` integer NOT NULL;