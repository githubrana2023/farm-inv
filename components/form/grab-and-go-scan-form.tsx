import { useForm, useWatch } from "react-hook-form"
import { Form, FormField } from "../ui/form"
import { View } from "react-native"
import InputField from "../shared/input-field"
import { useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { grabAndGoCreateFormSchema, TGrabAndGoCreateFormValue } from "@/lib/zod/grab-and-go-form-schema"
import { Text } from "../ui/text"
import { useGrabAndGoInsert } from "@/hooks/tanstack/mutation/grab-and-go/use-insert"
import { showDynamicToast } from "@/lib/toast/dynamic"
import { invalidQueries } from "@/lib/tanstack-query/invalid-query"
import { QUERY_KEY } from "@/constants/tanstack/query"
import Lucide from "@react-native-vector-icons/lucide"
import { useGetItemByBarcode, useGetItemDetailsByBarcode } from "@/hooks/tanstack/mutation/item/get-item"
import { showError } from "@/lib/toast/error"
import { LoadingState } from "../shared/loading-state"
import { useGetGrabAndGoFiftyPercentBarcode } from "@/hooks/tanstack/mutation/grab-and-go/use-get"
import { NoSearchResults } from "../shared/no-result-found"
import { DetailsRow } from "../shared/details-row"
import { Button } from "../ui/button"
import { GrabAndGoItemCard, GrabAndGoItemList } from "../grab-and-go-list"


export const GrabAndGoForm = () => {
    const barcodeRef = useRef<any>(null)
    const quantityRef = useRef<any>(null)

    const {
        mutate: insertGrabAndGo,
        reset: resetGrabAndGoInsertMutation,
        isPending: isInsertGrabAndGoPending,
    } = useGrabAndGoInsert()
    const {
        mutate: getGrabAndGoItemDetailsByBarcode,
        data: itemDetails,
        isPending: isItemDetailsPending,
        reset: resetItemDetailsGetMutation,
    } = useGetGrabAndGoFiftyPercentBarcode()

    const form = useForm<TGrabAndGoCreateFormValue>({
        defaultValues: {
            barcode: "",
            quantity: "",
        },
        resolver: zodResolver(grabAndGoCreateFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: false
    })

    const barcode = form.watch('barcode')

    const onSubmitEditing = () => {
        const barcode = form.getValues('barcode')
        getGrabAndGoItemDetailsByBarcode(barcode, {
            onSuccess({ success, message }) {
                if (!success) {
                    showError(message)
                    return
                }
                quantityRef.current?.focus()
            },
        })
    }


    const onSubmit = form.handleSubmit((values) => {

        insertGrabAndGo(values, {
            async onSuccess({ success, message }) {
                showDynamicToast(success, message)
                if (success) {
                    barcodeRef?.current?.focus()
                    form.reset()
                    resetItemDetailsGetMutation()
                    await invalidQueries([QUERY_KEY.GRAB_AND_GO.READ])
                }
            },
        })

    })


    return (

        <View>
            <Form {...form}>
                <View className="gap-1 py-1.5">
                    {/* BARCODE FIELD START*/}
                    <FormField
                        control={form.control}
                        name="barcode"
                        render={({ field }) => {
                            return (
                                <View className="relative">
                                    <InputField
                                        // autoFocus
                                        ref={barcodeRef}
                                        placeholder="Barcode"
                                        returnKeyType="go"
                                        keyboardType="number-pad"
                                        value={field.value}
                                        onChangeText={text => {
                                            field.onChange(text)
                                            if (text.length === 0) {
                                                resetItemDetailsGetMutation()
                                            }
                                        }}
                                        onSubmitEditing={onSubmitEditing}
                                    />
                                    {
                                        (field?.value?.length > 0) && (
                                            <View className="absolute right-3 top-1/2 -translate-y-1/2">
                                                <Lucide
                                                    name="x-circle"
                                                    size={22}
                                                    color={'gray'}
                                                    onPress={() => {
                                                        form.reset()
                                                        resetItemDetailsGetMutation()
                                                    }} />
                                            </View>
                                        )
                                    }
                                </View>
                            )
                        }}
                    />
                    {/* BARCODE FIELD END*/}


                    {/* QUANTITY & EXPIRY FIELD START*/}
                    <FormField
                        control={form.control}
                        name="quantity"
                        render={({ field }) => {
                            return (
                                <InputField
                                    ref={quantityRef}
                                    placeholder="Quantity"
                                    returnKeyType="next"
                                    keyboardType="number-pad"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onSubmitEditing={onSubmit}
                                />
                            )
                        }}
                    />
                    {/* HAS IMPORTED LABEL FIELD END*/}
                </View>
            </Form>
            <View >
                {/* <GrabAndGoItemList /> */}
                {
                    isItemDetailsPending && (
                        <View className="items-center justify-center">
                            <LoadingState title="Fetching Item" description="Loading item details" />
                        </View>
                    )
                }
                {
                    (!itemDetails?.data && barcode.length > 0) && <View>
                        <NoSearchResults query={barcode} />
                    </View>
                }
                {
                    (!itemDetails?.data && barcode.length < 1) &&
                    <View className="pb-24">
                        <GrabAndGoItemList />
                    </View>
                }
                {
                    (itemDetails?.data && itemDetails?.data) && (
                        <View className="gap-1 p-1 border border-dotted rounded-md"
                            style={{
                                boxShadow: '0px 6px 20px rgba(0,0,0,0.2)'
                            }}
                        >
                            <DetailsRow
                                library="Lucide"
                                iconName="barcode"
                                label="Barcode"
                                value={itemDetails.data.barcode}
                            />
                            <DetailsRow
                                library="Lucide"
                                iconName="hash"
                                label="ItemCode"
                                value={itemDetails.data.item_number}
                            />
                            <DetailsRow
                                library="Lucide"
                                iconName="file-text"
                                label="description"
                                value={itemDetails.data.description}
                            />
                        </View>
                    )
                }
            </View>
        </View >
    )
}



