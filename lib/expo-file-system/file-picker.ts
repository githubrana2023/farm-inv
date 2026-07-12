import { FILE_URI_KEY } from "@/constants"
import { getNonStringStoredData, storeData } from "../async-storage"
import { StoredFileInfo } from "@/constants/type"
import { Directory, File, Paths } from "expo-file-system"
import Toast from "react-native-toast-message"
import { showError } from "../toast/error"
import { showSuccess } from "../toast/success"




const ensureDbDir = () => {
    const directory = new Directory(Paths.document, 'database')
    if (!directory.exists) {
        directory.create()
    }
    return directory
}


const validateDbFile = (file: File) => {
    if (!file.exists) {
        showError('Database is missing!')
        return false
    }

    if (
        !file.name.startsWith('Farm') ||
        !file.name.endsWith('.db')
    ) {
        showError('Wrong file picked!')
        return false
    }

    return true
}

const copyDb = async (sourceFile: File) => {

    const databaseDir = await ensureDbDir()
    const destination = new File(databaseDir, 'Farm.db')

    await sourceFile.copy(destination, { overwrite: true })
    showSuccess('Database imported!')
}

const savePickedFile = async (file: File) => {
    await storeData<StoredFileInfo>({
        key: FILE_URI_KEY,
        isStringValue: false,
        value: {
            fileName: file.name,
            fileUri: file.uri,
        },
    });
}


const pickDatabaseFile = async () => {
    const picked = await File.pickFileAsync();

    if (picked.canceled) {
        showError("Select the db file!");
        return null;
    }

    if (!picked.result) {
        showError("Select the db file!");
        return null;
    }

    if (!validateDbFile(picked.result)) {
        return null;
    }

    return picked.result;
}




export const filePicker = async () => {
    try {
        const stored = await getNonStringStoredData<StoredFileInfo>(
            FILE_URI_KEY
        );

        // Database already selected before
        if (stored) {
            const source = new File(stored.fileUri);

            if (!validateDbFile(source)) {
                return;
            }

            await copyDb(source);
            return;
        }

        // Ask user to pick a file
        const file = await pickDatabaseFile();

        if (!file) {
            return;
        }

        await savePickedFile(file);
        await copyDb(file);
    } catch (error) {
        console.error(error);
        showError("Failed to import database.");
    }
}