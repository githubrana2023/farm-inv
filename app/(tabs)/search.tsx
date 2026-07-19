import { View, FlatList } from 'react-native'
import Container from '@/components/shared/container'
import { useGetGlobalSearchItems } from '@/hooks/tanstack/mutation/item/get-item'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Text } from '@/components/ui/text'
import { useDebounce } from '@/hooks/use-debounce'
import { ItemDetails } from '@/components/shared/item-details'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DetailsRow } from '@/components/shared/details-row'
import { Button } from '@/components/ui/button'
import Lucide from '@react-native-vector-icons/lucide'
import { useColorScheme } from 'nativewind'

const Search = () => {
    const [searchValue, setSearchValue] = useState('')
    const search = useDebounce(searchValue)
    const isDark = useColorScheme().colorScheme === 'dark'
    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetGlobalSearchItems(search)

    const items = data?.pages.flatMap(page => page).filter(item => !!item) ?? []

    return (
        <Container>
            <View className="h-12 py-2">
                <Input
                    className="flex-1"
                    placeholder="Search"
                    onChangeText={(text) => {
                        setSearchValue(text)
                    }}
                    value={searchValue}
                />
            </View>

            <FlatList
                className="pb-0 flex-1"
                showsVerticalScrollIndicator={false}
                data={items}
                keyExtractor={item => item.barcode}
                renderItem={({ item, index }) => (
                    // <ScannedItemCard
                    //     key={item.barcode}
                    //     item={item}
                    //     enableActionBtn={false}
                    //     isCollapseAble
                    //     defaultCollapse={index !== 0}
                    // />
                    // <View className='py-3'>
                    //     <Text>{item.barcode}</Text>
                    //     <Text>{item.item_number}</Text>
                    //     <Text>{item.description}</Text>
                    // </View>

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
                                {/* <View className="flex-1"> */}
                                <Button size={'sm'}>
                                    <View className="flex-row item-center justify-center gap-1">
                                        <Lucide name='copy' size={16} color={isDark ? 'black' : 'white'} />
                                        <Text>Copy</Text>
                                    </View>

                                </Button>
                                {/* </View> */}

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

                )}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage()
                    }
                }}
            />

            {/* <View>
                <Text>hello</Text>
            </View> */}
        </Container>
    )
}

export default Search