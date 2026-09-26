import React, { useCallback, useMemo, useRef } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
    BottomSheetModal,
    BottomSheetView,
    BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Button } from '../ui/button';
import { Text } from '../ui/text';
import { Icon } from '../ui/icon';
import { Menu } from 'lucide-react-native';
import { Href, useRouter } from 'expo-router';
import { Separator } from '../ui/separator';
import { Label } from '../ui/label';
type Route = {
    label: string;
    href: Href
}

const routes: Route[] = [
    {
        label: 'Regular Scan',
        href: '/(tabs)/(home)'
    },
    {
        label: 'Grab & Go',
        href: '/(tabs)/(home)/grab-and-go'
    },
    {
        label: '1+1 / Throwing / Overstock',
        href: '/(tabs)/files'
    },
    {
        label: 'Expiry Monitoring',
        href: '/(tabs)/files'
    },
]

export const FormRouteManu = () => {
    // ref
    const formRouteSheetRef = useRef<BottomSheetModal>(null);
    const router = useRouter()

    // callbacks
    const handlePresentModalPress = useCallback(() => {
        formRouteSheetRef.current?.present();
    }, []);
    return (
        <>
            <Button size={'sm'} onPress={handlePresentModalPress}>
                <Text>
                    <Icon
                        as={Menu}
                    />
                </Text>
            </Button>
            <BottomSheetModal
                ref={formRouteSheetRef}
                snapPoints={['90%']}
                enablePanDownToClose
            >

                <BottomSheetView className='flex-1 p-6 border-t-2 rounded-sm'>
                    <Label>
                        Scan Form Routes
                    </Label>
                    <Separator className='my-2' />
                    <View className='flex-row gap-1 flex-wrap'>
                        {
                            routes.map(({ href, label }) => (
                                <Button onPress={() => router.replace(href)} key={`${label}+${href}`}>
                                    <Text>{label}</Text>
                                </Button>
                            ))
                        }
                    </View>
                </BottomSheetView>
            </BottomSheetModal>
        </>
    )
}