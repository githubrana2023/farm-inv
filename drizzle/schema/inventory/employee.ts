import { createdAt, updatedAt } from '@/drizzle/schema-helper'
import { relations } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
import { shelfTable } from './shelf'

export const employeeTable = sqliteTable('employee', {
    employeeId: text('employeeId').primaryKey().notNull().unique(),
    name: text('name').notNull(),
    employeeTitle: text('employee_title').notNull(),
    password: text('password').notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})

export const employeeTableRelation = relations(employeeTable, ({ many }) => ({
    shelfList: many(shelfTable, {
        relationName: 'relation-between-shelf-and-employee'
    })
}))