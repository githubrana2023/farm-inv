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

type ScannedItemCardHeader = {
    title: string;
    description?: string;
};

type Item = NonNullable<
    Awaited<ReturnType<typeof getItemByBarcode>>["data"]
>;

type ScannedItemCardProps = {
    header: ScannedItemCardHeader;
    item: Item;
    onUpdate?: (item: Item, quantity: number) => void;
    onDelete?: (item: Item) => void;
};

export const ItemDetails = ({
    header,
    item,
    onUpdate,
    onDelete,
}: ScannedItemCardProps) => {
    // const { isOpen, type } = useAlertModal();
    const [latestQuantity, setLatestQuantity] = useState(
        Number(item.orderItem?.quantity ?? 1)
    );

    // const dispatch = useAppDispatch();
    const form = useForm({
        defaultValues: {
            quantity: Number(item.orderItem?.quantity ?? 1),
        },
    });

    // const { isEditState, setIsEditState } = useRestoreQuantity({
    //     form,
    //     quantity: Number(item.storedItem?.quantity) ?? 0,
    // });

    const onSubmitEditing = form.handleSubmit(({ quantity: latestQuantity }) => {
        setLatestQuantity(latestQuantity);
        // dispatch(onOpen("item-details-update"));
    });

    // const isDeleteAlertModalOpen =
    //     isOpen && type === "item-details-delete" && !!onDelete;
    // const isUpdateAlertModalOpen =
    //     isOpen && type === "item-details-update" && !!onUpdate;

    // const alertTitle = `Sure? Scanned order item will ${isDeleteAlertModalOpen ? "be deleted" : "update"}!`;
    // const alertDescription =
    //     item && item.storedItem ? (item.storedItem.description ?? "") : "";

    const onConfirm = () => {
        if (
            // isDeleteAlertModalOpen &&
            !!onDelete &&
            item.orderItem &&
            item.orderItem.id
        ) { onDelete(item); }
        if (
            // isUpdateAlertModalOpen &&
            !!onUpdate &&
            item.orderItem &&
            item.orderItem.id
        ) {
            onUpdate(item, latestQuantity);
        }
    };

    const { height } = useWindowDimensions();

    return (
        <>
            {/* <AlertModal
                title={alertTitle}
                description={alertDescription}
                isOpen={isDeleteAlertModalOpen || isUpdateAlertModalOpen}
                onConfirm={onConfirm}
                onCancel={() => dispatch(onClose())}
            /> */}
            {/* Item Details Card */}
            <ScrollView
                style={{ maxHeight: height * 0.4 }}
                contentContainerStyle={{ paddingBottom: 20 }}
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <Card className="mt-1 p-3 gap-4"                >
                    <CardHeader className="flex-row items-center justify-between px-0"                    >
                        <View>
                            <CardTitle>{header.title}</CardTitle>
                            {
                                header.description && (
                                    <CardDescription>
                                        {header.description}
                                    </CardDescription>
                                )
                            }
                        </View>

                        {/* /Card Header Component Like BUTTON OR BADGE */}
                        <View className="flex-row items-center gap-2 px-0">
                            {item.orderItem ? (
                                <Button
                                    variant={"destructive"}
                                    size={"sm"}
                                    onPress={() => {
                                        //dispatch(onOpen("item-list-delete"))
                                    }}
                                >
                                    <FontAwesome6 iconStyle="solid" name={"trash"} size={14} color={"#fff"} />
                                </Button>
                            ) : (
                                <ItemPriceUnit
                                    price={item.item.sales_price}
                                    uom={item.item.uom}
                                />
                            )}
                        </View>
                    </CardHeader>

                    <CardContent className="flex-col gap-2 px-0 py-0">
                        {
                            (item.item) && (
                                <>
                                    <DetailsRow
                                        library="Lucide"
                                        iconName="hash"
                                        label="Item Code"
                                        value={item.item?.item_number ?? "no item code"}
                                    />
                                    <DetailsRow
                                        library="Lucide"
                                        iconName="file-text"
                                        label="description"
                                        value={item.item?.description ?? ""}
                                    />
                                </>
                            )
                        }
                        {
                            (item.orderItem) && (
                                <>
                                    <DetailsRow
                                        library="Lucide"
                                        iconName="hash"
                                        label="Item Code"
                                        value={item.orderItem.item_number ?? "no item code"}
                                    />
                                    <DetailsRow
                                        library="Lucide"
                                        iconName="file-text"
                                        // icon={{ library: "FontAwesome", name: "file-text" }}
                                        label="description"
                                        value={item.orderItem.description ?? ""}
                                    />
                                </>
                            )
                        }
                    </CardContent>

                    {item.orderItem && (
                        <>
                            <Separator />
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

                                {false ? (
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
                                                        //setIsEditState(false)
                                                    }}
                                                    value={value.toString()}
                                                />
                                            )}
                                        />
                                    </View>
                                ) : (
                                    <ItemQuantityUnit
                                        quantity={Number(item.orderItem.quantity)}
                                        uom={item.orderItem.uom}
                                        onPress={() => {
                                            // setIsEditState((prev) => !prev);
                                        }}
                                    />
                                )}
                            </CardFooter>
                        </>
                    )}
                </Card>
            </ScrollView>
        </>
    );
};

type ItemPriceUnitProps = {
    price?: number;
    uom?: string;
} & React.ComponentProps<typeof Text>;

const ItemPriceUnit = ({ price, uom, ...props }: ItemPriceUnitProps) => {
    return (
        <Badge
            variant="outline"
        // className="border-muted-foreground rounded-full px-4"
        >
            <Text {...props} className="text-center text-sm font-bold">
                SAR {price ?? 0} / {uom ?? "".toUpperCase()}
            </Text>
        </Badge>
    );
};
