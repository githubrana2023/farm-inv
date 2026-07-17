import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable } from "@/drizzle/schema/inventory"
import { EmployeeCreateFormValue } from "@/lib/zod/employee-form-schema"
import 'react-native-get-random-values';
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { failureResponse, successResponse } from "@/lib/response"

export const createEmployee = async (value: EmployeeCreateFormValue) => {
    try {
        const allEmployees = await inventoryDb.select().from(employeeTable)

        const isFirstEmp = allEmployees.length < 1
        const isEdpEmployee = value.employeeTitle.toUpperCase() === 'EDP'
        const salt = await bcrypt.genSalt(10)

        if (isFirstEmp) {
            if (value.employeeTitle.toUpperCase() !== 'EDP') return failureResponse('I.T required to create employee!')

            const hashedPw = await bcrypt.hash(value.password, salt)

            // Create first emp as Edp
            const [emp] = await inventoryDb.insert(employeeTable).values({
                ...value,
                employeeId: Number(value.employeeId),
                employeeTitle: value.employeeTitle.toUpperCase(),
                password: hashedPw
            }).returning()

            return successResponse(emp, 'EDP employee created!')
        }

        const edpEmployees = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeTitle, 'EDP'))
        const totalEdp = edpEmployees.length
        if (totalEdp > 1) return failureResponse('I.T employee already exist!')

        if (isEdpEmployee) return failureResponse('I.T can not more than one!')

        const [existEmp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeId, Number(value.employeeId)))

        if (existEmp) return failureResponse('Employee already exist!')

        const edpEmployee = edpEmployees[0]

        if (!edpEmployee) return failureResponse('I.T required to create employee!')

        const isPwMatch = await bcrypt.compare(value.password, edpEmployee.password)

        if (!isPwMatch) return failureResponse('Invalid password!')

        const hashedPw = await bcrypt.hash(value.employeeId, salt)

        const [emp] = await inventoryDb.insert(employeeTable).values({
            ...value,
            employeeId: Number(value.employeeId),
            password: hashedPw
        }).returning()
        return successResponse(emp, 'Employee created successfully')
    } catch (error) {
        console.log('Failed to create employee!', error)
        return failureResponse('Failed to create employee!')
    }
}