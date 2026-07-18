import { FlatList, View, } from 'react-native'
import Container from '@/components/shared/container'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useColorScheme } from 'nativewind'
import { MODAL_TYPE, } from '@/constants'
import { saveOrder } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { saveFile } from '@/lib/expo-file-system/save-file'
import { useEmployeesGetQuery } from '@/hooks/tanstack/mutation/employee'
import { useModalAction } from '@/hooks/redux/use-modal'
import { useLabelingGetQuery } from '@/hooks/tanstack/mutation/labeling'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import ScannedItemCard from '@/components/shared/scanned-item-card'
import { Input } from '@/components/ui/input'

const ItemsList = () => {
    const { data: employees } = useEmployeesGetQuery()
    const { data: label } = useLabelingGetQuery()
    const [inputValue, setInputValue] = useState({ search: "", title: "" })

    return (
        <Container>
            <View className='flex-1 justify-between py-2'>
                <View >
                    {/* Inventory Save Form */}
                    <View className="h-20 gap-2">
                        <Input
                            className="flex-1"
                            placeholder="Item Title"
                            onChangeText={(text) => {
                                setInputValue(prev => ({ ...prev, title: text }))
                            }}
                            value={inputValue.title}
                        />
                        <Input
                            className="flex-1"
                            placeholder="Search"
                            onChangeText={(text) => {
                                setInputValue(prev => ({ ...prev, search: text }))
                            }}
                            value={inputValue.search}
                        />
                    </View>

                    {/* scanned items */}
                    <FlatList
                        className="pb-0 flex-1"
                        showsVerticalScrollIndicator={false}
                        data={[]}
                        renderItem={({ item, index }) => (
                            <ScannedItemCard
                                key={''}
                                item={item}
                                enableActionBtn
                                isCollapseAble
                                defaultCollapse={index !== 0}
                                onDelete={(item) => {
                                    // dispatch(onOpen("item-list-delete"));
                                    // setActionState({ type: "delete", item });
                                }}
                                onUpdate={(item) => {
                                    // dispatch(onOpen("item-list-update"));
                                    // setActionState({ type: "update", item });
                                }}
                            />
                        )}
                    />
                </View>

                {/* below buttons */}
                <View className='bg-background flex-row justify-between items-center gap-1 rounded-md p-1 shadow-sm shadow-black/5'>
                    {/* INVENTORY */}
                    <Inventory invLabels={label?.invLabels ?? []} />
                    {/* TAGS */}
                    <Tag employees={employees ?? []} />
                    {/* ORDER */}
                    <Order orderLabels={label?.orderLabels ?? []} />

                    <Button
                        onPress={() => saveOrder()}
                        size={'sm'}
                        className='h-8'
                    >
                        <Text>Print</Text>
                    </Button>
                </View>

            </View>
        </Container>
    )
}

export default ItemsList


const Inventory = ({ invLabels }: {
    invLabels: {
        id: string;
        label: string;
        saveFlag: "Inventory" | "Order";
        createdAt: Date;
        updatedAt: Date;
        onPress: (prefix: string) => Promise<void>;
    }[]
}) => {

    const { colorScheme } = useColorScheme();
    const { onOpen } = useModalAction()

    return (
        <>
            <View className="flex-row">
                <Button
                    onPress={() => saveFile('Tags')}
                    className='rounded-r-none h-8 pr-0'
                    size={'sm'}
                >
                    <Text>Inv</Text>
                </Button>
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button
                            className='rounded-l-none h-8 pl-2'
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
                        <DropdownMenuItem
                            onPress={() => onOpen(MODAL_TYPE.LABELING.CREATE)}
                            className='flex-row'
                        >
                            <FontAwesome6 name='circle-plus' iconStyle='solid' color={colorScheme === 'dark' ? 'white' : 'black'}
                            />
                            <Text className='font-semibold'>Add New</Text>
                        </DropdownMenuItem>
                        <Separator />
                        {
                            invLabels.map(({ id, label: menuItem, onPress }, i) => (
                                <View key={id}>
                                    <DropdownMenuItem onPress={() => onPress(menuItem)}>
                                        <Text className='font-semibold'>{menuItem}</Text>
                                    </DropdownMenuItem>
                                    {invLabels.length !== i + 1 && <Separator />}
                                </View>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </View>
        </>
    )
}

const Order = ({ orderLabels }: {
    orderLabels: {
        id: string;
        label: string;
        saveFlag: "Inventory" | "Order";
        createdAt: Date;
        updatedAt: Date;
        onPress: (prefix: string) => Promise<void>;
    }[]
}) => {

    const { colorScheme } = useColorScheme();
    const { onOpen } = useModalAction()

    return (
        <>
            <View className="flex-row">
                <Button
                    onPress={() => saveOrder()}
                    className='rounded-r-none h-8 pr-0'
                    size={'sm'}
                >
                    <Text>Order</Text>
                </Button>
                <DropdownMenu >
                    <DropdownMenuTrigger asChild>
                        <Button
                            className='rounded-l-none h-8 pl-2'
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
                        <DropdownMenuItem onPress={() => onOpen(MODAL_TYPE.LABELING.CREATE)} className='flex-row'
                        >
                            <FontAwesome6 name='circle-plus' iconStyle='solid' color={colorScheme === 'dark' ? 'white' : 'black'}
                            />
                            <Text className='font-semibold'>Add New</Text>
                        </DropdownMenuItem>
                        {
                            orderLabels.map(({ id, label: menuItem, onPress }, i) => (
                                <View key={id}>
                                    <DropdownMenuItem
                                        onPress={() => onPress(menuItem)}>
                                        <Text className='font-semibold'>{menuItem}</Text>
                                    </DropdownMenuItem>
                                    {orderLabels.length !== i + 1 && <Separator />}
                                </View>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </View>
        </>
    )
}

const Tag = ({ employees }: {
    employees: {
        emp: {
            employeeId: number;
            name: string;
            employeeTitle: string;
            createdAt: Date;
            updatedAt: Date;
        };
        onPress: (prefix: string) => Promise<void>;
    }[]
}) => {
    const [, setOpen] = useState(false)
    const { colorScheme } = useColorScheme();
    const { onOpen } = useModalAction()

    const router = useRouter()

    return (
        <>
            <View className="flex-row">
                <Button
                    onPress={() => saveFile('Tags')}
                    className='rounded-r-none h-8 pr-0'
                    size={'sm'}
                >
                    <Text>Tags</Text>
                </Button>
                <DropdownMenu  >
                    <DropdownMenuTrigger asChild>
                        <Button
                            className='rounded-l-none h-8 pl-2'
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
                        <DropdownMenuItem onPress={() => onOpen(MODAL_TYPE.EMPLOYEE.CREATE)} className='flex-row'
                        >
                            <FontAwesome6 name='circle-plus' iconStyle='solid' color={colorScheme === 'dark' ? 'white' : 'black'}
                            />
                            <Text className='font-semibold'>Add New</Text>
                        </DropdownMenuItem>
                        <Separator />
                        {
                            employees?.map(({ emp, onPress }, i) => (
                                <View key={emp.employeeId}>
                                    <DropdownMenuItem
                                        onPress={() => onPress(`tag-${emp.name}`)}
                                        onLongPress={(c) => router.push(`/employee/${emp.employeeId}`)}
                                    >
                                        <Text className='font-semibold'>{emp.name}</Text>
                                    </DropdownMenuItem>
                                    {employees?.length !== i + 1 && <Separator />}
                                </View>
                            ))
                        }
                    </DropdownMenuContent>
                </DropdownMenu>
            </View>
        </>
    )
}