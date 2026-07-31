import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { employeeTable, nonReturnAbleSupplierTable } from "@/drizzle/schema/inventory";
import { expiryMonitorTable } from "@/drizzle/schema/inventory/expiry-monitor";
import { shelfTable } from "@/drizzle/schema/inventory/shelf";
import { throwableAllowedSupplierTable } from "@/drizzle/schema/inventory/throwable-allowed-suppliers";
import { failureResponse, successResponse } from "@/lib/response";
import { isValidEAN13, parseEAN13, splitWord } from "@/lib/utils";
import { ExpireScanFormValue } from "@/lib/zod/expiry-monitor-form-schema";
import { format, subDays } from "date-fns";
import { and, eq } from "drizzle-orm";

export const insertExpiryMonitor = async (value: (ExpireScanFormValue & { empId: string })) => {
    try {
        const parsedBarcode = isValidEAN13(value.barcode) ? parseEAN13(value.barcode) : value.barcode

        //! check for exist employee
        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, value.empId))
        if (!existEmp) return failureResponse('Employee not found!')

        //! check for exist item
        const [existItem] = await farmDb.select().from(itemMasterTable).where(eq(itemMasterTable.barcode, parsedBarcode))
        if (!existItem) return failureResponse('Item not found!')


        const [date, month, year] = splitWord(value.expireIn, '.').map(str => Number(str))
        const expireIn = new Date(year, month - 1, date)
        const removeBefore = subDays(expireIn, Number(value.remindBefore))

        const [existNonReturnAbleSupplier] = await inventoryDb.select().from(nonReturnAbleSupplierTable).where(eq(
            nonReturnAbleSupplierTable.vendorCode, existItem.vendor_code
        ))


        const [existAllowedThrowable] = await inventoryDb.select().from(throwableAllowedSupplierTable).where(eq(
            throwableAllowedSupplierTable.vendorCode, existItem.vendor_code
        ))

        const isThrowing = (!!existAllowedThrowable && existAllowedThrowable.isCurrentlyAllow) || (!!existNonReturnAbleSupplier && existNonReturnAbleSupplier.branchThrowing)
        const isOnePlusOne = (!!existAllowedThrowable && existAllowedThrowable.isCurrentlyAllow) || (!!existNonReturnAbleSupplier && existNonReturnAbleSupplier.nearExpiryDiscount)


        const newExpiry = await inventoryDb.insert(expiryMonitorTable).values({
            barcode: existItem.barcode,
            item_number: existItem.item_number,
            description: existItem.description,
            expireIn,
            remindBefore: removeBefore,
            shelfNo: value.shelfNo,
            empId: existEmp.employeeId,
            isOnePlusOne,
            isThrowing,
            vendor: existItem.vendor,
            vendorCode: existItem.vendor_code
        })
        return successResponse(newExpiry)

    } catch (error) {
        console.log('Failed to insert expiry', error)
        return failureResponse('Failed to insert expiry')
    }
}