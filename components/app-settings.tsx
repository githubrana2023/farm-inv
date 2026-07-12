import { View } from 'react-native'
import React from 'react'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Text } from './ui/text'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { useFile, usePermission } from '@/hooks/permissions'
import { removeStoredData } from '@/lib/async-storage'
import { DIRECTORY_PERMISSION_KEY, FILE_URI_KEY } from '@/constants'
import { filePicker } from '@/lib/expo-file-system/file-picker'

const AppSettings = () => {
    // const permission = usePermission()
    // const file = useFile(FILE_URI_KEY)
    return (
        <View>
            {/* /BRANCH INPUT AREA */}
            <View className="gap-1">
                <Label>Branch Number</Label>
                <Input
                    keyboardType='numeric'
                    onChangeText={(v) => { }}
                    placeholder='Branch Code (eg. 001)'
                />
                <Separator />
            </View>
            {/* BRANCH INPUT AREA FINISH */}
            <Button
                onPress={filePicker}
            >
                <Text>Import Database</Text>
            </Button>
            <Separator className='my-4' />

            <Button onPress={() => removeStoredData(DIRECTORY_PERMISSION_KEY)}>
                <Text>Remove Folder Permission</Text>
            </Button>
            <Separator className='my-4' />
            <Button onPress={() => removeStoredData(FILE_URI_KEY)}>
                <Text>Remove File Uri</Text>
            </Button>
        </View>
    )
}

export default AppSettings