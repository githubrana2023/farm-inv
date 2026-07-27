import { View, Text } from 'react-native'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as React from 'react';
import { ThrowableForm } from '@/components/form/throwable-form';
import Container from '@/components/shared/container';
import { GrabAndGoForm } from '@/components/form/grab-and-go-scan-form';
const Throwable = () => {
    const [value, setValue] = React.useState('scan');

    return (
        <Container>
            <View className='flex-1'>
                <ThrowableForm />
            </View>
        </Container>
    )
}

export default Throwable