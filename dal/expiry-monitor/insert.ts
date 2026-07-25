import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { employeeTable } from "@/drizzle/schema/inventory";
import { expiryMonitorTable } from "@/drizzle/schema/inventory/expiry-monitor";
import { shelfTable } from "@/drizzle/schema/inventory/shelf";
import { failureResponse, successResponse } from "@/lib/response";
import { splitWord } from "@/lib/utils";
import { ExpireScanFormValue } from "@/lib/zod/expiry-monitor-form-schema";
import { format, subDays } from "date-fns";
import { and, eq } from "drizzle-orm";

export const insertExpiryMonitor = async (value: (ExpireScanFormValue & { empId: string })) => {
    try {

        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, value.empId))
        if (!existEmp) return failureResponse('Employee not found!')

        const [existItem] = await farmDb.select().from(itemMasterTable).where(eq(itemMasterTable.barcode, value.barcode))
        if (!existItem) return failureResponse('Item not found!')

        const [date, month, year] = splitWord(value.expireIn, '.').map(str => Number(str))
        const expireIn = new Date(year, month - 1, date)
        const removeBefore = subDays(expireIn, Number(value.remindBefore))

        const newExpiry = await inventoryDb.insert(expiryMonitorTable).values({
            barcode: existItem.barcode,
            item_number: existItem.item_number,
            description: existItem.description,
            expireIn,
            remindBefore: removeBefore,
            shelfNo: value.shelfNo,
            empId: existEmp.employeeId
        })
        return successResponse(null)

    } catch (error) {
        console.log('Failed to insert expiry', error)
        return failureResponse('Failed to insert expiry')
    }
}