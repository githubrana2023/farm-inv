import { THROW_ABLE_SCAN_TYPE } from ".";

export type TThrowableScanType = typeof THROW_ABLE_SCAN_TYPE[number]

export type TGroupedThrowableItem = {
    id: string;
    serial: number
    vendorCode: string;
    vendorName: string;
    type: string;
    barcode: string;
    quantity: string;
    expireIn: string;
    hasImportedLabel: boolean;
    isAllow: boolean;
    itemCode: string;
    description: string;
    uom: string;
    salesPrice: string;
    // remark: string
}

export type TThrowable = {
    [ScanType in TThrowableScanType as `${ScanType}`]: {
        type: string;
        items: TGroupedThrowableItem[]
    }
}
