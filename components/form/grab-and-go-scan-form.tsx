import { useForm } from "react-hook-form"
import { Form, FormField } from "../ui/form"
import { View } from "react-native"
import InputField from "../shared/input-field"
import { useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { grabAndGoCreateFormSchema, TGrabAndGoCreateFormValue } from "@/lib/zod/grab-and-go-form-schema"
import { Text } from "../ui/text"


export const GrabAndGoForm = () => {
    const barcodeRef = useRef<any>(null)
    const quantityRef = useRef<any>(null)
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

    const onSubmit = form.handleSubmit(() => {
        quantityRef?.current?.focus()
        form.reset()
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
                                    onSubmitEditing={() => { onSubmit }}
                                />
                            )
                        }}
                    />
                    {/* HAS IMPORTED LABEL FIELD END*/}
                </View>
            </Form>
            <View>
                <Text>Show Details and List conditionally</Text>
            </View>
        </View>
    )
}



