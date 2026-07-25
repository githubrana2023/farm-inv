import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable, remindBeforeTable, shelfTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { eq } from "drizzle-orm"

export const getShelfsNo = async (empId: string) => {
    try {
        console.log({ empId })
        await new Promise((resolve) => requestAnimationFrame(resolve))

        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, empId))
        if (!existEmp) return failureResponse('Employee not found!')


        const remindBefores = await inventoryDb.select().from(shelfTable).where(
            eq(shelfTable.employeeId, existEmp.employeeId)
        )

        return successResponse(remindBefores, 'Remind Before retrieved!')

    } catch (error) {
        console.log('Failed to get remindBefore!', error)
        return failureResponse('Failed to get remindBefore!')
    }
}