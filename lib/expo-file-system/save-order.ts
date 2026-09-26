import { inventoryDb } from "@/drizzle/db/inventory-db";
import { showError } from "../toast/error";
import { generateFileName, saveFile } from "./save-file";
import { inventoryTable } from "@/drizzle/schema/inventory";
import { eq } from "drizzle-orm";

export const saveOrder = async (saveFlag?: string) => {
    try {
        const items = await inventoryDb.select().from(inventoryTable).where(
            eq(inventoryTable.scanFlag, 'Order')
        )
        if (items.length < 1) return showError('No item to save')

        const fileName = generateFileName('order', saveFlag)
        const content = generateOrderTypeContent(items)
        saveFile({
            content, fileName
        })
    } catch (error) {
        console.log('failed to save order')
    }

}

const generateOrderTypeContent = (items: { barcode: string, quantity: string, packing: string, uom: string }[]) => {
    return items.map(item => (`${item.barcode.padEnd(25, ' ')}|${item.uom}|${item.packing}|${item.quantity}|`)).join('\n')
}