import { DOT_SEPARATOR } from "@/constants"
import { farmDb } from "@/drizzle/db/farm-db"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { itemMasterTable } from "@/drizzle/schema/farm-schema"
import { nonReturnAbleSupplierTable, throwableTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { splitWord } from "@/lib/utils"
import { throwableCreateFormSchema, TThrowableCreateFormValue } from "@/lib/zod/throwable-form-schema"
import { eq } from "drizzle-orm"

export const insertThrowable = async (value: TThrowableCreateFormValue) => {
    try {
        await new Promise((resolve) => requestAnimationFrame(resolve))

        const { data, error, success } = throwableCreateFormSchema.safeParse(value)
        if (!success) return failureResponse('Invalid Fields')
        const { barcode, quantity, expireIn, hasImportedLabel, type } = data

        const [day, month, year] = splitWord(expireIn, DOT_SEPARATOR).map(v => Number(v))
        const expireDate = new Date(year, month - 1, day)

        const [existItem] = await farmDb.select().from(itemMasterTable).where(
            eq(itemMasterTable.barcode, barcode)
        )

        if (!existItem) return failureResponse('Item not found!')


        let existNonReturnableSupplier: {
            id: string;
            vendorCode: string;
            shortVendorName: string;
            vendorName: string;
            returnAble: boolean;
            nonReturnAble: boolean;
            branchThrowing: boolean;
            nearExpiryDiscount: boolean;
            returnException: string | null;
        } | null = null

        let vendorCode: string = ""
        let vendorName: string = ""
        const isAllow = !existNonReturnableSupplier || !hasImportedLabel

        if (type !== 'OVERSTOCK') {
            const [existNonReturnableSupplier] = await inventoryDb.select().from(nonReturnAbleSupplierTable).where(
                eq(nonReturnAbleSupplierTable.vendorCode, existItem.vendor)
            )

            if (!existNonReturnableSupplier && !hasImportedLabel) return failureResponse('Check for imported label!')

            vendorCode = existNonReturnableSupplier ? existNonReturnableSupplier.vendorCode : existItem.vendor_code
            vendorName = existNonReturnableSupplier ? existNonReturnableSupplier.vendorName : existItem.vendor
        }


        const newThrowable = await inventoryDb.insert(throwableTable).values({
            barcode: existItem.barcode,
            expireIn: expireDate,
            isAllow,
            quantity,
            type,
            vendorCode,
            vendorName,
            hasImportedLabel,
            description: existItem.description,
            uom: existItem.uom,
            itemCode: existItem.item_number,
            salesPrice: String(existItem.sales_price)
        })

        return successResponse(newThrowable)

    } catch (error) {
        console.log(`Failed to insert ${value.type}!`, error)
        return failureResponse(`Failed to insert ${value.type}!`)
    }
}