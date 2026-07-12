import { Directory } from 'expo-file-system'
import { storeData } from '../async-storage'
import { DIRECTORY_PERMISSION_KEY } from '@/constants'
import { StoredDirectoryInfo } from '@/constants/type'

export const documentPicker = async () => {
    const directory = await Directory.pickDirectoryAsync()

    if (!directory.exists) return null

    await storeData<StoredDirectoryInfo>({
        key: DIRECTORY_PERMISSION_KEY,
        isStringValue: false,
        value: {
            directoryUri: directory.uri,
            directoryName: directory.name
        }
    })

    return directory
}