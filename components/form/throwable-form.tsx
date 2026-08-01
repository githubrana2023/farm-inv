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
import { RadioGroup } from "../ui/radio-group"
import { ReactNode, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { usePersistThrowingDiscountType } from "@/hooks/use-persist-throwing-discount-type"
import { showError } from "@/lib/toast/error"
import { useGetThrowableItemDetailsMutation } from "@/hooks/tanstack/mutation/throwable/use-get-throwable-item-details"
import { ThrowableDetailsCard } from "../shared/throwable-details-card"
import { useInsertThrowable } from "@/hooks/tanstack/mutation/throwable/use-insert-throwable"
import { showDynamicToast } from "@/lib/toast/dynamic"
import { invalidQueries } from "@/lib/tanstack-query/invalid-query"
import { QUERY_KEY } from "@/constants/tanstack/query"
import { useGetThrowables } from "@/hooks/tanstack/query/throwable/use-get-throwables"
import ReusableTab from "../shared/tab"
import { TGroupedThrowableItem, TThrowableScanType } from "@/constants/throwable/type"
import { Icon } from "../ui/icon"
import { Trash } from "lucide-react-native"
import { Button } from "../ui/button"
import { deleteThrowableByIdAndType } from "@/dal/throwable/delete"
import { DetailsRow } from "../shared/details-row"
import { Badge } from "../ui/badge"


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
                    await invalidQueries([QUERY_KEY.THROWABLE.READ])
                    barcodeRef?.current?.focus()
                    form.reset()
                    resetThrowableGetMutation()
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
            <View className="flex-1 w-full">
                {
                    (throwableDetails && throwableDetails.data) && (
                        <ThrowableDetailsCard item={throwableDetails.data} />
                    )
                }
                {
                    (barcodeInputValue.length < 1 && throwableData && throwableData.data) && (
                        // <></>
                        <ReusableTab
                            tabContent={Object.values(throwableData.data).reduce((acc, item) => {

                                acc[item.type] = <ThrowableItems key={item.type} item={item} />

                                return acc
                            }, {} as Record<string, ReactNode>)}
                            tabLabels={Object.values(throwableData.data).map(item => (
                                {
                                    label: item.type,
                                    hidden: item.items.length < 1
                                }
                            ))}

                        />
                    )
                }
            </View>
        </View>
    )
}


const ThrowableItems = ({ item }: {
    item: {
        type: string;
        items: TGroupedThrowableItem[];
    }
}) => {


    return (
        <View className="flex-1 justify-between">

            <FlatList
                data={item.items}
                keyExtractor={(item) => String(item.id)}
                renderItem={({ item: scannedItem, index }) => {
                    return (
                        <View
                            className={cn(
                                "flex-row items-center justify-between gap-2 mb-2 border border-dashed p-2 rounded-md",
                                (scannedItem.type !== 'OVERSTOCK' && !scannedItem.isAllow) ? 'border-destructive' : 'border-emerald-800'
                            )}
                            key={scannedItem.id}
                        >
                            <View className="flex-1">
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <DetailsRow
                                            library="Lucide"
                                            iconName="barcode"
                                            label="Barcode"
                                            value={scannedItem.barcode}
                                        />
                                    </View>
                                    <View className="flex-1 flex-row justify-end">
                                        <Badge>
                                            <Text>count : {item.items.length - index}</Text>
                                        </Badge>
                                    </View>
                                </View>
                                <DetailsRow
                                    library="Lucide"
                                    iconName="file-text"
                                    label="Description"
                                    value={scannedItem.description}
                                />
                                <View className="flex-row items-center justify-between">
                                    <View className="flex-1">
                                        <DetailsRow
                                            library="Lucide"
                                            iconName="layers"
                                            label="Quantity"
                                            value={`${scannedItem.quantity} ${scannedItem.uom}`}
                                        />
                                    </View>
                                    <View className="flex-1 flex-row justify-end">
                                        <DetailsRow
                                            library="Lucide"
                                            iconName="calendar"
                                            label="Expire In"
                                            value={scannedItem.expireIn}
                                        />
                                    </View>

                                </View>

                                <Button
                                    variant={'destructive'}
                                    size={'sm'}
                                    onPress={async () => {
                                        console.log(scannedItem.id, scannedItem.type)
                                        await deleteThrowableByIdAndType(scannedItem.id, (scannedItem.type as TThrowableScanType))
                                        await invalidQueries([QUERY_KEY.THROWABLE.READ])
                                    }}
                                >
                                    <Icon
                                        as={Trash}
                                    />
                                </Button>
                            </View>

                        </View>
                    )
                }}
            />

            <Button>
                <Text>
                    Generate {item.type}
                </Text>
            </Button>
        </View>
    )
}