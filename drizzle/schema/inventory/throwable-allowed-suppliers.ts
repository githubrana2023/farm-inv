import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { createdAt, updatedAt } from "@/drizzle/schema-helper";

export const throwableAllowedSupplierTable = sqliteTable('throwable_allowed_supplier', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => uuid()),
    vendorCode: text('vendor_code').notNull(),
    vendorName: text('short_vendor_name').notNull(),
    isCurrentlyAllow: integer('is_currently_allow', { mode: 'boolean' }).notNull().default(true),
    createdAt: createdAt(),
    updatedAt: updatedAt()
})