import { TThrowable, TThrowableScanType } from "@/constants/throwable/type"
import { farmDb } from "@/drizzle/db/farm-db"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { itemMasterTable } from "@/drizzle/schema/farm-schema"
import { nonReturnAbleSupplierTable, throwableTable } from "@/drizzle/schema/inventory"
import { throwableAllowedSupplierTable } from "@/drizzle/schema/inventory/throwable-allowed-suppliers"
import { failureResponse, successResponse } from "@/lib/response"
import { isStartWith, isValidEAN13, needPendingState, parseEAN13 } from "@/lib/utils"
import { differenceInDays, format } from "date-fns"
import { desc, eq } from "drizzle-orm"

export const getThrowables = async () => {
    try {
        await needPendingState()
        const throwables = await inventoryDb.select().from(throwableTable).orderBy(desc(throwableTable.createdAt))

        // TODO : Separate 50% oneplusone

        const values = throwables.length > 0 ?
            throwables.reduce((acc, throwable, currentIndex) => {
                const { updatedAt, createdAt, ...rest } = throwable

                if (!acc[throwable.type]) {
                    acc[throwable.type] = {
                        type: throwable.type,
                        items: []
                    }
                }
                // const current = new Date()
                // const remainingDay = differenceInDays(rest.expireIn, current)
                acc[throwable.type].items.push({
                    ...rest,
                    expireIn: format(rest.expireIn, 'MMM dd, yyyy'),
                    serial: currentIndex + 1
                    // remark: ""
                })

                return acc
            }, {} as TThrowable) :
            null

        return successResponse(values)

    } catch (error) {
        console.log('Failed to get throwables!', error)
        return failureResponse('Failed to get throwables!')
    }
}

export const getThrowablesByType = async (type: TThrowableScanType) => {
    try {
        await needPendingState()
        const throwables = await inventoryDb.select().from(throwableTable).where(eq(throwableTable.type, type))
        return successResponse(throwables)
    } catch (error) {
        return failureResponse(`Failed to get ${type} items`)
    }
}

export const getThrowableItemDetails = async (
    { barcode, hasImportedLabel }: {
        barcode: string,
        hasImportedLabel: boolean,
    }
) => {
    try {
        //! parsing the barcode
        const parsedBarcode = isValidEAN13(barcode) ? parseEAN13(barcode) : barcode


        console.log(parsedBarcode)

        // !checking for exist item
        const [existItem] = await farmDb.select(
            {
                barcode: itemMasterTable.barcode,
                item_number: itemMasterTable.item_number,
                description: itemMasterTable.description,
                vendor_code: itemMasterTable.vendor_code,
            }
        ).from(itemMasterTable).where(eq(
            itemMasterTable.barcode, parsedBarcode
        ))
        if (!existItem) return failureResponse('Item not found')


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

        const isOnePlusOne = (existAllowedSupplier && existAllowedSupplier.isCurrentlyAllow) ||
            (existNonReturnAbleSupplier && existNonReturnAbleSupplier.nearExpiryDiscount) || isGiOrHiVendorCode || hasImportedLabel

        const isThrowing = (existAllowedSupplier && existAllowedSupplier.isCurrentlyAllow) ||
            (existNonReturnAbleSupplier && existNonReturnAbleSupplier.branchThrowing) || isGiOrHiVendorCode || hasImportedLabel

        const isAllow = isThrowing || isOnePlusOne

        return successResponse({
            ...existItem,
            isAllow,
            isOnePlusOne,
            isThrowing
        })


    } catch (error) {
        console.log('Failed to get throwable item details!', error)
        return failureResponse('Failed to get throwable item details!')
    }

}