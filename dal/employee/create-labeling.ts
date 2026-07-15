import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable, labelingTable } from "@/drizzle/schema/inventory"
import { showError } from "@/lib/toast/error"
import { showSuccess } from "@/lib/toast/success"
import { LabelingCreateFormValue } from "@/lib/zod/labeling-form-schema"
import 'react-native-get-random-values';
import bcrypt from "bcryptjs"
import { and, eq } from "drizzle-orm"

export const createLabeling = async ({ password, ...value }: LabelingCreateFormValue) => {
    try {

        const [edpEmployee] = await inventoryDb.select().from(employeeTable).where(
            eq(employeeTable.employeeTitle, 'EDP')
        )

        if (!edpEmployee) {
            showError('I.T does not exist!')
            return
        }

        const isPwMatch = await bcrypt.compare(password, edpEmployee.password)
        if (!isPwMatch) {
            showError('Invalid Password!')
            return
        }
        const [existLabeling] = await inventoryDb.select().from(labelingTable).where(
            and(
                eq(labelingTable.label, value.label),
                eq(labelingTable.saveFlag, value.saveFlag),
            )
        )
        console.log(existLabeling);

        if (existLabeling) {
            showError('Labeling already exist!')
            return
        }

        await inventoryDb.insert(labelingTable).values(value)
        showSuccess('Labeling created!')
        return
    } catch (error) {
        console.log('Failed to create labeling!', error)
        showError('Failed to create labeling!')
    }
}