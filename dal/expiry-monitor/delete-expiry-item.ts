import { inventoryDb } from "@/drizzle/db/inventory-db";
import { employeeTable, expiryMonitorTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { and, eq } from "drizzle-orm";

export const deleteExpiryMonitorItemByIdAndEmpId = async ({ id, empId }: { id: string; empId: string }) => {
    try {
        const [existEmp] = await inventoryDb.select().from(employeeTable).where(
            eq(employeeTable.employeeId, empId)
        )

        if (!existEmp) return failureResponse('Employee not found!')

        const existExpiry = await inventoryDb.select().from(expiryMonitorTable).where(
            and(
                eq(expiryMonitorTable.empId, existEmp.employeeId),
                eq(expiryMonitorTable.id, id)
            )
        )

        if (!existExpiry) return failureResponse('Expiry item not found!')

        const deleteExpiryItem = await inventoryDb.delete(expiryMonitorTable).where(
            and(
                eq(expiryMonitorTable.empId, existEmp.employeeId),
                eq(expiryMonitorTable.id, id)
            )
        )

        return successResponse(deleteExpiryItem)
    } catch (error) {
        console.log('Failed to delete expiry item!')
        return failureResponse('Failed to delete expiry item!')
    }

}