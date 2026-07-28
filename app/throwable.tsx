import { View } from 'react-native'
import * as React from 'react';
import { ThrowableForm } from '@/components/form/throwable-form';
import Container from '@/components/shared/container';
import { GrabAndGoForm } from '@/components/form/grab-and-go-scan-form';
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useGetGrabAndGoFiftyPercentBarcodes } from '@/hooks/tanstack/query/grab-and-go/use-get-grab-and-go';
import { saveFile, saveGrabAndGoFiftyPercent } from '@/lib/expo-file-system/save-file';

type TabComponentName = 'throwable' | 'grab&go'
type TabComponentMap = Record<TabComponentName, () => React.JSX.Element>

const Throwable = () => {

    const [tab, setTab] = React.useState<TabComponentName>('throwable')
    const { data, isPending } = useGetGrabAndGoFiftyPercentBarcodes()

    const TabComponents: TabComponentMap = {
        "grab&go": GrabAndGoForm,
        'throwable': ThrowableForm
    }

    const TabComponent = TabComponents[tab]

    const generate = async () => {
        await saveGrabAndGoFiftyPercent()
    }



    return (
        <Container>
            <View className="flex-1">
                <View className='flex-1 justify-between'>
                    <TabComponent />
                </View>
                <View>
                    <Button size={'sm'} onPress={async () => {
                        if (tab === 'grab&go') {
                            await saveGrabAndGoFiftyPercent()
                            return
                        }
                    }}>
                        <Text>Generate</Text>
                    </Button>
                </View>



                {/* Toggle button */}
                <View className="flex-row items-center justify-center py-1">
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