import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { throwableCreateFormSchema, TThrowableCreateFormValue } from "@/lib/zod/throwable-form-schema"
import { FlatList, Pressable, View } from "react-native"
import { Text } from "../ui/text"
import InputField from "../shared/input-field"
import { cn } from "@/lib/utils"
import { Label } from "../ui/label"
import { Checkbox } from "../ui/checkbox"
import { THROW_ABLE_SCAN_TYPE } from "@/constants/throwable"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePersistThrowingDiscountType } from "@/hooks/use-persist-throwing-discount-type"
import { dateRegex, DOT_SEPARATOR } from "@/constants"
import { useGetItemDetailsByBarcode } from "@/hooks/tanstack/mutation/item/get-item"
import { showError } from "@/lib/toast/error"
import { useGetThrowableItemDetailsMutation } from "@/hooks/tanstack/mutation/throwable/use-get-throwable-item-details"
import { ThrowableDetailsCard } from "../shared/throwable-details-card"
import { useInsertThrowable } from "@/hooks/tanstack/mutation/throwable/use-insert-throwable"
import { showDynamicToast } from "@/lib/toast/dynamic"
import { invalidQueries } from "@/lib/tanstack-query/invalid-query"
import { QUERY_KEY } from "@/constants/tanstack/query"
import { useGetThrowables } from "@/hooks/tanstack/query/throwable/use-get-throwables"
import ReusableTab from "../shared/tab"
import { TGroupedThrowableItem } from "@/constants/throwable/type"


export const ThrowableForm = () => {

    // HOOKS
    const barcodeRef = useRef<any>(null)
    const quantityRef = useRef<any>(null)
    const expireInRef = useRef<any>(null)

    const form = useForm<TThrowableCreateFormValue>({
        defaultValues: {
            barcode: "",
            expireIn: "",
            quantity: "",
            hasImportedLabel: false,
        },
        resolver: zodResolver(throwableCreateFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: false
    })
    const barcodeInputValue = form.watch('barcode')
    usePersistThrowingDiscountType(form)

    const { mutate: insertThrowable } = useInsertThrowable()
    const { data: throwableData } = useGetThrowables()
    const { mutate: getThrowableItemDetails, data: throwableDetails, reset: resetThrowableGetMutation } = useGetThrowableItemDetailsMutation()

    const onSubmit = form.handleSubmit(values => {
        insertThrowable(values, {
            async onSuccess({ success, message }) {
                showDynamicToast(success, message)
                if (success) {
                    barcodeRef?.current?.focus()
                    // form.reset() 
                    resetThrowableGetMutation()
                    await invalidQueries([QUERY_KEY.THROWABLE.READ])
                }
            },
        })
    })


    const onSubmitEditing = () => {
        const barcode = form.getValues('barcode')
        const hasImportedLabel = form.getValues('hasImportedLabel')
        getThrowableItemDetails(
            {
                barcode,
                hasImportedLabel
            },
            {
                async onSuccess({ success, message }) {
                    if (!success) {
                        showError(message)
                        return
                    }
                    quantityRef.current?.focus()
                },
            }
        )
    }

    const isOverStock = form.watch('type') === 'OVERSTOCK'

    return (
        <View className="flex-1">
            <Form {...form}>
                <View className="gap-1 py-1.5">
                    {/* BARCODE FIELD START*/}
                    <FormField
                        control={form.control}
                        name="barcode"
                        render={({ field }) => {
                            return (
                                <InputField
                                    // autoFocus
                                    ref={barcodeRef}
                                    placeholder="Barcode"
                                    returnKeyType="go"
                                    keyboardType="number-pad"
                                    value={field.value}
                                    onChangeText={field.onChange}
                                    onSubmitEditing={onSubmitEditing}
                                />
                            )
                        }}
                    />
                    {/* BARCODE FIELD END*/}


                    {/* QUANTITY & EXPIRY FIELD START*/}
                    <View className="flex-row gap-2">
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => {
                                return (
                                    <View className="flex-1">
                                        <InputField
                                            ref={quantityRef}
                                            placeholder="Quantity"
                                            returnKeyType="next"
                                            keyboardType="number-pad"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                            onSubmitEditing={() => { expireInRef?.current?.focus() }}
                                        />
                                    </View>
                                )
                            }}
                        />

                        <FormField
                            control={form.control}
                            name="expireIn"
                            render={({ field }) => {
                                return (
                                    <View className="flex-1">
                                        <InputField
                                            ref={expireInRef}
                                            placeholder="e.g. 1.1.2026"
                                            returnKeyType="next"
                                            keyboardType="number-pad"
                                            value={field.value}
                                            onChangeText={field.onChange}
                                            onSubmitEditing={onSubmit}
                                        />
                                    </View>
                                )
                            }}
                        />
                    </View>
                    {/* QUANTITY & EXPIRY FIELD END*/}



                    {/* SCAN TYPE FIELD START*/}
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormControl>
                                        <RadioGroup
                                            value={field.value}
                                            onValueChange={(value) => {
                                                field.onChange(value)
                                                if (value === "OVERSTOCK") {
                                                    form.setValue('hasImportedLabel', false)
                                                }
                                            }}
                                            className="flex-row gap-2"
                                        >
                                            {THROW_ABLE_SCAN_TYPE.map((type) => {
                                                const isActive = field.value === type;

                                                return (
                                                    <Pressable
                                                        onPress={() => {
                                                            field.onChange(type)
                                                            if (type === "OVERSTOCK") {
                                                                form.setValue('hasImportedLabel', false)
                                                            }
                                                        }}
                                                        key={type}
                                                        className={cn(
                                                            "flex-1 rounded",
                                                            isActive ? "dark:bg-white bg-black" : "border border-gray-100",
                                                        )}
                                                    >
                                                        <View className="flex-row items-center justify-center gap-1">
                                                            <Text
                                                                className={cn(
                                                                    "py-1 px-0 text-center font-semibold text-xs",
                                                                    isActive && "dark:text-black text-white",
                                                                )}
                                                            >
                                                                {type}
                                                            </Text>
                                                        </View>
                                                    </Pressable>
                                                );
                                            })}
                                        </RadioGroup>

                                    </FormControl>
                                </FormItem>
                            )
                        }}
                    />
                    {/* SCAN TYPE FIELD END*/}



                    {/* HAS IMPORTED LABEL FIELD START*/}
                    {
                        (!isOverStock) && (
                            <FormField
                                control={form.control}
                                name="hasImportedLabel"
                                render={({ field }) => {
                                    return (
                                        <FormItem>
                                            <FormControl>
                                                <Label
                                                    onPress={() => {
                                                        field.onChange(!field.value)
                                                    }}
                                                    className={cn(
                                                        'border border-border flex flex-row rounded-lg p-2',
                                                        field.value && "border-emerald-200 bg-emerald-100"
                                                    )}
                                                >
                                                    <View className="flex flex-1 flex-row items-start gap-3">
                                                        <Checkbox
                                                            id="toggle-2"
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                            checkedClassName="border-emerald-700 bg-emerald-700"
                                                            indicatorClassName="bg-emerald-700"
                                                            iconClassName="text-emerald-100"
                                                        />
                                                        <View className="flex-1">
                                                            <Text className={cn("text-sm font-medium leading-none", field.value && 'text-emerald-700')}>Has imported label</Text>
                                                            <Text className={cn("text-muted-foreground text-sm", field.value && 'text-emerald-600')}>
                                                                This item is imported by Farm
                                                            </Text>
                                                        </View>
                                                    </View>
                                                </Label>
                                            </FormControl>
                                        </FormItem>
                                    )
                                }}
                            />
                        )
                    }
                    {/* HAS IMPORTED LABEL FIELD END*/}
                </View>
            </Form>
            <View className="flex-1">
                {
                    (throwableDetails && throwableDetails.data) && (
                        <ThrowableDetailsCard item={throwableDetails.data} />
                    )
                }
                {
                    (barcodeInputValue.length < 1 && throwableData && throwableData.data) && (
                        <ReusableTab
                            tabLabels={
                                [
                                    {
                                        label: throwableData.data.ONE_PLUS_ONE.type,
                                        hidden: throwableData.data.ONE_PLUS_ONE.items.length < 1
                                    },
                                    {
                                        label: throwableData.data.THROWING.type,
                                        hidden: throwableData.data.THROWING.items.length < 1
                                    },
                                    {
                                        label: throwableData.data.OVERSTOCK.type,
                                        hidden: throwableData.data.OVERSTOCK.items.length < 1
                                    },
                                ]
                            }
                            tabContent={{
                                ONE_PLUS_ONE: <OnePlusOneItems item={throwableData.data.ONE_PLUS_ONE} />,
                                OVERSTOCK: <OverstockItems item={throwableData.data.OVERSTOCK} />,
                                THROWING: <ThrowingItems item={throwableData.data.THROWING} />
                            }}
                        />
                    )
                }
            </View>
        </View>
    )
}



const OnePlusOneItems = ({ item }: {
    item: {
        type: string;
        items: TGroupedThrowableItem[];
    }
}) => {

    return (
        <FlatList
            data={item.items ?? []}
            renderItem={({ item }) => {
                return (
                    <View>
                        <Text>
                            {item.vendorCode}
                        </Text>
                        <Text>
                            {item.barcode}
                        </Text>
                        <Text>
                            {item.description}
                        </Text>
                        <Text>
                            {item.expireIn}
                        </Text>
                        <Text>
                            {item.itemCode}
                        </Text>
                        <Text>
                            {JSON.stringify(item.isAllow)}
                        </Text>
                        <Text>
                            {String(item.type)}
                        </Text>
                    </View>
                )
            }}
        />
    )
}

const ThrowingItems = ({ item }: {
    item: {
        type: string;
        items: TGroupedThrowableItem[];
    }
}) => {

    return (
        <FlatList
            data={item.items ?? []}
            renderItem={(item) => {
                return (
                    <View>
                        <Text>
                            {item.item.barcode}
                        </Text>
                    </View>
                )
            }}
        />
    )
}

const OverstockItems = ({ item }: {
    item: {
        type: string;
        items: TGroupedThrowableItem[];
    }
}) => {

    return (
        <FlatList
            data={item.items ?? []}
            renderItem={(item) => {
                return (
                    <View>
                        <Text>
                            {item.item.barcode}
                        </Text>
                    </View>
                )
            }}
        />
    )
}




