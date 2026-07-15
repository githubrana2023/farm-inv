import { View, } from 'react-native'
import React from 'react'
import { Button } from './ui/button'
import { useModalAction } from '@/hooks/redux/use-modal'
import { MODAL_TYPE } from '@/constants'
import { Text } from './ui/text'
import { Form, FormField } from './ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import InputField from './shared/input-field'
import { inventoryDb } from '@/drizzle/db/inventory-db'
import { employeeTable } from '@/drizzle/schema/inventory'
import { useEmployeeGetMutation } from '@/hooks/tanstack/mutation/employee'

const EmployeeSettings = () => {
    const { onOpen } = useModalAction()
    const { mutate, data } = useEmployeeGetMutation()
    const form = useForm<{ password: string }>({
        defaultValues: { password: '' },
        resolver: zodResolver(z.object({ password: z.string() }))
    })

    const onSubmitHandler = form.handleSubmit((value) => {

        mutate(value.password, {
            onSuccess(isAllow) {
                isAllow && onOpen('EMPLOYEE_CREATE_MODAL')
            }
        })


    })



    return (
        <View>
            <Form {...form}>
                <View className="gap-2">
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <InputField
                                label='Password'
                                placeholder='*******'
                                onChangeText={field.onChange}
                                value={field.value}
                                secureTextEntry={true}
                            />
                        )}
                    />
                    <Button onPress={onSubmitHandler}>
                        {/* <Button onPress={() => onOpen(MODAL_TYPE.EMPLOYEE_CREATE_MODAL)}> */}

                        <Text>Add New Employee</Text>
                    </Button>
                </View>
            </Form>

            <Button onPress={async () => {
                await inventoryDb.delete(employeeTable)
            }}>
                <Text>Delete Emp</Text>
            </Button>


        </View>
    )
}

export default EmployeeSettings