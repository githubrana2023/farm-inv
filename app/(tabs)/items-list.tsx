import { View, } from 'react-native'
import Container from '@/components/shared/container'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useColorScheme } from 'nativewind'
import { MODAL_TYPE, ORDER_NAME, SAVE_NAME } from '@/constants'
import { saveOrder } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { saveFile } from '@/lib/expo-file-system/save-file'
import { useEmployeesGetQuery } from '@/hooks/tanstack/mutation/employee'
import { useModalAction } from '@/hooks/redux/use-modal'

const ItemsList = () => {
    const { colorScheme } = useColorScheme();
    const { onOpen } = useModalAction()

    const { data } = useEmployeesGetQuery()
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
                                <DropdownMenuItem onPress={() => onOpen(MODAL_TYPE.EMPLOYEE_CREATE_MODAL)} onLongPress={() => { 'longpressed' }} className='flex-row'
                                >
                                    <FontAwesome6 name='circle-plus' iconStyle='solid' color={colorScheme === 'dark' ? 'white' : 'black'}
                                    />
                                    <Text className='font-semibold'>Add New</Text>
                                </DropdownMenuItem>
                                <Separator />
                                {
                                    data?.map(({ emp, onPress }, i) => (
                                        <View key={emp.employeeId}>
                                            <DropdownMenuItem onPress={() => onPress(`tag-${emp.name}`)}>
                                                <Text className='font-semibold'>{emp.name}</Text>
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