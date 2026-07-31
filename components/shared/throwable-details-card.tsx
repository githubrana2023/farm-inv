import { View } from "react-native"
import { Text } from "../ui/text"
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { Icon } from "../ui/icon";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";

type ThrowableItemDetails = {
    item: {
        isAllow: boolean;
        isOnePlusOne: boolean;
        isThrowing: boolean;
        barcode: string;
        item_number: string;
        description: string;
        vendor_code: string;
    }
}

export function ThrowableDetailsCard({
    item: {
        isAllow,
        isOnePlusOne,
        isThrowing,
        barcode,
        item_number,
        description,
        vendor_code,
    }
}: ThrowableItemDetails) {
    const isDestructive = !isAllow || isThrowing;
    const isSuccess = isAllow && !isThrowing;

    return (
        <View
            className={cn(
                "rounded-xl border p-2 border-emerald-500 bg-emerald-100",
                !isAllow
                && "border-destructive/30 bg-destructive/5"
                // : "border-emerald-500/30 bg-emerald-500/5"
            )}
        >
            {/* Header */}
            <View className="mb-2 flex-row items-start justify-between">
                <View className="flex-1 flex-row items-center gap-3">
                    <Icon
                        as={isAllow ? CheckCircle2 : AlertCircle}
                        size={22}
                        className={
                            cn('text-emerald-500', !isAllow && 'text-destructive')
                        }
                    />


                    <View className="flex-1">
                        <Text className="font-semibold text-sm">
                            {description}
                        </Text>

                        <Text className="text-muted-foreground text-sm">
                            Item {item_number}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Badges */}
            <View className="mb-2 flex-row flex-wrap gap-2">
                <Badge
                    variant={isAllow ? "secondary" : "destructive"}
                    className={cn(

                        isAllow &&
                        "bg-emerald-300 dark:bg-emerald-950 "
                    )}
                >
                    <Text
                        className={cn(
                            "text-xs",
                            isAllow
                                ? "text-emerald-700 dark:text-emerald-300"
                                : ""
                        )}
                    >
                        {isAllow ? "✓ Allowed" : "✗ Not Allowed"}
                    </Text>
                </Badge>

                {isOnePlusOne && (
                    <Badge className="bg-blue-100 dark:bg-blue-950">
                        <Text className="text-xs text-blue-700 dark:text-blue-300">
                            1+1 Promo
                        </Text>
                    </Badge>
                )}

                {isThrowing && (
                    <Badge className="bg-orange-100 dark:bg-orange-950">
                        <Text className="text-xs text-orange-700 dark:text-orange-300">
                            ⚠ Throwing
                        </Text>
                    </Badge>
                )}
            </View>

            {/* Details */}
            <View className="gap-4">
                <View className="flex-row gap-4">
                    <View className="flex-1">
                        <Text className="text-muted-foreground text-xs">
                            Barcode
                        </Text>

                        <Text className="font-mono font-semibold">
                            {barcode}
                        </Text>
                    </View>

                    <View className="flex-1">
                        <Text className="text-muted-foreground text-xs">
                            Vendor Code
                        </Text>

                        <Text className="font-mono font-semibold">
                            {vendor_code}
                        </Text>
                    </View>
                </View>

                {/* Status */}
                <View className="">

                    <View
                        className={cn(
                            " rounded-sm p-2",
                            !isOnePlusOne
                                ? "bg-destructive/10"
                                : "bg-emerald-500/10"
                        )}
                    >
                        <Text
                            className={cn(
                                "font-medium",
                                !isOnePlusOne
                                    ? "text-destructive"
                                    : "text-emerald-700 dark:text-emerald-300"
                            )}
                        >
                            {isOnePlusOne && "✓ Item is allowed with 1+1 promo"}
                            {!isOnePlusOne && "Item is not allowed with 1+1 promo"}
                        </Text>
                    </View>
                    <View
                        className={cn(
                            "mt-2 rounded-sm p-2",
                            !isThrowing
                                ? "bg-destructive/10"
                                : "bg-emerald-500/10"
                        )}
                    >
                        <Text
                            className={cn(
                                "font-medium",
                                !isThrowing
                                    ? "text-destructive"
                                    : "text-emerald-700 dark:text-emerald-300"
                            )}
                        >
                            {isThrowing && "⚠️ Item is throwable"}

                            {!isThrowing && "Item is not throwable"}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}