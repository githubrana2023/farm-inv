
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { createdAt, updatedAt, SAVE_FLAG, SCAN_FLAG } from '@/drizzle/schema-helper'

export const inventoryTable = sqliteTable('inventory', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    barcode: text('barcode').notNull(),
    item_number: text('item_number').notNull(),
    uom: text('uom').notNull(),
    packing: integer('packing').notNull(),
    quantity: integer('quantity').notNull(),
    scanFlag: text('scan_flag', { enum: SCAN_FLAG }),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})