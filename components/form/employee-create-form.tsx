import { View } from 'react-native'
import React from 'react'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { Text } from '../ui/text'
import InputField from '../shared/input-field'
import { employeeCreateFormSchema, EmployeeCreateFormValue } from '@/lib/zod/employee-form-schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { KeyboardAwareScrollView, KeyboardToolbar } from 'react-native-keyboard-controller'
import { useEmployeeCreateMutation } from '@/hooks/tanstack/mutation/employee'
import { showSuccess } from '@/lib/toast/success'
import { queryClient } from '../provider/tanstack-query-client'
import { MUTATION_KEY } from '@/constants/tanstack-query'
import { useModalAction } from '@/hooks/redux/use-modal'

const EmployeeCreateForm = () => {

    const { mutate: createEmployee, isPending, } = useEmployeeCreateMutation()
    const { onClose } = useModalAction()

    const form = useForm<EmployeeCreateFormValue>({
        defaultValues: {
            employeeTitle: "",
            employeeId: "",
            name: ""
        },
        resolver: zodResolver(employeeCreateFormSchema)
    })


    const onSubmitHandler = form.handleSubmit(values => {
        createEmployee(values, {
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: [MUTATION_KEY.EMPLOYEE.READ] })
                // form.reset()
                // onClose()
            }
        })

    })




    return (
        <>
            <Form {...form}>

                <View className='gap-2 w-72'>
                    <View className="gap-1 items-center justify-between flex-row">
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
                                    className='min-w-36 max-w-36'
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <InputField
                                    label='Name'
                                    placeholder="e.g. John"
                                    returnKeyType="next"
                                    onChangeText={field.onChange}
                                    value={field.value}
                                    className='min-w-36 max-w-36'
                                />
                            )}
                        />
                    </View>
                    <FormField
                        control={form.control}
                        name='employeeTitle'
                        render={({ field }) => (
                            <InputField
                                label='Employee Title'
                                placeholder="e.g. I.T"
                                returnKeyType="next"
                                onChangeText={field.onChange}
                                value={field.value}
                            />
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <InputField
                                label='Password'
                                placeholder="******"
                                secureTextEntry
                                returnKeyType="next"
                                onChangeText={field.onChange}
                                value={field.value}
                            />
                        )}
                    />
                    <Button onPress={onSubmitHandler} disabled={isPending}>
                        <Text>
                            {isPending ? 'Creating Employee...' : 'Create Employee'}
                        </Text>
                    </Button>
                </View>
            </Form>
        </>
    )
}

export default EmployeeCreateForm