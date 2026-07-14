
import { sqliteTable, text, } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { createdAt, updatedAt } from '@/drizzle/schema-helper'
import { employeeTable } from './employee'

export const employeeSettingsTable = sqliteTable('employee_settings', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    employeeId: text('employeeId').notNull().references(() => employeeTable.employeeId),
    
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})

export const appSettingsTable = sqliteTable('app_settings', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    password: text('password').notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})