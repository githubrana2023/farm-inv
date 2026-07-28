import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { grabAndGoTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { needPendingState } from "@/lib/utils";
import { grabAndGoCreateFormSchema, TGrabAndGoCreateFormValue } from "@/lib/zod/grab-and-go-form-schema";
import { and, eq, like } from "drizzle-orm";

export const insertGrabAndGo = async (values: TGrabAndGoCreateFormValue) => {
    try {
        await needPendingState()
        const validation = grabAndGoCreateFormSchema.safeParse(values)
        if (!validation.success) return failureResponse('Invalid fields');
        const [existItem] = await farmDb.select().from(itemMasterTable).where(eq(
            itemMasterTable.barcode, values.barcode
        ))
        if (!existItem) return failureResponse('Item not found');

        const [fiftyPercentBarcode] = await farmDb.select().from(itemMasterTable).where(
            and(
                eq(itemMasterTable.item_number, existItem.item_number),
                like(itemMasterTable.barcode, '6699%%')
            )
        )

        if (!fiftyPercentBarcode) return failureResponse('Fifty percent item barcode not found!')

        console.log({ description: existItem.description })

        const [newFiftyPercentBarcode] = await inventoryDb.insert(grabAndGoTable).values({
            barcode: fiftyPercentBarcode.barcode,
            description: existItem.description,
            quantity: values.quantity
        }).returning()
        return successResponse(newFiftyPercentBarcode)
    } catch (error) {
        console.log('Failed to insert fifty percent barcode', error)
        return failureResponse('Failed to insert fifty percent barcode')
    }
}