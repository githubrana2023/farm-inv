import { View } from 'react-native'
import { Form, FormField } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Text } from '../ui/text'
import InputField from '../shared/input-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { employeeChangePasswordFormSchema, EmployeeChangePasswordFormValue } from '@/lib/zod/employee-form-schema'

type ChangePasswordFormProp = {
    employeeId: string,
}
const ChangePasswordForm = ({ employeeId }: ChangePasswordFormProp) => {


    const form = useForm<EmployeeChangePasswordFormValue>({
        defaultValues: {
            oldPassword: "",
            newPassword: ""
        },
        resolver: zodResolver(employeeChangePasswordFormSchema),
        shouldFocusError: false,
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    })


    const onSubmitHandler = form.handleSubmit(values => {
        console.log({ employeeId })
    })




    return (
        <Form {...form}>
            <View className='gap-2'>
                <FormField
                    control={form.control}
                    name='oldPassword'
                    render={({ field }) => (
                        <InputField
                            label='Old Password'
                            placeholder="******"
                            secureTextEntry
                            returnKeyType="next"
                            onChangeText={field.onChange}
                            value={field.value}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name='newPassword'
                    render={({ field }) => (
                        <InputField
                            label='New Password'
                            placeholder="******"
                            secureTextEntry
                            returnKeyType="next"
                            onChangeText={field.onChange}
                            value={field.value}
                        />
                    )}
                />
                <Button onPress={onSubmitHandler}>
                    <Text>
                        Change Password
                    </Text>
                </Button>
            </View>
        </Form>
    )
}

export default ChangePasswordForm