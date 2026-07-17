import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable, labelingTable } from "@/drizzle/schema/inventory"
import { LabelingCreateFormValue } from "@/lib/zod/labeling-form-schema"
import 'react-native-get-random-values';
import bcrypt from "bcryptjs"
import { and, eq } from "drizzle-orm"
import { failureResponse, successResponse } from "@/lib/response"

export const createLabeling = async ({ password, ...value }: LabelingCreateFormValue) => {
    try {

        const [edpEmployee] = await inventoryDb.select().from(employeeTable).where(
            eq(employeeTable.employeeTitle, 'EDP')
        )

        if (!edpEmployee) return failureResponse('I.T does not exist!')

        const isPwMatch = await bcrypt.compare(password, edpEmployee.password)
        if (!isPwMatch) return failureResponse('Invalid Password!')

        const [existLabeling] = await inventoryDb.select().from(labelingTable).where(
            and(
                eq(labelingTable.label, value.label),
                eq(labelingTable.saveFlag, value.saveFlag),
            )
        )

        if (existLabeling) return failureResponse('Label already exist!')

        const [newLabel] = await inventoryDb.insert(labelingTable).values(value).returning()
        return successResponse(newLabel, 'Label created successfully')
    } catch (error) {
        console.log('Failed to create labeling!', error)
        return failureResponse('Failed to create labeling!')
    }
}