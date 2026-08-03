import { inventoryDb } from "@/drizzle/db/inventory-db"
import { grabAndGoTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { needPendingState } from "@/lib/utils"
import { grabAndGoDeleteItemsFormSchema } from "@/lib/zod/grab-and-go-form-schema"
import { eq } from "drizzle-orm"

export const deleteGrabAndGoById = async (id: string) => {
    try {
        await needPendingState()
        const [existGrabAndGo] = await inventoryDb.select().from(grabAndGoTable).where(
            eq(grabAndGoTable.id, id)
        )
        if (!existGrabAndGo) return failureResponse('Grab and Go item not found!')

        const [deleted] = await inventoryDb.delete(grabAndGoTable).where(
            eq(grabAndGoTable.id, existGrabAndGo.id)
        ).returning()
        return successResponse(deleted, 'Grab and Go item deleted!')
    } catch (error) {
        console.log('Failed to delete Grab and Go item!', error)
        return failureResponse('Failed to delete Grab and Go item!')
    }
}


export const deleteGrabAndGoItems = async (value: unknown) => {
    try {
        await needPendingState()
        const validation = grabAndGoDeleteItemsFormSchema.safeParse(value)
        if (!validation.success) return failureResponse('Invalid Confirmation word!')

        await inventoryDb.delete(grabAndGoTable)

        return successResponse(null, 'Grab and Go items cleared!')
    } catch (error) {
        console.log('Failed to clear Grab and Go item!', error)
        return failureResponse('Failed to clear Grab and Go item!')
    }
}