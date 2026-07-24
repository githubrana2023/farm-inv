import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn, copy } from "@/lib/utils"
import { Text, View } from "react-native"
import { DetailsRow } from "@/components/shared/details-row"
import FontAwesome6 from "@react-native-vector-icons/fontawesome6"

interface PriceCheckCardProps {
    barcode: string;
    item_number: string;
    description: string;
    sales_price: number;
    vendor: string;
    vendor_code: string;
    promo: "P" | "R" | null;
}
export function PriceCheckCard({
    item_number,
    description,
    sales_price,
    barcode,
    vendor,
    vendor_code,
    promo,
}: PriceCheckCardProps) {
    const isOnPromo = promo !== undefined && promo === 'P'
    // const discount = isOnPromo
    //     ? Math.round(((regularPrice - promoPrice) / regularPrice) * 100)
    //     : 0

    function formatPrice(value: number) {
        return (value ? value : 0).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })
    }

    return (
        <Card className="gap-0 p-2">
            {/* PRICE HEADER */}
            <View className="relative items-center border-b border-border bg-secondary/50 px-4 pt-6 pb-2">
                {/* {isOnPromo && (
                    <Badge className="absolute right-1.5 top-1.5 flex-row items-center rounded-full bg-green-600 px-2 py-0.5">
                        <FontAwesome6 name="percent" iconStyle="solid" color={'white'} />
                        <Text className="ml-0 text-[11px] font-bold text-white">
                            {discount}% OFF
                        </Text>
                    </Badge>
                )} */}

                <View className="flex-row items-center">
                    <FontAwesome6 iconStyle="solid" name="dollar-sign" size={20} color="##6A7181" />

                    <Text className="ml-2 text-xs font-medium uppercase text-muted-foreground">
                        {isOnPromo ? "Promo Price" : "Unit Price"}
                    </Text>
                </View>


                <Text className={cn("mt-2 text-5xl font-extrabold", isOnPromo ? "text-green-600" : "text-foreground")}>
                    {/* {currency}  */}
                    {formatPrice(isOnPromo ? sales_price : sales_price)}
                </Text>

                {/* {isOnPromo && (
                    <Text className="mt-1 text-xl text-muted-foreground line-through">
                        {currency} {formatPrice(regularPrice)}
                    </Text>
                )} */}
            </View>

            {/* DETAILS */}
            <CardContent className="p-0">
                <View className="gap-3 p-2">
                    {/* BARCODE */}
                    <DetailsRow
                        // icon={{ library: 'FontAwesome', name: "barcode" }}
                        library="Lucide"
                        iconName="barcode"
                        label="barcode"
                        value={barcode}
                    />

                    {/* ITEM CODE */}
                    <DetailsRow
                        library="Lucide"
                        iconName="hash"
                        label="item code"
                        value={item_number}
                    />

                    {/* DESCRIPTION */}
                    <DetailsRow
                        library="Lucide"
                        iconName="file-text"
                        label="Description"
                        value={description}
                    />

                </View>

                {/* SUPPLIER FOOTER */}
                <View className="flex-row items-center justify-between border-t border-border bg-secondary/30 p-2">
                    {/* LEFT SIDE */}
                    <View className="flex-1 flex-row items-start">
                        <FontAwesome6 name="truck" size={16} color="#6b7280" iconStyle="solid" />

                        <View className="ml-2 flex-1">
                            <View className="flex-row items-start justify-between">

                                <Text className="text-xs font-medium uppercase text-muted-foreground">
                                    Supplier
                                </Text>
                                <Badge
                                    variant="outline"
                                    className="ml-2 flex-row items-center rounded-md px-2.5 py-1"
                                >
                                    <FontAwesome6 name="tag" size={12} color="#6b7280" iconStyle="solid" />
                                    <Text className="ml-1 font-mono text-xs font-semibold" onPress={() => copy(vendor_code)}>
                                        {vendor_code}
                                    </Text>
                                </Badge>
                            </View>

                            <Text className="text-sm font-medium text-foreground">
                                {vendor}
                            </Text>
                        </View>
                    </View>

                    {/* RIGHT BADGE */}




                </View>

            </CardContent>
        </Card>
    )
}
