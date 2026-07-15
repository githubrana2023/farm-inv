import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable } from "@/drizzle/schema/inventory"
import { showError } from "@/lib/toast/error"
import { showSuccess } from "@/lib/toast/success"
import { EmployeeCreateFormValue } from "@/lib/zod/employee-form-schema"
import 'react-native-get-random-values';
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"

export const createEmployee = async (value: EmployeeCreateFormValue) => {
    try {
        const allEmployees = await inventoryDb.select().from(employeeTable)

        const isFirstEmp = allEmployees.length < 1
        const isEdpEmployee = value.employeeTitle.toUpperCase() === 'EDP'
        const salt = await bcrypt.genSalt(10)

        if (isFirstEmp) {
            if (value.employeeTitle.toUpperCase() !== 'EDP') {
                showError('I.T required to create employee!')
                return
            }

            const hashedPw = await bcrypt.hash(value.password, salt)
            console.log({ value })

            // Create first emp as Edp
            await inventoryDb.insert(employeeTable).values({
                ...value,
                employeeId: Number(value.employeeId),
                employeeTitle: value.employeeTitle.toUpperCase(),
                password: hashedPw
            })
            showSuccess('EDP created!')
            return
        }

        const edpEmployees = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeTitle, 'EDP'))
        const totalEdp = edpEmployees.length
        if (totalEdp > 1) {
            showError('I.T employee already exist!')
            return
        }

        if (isEdpEmployee) {
            showError('I.T can not more than one!' + totalEdp)
            return
        }

        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, Number(value.employeeId)))

        if (existEmp) {
            showError('Employee already exist!')
            return
        }

        const edpEmployee = edpEmployees[0]

        if (!edpEmployee) {
            showError('I.T required to create employee!')
            return
        }

        const isPwMatch = await bcrypt.compare(value.password, edpEmployee.password)

        if (!isPwMatch) {
            showError('Invalid password!')
            return
        }

        const hashedPw = await bcrypt.hash(value.employeeId, salt)

        await inventoryDb.insert(employeeTable).values({
            ...value,
            employeeId: Number(value.employeeId),
            password: hashedPw
        })

        showSuccess('Labour created!')
        return
    } catch (error) {
        console.log('Failed to create employee!', error)
        showError('Failed to create employee!')
    }
}