ALTER TABLE `expiry_monitor` ADD `empId` text NOT NULL REFERENCES employee(employeeId);--> statement-breakpoint
ALTER TABLE `expiry_monitor` ADD `item_number` text NOT NULL;--> statement-breakpoint
ALTER TABLE `expiry_monitor` ADD `description` text NOT NULL;