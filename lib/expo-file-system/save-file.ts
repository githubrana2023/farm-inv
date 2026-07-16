import { DIRECTORY_PERMISSION_KEY } from "@/constants";
import { StoredDirectoryInfo } from "@/constants/type";
import { Directory } from "expo-file-system";
import Toast from "react-native-toast-message";
import * as dateFns from 'date-fns'
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

    return `${prefix}_${dateFns.format(now, 'ddMMyyyy_hhmmss aaa')}.txt`;
}

function validateDirectory(directory: Directory | null): directory is Directory {
    if (!directory?.exists) {
        showError("Directory does not exist!");
        return false;
    }

    return true;
}

export async function getDirectory(): Promise<Directory | null> {
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