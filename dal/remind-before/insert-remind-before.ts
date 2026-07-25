import { remindBeforeRegex, shelfNoRegex } from "@/constants"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable, remindBeforeTable, shelfTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { splitWord } from "@/lib/utils"
import { and, eq } from "drizzle-orm"

export const insertRemindBefore = async ({ empId, remindBefore }: { remindBefore: string; empId: string }) => {
    try {
        await new Promise((resolve) => requestAnimationFrame(resolve))
        const separator = '.'
        const isValidRemindBefore = remindBeforeRegex.test(remindBefore)
        const isContainPeriod = remindBefore.includes(separator)
        if (!isValidRemindBefore) return failureResponse('Invalid day!')

        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, empId))
        if (!existEmp) return failureResponse('Employee not found!')


        if (isContainPeriod) {

            const remindBefores = splitWord(remindBefore, separator)

            let noExists: string[] = []

            for (const remindBefore of remindBefores) {
                const [existShelf] = await inventoryDb.select().from(remindBeforeTable).where(
                    and(
                        eq(remindBeforeTable.employeeId, existEmp.employeeId),
                        eq(remindBeforeTable.remindBeforeNo, remindBefore)
                    )
                )
                if (!existShelf) {
                    noExists = [...noExists, remindBefore]
                }
            }

            for (const noExist of noExists) {
                await inventoryDb.insert(remindBeforeTable).values({
                    employeeId: existEmp.employeeId,
                    remindBeforeNo: noExist
                })
            }

            return successResponse({ total: noExists.length })

        }

        const [existRemindBefore] = await inventoryDb.select().from(remindBeforeTable).where(
            and(
                eq(remindBeforeTable.employeeId, existEmp.employeeId),
                eq(remindBeforeTable.remindBeforeNo, remindBefore)
            )
        )
        if (!existRemindBefore) return failureResponse('Shelf no already exist!')

        const newRemindBefore = await inventoryDb.insert(remindBeforeTable).values({
            employeeId: existEmp.employeeId,
            remindBeforeNo: remindBefore
        })

        return successResponse(newRemindBefore, 'Remind Before created!')

    } catch (error) {
        console.log('Failed to create remindBefore!', error)
        return failureResponse('Failed to create remindBefore!')
    }
}