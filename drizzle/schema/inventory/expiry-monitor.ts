
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { createdAt, updatedAt, SCAN_FLAG } from '@/drizzle/schema-helper'

export const expiryMonitorTable = sqliteTable('expiry_monitor', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    barcode: text('barcode').notNull(),
    expireIn: integer('quantity', { mode: 'timestamp' }).notNull(),
    shelfId: text('scan_flag', { enum: SCAN_FLAG }),
    remindBeFore:integer('remind_before').notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})