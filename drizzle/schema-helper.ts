import { integer, text } from "drizzle-orm/sqlite-core";

export const createdAt = (columnName: string = "createdAt") => integer(columnName, { mode: 'timestamp' }).notNull().$defaultFn(() => new Date())
export const updatedAt = (columnName: string = "updatedAt") => integer(columnName, { mode: 'timestamp' }).notNull().$onUpdateFn(() => new Date())

export const SAVE_FLAG = ["Inventory", "Tags", "Order"] as const;
export const SCAN_FLAG = ["Inventory", "Tags", "Order"] as const;