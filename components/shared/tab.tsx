import { View, Text } from 'react-native'
import React, { ComponentType, JSX, useState } from 'react'
import Container from './container';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';


const Tab = <T extends readonly string[],>({ tabLabels, tabContent }: {
    tabContent: Record<T[number], ComponentType>;
    tabLabels: T
}) => {
    const [activeTab, setActivTab] = useState<typeof tabLabels[number]>(tabLabels[0])

    const TabContent = tabContent[activeTab]

    return (
        <Container>
            <View className="flex-1">
                <View className='flex-1'>
                    <TabContent />
                </View>

                {/* Toggle button */}
                <View className="flex-row items-center justify-center ">
                    <View className="flex-row items-center justify-center gap-2 p-2 bg-secondary rounded-full">
                        {
                            tabLabels.map(tabLabel => {
                                const actived = tabLabel === activeTab
                                return (
                                    <Label
                                        className={cn("px-2 py-0.5 rounded-full", actived && 'bg-white')}
                                        onPress={() => setActivTab(tabLabel)}>
                                        Damage & Discount
                                    </Label>
                                )
                            })
                        }
                    </View>
                </View>
            </View>
        </Container>
    )
}

export default Tab