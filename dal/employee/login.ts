import { inventoryDb } from '@/drizzle/db/inventory-db'
import { employeeTable } from '@/drizzle/schema/inventory'
import { failureResponse, successResponse } from '@/lib/response'
import bcrypt from 'bcryptjs'
import { eq } from 'drizzle-orm'
export const employeeLogin = async ({ empId, password }: { empId: string, password: string }) => {
    try {

        await new Promise<void>(resolve =>
            requestAnimationFrame(() => resolve())
        );
        const [existEmployee] = await inventoryDb.select().from(employeeTable).where(
            eq(employeeTable.employeeId, empId)
        )

        if (!existEmployee) return failureResponse('Employee does not exist!')

        const isPwMatched = await bcrypt.compare(password, existEmployee.password)

        if (!isPwMatched) return failureResponse('Invalid Password!')

        return successResponse(true)

    } catch (error) {
        console.log('failed to login employee', error)
        return failureResponse('Failed to login employee!')
    }
}