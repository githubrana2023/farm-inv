
import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { inventoryTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { splitWord } from "@/lib/utils";
import { addItemFormSchema, AddItemFormValue } from "@/lib/zod/add-item-form-schema";
import { and, eq } from "drizzle-orm";

export const insertScannedItem = async (formValue: AddItemFormValue) => {
    try {
        const validation = addItemFormSchema.safeParse(formValue)
        if (!validation.success) return failureResponse('Invalid Fields!')
        const { data } = validation
        const [uom, packing] = splitWord(data.uom, '|')
        const isOrder = data.scanType === 'Order'

        if (Number(data.quantity) <= 0) return failureResponse('Quantity must grater than 0')

        const [existItem] = await farmDb.select().from(itemMasterTable).where(
            eq(itemMasterTable.barcode, data.barcode)
        )

        if (!existItem) return failureResponse('Item not found!')

        if (data.scanType && isOrder && data.isAdvanceMode) {
            const duplicateItems = await inventoryDb.select().from(inventoryTable).where(
                and(
                    eq(inventoryTable.scanFlag, data.scanType),
                    eq(inventoryTable.item_number, existItem.item_number)
                )
            )
            const isDuplicateScanned = duplicateItems.length >= 1

            if (isDuplicateScanned) return successResponse(duplicateItems[0], 'Oops! wanna delete or update the order item?')
        }

        const newAdded = await inventoryDb.insert(inventoryTable).values({
            uom,
            description: existItem.description,
            barcode: existItem.barcode,
            item_number: existItem.item_number,
            packing: packing,
            quantity: data.quantity,
            scanFlag: data.scanType
        }).returning()
        return successResponse(newAdded, 'Item added!')

    } catch (error) {
        console.log(error)
        return failureResponse('Failed to add scanned item!')
    }
}



export const insertPriceCheckerTag = async (barcode: string) => {
    try {

        const trimmedBarcode = barcode.trim()
        if (!trimmedBarcode) return failureResponse('Please enter the barcode!')

        const [existItem] = await farmDb.select().from(itemMasterTable).where(
            eq(itemMasterTable.barcode, trimmedBarcode)
        )

        if (!existItem) return failureResponse('Item not found!')


        const newAdded = await inventoryDb.insert(inventoryTable).values({
            uom: existItem.uom,
            description: existItem.description,
            barcode: existItem.barcode,
            item_number: existItem.item_number,
            packing: String(existItem.packing),
            quantity: String(1),
            scanFlag: 'Tags'
        }).returning()
        return successResponse(newAdded, 'Shelf tag added!')

    } catch (error) {
        console.log(error)
        return failureResponse('Failed to add scanned item!')
    }
}