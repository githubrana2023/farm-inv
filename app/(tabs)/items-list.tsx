import { FlatList, TouchableOpacity, View, } from 'react-native'
import Container from '@/components/shared/container'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useColorScheme } from 'nativewind'
import { ALERT_MODAL_TYPE, MODAL_TYPE, SCAN_FLAG_TYPE, SCAN_TYPE_KEY, ScanFlag, } from '@/constants'
import { Separator } from '@/components/ui/separator'
import { saveOrder } from '@/lib/expo-file-system/save-file'
import { useEmployeesGetQuery } from '@/hooks/tanstack/mutation/employee'
import { useModalAction } from '@/hooks/redux/use-modal'
import { useLabelingGetQuery } from '@/hooks/tanstack/mutation/labeling'
import { useRouter } from 'expo-router'
import { useState, useCallback, useMemo, useRef } from 'react'
import ScannedItemCard from '@/components/shared/scanned-item-card'
import { Input } from '@/components/ui/input'
import { useGetScannedItems, useGetStoredScannedItemsSearch } from '@/hooks/tanstack/mutation/item/get-item'
import { useAlertModalActionWithPayload, useAlertModalWithPayload } from '@/hooks/redux/use-alert-modal'
import AlertModal from '@/components/shared/alert-modal'
import ItemListItemCard from '@/components/shared/item-list-item-card'
import { useDeleteItemById } from '@/hooks/tanstack/mutation/item/delete-item '
import { showSuccess } from '@/lib/toast/success'
import { queryClient } from '@/components/provider/tanstack-query-client'
import { MUTATION_KEY } from '@/constants/tanstack-query'
import { useUpdateItemById } from '@/hooks/tanstack/mutation/item/update-item'
import { showError } from '@/lib/toast/error'
import Lucide from '@react-native-vector-icons/lucide'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, useBottomSheet } from '@gorhom/bottom-sheet';
import { saveInventory } from '@/lib/expo-file-system/save-inventory'


const ItemsList = () => {
    const { data: employees } = useEmployeesGetQuery()
    const { data: label } = useLabelingGetQuery()
    const [inputValue, setInputValue] = useState({ search: "", title: "" })
    const { data: items, } = useGetScannedItems()
    const { data: searchItems } = useGetStoredScannedItemsSearch(inputValue.search)
    const { isAlertOpenWithPayload, payload } = useAlertModalWithPayload()
    const { onAlertOpenWithPayload, onAlertCloseWithPayload } = useAlertModalActionWithPayload()
    const { mutate: deleteItemById } = useDeleteItemById()
    const { mutate: updateItemById } = useUpdateItemById()
    const bottomSheetRef = useRef<BottomSheet>(null);
    // variables
    const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);
    // callbacks
    // callbacks
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);
    const handleSnapPress = useCallback((index: number) => {
        bottomSheetRef.current?.snapToIndex(index);
    }, []);
    const handleClosePress = useCallback(() => {
        bottomSheetRef.current?.close();
    }, []);
    const allItems = (inputValue.search.length > 0 ? searchItems?.data : items?.data?.scannedItems)

    const data = allItems ?? []

    const isUpdateAlert = isAlertOpenWithPayload &&
        payload &&
        payload.type ===
        ALERT_MODAL_TYPE.SCANNED_ITEM.UPDATE


    const isDeleteAlert = isAlertOpenWithPayload &&
        payload &&
        payload.type ===
        ALERT_MODAL_TYPE.SCANNED_ITEM.DELETE


    const alertTitle =
        `Sure? Item ${isUpdateAlert ? "quantity" : ""} will be ${isUpdateAlert ? `updated to ${payload.quantity} ${payload.uom}` : "deleted"}!`;
    const alertDescription = isDeleteAlert ?
        payload.description :
        isUpdateAlert ? `${payload.description} (Previous Quantity ${payload.previousQuantity} ${payload.uom})` : ""

    const onConfirm = () => {
        if (!payload) return showError('Payload missing to delete item!')
        if (isDeleteAlert) {
            deleteItemById(payload.id, {
                onSuccess(data) {
                    if (data.success) {
                        showSuccess(data.message)
                        onAlertCloseWithPayload()
                        queryClient.invalidateQueries({
                            queryKey: [MUTATION_KEY.SCANNED_ITEM.READ]
                        })
                    }
                }
            })
            return
        }
        if (isUpdateAlert) {
            updateItemById(
                {
                    id: payload.id,
                    quantity: payload.quantity
                },
                {
                    onSuccess(data) {
                        if (data.success) {
                            showSuccess(data.message)
                            onAlertCloseWithPayload()
                            queryClient.invalidateQueries({
                                queryKey: [MUTATION_KEY.SCANNED_ITEM.READ]
                            })
                        }
                    }
                }
            )
            return
        }

    };

    return (
        <>
            <AlertModal
                isOpen={!!isDeleteAlert || !!isUpdateAlert}
                title={alertTitle}
                description={alertDescription}
                onConfirm={onConfirm}
                onCancel={onAlertCloseWithPayload}
            />

            <View className='flex-1 justify-between py-2'>
                <View className='flex-1'>
                    {/* Inventory Save Form */}
                    <View className=" gap-2 py-2">
                        <View className="relative">
                            <Input
                                placeholder="Item Title"
                                onChangeText={(text) => {
                                    setInputValue(prev => ({ ...prev, title: text }))
                                }}
                                value={inputValue.title}
                            />

                            {/* Clear Button */}
                            {inputValue.title.length > 0 && (
                                <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                    <TouchableOpacity
                                        onPress={() => {
                                            setInputValue(prev => ({ ...prev, title: "" }))
                                        }}
                                    >
                                        <Lucide name='x-circle' size={20} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        <View className="relative">
                            <Input
                                placeholder="Search"
                                onChangeText={(text) => {
                                    setInputValue(prev => ({ ...prev, search: text }))
                                }}
                                value={inputValue.search}
                            />

                            {/* Clear Button */}
                            {inputValue.search.length > 0 && (
                                <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                    <TouchableOpacity
                                        onPress={() => {
                                            setInputValue(prev => ({ ...prev, search: "" }))
                                        }}
                                    >
                                        <Lucide name='x-circle' size={20} />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </View>

                    {/* scanned items */}
                    <FlatList
                        className="py-2 flex-1"
                        showsVerticalScrollIndicator={false}
                        data={data}
                        renderItem={({ item, index }) => (
                            <ItemListItemCard
                                key={item.id}
                                item={item}
                                enableActionBtn
                                isCollapseAble
                                defaultCollapse={index !== 0}
                                onDelete={(item) => {
                                    onAlertOpenWithPayload({
                                        type: ALERT_MODAL_TYPE.SCANNED_ITEM.DELETE,
                                        id: item.id,
                                        description: item.description,
                                    })
                                }}
                                onUpdate={(item) => {
                                    onAlertOpenWithPayload({
                                        type: ALERT_MODAL_TYPE.SCANNED_ITEM.UPDATE,
                                        id: item.id,
                                        description: item.description,
                                        previousQuantity: item.previousQuantity,
                                        quantity: String(item.quantity),
                                        uom: item.uom
                                    })
                                }}
                            />
                        )}
                    />
                </View>

                <BottomSheet
                    snapPoints={snapPoints}
                    enableDynamicSizing={false}
                    ref={bottomSheetRef}
                    onChange={handleSheetChanges}
                    index={-1}
                    enablePanDownToClose
                >
                    <BottomSheetView className='flex-1 p-8'>
                        <View className='gap-2'>
                            {
                                [
                                    {
                                        label: "Inventory",
                                        onPress: async (flag: string, prefix: string) => {
                                            await saveInventory(prefix)
                                            // showSuccess(prefix, flag)
                                            handleClosePress()
                                        },
                                        buttons: [
                                            { label: "Inventory", },
                                            { label: "Non Food Over Stock", },
                                            { label: "Food Over Stock", },
                                            { label: "Deli", },
                                            { label: "Veg", },
                                            { label: "Cig", },
                                            { label: "Water", },
                                            { label: "Meat", },
                                            { label: "Louziano", },
                                            { label: "Bakery", },
                                            { label: "Chickens & Eggs", },
                                            { label: "T96", },
                                            { label: "T27", },
                                            { label: "T77", },
                                            { label: "T15", },
                                            { label: "T19", },
                                            { label: "Kwh Exp", },
                                            { label: "Throwing", },
                                            { label: "One Plus One", },
                                        ]
                                    },
                                    {
                                        label: "Tags",
                                        onPress: async (flag: string, prefix: string) => {
                                            // showSuccess(prefix, flag)
                                            handleClosePress()
                                        },
                                        buttons: [
                                            { label: "Tags", },
                                            { label: "Jojo", },
                                            { label: "Jitendra", },
                                            { label: "Raam", },
                                            { label: "Trishudhan", },
                                        ]
                                    },
                                    {
                                        label: "Order",
                                        onPress: async (flag: string, prefix: string) => {
                                            // showSuccess(prefix, flag)
                                            handleClosePress()
                                        },
                                        buttons: [
                                            { label: "Kwh", },
                                            { label: "Veg", },
                                            { label: "Louziano", },
                                            { label: "Direct", },
                                        ]
                                    },
                                ].map(({ label, buttons, onPress }) => (
                                    <View key={label}>
                                        <View>
                                            <Text>{label}</Text>
                                        </View>
                                        <Separator className='my-1' />
                                        <View className='flex-row gap-1 flex-wrap'>
                                            {buttons.map(button => (

                                                <Button size={'sm'} key={button.label} onPress={async () => await onPress(label, button.label)}>
                                                    <Text>{button.label}</Text>
                                                </Button>
                                            ))}
                                        </View>
                                    </View>
                                ))
                            }
                        </View>
                    </BottomSheetView>
                </BottomSheet>
                {/* below buttons */}
                <View className='bg-background flex-row justify-between items-center  rounded-md p-1 shadow-sm shadow-black/5'>
                    <View className="flex-row">
                        <Button
                            onPress={() => handleSnapPress(2)}
                            className='rounded-r-none flex-1'
                        >
                            <Text>Save</Text>
                        </Button>
                        <Separator orientation='vertical' />
                        <Button
                            className='rounded-l-none '
                            onPress={() => bottomSheetRef?.current?.close()}
                        >
                            <Text>Close</Text>
                        </Button>

                    </View>
                </View>

            </View>
        </ >
    )
}

export default ItemsList


// const Inventory = ({ invLabels, fileName, items }: {
//     invLabels: {
//         id: string;
//         label: string;
//         saveFlag: "Inventory" | "Order";
//         onPress: SaveInventoryFn
//     }[],
//     items: any[]
//     fileName?: string
// }) => {

//     const { colorScheme } = useColorScheme();
//     const { onOpen } = useModalAction()

//     return (
//         <View className="flex-row">
//             <Button
//                 onPress={async () => {
//                     await saveInventory({ items, prefix: 'inv', saveFlag: fileName })
//                 }}
//                 className='rounded-r-none h-8 pr-1.5'
//                 size={'sm'}
//             >
//                 <Text>Inv</Text>
//             </Button>
//             <DropdownMenu >
//                 <DropdownMenuTrigger asChild>
//                     <Button
//                         className='rounded-l-none h-8 pl-2'
//                         size={'sm'}
//                     >
//                         <Text>
//                             <Lucide name='arrow-down' size={14}
//                                 color={colorScheme === 'dark' ? 'black' : 'white'}
//                             />
//                         </Text>
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent side='top'>
//                     <DropdownMenuItem
//                         onPress={() => onOpen(MODAL_TYPE.LABELING.CREATE)}
//                         className='flex-row'
//                     >
//                         <Lucide name='circle-plus' color={colorScheme === 'dark' ? 'white' : 'black'}
//                         />
//                         <Text className='font-semibold'>Add New</Text>
//                     </DropdownMenuItem>
//                     <Separator />
//                     {
//                         invLabels.map(({ id, label: menuItem, onPress }, i) => (
//                             <View key={id}>
//                                 <DropdownMenuItem onPress={async () => await onPress({ items, prefix: 'inv', saveFlag: menuItem })}>
//                                     <Text className='font-semibold'>{menuItem}</Text>
//                                 </DropdownMenuItem>
//                                 {invLabels.length !== i + 1 && <Separator />}
//                             </View>
//                         ))
//                     }
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </View>
//     )
// }

// const Order = ({ orderLabels, fileName, items }: {
//     orderLabels: {
//         id: string;
//         label: string;
//         saveFlag: "Inventory" | "Order";
//         onPress: SaveOrderFn
//     }[],
//     fileName?: string
//     items: any[]
// }) => {

//     const { colorScheme } = useColorScheme();
//     const { onOpen } = useModalAction()

//     return (
//         <View className="flex-row">
//             <Button
//                 onPress={async () => {
//                     await saveOrder({
//                         items,
//                         prefix: 'order',
//                         saveFlag: fileName
//                     })
//                 }}
//                 className='rounded-r-none h-8 pr-1.5'
//                 size={'sm'}
//             >
//                 <Text>Order</Text>
//             </Button>
//             <DropdownMenu >
//                 <DropdownMenuTrigger asChild>
//                     <Button
//                         className='rounded-l-none h-8 pl-2'
//                         size={'sm'}
//                     >
//                         <Text>
//                             <Lucide name='arrow-down' size={14}
//                                 color={colorScheme === 'dark' ? 'black' : 'white'}
//                             />
//                         </Text>
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent side='top'>
//                     <DropdownMenuItem onPress={() => onOpen(MODAL_TYPE.LABELING.CREATE)} className='flex-row'
//                     >
//                         <Lucide name='circle-plus' color={colorScheme === 'dark' ? 'white' : 'black'}
//                         />
//                         <Text className='font-semibold'>Add New</Text>
//                     </DropdownMenuItem>
//                     {
//                         orderLabels.map(({ id, label: menuItem, onPress }, i) => (
//                             <View key={id}>
//                                 <DropdownMenuItem
//                                     onPress={async () => onPress(
//                                         {
//                                             items,
//                                             prefix: 'order',
//                                             saveFlag: menuItem
//                                         }
//                                     )}>
//                                     <Text className='font-semibold'>{menuItem}</Text>
//                                 </DropdownMenuItem>
//                                 {orderLabels.length !== i + 1 && <Separator />}
//                             </View>
//                         ))
//                     }
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </View>
//     )
// }

// const Tag = ({ employees, fileName, items }: {
//     employees: {
//         emp: {
//             employeeId: string;
//             name: string;
//             employeeTitle: string;
//         };
//         onPress: SaveInventoryFn
//     }[],
//     fileName?: string
//     items: {
//         regularItems: any[]
//         promoItems: any[]
//     }

// }) => {
//     const { colorScheme } = useColorScheme();
//     const { onOpen } = useModalAction()

//     const router = useRouter()

//     return (
//         <View className="flex-row">
//             <Button
//                 onPress={async () => {
//                     await saveInventory({
//                         items: items.regularItems,
//                         prefix: 'tags',
//                         saveFlag: fileName
//                     })
//                     await saveInventory({
//                         items: items.promoItems,
//                         prefix: 'tags',
//                         saveFlag: fileName
//                     })
//                 }}
//                 className='rounded-r-none h-8 pr-1.5'
//                 size={'sm'}
//             >
//                 <Text>Tags</Text>
//             </Button>
//             <DropdownMenu  >
//                 <DropdownMenuTrigger asChild>
//                     <Button
//                         className='rounded-l-none h-8 pl-2'
//                         size={'sm'}
//                     >
//                         <Text>
//                             <Lucide name='arrow-down' size={14}
//                                 color={colorScheme === 'dark' ? 'black' : 'white'}
//                             />
//                         </Text>
//                     </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent side='top'>
//                     <DropdownMenuItem onPress={() => onOpen(MODAL_TYPE.EMPLOYEE.CREATE)} className='flex-row'
//                     >
//                         <Lucide name='circle-plus' color={colorScheme === 'dark' ? 'white' : 'black'}
//                         />
//                         <Text className='font-semibold'>Add New</Text>
//                     </DropdownMenuItem>
//                     <Separator />
//                     {
//                         employees?.map(({ emp, onPress }, i) => (
//                             <View key={emp.employeeId}>
//                                 <DropdownMenuItem
//                                     onPress={async () => {
//                                         await onPress({
//                                             items: items.regularItems,
//                                             prefix: 'r-tags',
//                                             saveFlag: emp.name
//                                         })
//                                         await onPress({
//                                             items: items.promoItems,
//                                             prefix: 'p-tags',
//                                             saveFlag: emp.name
//                                         })
//                                     }}
//                                     onLongPress={(c) => router.push(`/employee/${emp.employeeId}`)}
//                                 >
//                                     <Text className='font-semibold'>{emp.name}</Text>
//                                 </DropdownMenuItem>
//                                 {employees?.length !== i + 1 && <Separator />}
//                             </View>
//                         ))
//                     }
//                 </DropdownMenuContent>
//             </DropdownMenu>
//         </View>
//     )
// }