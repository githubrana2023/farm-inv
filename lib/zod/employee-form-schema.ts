import z from "zod";

export const employeeCreateFormSchema = z.object({
    name: z.string().nonempty({ error: "Name is required!" }).min(3, { error: 'Name at least 3 characters long! ' }),
    employeeId: z.string().nonempty({ error: "Employee ID is required!" }).min(5, { error: 'Employee ID at least 5 digits long! ' }),
    employeeTitle: z.string().nonempty({ error: "Employee title is required!" }).min(3, { error: 'Employee title at least 3 characters long! ' }),
    password: z.string(),
})

export const employeeUpdateFormSchema = z.object({
    name: z.string().nonempty({ error: "Name is required!" }).min(3, { error: 'Name at least 3 characters long! ' }),
    employeeId: z.string().nonempty({ error: "Employee ID is required!" }).min(5, { error: 'Employee ID at least 5 digits long! ' }),
    employeeTitle: z.string().nonempty({ error: "Employee title is required!" }).min(3, { error: 'Employee title at least 3 characters long! ' }),
    edpPassword: z.string().nonempty(),
})

export const employeeChangePasswordFormSchema = z.object({
    oldPassword: z.string().nonempty(),
    newPassword: z.string().nonempty(),
})

export type EmployeeChangePasswordFormValue = z.infer<typeof employeeChangePasswordFormSchema>
export type EmployeeUpdateFormValue = z.infer<typeof employeeUpdateFormSchema>
export type EmployeeCreateFormValue = z.infer<typeof employeeCreateFormSchema>