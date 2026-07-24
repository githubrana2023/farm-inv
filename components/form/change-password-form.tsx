import { View } from 'react-native'
import { Form, FormField } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Text } from '../ui/text'
import InputField from '../shared/input-field'
import { zodResolver } from '@hookform/resolvers/zod'
// import { employeeUpdateFormSchema, ChangePasswordFormValue } from '@/lib/zod/employee-form-schema'

type ChangePasswordFormProp = {
    employeeId: string,
}
const ChangePasswordForm = ({ employeeId }: ChangePasswordFormProp) => {


    const form = useForm({
        defaultValues: {
            employeeId,
            oldPassword: "",
            newPassword: ""
        },
        // resolver: zodResolver(employeeUpdateFormSchema),
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
                    name='employeeId'
                    render={({ field }) => (
                        <InputField
                            label='Employee ID'
                            placeholder="e.g. 45168"
                            keyboardType='numeric'
                            returnKeyType="next"
                            onChangeText={field.onChange}
                            value={String(field.value)}
                        />
                    )}
                />
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