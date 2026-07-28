import { inventoryDb } from "@/drizzle/db/inventory-db";
import { employeeTable, expiryMonitorTable } from "@/drizzle/schema/inventory";
import { failureResponse, successResponse } from "@/lib/response";
import { needPendingState } from "@/lib/utils";
import { differenceInDays, format } from "date-fns";
import { and, desc, eq, gte, lte } from "drizzle-orm";

export const getExpiryItemByEmpId = async ({ empId, after = new Date(), before }: { empId: string; after?: Date; before?: Date }) => {
    try {
        await needPendingState()
        const afterTime = new Date(new Date(after).setHours(0, 0, 0, 0))
        // const beforeTime = new Date(before).setHours(23, 59, 59, 0)


        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, empId))

        if (!existEmp) return failureResponse('Employee not found!')

        const employeeExpiryItems = await inventoryDb.select().from(expiryMonitorTable).where(
            and(
                eq(expiryMonitorTable.empId, existEmp.employeeId),
                gte(expiryMonitorTable.createdAt, afterTime)
            )
        ).orderBy(desc(expiryMonitorTable.createdAt))


        return successResponse(employeeExpiryItems)


    } catch (error) {
        console.log('Failed to get expiry monitoring items', error)
        return failureResponse('Failed to get expiry monitoring items')
    }
}

export const getExpiryItemsRemoveDateIsToday = async () => {
    const current = new Date().setHours(23, 59, 59, 0)
    const today = new Date(current)
    try {
        const removableItems = await inventoryDb.select().from(expiryMonitorTable).where(lte(
            expiryMonitorTable.remindBefore, today
        ))

        const grouped = removableItems.reduce((acc, item) => {
            const remainingDay = differenceInDays(item.expireIn, new Date())

            if (!acc[item.empId]) {
                acc[item.empId] = {
                    Employee_Id: item.empId,
                    items: []
                }
            }


            acc[item.empId].items.push({
                Employee_Id: item.empId,
                Barcode: item.barcode,
                Item_Code: item.item_number,
                Description: item.description,
                Expire_In: format(item.expireIn, 'MMMM dd, yyyy'),
                Pull_Out_Date: format(item.remindBefore, 'MMMM dd, yyyy'),
                Remark: remainingDay <= 0 ? 'Expired' : `${remainingDay} ${remainingDay > 1 ? 'days' : 'day'} remaining`,
                Shelf_Number: item.shelfNo,
            })

            return acc
        }, {} as Record<string, {
            Employee_Id: string;
            items: {
                Employee_Id: string;
                Barcode: string;
                Item_Code: string;
                Description: string;
                Expire_In: string;
                Shelf_Number: string;
                Pull_Out_Date: string;
                Remark: string;
            }[]
        }>)


        return successResponse(Object.values(grouped))
    } catch (error) {

        console.log('Failed to retrieved expiry monitoring items', error)
        return failureResponse('Failed to retrieved expiry monitoring items')
    }
}