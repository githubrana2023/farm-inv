
import { sqliteTable, text, unique, } from 'drizzle-orm/sqlite-core'
import { v4 as uuid } from 'uuid'

import { SAVE_FLAG } from '@/constants'
import { createdAt, updatedAt } from '@/drizzle/schema-helper'

export const labelingTable = sqliteTable('labeling', {
    id: text('id').notNull().primaryKey().unique().$defaultFn(() => uuid()),
    label: text('label').notNull(),
    saveFlag: text('scan_flag', { enum: SAVE_FLAG }),
    createdAt: createdAt('createdAt'),
    updatedAt: updatedAt('updatedAt'),
},
    (table) => ([
        unique('labeling_save_flag_unique').on(table.label, table.saveFlag)
    ])
)