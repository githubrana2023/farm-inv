import { farmDb } from "@/drizzle/db/farm-db"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { itemMasterTable } from "@/drizzle/schema/farm-schema"
import { inventoryTable } from "@/drizzle/schema/inventory"
import { inventoryTable as farmInventoryTable } from "@/drizzle/schema/farm-schema"
import { storeData } from "@/lib/async-storage"
import { failureResponse, successResponse } from "@/lib/response"
import { AddItemFormValue } from "@/lib/zod/add-item-form-schema"
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm"

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
                isScanTypeOrder,
                isDuplicated: itemAlreadyScanned,
                orderItem: {
                    ...scannedItems[0],
                    itemUoms: uniqueUoms,
                },
                item: null
            },
                'Oops! wanna delete or update the order item?'
            )
        }

        return successResponse({
            isScanTypeOrder,
            isDuplicated: false,
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

export const getItemDetailsByBarcode = async (barcode: string) => {
    try {

        if (!barcode) return failureResponse('Barcode is missing!')

        const [item] = await farmDb.select().from(itemMasterTable).where(
            eq(itemMasterTable.barcode, barcode)
        )

        if (!item) return failureResponse('Item not found!')

        return successResponse(item)

    } catch (error) {
        console.log('error', error)
        return failureResponse('Failed to get item details!')
    }
}

export const getScannedItems = async () => {
    try {
        const scannedItems = await inventoryDb.select().from(inventoryTable).orderBy(desc(inventoryTable.createdAt))
        const scannedItemsCount = await inventoryDb.select({ scanFlag: inventoryTable.scanFlag, count: sql<number>`cast(count(*) as int)` }).from(inventoryTable).groupBy(inventoryTable.scanFlag)

        const total = scannedItemsCount.reduce((current, item) => {
            current.count = current.count + item.count
            return current
        }, {
            scanFlag: ("Total" as const),
            count: 0
        })
        return successResponse({
            scannedItems,
            scannedItemsCount: [...scannedItemsCount, ...[total]]
        })

    } catch (error) {
        console.log(error)
        return failureResponse('Failed to get scanned items')
    }
}

export const getItemPriceCheckByBarcode = async (barcode: string) => {
    try {

        const trimmedBarcode = barcode.trim()

        const [existItem] = await farmDb.select().from(itemMasterTable).where(
            eq(itemMasterTable.barcode, trimmedBarcode)
        )

        if (!existItem) return failureResponse('Item not found!')

        // console.log(existItem)

        return successResponse(existItem, 'Item retrieved!')

    } catch (error) {
        console.log('Failed to check item price!', error)
        return failureResponse('Failed to check item price!')
    }
}



export const getSearchItems = async (query?: string) => {
    try {
        const storeScannedItemsQuery = inventoryDb
            .select()
            .from(inventoryTable)

        if (query) {
            const words = query.trim().toLowerCase().split(/\s+/);

            storeScannedItemsQuery.where(
                or(
                    like(inventoryTable.barcode, `%${query}%`),
                    like(inventoryTable.item_number, `%${query}%`),
                    ...words.map((word) => like(inventoryTable.description, `%${word}%`)),
                ),
            );
        }

        const storedData = await storeScannedItemsQuery.orderBy(
            desc(inventoryTable.createdAt),
        );

        return successResponse(storedData, 'Items retrieved!')
    } catch (error) {
        return failureResponse('Failed to get search data')
    }

};


export const getGlobalSearchItems = async ({ limit, offset, query }: { query: string; limit: number; offset: number }) => {
    try {
        const words = query.trim().toLowerCase().split(/\s+/);


        const storeScannedItemsQuery = farmDb
            .select()
            .from(itemMasterTable)
            .where(
                or(
                    like(itemMasterTable.barcode, `%${query}%`),
                    like(itemMasterTable.item_number, `%${query}%`),
                    ...words.map((word) => like(itemMasterTable.description, `%${word}%`)),
                ),
            )
            .limit(limit)
            .offset(offset)

        const data = await storeScannedItemsQuery
        return data
    } catch (error) {
        return null
    }

};