import { View, FlatList, ActivityIndicator } from 'react-native'
import Container from '@/components/shared/container'
import { useGetGlobalSearchItems } from '@/hooks/tanstack/mutation/item/get-item'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useDebounce } from '@/hooks/use-debounce'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailsRow } from '@/components/shared/details-row'
import { Button } from '@/components/ui/button'
import Lucide from '@react-native-vector-icons/lucide'
import { useColorScheme } from 'nativewind'
import * as Clipboard from 'expo-clipboard'
import { showSuccess } from '@/lib/toast/success'
import { EmptySearch } from '@/components/shared/empty-search'
import { EmptyState } from '@/components/shared/empty-state'
import { NoSearchResults } from '../../components/shared/no-result-found'
import { LoadingState } from '@/components/shared/loading-state'
import CardWrapper from '@/components/shared/card-wrapper'
import { Separator } from '@/components/ui/separator'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import InputField from '@/components/shared/input-field'
import Modal from '@/components/shared/modal'
import ShowMessage from '@/components/show-message'

const Search = () => {
    const [searchValue, setSearchValue] = useState('')
    const { debouncedValue, isLoading } = useDebounce(searchValue)
    const [requestedItemIndex, setRequestedItemIndex] = useState<{ index: number; addTo: 'Tags' | 'Inventory' | 'Order' } | null>(null)
    const [triggerWidth, setTriggerWidth] = useState<number>(0)
    const isDark = useColorScheme().colorScheme === 'dark'

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage, isFetching, isFetched } = useGetGlobalSearchItems(debouncedValue)

    const items = data?.pages.flatMap(page => page).filter(item => !!item) ?? []

    const requestedItem = requestedItemIndex ? items[requestedItemIndex.index] : null

    const form = useForm({
        defaultValues: {
            uom: "",
            quantity: ""
        },
        // resolver:zodResolver(),
        shouldFocusError: false,
        mode: 'onSubmit',
        reValidateMode: 'onSubmit'
    })

    const renderSearchItemDetailsCard = React.useCallback(
        ({ index, isDark, item, setRequestedItemIndex }: {
            item: Item,
            index: number;
            isDark: boolean;
            setRequestedItemIndex: React.Dispatch<React.SetStateAction<{ index: number; addTo: 'Tags' | 'Inventory' | 'Order' } | null>>
        }) => (
            <SearchItemDetailsCard index={index} isDark={isDark} item={item} setRequestedItemIndex={setRequestedItemIndex} />
        ),
        []
    )


    const onSubmit = form.handleSubmit(value => {
        setRequestedItemIndex(null)
    })



    return (
        <Container>
            <View className="flex-1 gap-1">

                <View className='flex-1'>

                    <View className="h-16 py-2">
                        <Input
                            className="flex-1 relative pr-12"
                            placeholder="Search"
                            onChangeText={(text) => {
                                setSearchValue(text)
                            }}
                            value={searchValue}
                        />

                        {
                            searchValue.length > 0 && (
                                <View className='absolute top-5 right-4'>
                                    <Lucide
                                        name='x-circle'
                                        size={24}
                                        onPress={() => setSearchValue("")}
                                        color={isDark ? "white" : "black"}
                                    />
                                </View>
                            )
                        }
                    </View>



                    {/* ADD TO INVENTORY|TAGS|ORDER FORM  START*/}
                    {
                        requestedItem && (
                            <View className='gap-2 py-2'>
                                <Form {...form}>
                                    <View className='flex-row items-center justify-between gap-1'>
                                        <View className='flex-1'>
                                            <FormField
                                                name="uom"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Select
                                                                onValueChange={(option) => {
                                                                    field.onChange(option?.value);
                                                                }}
                                                                value={
                                                                    field.value ? {
                                                                        value: field.value,
                                                                        label: field.value
                                                                    } : undefined
                                                                }
                                                            >
                                                                <SelectTrigger
                                                                    onLayout={(e) =>
                                                                        setTriggerWidth(e.nativeEvent.layout.width)
                                                                    }
                                                                >
                                                                    <SelectValue placeholder="UOM" />
                                                                </SelectTrigger>
                                                                <SelectContent
                                                                    style={{ width: triggerWidth }}
                                                                    className="mt-2">
                                                                    <SelectGroup className="">
                                                                        <SelectLabel>Units</SelectLabel>
                                                                        {
                                                                            requestedItem.itemUoms.map(
                                                                                ({ uom, barcode, packing }) => (
                                                                                    <SelectItem
                                                                                        key={barcode}
                                                                                        value={`${uom}|${String(packing)}`}
                                                                                        label={`${uom} (${String(packing)})`}
                                                                                    />
                                                                                )
                                                                            )
                                                                        }
                                                                    </SelectGroup>
                                                                </SelectContent>
                                                            </Select>
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />


                                        </View>
                                        <View className="flex-1">
                                            <FormField
                                                control={form.control}
                                                name='quantity'
                                                render={({ field }) => {
                                                    return (
                                                        <InputField
                                                            // ref={barcodeInputRef}
                                                            // autoFocus
                                                            placeholder="quantity"
                                                            keyboardType="decimal-pad"
                                                            returnKeyType="go"
                                                            onChangeText={field.onChange}
                                                            value={field.value}
                                                            onSubmitEditing={onSubmit}
                                                        />
                                                    )
                                                }}
                                            />
                                        </View>
                                    </View>
                                </Form>
                                <ShowMessage success title={`Add to ${requestedItemIndex?.addTo}`} description={requestedItem.description} />
                            </View>
                        )
                    }
                    {/* ADD TO INVENTORY|TAGS|ORDER FORM END */}


                    {
                        (isFetching) && (
                            <LoadingState
                                title='Searching...'
                                description='Please wait'
                            />
                        )
                    }
                    {
                        (debouncedValue.length === 0 && !isFetching) && (<EmptySearch />)
                    }
                    {
                        (!isFetching && debouncedValue.length > 0 && items?.length < 1) && (
                            <NoSearchResults query={debouncedValue} />
                        )
                    }
                    {
                        (!isFetching && debouncedValue.length > 0 && items.length > 0) && (
                            <FlatList
                                className="pb-0 flex-1"
                                showsVerticalScrollIndicator={false}
                                data={items}
                                keyExtractor={item => item.barcode}
                                renderItem={({ item, index }) => renderSearchItemDetailsCard(
                                    { item, isDark, index, setRequestedItemIndex }
                                )}
                                onEndReached={() => {
                                    if (hasNextPage && !isFetchingNextPage) {
                                        fetchNextPage()
                                    }
                                }}
                            />
                        )
                    }

                </View>



                {/* TODO: total item count remaining */}
                {/* <View className='py-4'>
                    <Badge>
                        <Text>
                            Total Items : {items.length}
                        </Text>
                    </Badge>
                </View> */}
            </View>
        </Container>
    )
}

export default Search


type Item = {
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

const SearchItemDetailsCard = React.memo(
    (
        { item, index, isDark, setRequestedItemIndex }: {
            item: Item;
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
                                    <Text>My Account</Text>
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
                    {/* <AddToForm barcode={item.barcode} uoms={item.itemUoms} /> */}
                </CardContent>
            </Card>
        )
    }
)
