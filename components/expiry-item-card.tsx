import { View } from "react-native"
import { Text } from "./ui/text"
import CardWrapper from "./shared/card-wrapper";
import { Button } from "./ui/button";
import Lucide from "@react-native-vector-icons/lucide";
import { splitWord } from "@/lib/utils";
import { parse, differenceInDays, subDays, isAfter, format, formatDistanceToNow } from "date-fns";
import { DetailsRow } from "./shared/details-row";
import React, { Dispatch, SetStateAction, useState } from "react";


type ExpiryItemCardProp = {
    item: {
        id: string;
        empId: string;
        barcode: string;
        item_number: string;
        description: string;
        expireIn: Date;
        shelfNo: string;
        remindBefore: Date;
        createdAt: Date;
        updatedAt: Date;
    },
    index: number;
    onPress: () => void
}

export const ExpiryItemCard = ({ item, onPress }: ExpiryItemCardProp) => {
    const dayLeft = formatDistanceToNow(item.expireIn, { addSuffix: true })


    return (
        <CardWrapper
            title={`Monitoring Date - ${format(item.remindBefore, 'dd-MMM-yyyy')}`}
            description={`Day Left - ${dayLeft}`}
            headerContent={
                <Button
                    variant={'destructive'}
                    size={'sm'}
                    onPress={onPress}
                >
                    <Text>
                        <Lucide name="trash" size={16} color={'white'} />
                    </Text>
                </Button>
            }
        >
            <DetailsRow
                library="Lucide"
                iconName="barcode"
                label="Barcode"
                value={item.barcode}
            />
            <DetailsRow
                library="Lucide"
                iconName="file-text"
                label="Description"
                value={item.description}
            />
            <DetailsRow
                library="Lucide"
                iconName="calendar-check"
                label="Expire Date"
                value={format(item.expireIn, 'dd-MMM-yyyy')}
            />
        </CardWrapper>
    )
}