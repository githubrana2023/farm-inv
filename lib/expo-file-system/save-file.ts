import { DIRECTORY_PERMISSION_KEY, SCAN_FLAG_TYPE, ScanFlag } from "@/constants";
import { StoredDirectoryInfo } from "@/constants/type";
import { Directory } from "expo-file-system";
import * as dateFns from 'date-fns'
import { getNonStringStoredData } from "../async-storage";
import { directoryPicker, getDirectory } from "@/lib/expo-file-system/directory-picker";
import { getSavedItems } from "@/dal/item/get-item-save-file";
import { showError } from "../toast/error";
import { showSuccess } from "../toast/success";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { grabAndGoTable, inventoryTable } from "@/drizzle/schema/inventory";



//! GENERATE FILE NAME
export function generateFileName(prefix: string, saveFlag?: string) {
    const now = new Date();

    const fileName = saveFlag ? `${prefix}_${saveFlag}` : prefix

    return `${fileName}_${dateFns.format(now, 'ddMMyyyy_hhmmss aaa')}.txt`;
}


//! CREATE TXT FILE
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


export async function saveFile(
    { content, fileName }: { content: string, fileName: string }
) {
    try {

        const directory = await getDirectory();

        if (!directory) {
            return;
        }

        createTextFile(directory, fileName, content);

        showSuccess("File saved!");
    } catch (error) {
        console.error(error);
        showError("Failed to save file.");
    }
}