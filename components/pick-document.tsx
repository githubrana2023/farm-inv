import { View, Text } from 'react-native'
import { Button } from './ui/button'
import * as FsLegacy from 'expo-file-system/legacy';
import * as fs from 'expo-file-system/';
// import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key: string, value: unknown) => {

    const parsedValue = typeof value !== 'string' ? JSON.stringify(value) : value
    try {
        AsyncStorage.setItem(key, parsedValue)
    } catch (error) {
        console.log('error storing data', error)
    }
}

export const getStoredData = async (key: string) => {
    try {

        const storedData = await AsyncStorage.getItem(key);
        if (!storedData) return
        const [dbFileUri, folder] = await FsLegacy.StorageAccessFramework.readDirectoryAsync(storedData)

        return storedData
    } catch (e) {
        // error reading value
        console.log('error reading stored data', e)
    }
};

const PickDocument = () => {
    const { StorageAccessFramework: Saf } = FsLegacy



    const getPermission = async () => {
        const permission = await Saf.requestStoredDirectoryInfosAsync()

        if (permission.granted) {
            storeData('storedDirectoryUri', permission.directoryUri)
            console.log('stored')
        }
    }


    const pickFile = async () => {
        // const PickedFile = await fs.File.pickFileAsync()
        try {
            const current = new Date()
            const fileName =
                `myFile-${current.getFullYear()}-${current.getMonth()}-${current.getDate()}_${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}.txt`

            const uri = await getStoredData('storedDirectoryUri')
            if (!uri) return
            const [dbFileUri, folder] = await FsLegacy.StorageAccessFramework.readDirectoryAsync(uri)
            const newFile = await FsLegacy.StorageAccessFramework.createFileAsync(uri, fileName, 'text/plain')

            await FsLegacy.StorageAccessFramework.writeAsStringAsync(newFile, '6281116584|253|')
            const file = new fs.File(dbFileUri)

            const modified = file.lastModified
            if (!modified) return
            const modifiedDate = new Date(modified).getDate()
            const now = new Date().getDate()

            // if (now > modified) {
            //     console.log('please update the file')
            // }

            // const result = await file.lastModified
            console.log({ now, modifiedDate });
        } catch (e) {
            console.log('error picking file', e)
        }
    }

    return (
        <View>
            {/* <Button onPress={async () => await getPermission()}>
                <Text>Pick Document</Text>
            </Button> */}
            <Button onPress={pickFile}>
                <Text>Pick Document</Text>
            </Button>
        </View>
    )
}

export default PickDocument