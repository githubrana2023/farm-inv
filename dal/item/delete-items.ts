import { inventoryDb } from "@/drizzle/db/inventory-db"
import { inventoryTable } from "@/drizzle/schema/inventory"

export const deleteScannedItems = async () => {
    try {
        const scannedItems = await inventoryDb.delete(inventoryTable)

    } catch (error) {

    }
}