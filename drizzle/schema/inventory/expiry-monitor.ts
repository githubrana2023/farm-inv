
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { createdAt, updatedAt, } from '@/drizzle/schema-helper'


export const expiryMonitorTable = sqliteTable('expiry_monitor', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    barcode: text('barcode').notNull(),
    expireIn: integer('quantity', { mode: 'timestamp' }).notNull(),
    shelfNo: text('shelfNo').notNull(),
    remindBefore: integer('remind_before').notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})
