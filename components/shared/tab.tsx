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
                    <View className="flex-row items-center justify-center gap-2 p-2 bg-secondary rounded-full"
                        style={
                            {
                                boxShadow: '0px 6px 10px rgba(0,0,0,0.15)'
                            }
                        }
                    >
                        {
                            tabLabels.map(tabLabel => {
                                const activated = tabLabel === activeTab
                                return (
                                    <Label
                                        key={tabLabel}
                                        className={cn("px-2 py-0.5 rounded-full", activated && 'bg-white')}
                                        onPress={() => setActiveTab(tabLabel)}
                                        style={
                                            activated ? {
                                                boxShadow: '0px 3px 5px rgba(0,0,0,0.2)'
                                            } : undefined
                                        }
                                    >
                                        {tabLabel}
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

