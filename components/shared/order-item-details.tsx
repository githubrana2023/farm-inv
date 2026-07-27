import React, { useState, useEffect } from "react";
import { ScrollView, useWindowDimensions, View } from "react-native";
import { DetailsRow } from "./details-row";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { ItemQuantityUnit } from "./scanned-item-card";
// import { useRestoreQuantity } from "@/hooks/use-restore-quantity";
// import AlertModal from "@/components/ui/alert-modal";
// import { useAlertModal, useAppDispatch } from "@/hooks/redux";
// import { onClose, onOpen } from "@/lib/redux/slice/alert-modal-slice";
import { getItemByBarcode } from "@/dal/item/get-item";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { Text } from "../ui/text";
import Lucide from "@react-native-vector-icons/lucide";
import { useRestoreQuantity } from "@/hooks/use-restore-quantity";
import AlertModal from "./alert-modal";
import { useAlertModal, useAlertModalAction } from "@/hooks/redux/use-alert-modal";
import { ALERT_MODAL_TYPE } from "@/constants";
import { useUpdateOrderItem } from "@/hooks/tanstack/mutation/item/update-item";
import { useDeleteOrderItem } from "@/hooks/tanstack/mutation/item/delete-item ";
import { AddItemFormValue } from "@/lib/zod/add-item-form-schema";
import { queryClient } from "../provider/tanstack-query-client";
import { MUTATION_KEY } from "@/constants/tanstack-query";
import { showError } from "@/lib/toast/error";

type ScannedItemCardHeader = {

};

type Item = NonNullable<NonNullable<
    Awaited<ReturnType<typeof getItemByBarcode>>["data"]
>['orderItem']>

type ScannedItemCardProps = {
    title: string;
    description: string;
    orderItem: Item;
    onUpdate: (item: Item, quantity: string) => void;
    onDelete: (item: Item) => void;
};

export const OrderItemDetails = ({
    title,
    description,
    orderItem,
    onUpdate,
    onDelete,
}: ScannedItemCardProps) => {
    // const { isOpen, type } = useAlertModal();
    const [latestQuantity, setLatestQuantity] = useState(
        String(orderItem?.quantity ?? 1)
    );

    const { isAlertOpen, alertType } = useAlertModal()
    const { onAlertClose, onAlertOpen } = useAlertModalAction()

    const form = useForm({
        defaultValues: {
            quantity: String(orderItem.quantity),
        },
    });

    const { isEditState, setIsEditState } = useRestoreQuantity({
        form,
        quantity: String(orderItem.quantity),
    });

    const onSubmitEditing = form.handleSubmit(({ quantity: latestQuantity }) => {
        if (Number(latestQuantity) < 1) return showError('Update quantity can not be less than 1')
        setLatestQuantity(latestQuantity);
        onAlertOpen(ALERT_MODAL_TYPE.ORDER.UPDATE)
    });

    const isUpdateAlert = isAlertOpen && alertType === ALERT_MODAL_TYPE.ORDER.UPDATE
    const isDeleteAlert = isAlertOpen && alertType === ALERT_MODAL_TYPE.ORDER.DELETE


    const alertTitle = `Sure? Order item ${isUpdateAlert ? "quantity" : ""} will be ${isDeleteAlert ? "deleted" : `updated to ${latestQuantity} ${orderItem.uom}`}!`;
    const alertDescription = isDeleteAlert ?
        orderItem.description :
        isUpdateAlert ? `${orderItem.description} (Previous Quantity ${orderItem.quantity} ${orderItem.uom})` : ""

    const onConfirm = () => {
        if (isDeleteAlert) {
            onDelete(orderItem)
            return
        }
        if (isUpdateAlert) {
            onUpdate(orderItem, latestQuantity)
            setIsEditState(false)
            return
        }

    };

    const { height } = useWindowDimensions();

    return (
        <>
            <AlertModal
                title={alertTitle}
                description={alertDescription}
                isOpen={isDeleteAlert || isUpdateAlert}
                onConfirm={onConfirm}
                onCancel={onAlertClose}

            />
            {/* Item Details Card */}
            <ScrollView
                style={{ maxHeight: height * 0.4 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Card className="mt-1 p-3 gap-4 bg-destructive/20 border border-destructive"                >
                    <CardHeader className="flex-row items-center justify-between px-0"                    >
                        <View>
                            <CardTitle className="text-destructive">{title}</CardTitle>
                            <CardDescription className="text-destructive/70">{description}</CardDescription>
                        </View>

                        {/* /Card Header Component Like BUTTON OR BADGE */}
                        <View className="flex-row items-center gap-2 px-0">
                            <Button
                                variant={"destructive"}
                                size={"sm"}
                                onPress={() => {
                                    onAlertOpen(ALERT_MODAL_TYPE.ORDER.DELETE)
                                }}
                            >
                                <FontAwesome6 iconStyle="solid" name={"trash"} size={14} color={"#fff"} />
                            </Button>
                        </View>
                    </CardHeader>

                    <CardContent className="flex-col gap-2 px-0 py-0">

                        <DetailsRow
                            library="Lucide"
                            iconName="barcode"
                            label="Barcode"
                            value={orderItem.barcode}
                        />
                        <DetailsRow
                            library="Lucide"
                            iconName="hash"
                            label="Item Code"
                            value={orderItem.item_number}
                        />

                        <DetailsRow
                            library="Lucide"
                            iconName="file-text"
                            // icon={{ library: "FontAwesome", name: "file-text" }}
                            label="description"
                            value={orderItem.description}
                        />
                    </CardContent>


                    {/*! Order item details card footer */}
                    <Separator className="bg-destructive" />
                    <CardFooter className="items-center justify-between px-0">
                        <View className="flex-row items-center gap-2">
                            <View className="flex-row items-center justify-center w-8 h-8 bg-[#E8F1FC] rounded-md">
                                <Lucide
                                    name={"layers"}
                                    color={"#124DA1"}
                                    size={20}
                                />
                            </View>
                            <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Order Quantity
                            </Text>
                        </View>

                        {isEditState ? (
                            <View>
                                <Controller
                                    control={form.control}
                                    name="quantity"
                                    render={({ field: { onChange, value } }) => (
                                        <Input
                                            className="h-8 w-28" // same height & width as badge
                                            returnKeyType="go"
                                            keyboardType="numeric"
                                            onSubmitEditing={onSubmitEditing}
                                            onChangeText={onChange}
                                            onBlur={() => {
                                                setIsEditState(false)
                                            }}
                                            value={value.toString()}
                                        />
                                    )}
                                />
                            </View>
                        ) : (
                            <ItemQuantityUnit
                                quantity={Number(orderItem.quantity)}
                                uom={orderItem.uom}
                                onPress={() => {
                                    setIsEditState((prev) => !prev);
                                }}
                            />
                        )}
                    </CardFooter>
                </Card>
            </ScrollView>
        </>
    );
};

