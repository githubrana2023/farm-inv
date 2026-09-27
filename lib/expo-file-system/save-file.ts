import { Directory } from "expo-file-system";
import * as dateFns from 'date-fns'
import { getDirectory } from "@/lib/expo-file-system/directory-picker";
import { showError } from "../toast/error";
import { showSuccess } from "../toast/success";
import { inventoryDb } from "@/drizzle/db/inventory-db";
import { inventoryTable } from "@/drizzle/schema/inventory";
import { saveTags } from "./save-tags";
import { saveInventory } from "./save-inventory";
import { saveOrder } from "./save-order";
import { and, count, gt, isNotNull } from "drizzle-orm";



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

export const saveAll = async () => {
    try {
        const saves = await inventoryDb.select(
            {
                scanFlag: inventoryTable.scanFlag,
                count: count(inventoryTable.scanFlag)
            }
        ).from(inventoryTable)
            .groupBy(inventoryTable.scanFlag)
            .having(
                and(
                    gt(count(inventoryTable.scanFlag), 0),
                    isNotNull(inventoryTable.scanFlag)
                )
            )

        const saveFn: Record<typeof saves[number]['scanFlag'], (saveFlag?: string | undefined) => Promise<void>> = {
            Inventory: saveInventory,
            Tags: saveTags,
            Order: saveOrder
        }


        console.log()

        for (const save of saves) {
            await saveFn[save.scanFlag]()
        }

    } catch (error) {

    }
}