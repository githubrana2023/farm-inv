import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollView, View } from 'react-native'
import Container from '@/components/shared/container'
import { useState } from "react"
import { SettingsTab } from "@/constants/type"
import { APP_SETTINGS_TAB, SETTINGS_TABS, USER_SETTINGS_TAB } from "@/constants"
import { capitalizeFirstLetter, cn, splitWord } from "@/lib/utils"
import AppSettings from "@/components/app-settings"
import { Text } from "@/components/ui/text"
import EmployeeSettings from "@/components/employee-settings"

const Settings = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('app-settings')
    return (
        <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as SettingsTab)}
            className="flex-1 py-1"
        >
            <ScrollView>

                <TabsContent value={APP_SETTINGS_TAB}>
                    <AppSettings />
                </TabsContent>
                <TabsContent value={USER_SETTINGS_TAB}>
                    <EmployeeSettings />
                </TabsContent>
            </ScrollView>

            <TabsList className="w-full justify-around mt-auto">
                {
                    SETTINGS_TABS.map((tab) => (
                        <TabsTrigger key={tab} value={tab}>
                            <Text className={cn(tab === activeTab && "font-semibold")}>
                                {capitalizeFirstLetter(splitWord(tab, '-'))}
                            </Text>
                        </TabsTrigger>
                    ))
                }

            </TabsList>
        </Tabs>
    )
}

export default Settings