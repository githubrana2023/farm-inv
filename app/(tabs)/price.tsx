import Container from "@/components/shared/container";
import { PriceCheckCard } from "@/components/price-check-card";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { useCheckItemPrice } from "@/hooks/tanstack/mutation/item/get-item";
import { showDynamicToast } from "@/lib/toast/dynamic";
import Lucide from "@react-native-vector-icons/lucide";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useTagInsertMutation } from "@/hooks/tanstack/mutation/item/insert-item";
import { queryClient } from "@/components/provider/tanstack-query-client";
import { MUTATION_KEY } from "@/constants/tanstack-query";

const Price = () => {
    const barcodeInputRef = useRef<any>(null);
    const form = useForm({
        defaultValues: { barcode: "" },
    });

    const { mutate: checkItemPrice, data: item, reset: resetCheckItemMutation } = useCheckItemPrice()
    const { mutate: insertTag, } = useTagInsertMutation()

    const barcode = form.getValues('barcode')

    const onSubmit = form.handleSubmit(({ barcode }) => {
        checkItemPrice(barcode, {
            onSuccess({ success, message }) {
                if (success) {
                    barcodeInputRef?.current?.focus();
                }
                showDynamicToast(success, message)
            }
        })
    });

    const onTagRequest = () => {
        insertTag(barcode, {
            onSuccess({ success, message }) {
                if (success) {
                    form.reset()
                    resetCheckItemMutation()
                    showDynamicToast(success, message)
                    queryClient.invalidateQueries({
                        queryKey: [MUTATION_KEY.SCANNED_ITEM.READ]
                    })
                }
            }
        })
    }


    return (
        <Container>
            <View className="h-16 flex-row justify-center items-center gap-1.5">
                <View className="flex-1">
                    <Controller
                        control={form.control}
                        name="barcode"
                        render={({ field: { onChange, value } }) => (
                            <View className="relative">
                                <Input
                                    selectTextOnFocus
                                    placeholder="Barcode"
                                    keyboardType="numeric"
                                    returnKeyType="go"
                                    value={value}
                                    onChangeText={onChange}
                                    onSubmitEditing={onSubmit}
                                    ref={barcodeInputRef}
                                    className="pr-8"
                                />

                                {/* Clear Button */}
                                {value.length > 0 && (
                                    <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                        <TouchableOpacity
                                            onPress={() => {
                                                form.reset();
                                                resetCheckItemMutation()
                                            }}
                                        >
                                            <Lucide name='x-circle' size={20} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}
                    />
                </View>
                <Button
                    onPress={onTagRequest}
                >
                    <Text >
                        <Lucide name="plus" color={'white'} size={16} />
                    </Text>
                </Button>
            </View>

            {/* <View className='flex-1 pb-0'> */}
            <ScrollView
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
            >
                {
                    (item && item?.success) && (
                        <PriceCheckCard
                            barcode={item?.data.barcode}
                            item_number={item?.data.item_number}
                            description={item?.data.description}
                            sales_price={item?.data.sales_price}
                            vendor={item?.data.vendor}
                            vendor_code={item?.data.vendor_code}
                            promo={item?.data.promo}
                        />
                    )
                }
            </ScrollView>
            {/* </View> */}
        </Container>
    );
};

export default Price;
