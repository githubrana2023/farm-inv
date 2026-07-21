import { View, FlatList, ActivityIndicator } from 'react-native'
import Container from '@/components/shared/container'
import { useGetGlobalSearchItems } from '@/hooks/tanstack/mutation/item/get-item'
import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useDebounce } from '@/hooks/use-debounce'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
const Search = () => {
    const [searchValue, setSearchValue] = useState('')
    const { debouncedValue, isLoading } = useDebounce(searchValue)
    const isDark = useColorScheme().colorScheme === 'dark'

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetGlobalSearchItems(debouncedValue)

    const items = data?.pages.flatMap(page => page).filter(item => !!item) ?? []

    const renderSearchItemDetailsCard = React.useCallback(
        ({ index, isDark, item, }: { item: Item, index: number; isDark: boolean }) => (
            <SearchItemDetailsCard index={index} isDark={isDark} item={item} />
        ),
        []
    )

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

                    {
                        debouncedValue.length === 0 && (
                            <EmptySearch />
                        )
                    }

                    {
                        isLoading ? (
                            <LoadingState
                                title='Searching...'
                                description='Please wait'
                            />
                        ) :
                            (debouncedValue.length > 0 && items.length > 0) ? (
                                <FlatList
                                    className="pb-0 flex-1"
                                    showsVerticalScrollIndicator={false}
                                    data={items}
                                    keyExtractor={item => item.barcode}
                                    renderItem={({ item, index }) => renderSearchItemDetailsCard({ item, isDark, index })}
                                    onEndReached={() => {
                                        if (hasNextPage && !isFetchingNextPage) {
                                            fetchNextPage()
                                        }
                                    }}
                                />
                            ) : (debouncedValue.length > 0 && items.length < 1) ? (
                                <NoSearchResults query={debouncedValue} />
                            ) : null
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
}

const SearchItemDetailsCard = React.memo(
    ({ item, index, isDark }: {
        item: Item;
        index: number;
        isDark: boolean;
    }) => {
        const [isCopied, setIsCopied] = useState(false)
        useEffect(() => {
            const timer = setTimeout(() => {
                setIsCopied(false)
            }, 3000);

            return () => clearTimeout(timer)
        }, [isCopied])


        const onCopy = async (barcode: string) => {
            await Clipboard.setStringAsync(barcode);
            showSuccess(`Barcode ${barcode} copied!`)
            setIsCopied(true)
        }


        return (
            <Card className='p-1 gap-1 mb-2'>
                <CardHeader className='p-1'>
                    <CardTitle>Search Item {index + 1}</CardTitle>
                    <CardDescription>Item details</CardDescription>
                </CardHeader>
                <CardContent className='p-1 gap-1'>
                    <View className=" flex-row items-center justify-between">
                        <View className="flex-[1]">
                            <DetailsRow
                                library='Lucide'
                                iconName='barcode'
                                label='Barcode'
                                value={item.barcode}
                            />
                        </View>
                        <Button size={'sm'} onPress={() => onCopy(item.barcode)}>
                            <View className="flex-row item-center justify-center gap-1 text-sm">
                                <Lucide name='copy' size={14} color={isDark ? 'black' : 'white'} />
                                <Text>{isCopied ? 'Copied' : 'Copy'}</Text>
                            </View>

                        </Button>

                    </View>
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