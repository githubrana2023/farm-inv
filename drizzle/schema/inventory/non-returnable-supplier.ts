import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const nonReturnAbleSupplierTable = sqliteTable('no_return_able_supplier', {
    id: text('id').primaryKey().unique().notNull().$defaultFn(() => uuid()),
    vendorCode: text('vendor_code').notNull(),
    shortVendorName: text('short_vendor_name').notNull(),
    vendorName: text('short_vendor_name').notNull(),
    returnAble: integer('return_able', { mode: 'boolean' }).notNull(),
    nonReturnAble: integer('non_return_able', { mode: 'boolean' }).notNull(),
    branchThrowing: integer('branch_throwing', { mode: 'boolean' }).notNull(),
    nearExpiryDiscount: integer('near_expiry_discount', { mode: 'boolean' }).notNull(),
    returnException: text('return_exception')
})