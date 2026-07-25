import { createdAt, updatedAt } from "@/drizzle/schema-helper";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { employeeTable } from "./employee";
import { relations } from "drizzle-orm";
import { expiryMonitorTable } from "./expiry-monitor";

export const remindBeforeTable = sqliteTable('remindBefore', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    employeeId: text('employee_id').notNull().references(() => employeeTable.employeeId),
    remindBeforeNo: text('remindBefore_no').notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})

export const remindBeforeTableRelation = relations(remindBeforeTable, ({ many, one }) => ({
    employee: one(employeeTable, {
        fields: [remindBeforeTable.employeeId],
        references: [employeeTable.employeeId],
        relationName: 'relation-between-remindBefore-and-employee'
    })
}))