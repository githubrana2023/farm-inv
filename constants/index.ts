export const APP_SETTINGS_TAB = 'app-settings' as const
export const USER_SETTINGS_TAB = 'user-settings' as const

export const SETTINGS_TABS = [APP_SETTINGS_TAB, USER_SETTINGS_TAB] as const


export const DIRECTORY_PERMISSION_KEY = 'directory-permission' as const
export const FILE_URI_KEY = 'file-uri' as const
export const ADVANCE_MODE_KEY = 'ADVANCE_MODE_KEY'
export const SCAN_TYPE_KEY = 'SCAN_TYPE_KEY'

export const ITEM_CODE_REGEX = /^0\d{7}-\d{4}$/;
export const valueIsItemCode = (code: string) => ITEM_CODE_REGEX.test(code);

export const SCAN_FLAG = ["Inventory", "Tags", "Order"] as const;
export const SAVE_FLAG = ["Inventory", "Order"] as const;


export const multitaskVariants = [
    {
        label: "Inventory",
        value: "Inventory",
    },
    {
        label: "Tags",
        value: "Tags",
    },
    {
        label: "Order",
        value: "Order",
    },
] as const;

export type MultitaskVariantValues = (typeof SCAN_FLAG)[number];


type Modal = 'EMPLOYEE' | 'LABELING' | 'CHANGE_PASSWORD'
type Type = 'CREATE' | 'UPDATE'

type ModalTypeStructure = {
    [M in Modal]: {
        [T in Type]: `${M}_${T}_MODAL`
    }
}

export type ModalType = ModalTypeStructure[Modal][Type]


export const MODAL_TYPE: ModalTypeStructure = {
    EMPLOYEE: {
        CREATE: 'EMPLOYEE_CREATE_MODAL',
        UPDATE: 'EMPLOYEE_UPDATE_MODAL',
    },
    CHANGE_PASSWORD: {
        CREATE: 'CHANGE_PASSWORD_CREATE_MODAL',
        UPDATE: 'CHANGE_PASSWORD_UPDATE_MODAL',
    },
    LABELING: {
        CREATE: 'LABELING_CREATE_MODAL',
        UPDATE: 'LABELING_UPDATE_MODAL',
    }
} 