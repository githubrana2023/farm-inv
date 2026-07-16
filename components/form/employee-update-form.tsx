import { View } from 'react-native'
import { Form, FormField } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Text } from '../ui/text'
import InputField from '../shared/input-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { employeeUpdateFormSchema, EmployeeUpdateFormValue } from '@/lib/zod/employee-form-schema'

type EmployeeUpdateFormProp = {
    employee: {
        employeeTitle: string,
        employeeId: string,
        name: string,
    }
}
const EmployeeUpdateForm = ({ employee }: EmployeeUpdateFormProp) => {


    const form = useForm<EmployeeUpdateFormValue>({
        defaultValues: {
            ...employee,
            edpPassword: ""
        },
        resolver: zodResolver(employeeUpdateFormSchema)
    })


    const onSubmitHandler = form.handleSubmit(values => {

    })




    return (
        <>
            <Form {...form}>

                <View className='gap-2'>
                    <View className="gap-1 items-center justify-between flex-row">
                        <View className="flex-1">
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
                        </View>
                        <View className="flex-1">
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
                                        className='w-full'
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
                        name='edpPassword'
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
                    <Button onPress={onSubmitHandler}>
                        <Text>
                            Update Employee
                        </Text>
                    </Button>
                </View>
            </Form>
        </>
    )
}

export default EmployeeUpdateForm