import { DOT_SEPARATOR } from "@/constants"
import { farmDb } from "@/drizzle/db/farm-db"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { itemMasterTable } from "@/drizzle/schema/farm-schema"
import { nonReturnAbleSupplierTable, throwableAllowedSupplierTable, throwableTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { isStartWith, splitWord } from "@/lib/utils"
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

        const [existAllowedSupplier] = await inventoryDb.select().from(throwableAllowedSupplierTable).where(eq(
            throwableAllowedSupplierTable.vendorCode, existItem.vendor_code
        ))

        const [existNonReturnAbleSupplier] = await inventoryDb.select().from(nonReturnAbleSupplierTable).where(eq(
            nonReturnAbleSupplierTable.vendorCode, existItem.vendor_code
        ))

        const isGiOrHiVendorCode = isStartWith(existItem.vendor_code, 'gi') || isStartWith(existItem.vendor_code, 'hi')

        if (data.type !== 'OVERSTOCK') {
            if (
                !data.hasImportedLabel &&
                !isGiOrHiVendorCode &&
                !existAllowedSupplier &&
                !existNonReturnAbleSupplier
            ) return failureResponse(`Item are not allow for ${data.type}`)

            if (existAllowedSupplier && !existAllowedSupplier.isCurrentlyAllow) return failureResponse(
                `Currently not allow for ${data.type}`
            )

            if (
                data.type === 'ONE_PLUS_ONE' &&
                existNonReturnAbleSupplier &&
                !existNonReturnAbleSupplier.nearExpiryDiscount
            ) return failureResponse(
                `Not allowed for one plus one as per non returnable supplier sheet!`
            );

            if (
                data.type === 'THROWING' &&
                existNonReturnAbleSupplier &&
                !existNonReturnAbleSupplier.branchThrowing
            ) return failureResponse(
                `Not allowed for throwing as per non returnable supplier sheet!`
            );
        }


        const isAllow = data.hasImportedLabel ||
            isGiOrHiVendorCode ||
            (existAllowedSupplier && existAllowedSupplier.isCurrentlyAllow) ||
            (existNonReturnAbleSupplier && existNonReturnAbleSupplier.nearExpiryDiscount) ||
            (existNonReturnAbleSupplier && existNonReturnAbleSupplier.branchThrowing)

        const newThrowable = await inventoryDb.insert(throwableTable).values({
            barcode: existItem.barcode,
            expireIn: expireDate,
            isAllow,
            quantity,
            type,
            vendorCode: existItem.vendor_code,
            vendorName: existItem.vendor,
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