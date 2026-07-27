import { TThrowable, TThrowableScanType } from "@/constants/throwable/type"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { throwableTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { needPendingState } from "@/lib/utils"
import { differenceInDays, format } from "date-fns"
import { desc, eq } from "drizzle-orm"

export const getThrowables = async () => {
    try {
        await needPendingState()
        const throwables = await inventoryDb.select().from(throwableTable).orderBy(desc(throwableTable.createdAt))

        // TODO : Separate 50% oneplusone

        const values = throwables.reduce((acc, throwable, currentIndex) => {
            const { updatedAt, createdAt, ...rest } = throwable

            if (!acc[throwable.type]) {
                acc[throwable.type] = {
                    type: throwable.type,
                    items: []
                }
            }
            // const current = new Date()
            // const remainingDay = differenceInDays(rest.expireIn, current)
            acc[throwable.type].items.push({
                ...rest,
                expireIn: format(rest.expireIn, 'MMMM dd, yyyy'),
                serial: currentIndex + 1
                // remark: ""
            })

            return acc
        }, {} as TThrowable)

        return successResponse(values)

    } catch (error) {
        console.log('Failed to get throwables!', error)
        return failureResponse('Failed to get throwables!')
    }
}

export const getThrowablesByType = async (type: TThrowableScanType) => {
    try {
        await needPendingState()
        const throwables = await inventoryDb.select().from(throwableTable).where(eq(throwableTable.type, type))
        return successResponse(throwables)
    } catch (error) {
        return failureResponse(`Failed to get ${type} items`)
    }
}