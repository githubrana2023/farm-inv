import { inventoryDb } from "@/drizzle/db/inventory-db"
import { inventoryTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { and, eq } from "drizzle-orm"

export const updateOrderItemByBarcode = async (barcode: string, quantity: string) => {
    try {
        const [existOrderItem] = await inventoryDb.select().from(inventoryTable).where(
            and(
                eq(inventoryTable.barcode, barcode),
                eq(inventoryTable.scanFlag, 'Order')
            )
        )

        if (!existOrderItem) return failureResponse('Order item not found to update!')

        const [updatedOrderItem] = await inventoryDb.update(inventoryTable).set({
            quantity
        }).where(
            and(
                eq(inventoryTable.barcode, barcode),
                eq(inventoryTable.scanFlag, 'Order')
            )
        ).returning()
        return successResponse(updatedOrderItem, 'Order item updated!')
    } catch (error) {
        console.log('Order item', error)
        return failureResponse('Order item updated!')

    }
}

export const updateItemById = async (id: string, quantity: string,) => {
    try {
        const [existItem] = await inventoryDb.select().from(inventoryTable).where(
            eq(inventoryTable.id, id),
        )

        if (!existItem) return failureResponse('Order item not found to update!')

        const [updatedOrderItem] = await inventoryDb.update(inventoryTable).set({
            quantity
        }).where(
            eq(inventoryTable.id, id),
        ).returning()

        return successResponse(updatedOrderItem, 'Item updated!')
    } catch (error) {
        console.log('Order item', error)
        return failureResponse('Order item updated!')

    }
}