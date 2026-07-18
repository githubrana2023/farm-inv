import { View } from 'react-native'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Text } from './ui/text'
import { Separator } from './ui/separator'
import { Button } from './ui/button'
import { removeStoredData } from '@/lib/async-storage'
import { DIRECTORY_PERMISSION_KEY, FILE_URI_KEY } from '@/constants'
import { filePicker } from '@/lib/expo-file-system/file-picker'
import { ensureDbDir } from '@/lib/expo-file-system/directory-picker'
import CardWrapper from './shared/card-wrapper'
import { File } from 'expo-file-system'
import FontAwesome6 from '@react-native-vector-icons/fontawesome6'
import { useColorScheme } from 'nativewind'
import { Card } from './ui/card'

const AppSettings = () => {
    // const permission = usePermission()
    // const file = useFile(FILE_URI_KEY)
    const { colorScheme } = useColorScheme()
    const color = colorScheme === 'dark' ? "black" : 'white'

    const test = () => {
        const databaseFile = new File(ensureDbDir(), '/database/Farm.db')

        console.log({ databaseFile });
    }


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




            <Card>

            </Card>


            <CardWrapper
                title="Database settings"
                description="Manage your database"
                headerContent={<HeaderContent />}
            >
                <View className='gap-2'>
                    <View className='flex-row justify-between items-center'>
                        <Button
                            onPress={filePicker}
                            size={'sm'}
                        // onPress={test}
                        >
                            <FontAwesome6 name='file-import' iconStyle='solid' color={color} />
                            <Text>Import DB</Text>
                        </Button>
                        <Text className='font-semibold'>Last Updated : Today</Text>

                    </View>
                    <View className='flex-row justify-between items-center'>
                        <Button
                            size={'sm'}
                            onPress={filePicker}
                        >
                            <Text>Check DB</Text>
                        </Button>
                        <Text className='font-semibold'>DB Status : Ready</Text>
                    </View>
                    <Button
                        // onPress={filePicker}
                        size={'sm'}
                        variant={'destructive'}
                        onPress={test}
                    >
                        <FontAwesome6 name='trash-can' iconStyle='solid' color={color} />
                        <Text>Clear Inventory</Text>
                    </Button>
                </View>
                <Separator className='my-4' />

                <Button onPress={() => removeStoredData(DIRECTORY_PERMISSION_KEY)} size={'sm'}>
                    <Text>Remove Folder Permission</Text>
                </Button>
                <Separator className='my-4' />
                <Button onPress={() => removeStoredData(FILE_URI_KEY)} size={'sm'}>
                    <Text>Remove File Uri</Text>
                </Button>
            </CardWrapper>



        </View>
    )
}


const HeaderContent = () => {
    const { colorScheme } = useColorScheme()
    const color = colorScheme === 'dark' ? "black" : 'white'
    return (
        <Button size={'sm'}>
            <FontAwesome6 name='download' iconStyle='solid' color={color} />
            <Text>Download DB</Text>
        </Button>
    )
}

export default AppSettings