import { createdAt, updatedAt } from "@/drizzle/schema-helper";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";
import { employeeTable } from "./employee";
import { relations } from "drizzle-orm";
import { expiryMonitorTable } from "./expiry-monitor";

export const shelfTable = sqliteTable('shelf', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    employeeId: text('employee_id').notNull().references(() => employeeTable.employeeId),
    shelfNo: text('shelf_no').notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
})

export const shelfTableRelation = relations(shelfTable, ({ many, one }) => ({
    itemBarcodes: many(expiryMonitorTable, {
        relationName: 'relation-between-expiry-monitory-and-shelf'
    }),
    employee: one(employeeTable, {
        fields: [shelfTable.employeeId],
        references: [employeeTable.employeeId],
        relationName: 'relation-between-shelf-and-employee'
    })
}))