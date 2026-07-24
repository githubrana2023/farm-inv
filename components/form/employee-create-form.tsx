import { View } from 'react-native'
import React, { useRef } from 'react'
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
import { showDynamicToast } from '@/lib/toast/dynamic'

type InputLabel = 'employee_name' | 'employee_title' | 'edp_employee_password'

const EmployeeCreateForm = () => {
    const employeeNameRef = useRef<any>(null)
    const employeeTitleRef = useRef<any>(null)
    const edpPasswordRef = useRef<any>(null)
    const { mutate: createEmployee, isPending, } = useEmployeeCreateMutation()
    const { onClose } = useModalAction()

    const form = useForm<EmployeeCreateFormValue>({
        defaultValues: {
            employeeTitle: "",
            employeeId: "",
            name: ""
        },
        resolver: zodResolver(employeeCreateFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: false
    })


    const onSubmitHandler = form.handleSubmit(values => {
        createEmployee(values, {
            async onSuccess({ data, success, message }) {
                showDynamicToast(success, message)
                await queryClient.invalidateQueries({ queryKey: [MUTATION_KEY.EMPLOYEE.READ] })
                // form.reset()
                // onClose()
            }
        })

    })

    const onSubmitEditingHandler = (inputLabel: InputLabel) => {
        const onFocus: Record<InputLabel, () => void> = {
            edp_employee_password: edpPasswordRef?.current?.focus,
            employee_name: employeeNameRef?.current?.focus,
            employee_title: employeeTitleRef?.current?.focus,
        }
        onFocus[inputLabel]?.()
    }



    return (
        <>
            <Form {...form}>

                <View className='gap-2 w-72'>
                    <View className="gap-1 items-center justify-between flex-row">
                        <View className="flex-1">
                            <FormField
                                control={form.control}
                                name='employeeId'
                                render={({ field }) => (
                                    <InputField
                                        autoFocus
                                        onSubmitEditing={() => employeeNameRef?.current?.focus()}
                                        label='Employee ID'
                                        placeholder="e.g. 45168"
                                        keyboardType='numeric'
                                        returnKeyType="next"
                                        onChangeText={field.onChange}
                                        value={String(field.value)}
                                    />
                                )}
                            />
                        </View>
                        <View className="flex-1">
                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <InputField
                                        ref={employeeNameRef}
                                        onSubmitEditing={() => employeeTitleRef?.current?.focus()}
                                        label='Name'
                                        placeholder="e.g. John"
                                        returnKeyType="next"
                                        onChangeText={field.onChange}
                                        value={field.value}
                                    />
                                )}
                            />
                        </View>
                    </View>
                    <FormField
                        control={form.control}
                        name='employeeTitle'
                        render={({ field }) => (
                            <InputField
                                ref={employeeTitleRef}
                                onSubmitEditing={() => { edpPasswordRef?.current?.focus() }}
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
                                ref={edpPasswordRef}
                                onSubmitEditing={() => { }}
                                label='EDP Password'
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