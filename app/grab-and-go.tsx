import { View, } from 'react-native'
import React from 'react'
import ReusableTab from '@/components/shared/tab'
import { GrabAndGoForm } from '@/components/form/grab-and-go-scan-form'
import { Text } from '@/components/ui/text'
import Container from '@/components/shared/container'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { useForm } from 'react-hook-form'
import { Form, FormField } from '@/components/ui/form'
import InputField from '@/components/shared/input-field'
import { zodResolver } from '@hookform/resolvers/zod'
import { useGrabAndGoDeleteItemsMutation } from '@/hooks/tanstack/mutation/grab-and-go/use-delete'
import { grabAndGoDeleteItemsFormSchema, GrabAndGoDeleteItemsFormValue } from '@/lib/zod/grab-and-go-form-schema'
import { Trash } from 'lucide-react-native'
import { showDynamicToast } from '@/lib/toast/dynamic'
import { invalidQueries } from '@/lib/tanstack-query/invalid-query'
import { QUERY_KEY } from '@/constants/tanstack/query'

const GrabAndGo = () => {
    return (
        <Container>
            <ReusableTab
                tabLabels={[
                    {
                        label: 'Gran & Go'
                    },
                    {
                        label: 'Settings'
                    },
                ]}
                tabContent={{
                    "Gran & Go": <GrabAndGoForm />,
                    Settings: <GrabAndGoSettings />
                }}
            />
        </Container>
    )
}

export default GrabAndGo

const GrabAndGoSettings = () => {

    const { mutate: clearGrabAndGoMutation, isPending } = useGrabAndGoDeleteItemsMutation()
    const form = useForm<GrabAndGoDeleteItemsFormValue>({
        resolver: zodResolver(grabAndGoDeleteItemsFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: false
    })


    const onSubmit = form.handleSubmit(value => {
        clearGrabAndGoMutation(value, {
            async onSuccess({ success, message }) {
                showDynamicToast(success, message)
                if (success) {
                    form.reset()
                    await invalidQueries([QUERY_KEY.GRAB_AND_GO.READ])
                }
            },
        })

    })

    return (
        <View >
            <Text className='text-center font-semibold'>Grab & Go Settings</Text>
            <View>
                <Form
                    {...form}
                >
                    <View className='gap-2'>
                        <FormField
                            control={form.control}
                            name='confirmation'
                            render={({ field }) => {
                                return (
                                    <InputField
                                        {...field}
                                        placeholder={`Write 'Confirm'`}
                                        label='Clear Grab & Go Confirmation'
                                        autoFocus
                                        onChangeText={field.onChange}
                                        value={field.value}
                                    />
                                )
                            }}
                        />
                        <Button
                            variant={'destructive'}
                            onPress={onSubmit}
                        >
                            <Icon
                                as={Trash}
                            />
                            <Text>Clear Grab & Go</Text>
                        </Button>
                    </View>
                </Form>

            </View>
        </View>
    )
}
