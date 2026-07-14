import { createdAt, updatedAt } from '@/drizzle/schema-helper'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const employeeTable = sqliteTable('employee', {
    employeeId: integer('employeeId').primaryKey().notNull().unique(),
    name: text('name').notNull(),
    employeeTitle:text('employee_title').notNull(),
    password: text('password').notNull(),
    createdAt:createdAt('createdAt'),
    updatedAt:updatedAt('updatedAt'),
})