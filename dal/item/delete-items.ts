import { queryClient } from "@/components/provider/tanstack-query-client"
import { MUTATION_KEY } from "@/constants/tanstack-query"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { inventoryTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { and, eq } from "drizzle-orm"

export const deleteScannedItems = async () => {
    try {
        const scannedItems = await inventoryDb.delete(inventoryTable)
        await queryClient.invalidateQueries({
            queryKey: [MUTATION_KEY.SCANNED_ITEM.READ]
        })

    } catch (error) {

    }
}

export const deleteOrderItemByBarcode = async (barcode: string) => {
    try {
        const [existOrderItem] = await inventoryDb.select().from(inventoryTable).where(
            and(
                eq(inventoryTable.barcode, barcode),
                eq(inventoryTable.scanFlag, 'Order')
            )
        )

        if (!existOrderItem) return failureResponse('Order item not found to delete!')

        await inventoryDb.delete(inventoryTable).where(
            and(
                eq(inventoryTable.barcode, barcode),
                eq(inventoryTable.scanFlag, 'Order')
            )
        )
        return successResponse(existOrderItem, 'Order item deleted!')
    } catch (error) {
        console.log('failed to delete order item', error)
        return failureResponse('Failed to delete order item')
    }
}

export const deleteItemById = async (id: string) => {
    try {
        const [existItem] = await inventoryDb.select().from(inventoryTable).where(
            eq(inventoryTable.id, id),
        )

        if (!existItem) return failureResponse('Order item not found to delete!')

        await inventoryDb.delete(inventoryTable).where(
            eq(inventoryTable.id, id),
        )
        return successResponse(existItem, `${existItem.scanFlag} item deleted!`)
    } catch (error) {
        console.log('failed to delete item', error)
        return failureResponse('Failed to delete item')
    }
}