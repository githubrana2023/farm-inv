
import { createdAt, updatedAt } from "@/drizzle/schema-helper";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const grabAndGoTable = sqliteTable('grab_and_go', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => uuid()),
    barcode: text('barcode').notNull(),
    quantity: text('quantity').notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
})