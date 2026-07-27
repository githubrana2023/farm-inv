import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { grabAndGoTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { and, desc, eq, like } from "drizzle-orm";


export const getGrabAndGoFiftyPercentBarcode = async (barcode: string) => {
    try {
        try {
            const [existItem] = await farmDb.select().from(itemMasterTable).where(eq(
                itemMasterTable.barcode, barcode
            ))

            if (!existItem) return failureResponse('Item not found');

            const [fiftyPercentBarcode] = await farmDb.select().from(itemMasterTable).where(
                and(
                    eq(itemMasterTable.item_number, existItem.item_number),
                    like(itemMasterTable.barcode, '6699%%')
                )
            )

            if (!fiftyPercentBarcode) return failureResponse('Fifty percent item barcode not found!')

            return successResponse(fiftyPercentBarcode)

        } catch (error) {
            console.log('Failed to insert fifty percent barcode', error)
            return failureResponse('Failed to insert fifty percent barcode')
        }
    } catch (error) {
        console.log('Failed to get grab and go fifty percent barcode!', error)
        return failureResponse('Failed to get grab and go fifty percent barcode!')
    }
}

export const getGrabAndGoFiftyPercentBarcodes = async () => {
    try {
        try {
            const grabAndGoFiftyPercentBarcodes = await inventoryDb.select({ id: grabAndGoTable.id, barcode: grabAndGoTable.barcode, quantity: grabAndGoTable.quantity }).from(grabAndGoTable).orderBy(desc(grabAndGoTable.createdAt))

            return successResponse(grabAndGoFiftyPercentBarcodes)

        } catch (error) {
            console.log('Failed to insert fifty percent barcode', error)
            return failureResponse('Failed to insert fifty percent barcode')
        }
    } catch (error) {

    }
}