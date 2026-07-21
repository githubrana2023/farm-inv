import { Directory, Paths } from 'expo-file-system'
import { getNonStringStoredData, storeData } from '../async-storage'
import { DIRECTORY_PERMISSION_KEY } from '@/constants'
import { StoredDirectoryInfo } from '@/constants/type'
import { showError } from '../toast/error'

export const directoryPicker = async () => {
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

export function validateDirectory(directory: Directory | null): directory is Directory {
    if (!directory?.exists) {
        showError("Directory does not exist!");
        return false;
    }

    return true;
}


export async function getDirectory(): Promise<Directory | null> {
    try {
        const stored = await getNonStringStoredData<StoredDirectoryInfo>(
            DIRECTORY_PERMISSION_KEY
        );

        if (!stored) {
            const directory = await directoryPicker();

            if (!validateDirectory(directory)) {
                return null;
            }

            return directory;
        }

        const directory = new Directory(stored.directoryUri);

        if (!validateDirectory(directory)) {
            return null;
        }

        return directory;
    } catch (error) {
        showError('Please select the folder')
        return null
    }
}


export const ensureDbDir = () => {
    const directory = new Directory(Paths.document, 'database')
    if (!directory.exists) {
        directory.create()
    }
    return directory
}
