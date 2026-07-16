import { MUTATION_KEY } from "@/constants/tanstack-query"
import { createEmployee } from "@/dal/employee/create-employee"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { employeeTable } from "@/drizzle/schema/inventory"
import { useModalAction } from "@/hooks/redux/use-modal"
import { useMutation, useQuery } from "@tanstack/react-query"
import { eq } from "drizzle-orm"
import 'react-native-get-random-values';
import bcrypt from 'bcryptjs'
import { showError } from "@/lib/toast/error"
import { saveFile } from "@/lib/expo-file-system"

export const useEmployeeCreateMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.EMPLOYEE.CREATE],
        mutationFn: createEmployee
    })
}

export const useEmployeeGetMutation = () => {
    return useMutation({
        mutationKey: [`${MUTATION_KEY.EMPLOYEE.READ}s`],
        mutationFn: async (password: string) => {
            console.log(password)
            try {
                const employees = await inventoryDb.select().from(employeeTable)
                const totalEmp = employees.length
                if (totalEmp < 1) return true

                const [edp] = await inventoryDb.select().from(employeeTable).where(eq(employeeTable.employeeTitle, 'EDP'))
                if (!edp) {
                    showError('Not allow to create employee!')
                    return false
                }

                if (totalEmp > 0 && edp && !password) {
                    showError('Please enter password!')
                    return false
                }

                const isPwMatch = await bcrypt.compare(password, edp.password)
                if (!isPwMatch) {
                    showError('Invalid Password!')

                    return false
                }

                return true
            } catch (error) {
                console.log({ error })
                showError('failed')
            }
        }
    })
}

export const useEmployeesGetMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.EMPLOYEE.READ],
        mutationFn: async () => {
            try {
                const employees = await inventoryDb.select().from(employeeTable)
                return employees.map(({ password, ...emp }) => ({ emp, onPress: saveFile }))
            } catch (error) {
                console.log('Failed to get employees')
                showError('Failed to get employees')
            }
        }
    })
}

export const useEmployeesGetQuery = () => {
    return useQuery({
        queryKey: [MUTATION_KEY.EMPLOYEE.READ],
        queryFn: async () => {
            try {
                const employees = await inventoryDb.select().from(employeeTable)
                return employees.map(({ password, ...emp }) => ({ emp, onPress: saveFile }))
            } catch (error) {
                console.log('Failed to get employees', error)
                showError('Failed to get employees')
                return null
            }
        }
    })
}
