
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { createdAt, updatedAt, SCAN_FLAG } from '@/drizzle/schema-helper'


//TODO : need new col called pflag -> 'P' | 'R' | null
export const inventoryTable = sqliteTable('inventory', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    barcode: text('barcode').notNull(),
    item_number: text('item_number').notNull(),
    description: text('description').notNull(),
    uom: text('uom').notNull(),
    packing: text('packing').notNull(),
    quantity: text('quantity').notNull(),
    scanFlag: text('scan_flag', { enum: SCAN_FLAG }),
    pflag: text('pflag'),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})