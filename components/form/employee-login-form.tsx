import { employeeLoginFormSchema, EmployeeLoginFormValue } from "@/lib/zod/employee-login-form-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "expo-router"
import { useForm } from "react-hook-form"
import { Form, FormField } from "../ui/form"
import InputField from "../shared/input-field"
import { useEmployeeLogin } from "@/hooks/tanstack/mutation/employee"
import { showDynamicToast } from "@/lib/toast/dynamic"
import { Text } from "../ui/text"
import { Pressable, View } from "react-native"
import Lucide from "@react-native-vector-icons/lucide"

export const EmployeeLoginForm = ({ employeeId, onSubmitCallback }: { employeeId: string; onSubmitCallback: () => void }) => {
    const router = useRouter()
    const { mutateAsync: loginEmployee, isPending } = useEmployeeLogin()

    const form = useForm<EmployeeLoginFormValue>({
        defaultValues: {
            password: ""
        },
        resolver: zodResolver(employeeLoginFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: false
    })

    const onSubmit = form.handleSubmit(async (values) => {
        await loginEmployee(
            { ...values, empId: employeeId },
            {
                async onSuccess({ data, success, message }) {
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
                        <View className="flex-row items-center justify-between gap-2">
                            {
                                isPending ? (
                                    <View>
                                        <Text>Processing...</Text>
                                    </View>
                                ) : (
                                    <View className="flex-1">
                                        <InputField
                                            {...field}
                                            autoFocus
                                            value={field.value}
                                            placeholder="Employee Password"
                                            returnKeyType="go"
                                            onSubmitEditing={onSubmit}
                                            onChangeText={field.onChange}
                                            onBlur={() => {
                                                if (field.value?.length < 1) {
                                                    onSubmitCallback()
                                                }
                                            }}
                                        />
                                    </View>
                                )
                            }

                            <Pressable
                                className='active:bg-muted-foreground/20 rounded-full border border-muted bg-muted '
                                onPress={onSubmit}
                            >
                                <View className="items-center justify-center p-3">
                                    <Lucide
                                        name='arrow-right'
                                        size={20}
                                    />
                                </View>
                            </Pressable>
                        </View>
                    )
                }}
            />
        </Form>
    )
}