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
        const trimmedShelfNo = shelf.trim()
        console.log({ trimmedShelfNo })
        const isValidShelfNo = shelfNoRegex.test(trimmedShelfNo)
        const isContainPeriod = shelf.includes(separator)

        if (!isValidShelfNo) return failureResponse('Invalid shelf no!')

        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, empId))
        if (!existEmp) return failureResponse('Employee not found!')

        if (isContainPeriod) {

            const shelfs = splitWord(trimmedShelfNo, separator)

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

            const newShelf = noExists.map(noExist => ({
                employeeId: existEmp.employeeId,
                shelfNo: noExist
            }))

            const total = await inventoryDb.insert(shelfTable).values(newShelf).returning()

            return successResponse({ total: total.length })

        }
        const [existShelf] = await inventoryDb.select().from(shelfTable).where(
            and(
                eq(shelfTable.employeeId, existEmp.employeeId),
                eq(shelfTable.shelfNo, trimmedShelfNo)
            )
        )
        if (!existShelf) return failureResponse('Shelf no already exist!')

        const newShelfNo = await inventoryDb.insert(shelfTable).values({
            employeeId: existEmp.employeeId,
            shelfNo: trimmedShelfNo
        })

        return successResponse(newShelfNo, 'Shelf No created!')

    } catch (error) {
        console.log('Failed to create shelf no!', error)
        return failureResponse('Failed to create shelf no!')
    }
}