import { View } from "react-native"
import { Text } from "./ui/text"
import CardWrapper from "./shared/card-wrapper";
import { Button } from "./ui/button";
import Lucide from "@react-native-vector-icons/lucide";
import { splitWord } from "@/lib/utils";
import { parse, differenceInDays, subDays, isAfter, format, formatDistanceToNow } from "date-fns";


type ExpiryItemCardProp = {
    item: {
        id: string;
        empId: string;
        barcode: string;
        item_number: string;
        description: string;
        expireIn: Date;
        shelfNo: string;
        remindBefore: number;
        createdAt: Date;
        updatedAt: Date;
    },

}

export const ExpiryItemCard = ({ item }: ExpiryItemCardProp) => {

    const removeAfter = subDays(item.expireIn, item.remindBefore)
    const dayLeft = formatDistanceToNow(item.expireIn, { addSuffix: true })


    return (
        <CardWrapper
            title={item.barcode}
            description={item.description}
            headerContent={
                <Button
                    variant={'destructive'}
                    size={'sm'}
                >
                    <Text>
                        <Lucide name="trash" size={16} color={'white'} />
                    </Text>
                </Button>
            }
        >
            <View className='flex-row items-center justify-between'>
                <View className="flex-1">
                    <Text>Expiry Date</Text>
                </View>
                <View>
                    <Text>{format(item.expireIn, 'dd-MMM-yyyy')}</Text>
                </View>
            </View>
            <View className='flex-row items-center justify-between'>
                <View className="flex-1">
                    <Text>Remove Date</Text>
                </View>
                <View>
                    <Text>{format(removeAfter, 'dd-MMM-yyyy')}</Text>
                </View>
            </View>
            <View className='flex-row items-center justify-between'>
                <View className="flex-1">
                    <Text>Day Left</Text>
                </View>
                <View>
                    <Text>{dayLeft}</Text>
                </View>
            </View>
        </CardWrapper>
    )
}