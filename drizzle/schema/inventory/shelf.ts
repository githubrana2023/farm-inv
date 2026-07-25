import { createdAt, updatedAt } from "@/drizzle/schema-helper";
import { integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { employeeTable } from "./employee";
import { relations } from "drizzle-orm";
import { expiryMonitorTable } from "./expiry-monitor";

export const shelfTable = sqliteTable('shelf', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    employeeId: text('employee_id').notNull().references(() => employeeTable.employeeId, { onDelete: 'cascade', onUpdate: 'cascade' }),
    shelfNo: text('shelf_no').notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
},
    (table) => ([
        unique('shelf_no_employee_unique').on(table.shelfNo, table.employeeId)
    ]))

export const shelfTableRelation = relations(shelfTable, ({ one }) => ({
    employee: one(employeeTable, {
        fields: [shelfTable.employeeId],
        references: [employeeTable.employeeId],
        relationName: 'relation-between-shelf-and-employee'
    })
}))