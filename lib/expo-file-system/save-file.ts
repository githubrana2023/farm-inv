import { DIRECTORY_PERMISSION_KEY, SCAN_FLAG_TYPE, ScanFlag } from "@/constants";
import { StoredDirectoryInfo } from "@/constants/type";
import { Directory } from "expo-file-system";
import * as dateFns from 'date-fns'
import { getNonStringStoredData } from "../async-storage";
import { directoryPicker, getDirectory } from "@/lib/expo-file-system/directory-picker";
import { getSavedItems } from "@/dal/item/get-item-save-file";
import { showError } from "../toast/error";
import { showSuccess } from "../toast/success";


function generateFileName(prefix: string) {
    const now = new Date();

    return `${prefix}_${dateFns.format(now, 'ddMMyyyy_hhmmss aaa')}.txt`;
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


type Item = NonNullable<Awaited<ReturnType<typeof getSavedItems>>['data']>['scannedItems'][number]

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

            if (!generated.hasItem) return showError('No item to create shelf tags')

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


export const generateOrderContent = (items: Item[], maxLength: number): GeneratorReturnType => {

    const content = items.map(item => {
        const alinedBarcode = item.barcode.padEnd(maxLength, " ")

        return `${alinedBarcode}${item.uom}|${item.packing}|${item.quantity}|`
    }).join('\n')

    return {
        type: SCAN_FLAG_TYPE.Order,
        content,
        hasItem: items.length > 0
    }
}

const generator: Record<ScanFlag, (items: Item[], maxLength: number) => GeneratorReturnType> = {
    Inventory: generateInventoryContent,
    Tags: generateTagsContent,
    Order: generateOrderContent
}