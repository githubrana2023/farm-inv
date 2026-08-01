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
            <ThrowableForm />
        </Container>
    )
}

export default Throwable