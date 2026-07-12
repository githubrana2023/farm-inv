import { View, } from 'react-native'
import Container from '@/components/shared/container'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useColorScheme } from 'nativewind'
import { EMPLOYEE_NAME, ORDER_NAME, SAVE_NAME } from '@/constants'
import { saveOrder } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { saveFile } from '@/lib/expo-file-system/save-file'

const ItemsList = () => {
    const { colorScheme } = useColorScheme();

    return (
        <Container>
            <View className='flex-1 justify-between py-4'>
                <Text >ItemsList</Text>
                <View className='flex-row justify-between'>
                    <View className="flex-row">
                        <Button
                            onPress={() => saveFile('Tags')}
                            className='rounded-r-none'
                            size={'sm'}
                        >
                            <Text>Inv</Text>
                        </Button>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    onPress={() => { }}
                                    className='rounded-l-none'
                                    size={'sm'}
                                >
                                    <Text>
                                        <FontAwesome6 name='arrow-down' iconStyle='solid'
                                            color={colorScheme === 'dark' ? 'black' : 'white'}
                                        />
                                    </Text>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side='top'>
                                <DropdownMenuItem onPress={() => { }} className='flex-row'
                                >
                                    <FontAwesome6 name='circle-plus' iconStyle='solid' color={colorScheme === 'dark' ? 'white' : 'black'}
                                    />
                                    <Text className='font-semibold'>Add New</Text>
                                </DropdownMenuItem>
                                <Separator />
                                {
                                    SAVE_NAME.map(({ name, onPress }, i) => (
                                        <View key={name}>
                                            <DropdownMenuItem key={name} onPress={() => onPress(name)}>
                                                <Text className='font-semibold'>{name}</Text>
                                            </DropdownMenuItem>
                                            {SAVE_NAME.length !== i + 1 && <Separator />}
                                        </View>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </View>
                    <View className="flex-row">
                        <Button
                            onPress={() => saveFile('Tags')}
                            className='rounded-r-none'
                            size={'sm'}
                        >
                            <Text>Tags</Text>
                        </Button>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    onPress={() => { }}
                                    className='rounded-l-none'
                                    size={'sm'}
                                >
                                    <Text>
                                        <FontAwesome6 name='arrow-down' iconStyle='solid'
                                            color={colorScheme === 'dark' ? 'black' : 'white'}
                                        />
                                    </Text>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side='top'>
                                <DropdownMenuItem onPress={() => { }} className='flex-row'
                                >
                                    <FontAwesome6 name='circle-plus' iconStyle='solid' color={colorScheme === 'dark' ? 'white' : 'black'}
                                    />
                                    <Text className='font-semibold'>Add New</Text>
                                </DropdownMenuItem>
                                <Separator />
                                {
                                    EMPLOYEE_NAME.map(({ name, onPress }, i) => (
                                        <View key={name}>
                                            <DropdownMenuItem key={name} onPress={() => onPress(name)}>
                                                <Text className='font-semibold'>{name}</Text>
                                            </DropdownMenuItem>
                                            {SAVE_NAME.length !== i + 1 && <Separator />}
                                        </View>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </View>

                    <View className="flex-row">
                        <Button
                            onPress={() => saveOrder()}
                            className='rounded-r-none'
                        >
                            <Text>Order</Text>
                        </Button>
                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Button
                                    onPress={() => { }}
                                    className='rounded-l-none'
                                >
                                    <Text>
                                        <FontAwesome6 name='arrow-down' iconStyle='solid'
                                            color={colorScheme === 'dark' ? 'black' : 'white'}
                                        />
                                    </Text>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side='top'>
                                <DropdownMenuItem onPress={() => { }} className='flex-row'
                                >
                                    <FontAwesome6 name='circle-plus' iconStyle='solid' color={colorScheme === 'dark' ? 'white' : 'black'}
                                    />
                                    <Text className='font-semibold'>Add New</Text>
                                </DropdownMenuItem>
                                {
                                    ORDER_NAME.map(({ name, onPress }, i) => (
                                        <View key={name}>
                                            <DropdownMenuItem onPress={() => onPress(name)}>
                                                <Text className='font-semibold'>{name}</Text>
                                            </DropdownMenuItem>
                                            {ORDER_NAME.length !== i + 1 && <Separator />}
                                        </View>
                                    ))
                                }
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </View>


                    <Button
                        onPress={() => saveOrder()}
                    >
                        <Text>Print</Text>
                    </Button>
                </View>

            </View>
        </Container>
    )
}

export default ItemsList