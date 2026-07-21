
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { createdAt, updatedAt, SCAN_FLAG } from '@/drizzle/schema-helper'
import { shelfTable } from './shelf'
import { relations } from 'drizzle-orm'

export const expiryMonitorTable = sqliteTable('expiry_monitor', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    barcode: text('barcode').notNull(),
    expireIn: integer('quantity', { mode: 'timestamp' }).notNull(),
    shelfId: text('scan_flag', { enum: SCAN_FLAG }).references(() => shelfTable.id),
    remindBefore: integer('remind_before').notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})

export const expiryMonitorTableRelation = relations(expiryMonitorTable, ({ one }) => ({
    shelf: one(shelfTable, {
        fields: [expiryMonitorTable.shelfId],
        references: [shelfTable.id],
        relationName: 'relation-between-expiry-monitory-and-shelf'
    })
}))