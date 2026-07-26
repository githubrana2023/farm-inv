
import { THROW_ABLE_SCAN_TYPE } from "@/constants/throwable";
import { createdAt, updatedAt } from "@/drizzle/schema-helper";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const throwableTable = sqliteTable('throwable', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => uuid()),
    vendorCode: text('vendor_code').notNull(),
    vendorName: text('short_vendor_name').notNull(),
    type: text('type', { enum: THROW_ABLE_SCAN_TYPE }).notNull(),
    barcode: text('barcode').notNull(),
    itemCode: text('itemCode').notNull(),
    description: text('description').notNull(),
    uom: text('uom').notNull(),
    salesPrice: text('salesPrice').notNull(),
    quantity: text('quantity').notNull(),
    expireIn: integer('expireIn', { mode: 'timestamp' }).notNull(),
    hasImportedLabel: integer('has_imported_label', { mode: 'boolean' }).notNull().default(false),
    isAllow: integer('has_imported_label', { mode: 'boolean' }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
})