import { inventoryDb } from "@/drizzle/db/inventory-db"
import { throwableTable } from "@/drizzle/schema/inventory"
import { failureResponse, successResponse } from "@/lib/response"
import { format } from "date-fns"
import { desc } from "drizzle-orm"

export const getThrowables = async () => {
    try {
        const throwables = await inventoryDb.select().from(throwableTable).orderBy(desc(throwableTable.createdAt))

        // TODO : Separate 50% oneplusone

        const values = Object.values(throwables.reduce((acc, throwable) => {
            const { updatedAt, createdAt, ...rest } = throwable
            const isThrowing = rest.type === 'THROWING'
            const isOnePlusOne = rest.type === 'ONE_PLUS_ONE'

            if (!acc[throwable.type]) {
                acc[throwable.type] = {
                    type: throwable.type,
                    items: []
                }
            }

            acc[throwable.type].items.push({
                ...rest,
                expireIn: format(rest.expireIn, 'MMMM dd, yyyy'),
                remark: ''
            })

            return acc
        }, {} as Record<string, {
            type: string;
            items: {
                id: string;
                vendorCode: string;
                vendorName: string;
                type: string;
                barcode: string;
                quantity: string;
                expireIn: string;
                hasImportedLabel: boolean;
                isAllow: boolean;
                itemCode: string;
                description: string;
                uom: string;
                salesPrice: string;
                remark: string
            }[];
        }>))

        return successResponse(values)

    } catch (error) {
        console.log('Failed to get throwables!', error)
        return failureResponse('Failed to get throwables!')
    }
}