import { View } from 'react-native'
import React, { useRef } from 'react'
import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form'
import InputField from '../shared/input-field'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from '../ui/select'
import { useLocalSearchParams } from 'expo-router'
import { ItemDetails } from '../shared/item-details'
import { useGetItemByBarcode } from '@/hooks/tanstack/mutation/item/get-item'
import { useAlertModal, useAlertModalAction } from '@/hooks/redux/use-alert-modal'
import { useModal, useModalAction } from '@/hooks/redux/use-modal'
import { MODAL_TYPE } from '@/constants'
import Modal from '../shared/modal'
import { Text } from '../ui/text'
import { Button } from '../ui/button'

export const expiryScanFormSchema = z.object({
    barcode: z.string().trim().nonempty(),
    expireIn: z.string().trim().nonempty().min(6, { error: 'Minimum 6 characters long!' }).max(10, { error: 'Maximum 10 characters long!' }),
    remindBefore: z.string().trim().nonempty(),
    shelfNo: z.string().trim().nonempty(),
})

export type ExpireScanFormValue = z.infer<typeof expiryScanFormSchema>

export const ExpiryScanForm = () => {

    const { empId } = useLocalSearchParams()
    const [triggerWidth, setTriggerWidth] = React.useState(0);
    const barcodeRef = useRef<any>(null)
    const expireInRef = useRef<any>(null)
    const remindBeforeRef = useRef<any>(null)
    const shelfNoRef = useRef<any>(null)

    const { isOpen, type } = useModal()
    const { onClose, onOpen } = useModalAction()

    const isShelfNoCreateModal = isOpen && type === MODAL_TYPE.SHELF_NO.CREATE
    const isRemindBeforeCreateModal = isOpen && type === MODAL_TYPE.REMIND_BEFORE.CREATE

    const title = isShelfNoCreateModal ? 'Create Shelf No Form' : isRemindBeforeCreateModal ? "Create Remind Before Form" : ""
    const description = 'Fill the following fields'


    const { mutate: getItem, data: item } = useGetItemByBarcode()



    const form = useForm<ExpireScanFormValue>({
        defaultValues: {
            barcode: "",
            expireIn: "",
            remindBefore: "",
            shelfNo: ""
        },
        resolver: zodResolver(expiryScanFormSchema),
        shouldFocusError: false,
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    })




    return (
        <View>

            <Modal
                isWithoutHeader={false}
                title={title}
                description={description}
                onOpenChange={onClose}
                open={isRemindBeforeCreateModal || isShelfNoCreateModal}
            >
                <View>
                    <ShelfNoForm empId={empId} />
                </View>
            </Modal>


            <Form
                {...form}
            >
                <View className="gap-2">

                    {/* REMIND_BEFORE & SHELF_NO FIELD */}
                    <View className='flex-row items-center justify-between gap-2'>

                        {/* SHELF_NO FIELD */}
                        <View className="flex-row flex-1 items-center">
                            <FormField
                                control={form.control}
                                name='shelfNo'
                                render={({ field }) => (
                                    <View className='flex-1'>
                                        <FormItem >
                                            <FormControl>
                                                <Select
                                                    onValueChange={(option) => {
                                                        field.onChange(option?.value);
                                                    }}
                                                    value={
                                                        field.value ? {
                                                            value: field.value,
                                                            label: field.value
                                                        } : undefined
                                                    }
                                                    ref={shelfNoRef}
                                                >
                                                    <SelectTrigger
                                                        onLayout={(e) =>
                                                            setTriggerWidth(e.nativeEvent.layout.width)
                                                        }
                                                        className='rounded-r-none'
                                                    >
                                                        <SelectValue placeholder="Shelf No" />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        style={{ width: triggerWidth }}
                                                        className="mt-2">
                                                        <SelectGroup >
                                                            <SelectLabel>Shelf No</SelectLabel>
                                                            <SelectSeparator />

                                                            <SelectItem
                                                                value="B1"
                                                                label="B1"
                                                                onLongPress={() => onOpen(MODAL_TYPE.SHELF_NO.UPDATE)}
                                                            />
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    </View>
                                )}
                            />
                            <View>
                                <Button
                                    variant={'outline'}
                                    className='rounded-l-none'
                                    onPress={() => onOpen(MODAL_TYPE.SHELF_NO.CREATE)}
                                >
                                    <Text>+</Text>

                                </Button>
                            </View>
                        </View>

                        {/* REMIND_BEFORE FIELD */}
                        <View className="flex-row flex-1 items-center">
                            <FormField
                                control={form.control}
                                name='remindBefore'
                                render={({ field }) => (
                                    <View className='flex-1'>
                                        <FormItem>
                                            <FormControl>
                                                <Select
                                                    onValueChange={(option) => {
                                                        field.onChange(option?.value);
                                                    }}
                                                    value={
                                                        field.value ? {
                                                            value: field.value,
                                                            label: field.value
                                                        } : undefined
                                                    }
                                                    ref={remindBeforeRef}
                                                >
                                                    <SelectTrigger
                                                        onLayout={(e) =>
                                                            setTriggerWidth(e.nativeEvent.layout.width)
                                                        }
                                                        className='rounded-r-none'
                                                    >
                                                        <SelectValue placeholder="Pull out before" />
                                                    </SelectTrigger>
                                                    <SelectContent
                                                        style={{ width: triggerWidth }}
                                                        className="mt-2">
                                                        <SelectGroup className="">
                                                            <SelectLabel >Days</SelectLabel>
                                                            <SelectSeparator />

                                                            <SelectItem
                                                                value="10"
                                                                label="10 Days"
                                                            />
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>

                                    </View>
                                )}
                            />
                            <View>
                                <Button
                                    variant={'outline'}
                                    className='rounded-l-none'
                                    onPress={() => {
                                        onOpen(MODAL_TYPE.REMIND_BEFORE.CREATE)
                                        console.log(title)

                                    }}
                                >
                                    <Text>+</Text>

                                </Button>
                            </View>
                        </View>

                    </View>

                    {/* BARCODE FIELD */}
                    <FormField
                        control={form.control}
                        name='barcode'
                        render={({ field }) => (
                            <InputField
                                {...field}
                                placeholder='Barcode'
                                returnKeyType='next'
                                onChangeText={field.onChange}
                                value={field.value}
                                ref={barcodeRef}
                            />
                        )}
                    />




                    {/* EXPIRE_IN FIELD */}
                    <FormField
                        control={form.control}
                        name='expireIn'
                        render={({ field }) => (
                            <InputField
                                {...field}
                                placeholder='e.g. 10.10.26'
                                returnKeyType='next'
                                onChangeText={field.onChange}
                                value={field.value}
                                ref={expireInRef}
                            />
                        )}
                    />


                </View>
            </Form >

            {/* Item Details */}

            {(item?.data?.item) && <ItemDetails
                item={item?.data?.item}
                title='Item Details'
                description='Item scanned for expiry monitoring!'
            />}
        </View>
    )
}

export const shelfNoCreateFormSchema = z.object({
    shelfNo: z.string().trim().min(2, { error: "Must be 2 characters long" }).nonempty({ error: 'Shelf No is required' }),
    empPassword: z.string().nonempty({ error: 'Password is required' })
})

export type ShelfNoCreateFormValue = z.infer<typeof shelfNoCreateFormSchema>

export const ShelfNoForm = ({ empId }: { empId: string | string[] }) => {

    const { onClose } = useModalAction()
    const form = useForm<ShelfNoCreateFormValue>({
        defaultValues: {
            shelfNo: "",
            empPassword: ""
        },
        resolver: zodResolver(shelfNoCreateFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: false
    })

    const onSubmit = form.handleSubmit(values => {
        console.log({ values })
        form.reset()
        onClose()
    })

    return (
        <Form
            {...form}
        >
            <View className="gap-1">
                {/* BARCODE FIELD */}
                <FormField
                    control={form.control}
                    name='shelfNo'
                    render={({ field }) => (
                        <InputField
                            {...field}
                            placeholder='e.g. B1,B2,A1'
                            returnKeyType='next'
                            onChangeText={field.onChange}
                            value={field.value}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name='empPassword'
                    render={({ field }) => (
                        <InputField
                            {...field}
                            placeholder='Employee Password'
                            returnKeyType='next'
                            onChangeText={field.onChange}
                            onSubmitEditing={onSubmit}
                            value={field.value}
                        />
                    )}
                />
            </View>
        </Form >
    )
}
