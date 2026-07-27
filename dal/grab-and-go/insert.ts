import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { grabAndGoTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { grabAndGoCreateFormSchema, TGrabAndGoCreateFormValue } from "@/lib/zod/grab-and-go-form-schema";
import { and, eq, like } from "drizzle-orm";

export const insertGrabAndGo = async (values: TGrabAndGoCreateFormValue) => {
    try {
        const validation = grabAndGoCreateFormSchema.safeParse(values)
        if (!validation.success) return failureResponse('Invalid fields');
        const [existItem] = await farmDb.select().from(itemMasterTable).where(eq(
            itemMasterTable.barcode, values.barcode
        ))
        if (!existItem) return failureResponse('Item not found');

        const [fifthyPercentBarcode] = await farmDb.select().from(itemMasterTable).where(
            and(
                eq(itemMasterTable.item_number, existItem.item_number),
                like(itemMasterTable.barcode, '6699%%')
            )
        )

        if (!fifthyPercentBarcode) return failureResponse('Fifty percent item barcode not found!')

        const [newFifhyPercentBarcode] = await inventoryDb.insert(grabAndGoTable).values({
            barcode: fifthyPercentBarcode.barcode,
            quantity: values.quantity
        }).returning()
        return successResponse(newFifhyPercentBarcode)
    } catch (error) {
        console.log('Failed to insert fifty percent barcode', error)
        return failureResponse('Failed to insert fifty percent barcode')
    }
}