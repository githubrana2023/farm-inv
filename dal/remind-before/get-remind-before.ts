import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable, remindBeforeTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { eq } from "drizzle-orm"

export const getRemindBeforeDays = async (empId: string) => {
    try {
        await new Promise((resolve) => requestAnimationFrame(resolve))

        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, empId))
        if (!existEmp) return failureResponse('Employee not found!')

        const remindBefores = await inventoryDb.select().from(remindBeforeTable).where(
            eq(remindBeforeTable.employeeId, existEmp.employeeId)
        )

        return successResponse(remindBefores, 'Remind Before retrived!')

    } catch (error) {
        console.log('Failed to get remindBefore!', error)
        return failureResponse('Failed to get remindBefore!')
    }
}