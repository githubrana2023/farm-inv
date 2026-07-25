
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { createdAt, updatedAt, } from '@/drizzle/schema-helper'
import { employeeTable } from './employee'


export const expiryMonitorTable = sqliteTable('expiry_monitor', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    empId: text('empId').notNull().references(() => employeeTable.employeeId, { onDelete: 'cascade', onUpdate: 'cascade' }),
    barcode: text('barcode').notNull(),
    item_number: text('item_number').notNull(),
    description: text('description').notNull(),
    expireIn: integer('quantity', { mode: 'timestamp' }).notNull(),
    shelfNo: text('shelfNo').notNull(),
    remindBefore: integer('remind_before', { mode: 'timestamp' }).notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})
