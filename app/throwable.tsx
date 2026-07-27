import { View, Text } from 'react-native'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as React from 'react';
import { ThrowableForm } from '@/components/form/throwable-form';
import Container from '@/components/shared/container';
const Throwable = () => {
    const [value, setValue] = React.useState('scan');

    return (
        <Container>
            <Tabs value={value} onValueChange={setValue} className="flex-1 justify-between">
                <TabsContent value="scan">
                    <ThrowableForm />
                </TabsContent>
                <TabsContent value="grab&go">
                    <Text>
                        Change your password here.
                    </Text>
                </TabsContent>
                <TabsList className='flex-row w-full'>
                    <TabsTrigger value="scan">
                        <Text>Throwing & Discount</Text>
                    </TabsTrigger>
                    <TabsTrigger value="grab&go">
                        <Text>Grab & Go</Text>
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </Container>
    )
}

export default Throwable