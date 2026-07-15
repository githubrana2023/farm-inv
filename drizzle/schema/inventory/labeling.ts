
import { sqliteTable, text, unique, } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { createdAt, updatedAt, SAVE_FLAG } from '@/drizzle/schema-helper'

export const labelingTable = sqliteTable('labeling', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    label: text('label').notNull(),
    saveFlag: text('save_flag', { enum: SAVE_FLAG }).notNull(),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
},
    (table) => ([
        unique('labeling_save_flag_unique').on(table.label, table.saveFlag)
    ])
)