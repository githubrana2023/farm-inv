import { inventoryDb } from "@/drizzle/db/inventory-db"
import { grabAndGoTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { needPendingState } from "@/lib/utils"
import { eq } from "drizzle-orm"
import { success } from "zod"

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