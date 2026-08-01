import { View } from 'react-native'
import React, { ComponentType, ReactNode, useState } from 'react'
import Container from './container';
import { Label } from '../ui/label';
import { cn } from '@/lib/utils';

type TabLabel = {
    label: string;
    hidden?: boolean;
}

type TabProps<T extends readonly TabLabel[]> = {
    tabContent: Record<T[number]['label'], ReactNode>;
    tabLabels: T
}

function ReusableTab<const T extends readonly TabLabel[],>({ tabLabels, tabContent }: TabProps<T>) {
    const [activeTab, setActiveTab] = useState<typeof tabLabels[number]['label']>(() => tabLabels[0]['label'])

    return (
        <View className="flex-1">
            <View className='flex-1'>
                {tabContent[activeTab]}
            </View>

            {/* Toggle button */}
            {
                !tabLabels.every(label => label.hidden) && (
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
                                    const activated = tabLabel.label === activeTab
                                    return (
                                        <React.Fragment
                                            key={tabLabel.label}
                                        >
                                            {
                                                !tabLabel.hidden && (
                                                    <Label
                                                        className={cn("px-2 py-0.5 rounded-full", activated && 'bg-white')}
                                                        onPress={() => setActiveTab(tabLabel.label)}
                                                        style={
                                                            activated ? {
                                                                boxShadow: '0px 3px 5px rgba(0,0,0,0.2)'
                                                            } : undefined
                                                        }
                                                    >
                                                        {tabLabel.label}
                                                    </Label>
                                                )
                                            }
                                        </React.Fragment>
                                    )
                                })
                            }
                        </View>
                    </View>
                )
            }
        </View>
    )
}

export default ReusableTab

