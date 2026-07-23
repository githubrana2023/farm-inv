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
import { useGetItemByBarcode, useGetItemDetailsByBarcode } from '@/hooks/tanstack/mutation/item/get-item'
import { useAlertModal, useAlertModalAction } from '@/hooks/redux/use-alert-modal'
import { useModal, useModalAction } from '@/hooks/redux/use-modal'
import { MODAL_TYPE } from '@/constants'
import Modal from '../shared/modal'
import { Text } from '../ui/text'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { ExpireScanFormValue, expiryScanFormSchema } from '@/lib/zod/expiry-monitor-form-schema'
import { useExpiryMonitorInsert } from '@/hooks/tanstack/mutation/expiry-monitor/insert'


export const ExpiryScanForm = () => {

    const { empId } = useLocalSearchParams()

    const stringEmpId = Array.isArray(empId) ? empId[0] : empId

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


    const { mutate: getItemDetails, data: item, reset: resetGetItemMutation } = useGetItemDetailsByBarcode()
    const { mutate: insertExpiry } = useExpiryMonitorInsert()


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




    const onSubmit = form.handleSubmit((values) => {
        insertExpiry(
            { ...values, empId: stringEmpId },
            {
                onSuccess({ data, success, message }) {
                    if (success) {
                        form.reset({
                            barcode: "",
                            remindBefore: "",
                            shelfNo: ""
                        })
                        resetGetItemMutation()
                    }
                }
            }
        )
    })


    const onBarcodeSubmit = () => {
        const barcode = form.getValues('barcode')
        getItemDetails(barcode, {
            onSuccess({ data, success, message }) {
                if (success) {
                    expireInRef?.current?.focus()
                    return
                }
            }
        })
    }


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
                    {isShelfNoCreateModal && <ShelfNoForm empId={empId} />}
                    {isRemindBeforeCreateModal && <RemindBeforeForm empId={empId} />}
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
                                render={({ field, }) => {
                                    return (
                                        <View className='flex-1'>
                                            <FormItem >
                                                <FormControl>
                                                    <Select
                                                        key={String(field.value)}
                                                        onValueChange={(option) => {
                                                            field.onChange(option?.value);
                                                        }}
                                                        value={field.value === "" ? undefined : {
                                                            value: field.value,
                                                            label: field.value
                                                        }}

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
                                                                    label="B1 id"
                                                                    value="B1"
                                                                    onLongPress={() => onOpen(MODAL_TYPE.SHELF_NO.UPDATE)}
                                                                />
                                                                <SelectItem
                                                                    value="B2"
                                                                    label="B2 hello"
                                                                    onLongPress={() => onOpen(MODAL_TYPE.SHELF_NO.UPDATE)}
                                                                />
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        </View>
                                    )
                                }}
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
                                                    key={String(field.value)}
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
                                keyboardType='numeric'
                                onChangeText={field.onChange}
                                value={field.value}
                                onSubmitEditing={onBarcodeSubmit}
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
                                keyboardType='numeric'
                                onSubmitEditing={onSubmit}
                                ref={expireInRef}
                            />
                        )}
                    />


                </View>
            </Form >

            {/* Item Details */}

            {(item?.data) && (
                <>
                    <Separator className='my-3 ' />
                    <ItemDetails
                        item={{
                            ...item.data,
                            isDuplicated: false,
                            itemUoms: []
                        }}
                        title='Item Details'
                        description='Item scanned for expiry monitoring!'
                    />
                </>
            )}
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

export const remindBeforeCreateFormSchema = z.object({
    remindBefore: z.string().trim().min(2, { error: "Must be 2 characters long" }).nonempty({ error: 'Shelf No is required' }),
    empPassword: z.string().nonempty({ error: 'Password is required' })
})

export type RemindBeforeCreateFormValue = z.infer<typeof remindBeforeCreateFormSchema>

export const RemindBeforeForm = ({ empId }: { empId: string | string[] }) => {

    const { onClose } = useModalAction()
    const form = useForm<RemindBeforeCreateFormValue>({
        defaultValues: {
            remindBefore: "",
            empPassword: ""
        },
        resolver: zodResolver(remindBeforeCreateFormSchema),
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
                    name='remindBefore'
                    render={({ field }) => (
                        <InputField
                            {...field}
                            placeholder='e.g. 5,7,10 (days)'
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
