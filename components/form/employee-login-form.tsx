import { employeeLoginFormSchema, EmployeeLoginFormValue } from "@/lib/zod/employee-login-form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useForm } from "react-hook-form"
import { Form, FormField } from "../ui/form"
import InputField from "../shared/input-field"
import { useEmployeeLogin } from "@/hooks/tanstack/mutation/employee"
import { showDynamicToast } from "@/lib/toast/dynamic"

export const EmployeeLoginForm = ({ employeeId, onSubmitCallback }: { employeeId: string; onSubmitCallback: () => void }) => {
    const router = useRouter()
    const { mutate: loginEmployee } = useEmployeeLogin()

    const form = useForm<EmployeeLoginFormValue>({
        defaultValues: {
            password: ""
        },
        resolver: zodResolver(employeeLoginFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: false
    })

    const onSubmit = form.handleSubmit(values => {
        console.log({ values })
        loginEmployee(
            { ...values, empId: employeeId },
            {
                onSuccess({ data, success, message }) {
                    showDynamicToast(success, message)
                    if (success) {
                        onSubmitCallback()
                        form.reset()
                        router.push({
                            pathname: '/employee/[empId]',
                            params: { empId: employeeId }
                        })
                    }
                }
            }
        )

    })

    return (
        <Form {...form}>
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => {

                    return (
                        <InputField
                            {...field}
                            autoFocus
                            value={field.value}
                            placeholder="Employee Password"
                            onSubmitEditing={onSubmit}
                            onChangeText={field.onChange}
                        />
                    )
                }}
            />
        </Form>
    )
}