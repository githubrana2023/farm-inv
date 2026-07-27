import { View } from 'react-native'
import { ComponentType, useState } from 'react'
import Container from './container';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

type TabProps<T extends readonly string[]> = {
    tabContent: Record<T[number], ComponentType>;
    tabLabels: T
}

function ReusableTab<const T extends readonly string[],>({ tabLabels, tabContent }: TabProps<T>) {
    const [activeTab, setActiveTab] = useState<typeof tabLabels[number]>(tabLabels[0])

    const TabContent = tabContent[activeTab] as ComponentType<{}>


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
                                const activated = tabLabel === activeTab
                                return (
                                    <Label
                                        className={cn("px-2 py-0.5 rounded-full", activated && 'bg-white')}
                                        onPress={() => setActiveTab(tabLabel)}>
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

export default ReusableTab

