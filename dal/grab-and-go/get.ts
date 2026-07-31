import { EAN13Regex } from "@/constants";
import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { grabAndGoTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { isValidEAN13, parseEAN13 } from "@/lib/utils";
import { and, desc, eq, like } from "drizzle-orm";
export const getGrabAndGoFiftyPercentBarcode = async (barcode: string) => {
    try {

        const parsedBarcode = isValidEAN13(barcode) ? parseEAN13(barcode) : barcode

        const [existItem] = await farmDb.select().from(itemMasterTable).where(eq(
            itemMasterTable.barcode, parsedBarcode
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
}

export const getGrabAndGoFiftyPercentBarcodes = async () => {
    try {
        try {
            const grabAndGoFiftyPercentBarcodes = await inventoryDb.select().from(grabAndGoTable).orderBy(desc(grabAndGoTable.createdAt))

            return successResponse(grabAndGoFiftyPercentBarcodes)

        } catch (error) {
            console.log('Failed to insert fifty percent barcode', error)
            return failureResponse('Failed to insert fifty percent barcode')
        }
    } catch (error) {

    }
}