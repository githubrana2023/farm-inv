import Container from "@/components/shared/container";
import { PriceCheckCard } from "@/components/price-check-card";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useCheckItemPrice, useGetItemByBarcode } from "@/hooks/tanstack/mutation/item/get-item";
import { showDynamicToast } from "@/lib/toast/dynamic";
import Lucide from "@react-native-vector-icons/lucide";

const Price = () => {
    const barcodeInputRef = useRef<any>(null);
    const form = useForm({
        defaultValues: { barcode: "" },
    });

    const { mutate: checkItemPrice, data: item } = useCheckItemPrice()

    const onSubmit = form.handleSubmit(({ barcode }) => {
        checkItemPrice(barcode, {
            onSuccess({ success, message }) {
                if (success) {
                    barcodeInputRef?.current?.focus();
                    form.reset()
                }
                showDynamicToast(success, message)
            }
        })
    });

    return (
        <Container>
            <View className="h-16 justify-center">
                <Controller
                    control={form.control}
                    name="barcode"
                    render={({ field: { onChange, value } }) => (
                        <View className="relative">
                            <Input
                                placeholder="Barcode"
                                keyboardType="numeric"
                                returnKeyType="go"
                                value={value}
                                onChangeText={onChange}
                                onSubmitEditing={onSubmit}
                                selectTextOnFocus
                                ref={barcodeInputRef}
                            />

                            {/* Clear Button */}
                            {value.length > 0 && (
                                <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                    <TouchableOpacity
                                        onPress={() => {
                                            form.reset();
                                        }}
                                    >
                                        {/* <Feather name="x-circle" size={24} /> */}
                                        <Lucide name='x-circle' size={20} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    )}
                />
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
