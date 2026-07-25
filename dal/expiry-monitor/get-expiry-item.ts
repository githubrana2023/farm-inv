import { inventoryDb } from "@/drizzle/db/inventory-db";
import { employeeTable, expiryMonitorTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { and, eq, gte } from "drizzle-orm";

export const getExpiryItem = async ({ empId, after = new Date(), before }: { empId: string; after?: Date; before?: Date }) => {
    try {
        await new Promise((resolve) => requestAnimationFrame(resolve))
        const afterTime = new Date(new Date(after).setHours(0, 0, 0, 0))
        // const beforeTime = new Date(before).setHours(23, 59, 59, 0)


        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, empId))

        if (!existEmp) return failureResponse('Employee not found!')

        const employeeExpiryItems = await inventoryDb.select().from(expiryMonitorTable).where(
            and(
                eq(expiryMonitorTable.empId, existEmp.employeeId),
                gte(expiryMonitorTable.expireIn, afterTime)
            )
        )


        return successResponse(employeeExpiryItems)


    } catch (error) {
        console.log('Failed to get expiry monitoring items', error)
        return failureResponse('Failed to get expiry monitoring items')
    }
}