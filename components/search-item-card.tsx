import React from "react";
import { View } from 'react-native'
import { Text } from '@/components/ui/text'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailsRow } from '@/components/shared/details-row'
import { Button } from '@/components/ui/button'
import Lucide from '@react-native-vector-icons/lucide'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type SearchItem = {
    barcode: string;
    item_number: string;
    description: string;
    uom: string;
    packing: number;
    sales_price: number;
    vendor: string;
    vendor_code: string;
    promo: "P" | "R" | null;
    cat3: string;
    cat4: string;
    itemUoms: {
        barcode: string;
        packing: number;
        uom: string;
    }[];
}

export const SearchItemDetailsCard = React.memo(
    (
        { item, index, isDark, setRequestedItemIndex }: {
            item: SearchItem;
            index: number;
            isDark: boolean;
            setRequestedItemIndex: React.Dispatch<React.SetStateAction<{ index: number; addTo: 'Tags' | 'Inventory' | 'Order' } | null>>
        }
    ) => {

        return (
            <Card className='p-1 gap-1 mb-2'>
                <CardHeader className='flex-row items-center justify-between p-1'>
                    <View className="flex-1">
                        <CardTitle>Search Item {index + 1}</CardTitle>
                        <CardDescription>Item details</CardDescription>
                    </View>
                    <View >
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    size={'sm'}
                                >
                                    <Text>
                                        <Lucide
                                            name='ellipsis-vertical'
                                            color={'black'}
                                            size={16}
                                        />
                                    </Text>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                                <DropdownMenuLabel>
                                    <Text>Add Into</Text>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onPress={() => setRequestedItemIndex({ index, addTo: 'Inventory' })}
                                >
                                    <Text>Inventory</Text>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onPress={() => setRequestedItemIndex({ index, addTo: 'Tags' })}
                                >
                                    <Text>Tags</Text>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onPress={() => setRequestedItemIndex({ index, addTo: 'Order' })}
                                >
                                    <Text>Order</Text>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </View>
                </CardHeader>

                <CardContent className='p-1 gap-1'>
                    <DetailsRow
                        library='Lucide'
                        iconName='barcode'
                        label='Barcode'
                        value={item.barcode}
                    />
                    <DetailsRow
                        library='Lucide'
                        iconName='hash'
                        label='Item Code'
                        value={item.item_number}
                    />
                    <DetailsRow
                        library='Lucide'
                        iconName='file-text'
                        label='Description'
                        value={item.description}
                    />
                </CardContent>
            </Card>
        )
    }
)