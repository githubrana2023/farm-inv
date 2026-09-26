import { inventoryDb } from "@/drizzle/db/inventory-db"
import { inventoryTable } from "@/drizzle/schema/inventory"
import { eq } from "drizzle-orm"
import { showError } from "../toast/error"
import { generateFileName, saveFile } from "./save-file"

type Item = {
    id: string;
    barcode: string;
    item_number: string;
    description: string;
    uom: string;
    packing: string;
    quantity: string;
    scanFlag: "Inventory" | "Tags" | "Order" | null;
    pflag: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export const saveTags = async (saveFlag?: string) => {
    const items = await inventoryDb.select().from(inventoryTable).where(
        eq(inventoryTable.scanFlag, 'Tags')
    )
    if (items.length < 1) return showError('No item to save')

    const promoItems = items.filter(item => item.pflag === 'P')
    const regularItems = items.filter(item => item.pflag === 'R')

    const promoContent = generateInventoryContent(promoItems)
    const promoFileName = generateFileName('p-tags', saveFlag)

    const regularContent = generateInventoryContent(regularItems)
    const regularFileName = generateFileName('r-tags', saveFlag)


    await saveFile({ fileName: promoFileName, content: promoContent })
    await saveFile({ fileName: regularFileName, content: regularContent })
}

const generateInventoryContent = (items: Item[]) => items.map(item => `${item.barcode.padEnd(25, " ")}|${item.quantity}`).join('\n')