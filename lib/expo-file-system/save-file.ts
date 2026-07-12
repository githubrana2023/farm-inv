// import { StoredDirectoryInfo } from "@/constants/type"
// import { getNonStringStoredData } from "../async-storage"
// import { DIRECTORY_PERMISSION_KEY } from "@/constants"
// import { documentPicker } from "./document-picker"
// import { Directory } from "expo-file-system"
// import Toast from "react-native-toast-message"

// export const saveFile = async (prefix: string) => {

//     const content = ''
//     //TODO:? fetch data from inventory table

//     let directory: Directory | null = null

//     try {
//         const permission = await getNonStringStoredData<StoredDirectoryInfo>(DIRECTORY_PERMISSION_KEY)

//         if (!permission) {
//             directory = await documentPicker()
//             if (!directory?.exists) return Toast.show({
//                 type: 'error',
//                 text1: 'Direct does not exist!'
//             })
//         } else {
//             const persistDirectory = new Directory(permission.directoryUri)

//             if (!persistDirectory.exists) return Toast.show({
//                 type: 'error',
//                 text1: 'Directory is missing!'
//             })
//             directory = persistDirectory
//         }


//         const fileName = generateFileName(prefix)

//         const newFile = directory.createFile(fileName, 'text/plain')
//         newFile.write(content, { append: true })
//         Toast.show({
//             type: 'success',
//             text1: 'File saved!'
//         })

//     } catch (error) {
//         console.log("Failed to save file")
//     }
// }

// const generateFileName = (prefix: string) => {
//     const current = new Date()
//     const date = String(current.getDate()).padStart(2, "0")
//     const month = String(current.getMonth() + 1).padStart(2, "0")
//     const year = current.getFullYear()

//     const hours = String(current.getHours()).padStart(2, "0")
//     const min = String(current.getMinutes()).padStart(2, "0")
//     const sec = String(current.getSeconds()).padStart(2, "0")

//     return `${prefix}_${date}${month}${year}_${hours}${min}${sec}.txt`
// }




import { DIRECTORY_PERMISSION_KEY } from "@/constants";
import { StoredDirectoryInfo } from "@/constants/type";
import { Directory } from "expo-file-system";
import Toast from "react-native-toast-message";

import { getNonStringStoredData } from "../async-storage";
import { documentPicker } from "./document-picker";

function showError(message: string) {
    Toast.show({
        type: "error",
        text1: message,
    });
}

function showSuccess(message: string) {
    Toast.show({
        type: "success",
        text1: message,
    });
}

function generateFileName(prefix: string) {
    const now = new Date();

    const date = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    const hour = String(now.getHours()).padStart(2, "0");
    const minute = String(now.getMinutes()).padStart(2, "0");
    const second = String(now.getSeconds()).padStart(2, "0");

    return `${prefix}_${date}${month}${year}_${hour}${minute}${second}.txt`;
}

function validateDirectory(directory: Directory | null): directory is Directory {
    if (!directory?.exists) {
        showError("Directory does not exist!");
        return false;
    }

    return true;
}

async function getDirectory(): Promise<Directory | null> {
    const stored = await getNonStringStoredData<StoredDirectoryInfo>(
        DIRECTORY_PERMISSION_KEY
    );

    if (!stored) {
        const directory = await documentPicker();

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
}

function createTextFile(
    directory: Directory,
    fileName: string,
    content: string
) {
    const file = directory.createFile(fileName, "text/plain");

    file.write(content, {
        append: true,
    });
}

export async function saveFile(prefix: string) {
    try {
        // TODO: Fetch data from inventory table
        const content = "";

        const directory = await getDirectory();

        if (!directory) {
            return;
        }

        const fileName = generateFileName(prefix);

        createTextFile(directory, fileName, content);

        showSuccess("File saved!");
    } catch (error) {
        console.error(error);
        showError("Failed to save file.");
    }
}