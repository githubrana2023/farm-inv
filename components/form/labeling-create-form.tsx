import { View } from 'react-native'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Text } from '../ui/text'
import InputField from '../shared/input-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { queryClient } from '../provider/tanstack-query-client'
import { MUTATION_KEY } from '@/constants/tanstack-query'
import { useModalAction } from '@/hooks/redux/use-modal'
import { labelingCreateFormSchema, LabelingCreateFormValue } from '@/lib/zod/labeling-form-schema'
import { useLabelingCreateMutation } from '@/hooks/tanstack/mutation/labeling'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select'
import { Label } from '../ui/label'
import { SAVE_FLAG } from '@/constants'
import { invalidateLabelingGetQuery } from '@/lib/tanstack-query/labeling'

const LabelingCreateForm = () => {
    const { mutate: createLabeling } = useLabelingCreateMutation()
    const { onClose } = useModalAction()

    const form = useForm<LabelingCreateFormValue>({
        defaultValues: {
            label: "",
            password: ""
        },
        resolver: zodResolver(labelingCreateFormSchema)
    })


    const onSubmitHandler = form.handleSubmit(values => {
        createLabeling(values, {
            onSuccess() {
                invalidateLabelingGetQuery()
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
                            name='label'
                            render={({ field }) => (
                                <InputField
                                    label='Label'
                                    placeholder="e.g. 45168"
                                    returnKeyType="next"
                                    onChangeText={field.onChange}
                                    value={String(field.value)}
                                    className='min-w-36 max-w-36'
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='saveFlag'
                            render={({ field }) => (
                                <FormItem className='min-w-36 max-w-36'>
                                    <Label>Save Flag</Label>
                                    <FormControl>
                                        <Select
                                            // onValueChange={field.onChange}
                                            onValueChange={(option) => {
                                                field.onChange(option?.value);
                                            }}
                                            value={{
                                                label: field.value,
                                                value: field.value
                                            }}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a label" />
                                            </SelectTrigger>
                                            <SelectContent className='min-w-36 max-w-36'>
                                                <SelectGroup>
                                                    <SelectLabel>Labels</SelectLabel>
                                                    {
                                                        SAVE_FLAG.map(flag => (
                                                            <SelectItem
                                                                key={flag}
                                                                value={flag}
                                                                label={flag}
                                                            />
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </View>
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
                    <Button onPress={onSubmitHandler}>
                        <Text>
                            Create Labeling
                        </Text>
                    </Button>
                </View>
            </Form>
        </>
    )
}

export default LabelingCreateForm