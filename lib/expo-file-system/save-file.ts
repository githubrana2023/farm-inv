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
import { grabAndGoTable } from "@/drizzle/schema/inventory";


type InventoryOrderContentGeneratorReturnType = {
    type: Exclude<ScanFlag, 'Tags'>,
    content: string,
    hasItem: boolean
}

type TagsContentGeneratorReturnType = {
    type: 'Tags',
    content: {
        regularContent: string;
        promoContent: string;
    },
    hasItem: boolean
}

type GeneratorReturnType = InventoryOrderContentGeneratorReturnType | TagsContentGeneratorReturnType
type Item = NonNullable<Awaited<ReturnType<typeof getSavedItems>>['data']>['scannedItems'][number]

export type SaveInventoryFn = typeof saveInventory
export type SaveOrderFn = typeof saveOrder

//! GENERATE FILE NAME
function generateFileName(prefix: string, saveFlag?: string) {
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

//! SAVE FILE
export async function saveFile(prefix: ScanFlag, saveFlag?: string) {
    try {
        const res = await getSavedItems()
        if (!res.data) return showError('Failed to get items to save')

        const generated = generator[prefix](res.data.scannedItems.filter(item => item.scanFlag === prefix), 30)

        const directory = await getDirectory();

        if (!directory) {
            return;
        }

        if (!generated.hasItem) return showError(`No item to create ${prefix}`)


        let fileName: string


        fileName = generateFileName(saveFlag ? `${prefix}_${saveFlag}` : `${prefix}`);
        if (generated.type === SCAN_FLAG_TYPE.Tags) {
            // generating regular tags file name

            fileName = generateFileName(saveFlag ? `r-${prefix}_${saveFlag}` : `r-${prefix}`);
            createTextFile(directory, fileName, generated.content.regularContent);

            // generating promo tags file name
            fileName = generateFileName(saveFlag ? `p-${prefix}_${saveFlag}` : `p-${prefix}`);
            createTextFile(directory, fileName, generated.content.promoContent);
        } else {

            createTextFile(directory, fileName, generated.content);
        }


        showSuccess("File saved!");
    } catch (error) {
        console.error(error);
        showError("Failed to save file.");
    }
}


// GENERATING ORDER CONTENT
export const generateOrderContent = (items: Item[], maxLength: number): GeneratorReturnType => {

    const content = items.map(item => {
        const alinedBarcode = item.barcode.padEnd(maxLength, " ")

        return `${alinedBarcode}|${item.uom}|${item.packing}|${item.quantity}|`
    }).join('\n')

    return {
        type: SCAN_FLAG_TYPE.Order,
        content,
        hasItem: items.length > 0
    }
}


// GENERATING INVENTORY
const generateInventoryContent = (items: NonNullable<Awaited<ReturnType<typeof getSavedItems>>['data']>['scannedItems'], maxLength: number): GeneratorReturnType => {

    const content = items.map(item => {
        const alinedBarcode = item.barcode.padEnd(maxLength, " ")
        return `${alinedBarcode}|${item.quantity}`
    }).join('\n')

    return {
        type: SCAN_FLAG_TYPE.Inventory,
        content,
        hasItem: items.length > 0
    }
}


// GENERATING TAGS
const generateTagsContent = (items: Item[], maxLength: number): GeneratorReturnType => {

    const promoItems = items.filter(item => item.pflag === 'P')
    const regularItems = items.filter(item => item.pflag === 'R')


    const promoContent = promoItems.map(item => {
        const alinedBarcode = item.barcode.padEnd(maxLength, " ")

        return `${alinedBarcode}|${item.quantity}`
    }).join('\n')

    const regularContent = regularItems.map(item => {
        const alinedBarcode = item.barcode.padEnd(maxLength, " ")
        return `${alinedBarcode}|${item.quantity}`
    }).join('\n')

    return {
        type: SCAN_FLAG_TYPE.Tags,
        content: {
            regularContent,
            promoContent
        },
        hasItem: items.length > 0
    }
}


const generator: Record<ScanFlag, (items: Item[], maxLength: number) => GeneratorReturnType> = {
    Inventory: generateInventoryContent,
    Tags: generateTagsContent,
    Order: generateOrderContent
}




export async function saveFileModified(
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

export const saveGrabAndGoFiftyPercent = async () => {
    // const items = await inventoryDb.select().from(grabAndGoTable)
    // if (items.length < 1) return showError('No items found to generate!')
    // const content = items.map(item => (`${item.barcode.padEnd(25, " ")}|${item.quantity}`)).join('\n')
    // saveFileModified({
    //     content,
    //     prefix: 'grab_and_go'
    // })
}


const generateInventoryTypeContent = (items: { barcode: string, quantity: string }[]) => {
    return items.map(item => (`${item.barcode.padEnd(25, ' ')}|${item.quantity}`)).join('\n')
}

const generateOrderTypeContent = (items: { barcode: string, quantity: string, packing: string, uom: string }[]) => {
    return items.map(item => (`${item.barcode.padEnd(25, ' ')}|${item.uom}|${item.packing}|${item.quantity}|`)).join('\n')
}


export const saveInventory = async (
    { items, prefix, saveFlag }: {
        items: { barcode: string, quantity: string }[];
        prefix: string;
        saveFlag?: string;
    }) => {
    try {
        const fileName = generateFileName(prefix, saveFlag)
        const content = generateInventoryTypeContent(items)
        saveFileModified({
            content, fileName
        })
    } catch (error) {
        console.log(`failed to save ${prefix}`)
    }

}
export const saveOrder = async (
    { items, prefix, saveFlag }: {
        items: { barcode: string, quantity: string, packing: string, uom: string }[];
        prefix: string;
        saveFlag?: string;
    }) => {
    try {
        const fileName = generateFileName(prefix, saveFlag)
        const content = generateOrderTypeContent(items)
        saveFileModified({
            content, fileName
        })
    } catch (error) {
        console.log('failed to save order')
    }

}