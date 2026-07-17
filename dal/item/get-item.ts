import { farmDb } from "@/drizzle/db/farm-db"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { itemMasterTable } from "@/drizzle/schema/farm-schema"
import { inventoryTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { AddItemFormValue } from "@/lib/zod/add-item-form-schema"
import { and, eq, sql } from "drizzle-orm"

export const getItemByBarcode = async ({ barcode, scanType, isAdvanceMode }: Pick<AddItemFormValue, 'scanType' | 'isAdvanceMode' | 'barcode'>) => {
    try {

        const isScanTypeOrder = scanType === 'Order'

        if (!barcode) return failureResponse('Barcode is missing!')

        const [item] = await farmDb.select().from(itemMasterTable).where(
            eq(itemMasterTable.barcode, barcode)
        )

        if (!item) return failureResponse('Item not found!')


        const itemUoms = await farmDb.select({
            uom: itemMasterTable.uom,
            barcode: itemMasterTable.barcode,
            packing: itemMasterTable.packing
        }).from(itemMasterTable).where(
            eq(itemMasterTable.item_number, item.item_number)
        )

        const uniqueUoms = [...new Map(itemUoms.map(item => ([item.packing, item]))).values()]

        if (isAdvanceMode && isScanTypeOrder) {
            const scannedItems = await inventoryDb.select().from(inventoryTable).where(
                and(
                    eq(inventoryTable.scanFlag, 'Order'),
                    eq(inventoryTable.item_number, item.item_number),
                )
            )
            const itemAlreadyScanned = scannedItems.length >= 1



            if (itemAlreadyScanned) return successResponse({
                orderItem: {
                    ...scannedItems[0],
                    itemUoms: uniqueUoms,
                    isDuplicated: itemAlreadyScanned
                },
                item: null
            })
        }

        return successResponse({
            orderItem: null,
            item: {
                ...item,
                itemUoms: uniqueUoms,
                isDuplicated: false
            }
        })

    } catch (error) {
        console.log('error', error)
        return failureResponse('Failed to get item!')
    }
}

export const getScannedItems = async () => {
    try {
        const scannedItems = await inventoryDb.select().from(inventoryTable)
        const s = await inventoryDb.select({ scanFlag: inventoryTable.scanFlag, count: sql<number>`cast(count(*) as int)` }).from(inventoryTable).groupBy(inventoryTable.scanFlag)

        console.log(s)

    } catch (error) {

    }
}