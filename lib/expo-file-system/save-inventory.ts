import { inventoryDb } from "@/drizzle/db/inventory-db"
import { inventoryTable } from "@/drizzle/schema/inventory"
import { eq } from "drizzle-orm"
import { generateFileName, generateInventoryContent, saveFileModified } from "./save-file"
import { showError } from "../toast/error"

export const saveInventory = async (saveFlag: string) => {
    const items = await inventoryDb.select().from(inventoryTable).where(
        eq(inventoryTable.scanFlag, 'Inventory')
    )
    if (items.length < 1) return showError('No item to save')
    const fileName = generateFileName('inv', saveFlag)
    const content = generateInventoryContent(items, 15)
    await saveFileModified({ fileName, content })
}