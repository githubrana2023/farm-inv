import { farmDb } from "@/drizzle/db/farm-db";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { itemMasterTable } from "@/drizzle/schema/farm-schema";
import { employeeTable } from "@/drizzle/schema/inventory";
import { expiryMonitorTable } from "@/drizzle/schema/inventory/expiry-monitor";
import { failureResponse } from "@/lib/response";
import { splitWord } from "@/lib/utils";
import { ExpireScanFormValue } from "@/lib/zod/expiry-monitor-form-schema";
import { eq } from "drizzle-orm";

export const insertExpiryMonitor = async (value: (ExpireScanFormValue & { empId: string })) => {
    try {
        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, value.empId))
        if (!existEmp) return failureResponse('Employee not found!')
        const [existItem] = await farmDb.select().from(itemMasterTable).where(eq(itemMasterTable.barcode, value.barcode))
        if (!existItem) return failureResponse('Item not found!')

        const [date, month, year] = splitWord(value.expireIn, '.')
        const expireIn = new Date().setFullYear(Number(year), Number(month), Number(date))

        const newExpiry = await inventoryDb.insert(expiryMonitorTable).values({
            barcode: existItem.barcode,
            expireIn,
            remindBefore: value.remindBefore,
            shelfId
        })

    } catch (error) {

    }
}