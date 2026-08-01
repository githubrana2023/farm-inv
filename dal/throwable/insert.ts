import { DOT_SEPARATOR } from "@/constants"
import { farmDb } from "@/drizzle/db/farm-db"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { itemMasterTable } from "@/drizzle/schema/farm-schema"
import { nonReturnAbleSupplierTable, throwableTable } from "@/drizzle/schema/inventory"
import { throwableAllowedSupplierTable } from "@/drizzle/schema/inventory/throwable-allowed-suppliers"
import { failureResponse, successResponse } from "@/lib/response"
import { isStartWith, isValidEAN13, parseEAN13, splitWord } from "@/lib/utils"
import { throwableCreateFormSchema, TThrowableCreateFormValue } from "@/lib/zod/throwable-form-schema"
import { eq } from "drizzle-orm"

export const insertThrowable = async (value: TThrowableCreateFormValue) => {
    try {

        await new Promise((resolve) => requestAnimationFrame(resolve))

        //! schema validation
        const { data, success } = throwableCreateFormSchema.safeParse(value)
        if (!success) return failureResponse('Invalid Fields')
        const { barcode, quantity, expireIn, hasImportedLabel, type } = data

        //! expiry date extraction
        const [day, month, year] = splitWord(expireIn, DOT_SEPARATOR).map(Number)
        const expireDate = new Date(year, month - 1, day)

        //! parsing the barcode
        const parsedBarcode = isValidEAN13(barcode) ? parseEAN13(barcode) : barcode

        //! checking for exist item
        const [existItem] = await farmDb.select().from(itemMasterTable).where(
            eq(itemMasterTable.barcode, parsedBarcode)
        )
        if (!existItem) return failureResponse('Item not found!')


        //! getting the allowed supplier by vendor code
        const [existAllowedSupplier] = await inventoryDb.select().from(throwableAllowedSupplierTable).where(eq(
            throwableAllowedSupplierTable.vendorCode, existItem.vendor_code
        ))

        //! getting the non returnable supplier by vendor code
        const [existNonReturnAbleSupplier] = await inventoryDb.select().from(nonReturnAbleSupplierTable).where(eq(
            nonReturnAbleSupplierTable.vendorCode, existItem.vendor_code
        ))

        //! checking is the vendor code startswith GI or HI
        const isGiOrHiVendorCode = isStartWith(existItem.vendor_code, 'gi') || isStartWith(existItem.vendor_code, 'hi')


        //! operation for throwable or discount
        if (data.type !== 'OVERSTOCK') {
            if (
                !hasImportedLabel &&
                !isGiOrHiVendorCode &&
                !existAllowedSupplier &&
                !existNonReturnAbleSupplier
            ) return failureResponse(`Item are not allow for ${data.type}`)


            const isOnePlusOne = !existAllowedSupplier || !existAllowedSupplier?.isCurrentlyAllow ||
                !existNonReturnAbleSupplier || !existNonReturnAbleSupplier?.nearExpiryDiscount || !isGiOrHiVendorCode || !hasImportedLabel

            const isThrowing = (existAllowedSupplier && existAllowedSupplier.isCurrentlyAllow) ||
                (existNonReturnAbleSupplier && existNonReturnAbleSupplier.branchThrowing) || isGiOrHiVendorCode || hasImportedLabel

            if (data.type === 'ONE_PLUS_ONE' && !isOnePlusOne) return failureResponse(`Item is not allow for (${data.type})`);

            if (data.type === 'THROWING' && !isThrowing) return failureResponse(`Item is not allow for (${data.type})`);


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