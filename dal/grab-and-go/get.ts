import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { grabAndGoTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { and, eq, like } from "drizzle-orm";


export const getGrabAndGoFifthyPercentBarcode = async (barcode: string) => {
    try {
        try {
            const [existItem] = await farmDb.select().from(itemMasterTable).where(eq(
                itemMasterTable.barcode, barcode
            ))
            if (!existItem) return failureResponse('Item not found');

            const [fifthyPercentBarcode] = await farmDb.select().from(itemMasterTable).where(
                and(
                    eq(itemMasterTable.item_number, existItem.item_number),
                    like(itemMasterTable.barcode, '6699%%')
                )
            )

            if (!fifthyPercentBarcode) return failureResponse('Fifty percent item barcode not found!')

            return successResponse(fifthyPercentBarcode)

        } catch (error) {
            console.log('Failed to insert fifty percent barcode', error)
            return failureResponse('Failed to insert fifty percent barcode')
        }
    } catch (error) {

    }
}

export const getGrabAndGoFifthyPercentBarcodes = async () => {
    try {
        try {
            const grabAndGoFifthyPercentBarcodes = await inventoryDb.select().from(grabAndGoTable)

            return successResponse(grabAndGoFifthyPercentBarcodes)

        } catch (error) {
            console.log('Failed to insert fifty percent barcode', error)
            return failureResponse('Failed to insert fifty percent barcode')
        }
    } catch (error) {

    }
}