import { shelfNoRegex } from "@/constants"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable, shelfTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { splitWord } from "@/lib/utils"
import { and, eq } from "drizzle-orm"

export const insertShelfNo = async ({ empId, shelf }: { shelf: string; empId: string }) => {
    try {
        await new Promise((resolve) => requestAnimationFrame(resolve))
        const separator = '.'

        const isValidShelfNo = shelfNoRegex.test(shelf)
        const isContainPeriod = shelf.includes(separator)

        if (!isValidShelfNo) return failureResponse('Invalid shelf no!')

        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, empId))
        if (!existEmp) return failureResponse('Employee not found!')

        if (isContainPeriod) {

            const shelfs = splitWord(shelf, separator)

            let noExists: string[] = []

            for (const shelf of shelfs) {
                const [existShelf] = await inventoryDb.select().from(shelfTable).where(
                    and(
                        eq(shelfTable.employeeId, existEmp.employeeId),
                        eq(shelfTable.shelfNo, shelf)
                    )
                )
                if (!existShelf) {
                    noExists = [...noExists, shelf]
                }
            }

            for (const noExist of noExists) {
                await inventoryDb.insert(shelfTable).values({
                    employeeId: existEmp.employeeId,
                    shelfNo: noExist
                })
            }

            return successResponse({ total: noExists.length })

        }
        const [existShelf] = await inventoryDb.select().from(shelfTable).where(
            and(
                eq(shelfTable.employeeId, existEmp.employeeId),
                eq(shelfTable.shelfNo, shelf)
            )
        )
        if (!existShelf) return failureResponse('Shelf no already exist!')

        const newShelfNo = await inventoryDb.insert(shelfTable).values({
            employeeId: existEmp.employeeId,
            shelfNo: shelf
        })

        return successResponse(newShelfNo, 'Shelf No created!')

    } catch (error) {
        console.log('Failed to create shelf no!', error)
        return failureResponse('Failed to create shelf no!')
    }
}