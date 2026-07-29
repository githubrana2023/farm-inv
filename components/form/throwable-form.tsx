import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem } from "../ui/form"
import { throwableCreateFormSchema, TThrowableCreateFormValue } from "@/lib/zod/throwable-form-schema"
import { Pressable, View } from "react-native"
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


export const ThrowableForm = () => {
    const barcodeRef = useRef<any>(null)
    const quantityRef = useRef<any>(null)
    const expireInRef = useRef<any>(null)
    const form = useForm<TThrowableCreateFormValue>({
        defaultValues: {
            barcode: "",
            expireIn: "",
            quantity: "",
            hasImportedLabel: false,
            type: 'ONE_PLUS_ONE',
        },
        resolver: zodResolver(throwableCreateFormSchema),
        mode: 'onSubmit',
        reValidateMode: 'onSubmit',
        shouldFocusError: false
    })

    const isOverStock = form.watch('type') === 'OVERSTOCK'

    usePersistThrowingDiscountType(form)
    const onSubmit = form.handleSubmit(values => {
        quantityRef?.current?.focus()
        form.reset()
    })


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
                                    onSubmitEditing={() => { quantityRef?.current?.focus() }}
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
                                            onValueChange={field.onChange}
                                            className="flex-row gap-2"
                                        >
                                            {THROW_ABLE_SCAN_TYPE.map((type) => {
                                                const isActive = field.value === type;

                                                return (
                                                    <Pressable
                                                        onPress={() => field.onChange(type)}
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
                <Text>Show Details and List conditionally</Text>
            </View>
        </View>
    )
}



