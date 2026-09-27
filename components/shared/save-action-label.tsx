import { useCallback, useRef, useState } from 'react';
import { Pressable, View } from 'react-native';
import {
    BottomSheetModal,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { Check, Save } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';
import { useLabelingGetQuery } from '@/hooks/tanstack/mutation/labeling';
import { saveAll } from '@/lib/expo-file-system/save-file';


export const SaveActionLabel = () => {

    // ref
    const saveActionLabelSheetRef = useRef<BottomSheetModal>(null);

    const { data } = useLabelingGetQuery()
    const [checked, setChecked] = useState(false)
    const router = useRouter()

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        saveActionLabelSheetRef.current?.present();
    }, []);
    return (
        <>
            <Button
                size={'sm'}
                onPress={handlePresentModalPress}
                className='flex-1'
                onLongPress={async () => {
                    await saveAll()
                }}
            >
                <Icon
                    as={Save}
                />
                <Text>
                    Save
                </Text>
            </Button>
            <BottomSheetModal
                ref={saveActionLabelSheetRef}
                snapPoints={['90%']}
                enablePanDownToClose
            >

                <BottomSheetView className='flex-1 p-6 border-t-2 rounded-sm gap-2'>
                    <View>
                        <View className='flex-row gap-2'>
                            <Label>
                                Inventory
                            </Label>

                            <Pressable
                                onPress={() => setChecked(p => !p)}
                                className={cn('flex-row gap-1 items-center border rounded-sm px-2 py-1')}
                            >
                                <Text>Save & Clear</Text>
                                {
                                    checked && (<Icon
                                        as={Check}
                                    />)
                                }
                            </Pressable>

                        </View>
                        <Separator className='my-1.5' />
                        <View className='flex-row gap-1 flex-wrap'>
                            {
                                (data?.invLabels || []).map(({ onPress, label }) => (
                                    <Button onPress={async () => await onPress(label)} key={label}>
                                        <Text>{label}</Text>
                                    </Button>
                                ))
                            }
                        </View>
                    </View>
                    <View>
                        <Label>
                            Tags
                        </Label>
                        <Separator className='my-1.5' />
                        <View className='flex-row gap-1 flex-wrap'>
                            {
                                (data?.tagLabels || []).map(({ onPress, label }) => (
                                    <Button onPress={async () => await onPress(label)} key={label}>
                                        <Text>{label}</Text>
                                    </Button>
                                ))
                            }
                        </View>
                    </View>
                    <View>
                        <Label>
                            Order
                        </Label>
                        <Separator className='my-1.5' />
                        <View className='flex-row gap-1 flex-wrap'>
                            {
                                (data?.orderLabels || []).map(({ onPress, label }) => (
                                    <Button onPress={async () => await onPress(label)} key={label}>
                                        <Text>{label}</Text>
                                    </Button>
                                ))
                            }
                        </View>
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}