import { View, Text } from 'react-native'
import * as React from 'react';
import { ThrowableForm } from '@/components/form/throwable-form';
import Container from '@/components/shared/container';
import { GrabAndGoForm } from '@/components/form/grab-and-go-scan-form';
import { Label } from '@/components/ui/label'
import { usePathname } from 'expo-router';
import { cn } from '@/lib/utils';

type TabComponentName = 'throwable' | 'grab&go'
type TabComponentMap = Record<TabComponentName, () => React.JSX.Element>

const Throwable = () => {

    const [tab, setTab] = React.useState<TabComponentName>('throwable')

    const pathName = usePathname()
    const isGrabAndGoActive = pathName === '/grab-and-go'
    const isThrowableActive = pathName === '/throwable'
    console.log({
        isGrabAndGoActive,
        isThrowableActive
    })

    const TabComponents: TabComponentMap = {
        "grab&go": GrabAndGoForm,
        'throwable': ThrowableForm
    }

    const TabComponent = TabComponents[tab]



    return (
        <Container>
            <View className="flex-1">
                <View className='flex-1'>
                    <TabComponent />
                </View>

                {/* Toggle button */}
                <View className="flex-row items-center justify-center py-6">
                    <View className="flex-row items-center justify-center gap-2 p-2 bg-white rounded-full"
                        style={{
                            boxShadow: "0px 6px 20px rgba(0,0,0,0.2)",
                        }}
                    >
                        <Label className={cn("px-2 py-0.5 rounded-full", tab === 'throwable' && 'bg-muted')} onPress={() => setTab('throwable')}>
                            Damage & Discount
                        </Label>
                        <Label className={cn("px-2 py-0.5 rounded-full", tab === 'grab&go' && 'bg-muted')} onPress={() => setTab('grab&go')}>
                            Grab & Go
                        </Label>
                    </View>
                </View>
            </View>
        </Container>
    )
}

export default Throwable