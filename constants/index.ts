export const APP_SETTINGS_TAB = 'app-settings' as const
export const USER_SETTINGS_TAB = 'user-settings' as const

export const SETTINGS_TABS = [APP_SETTINGS_TAB, USER_SETTINGS_TAB] as const


export const DIRECTORY_PERMISSION_KEY = 'directory-permission' as const
export const FILE_URI_KEY = 'file-uri' as const

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


export const MODAL_TYPE = {
    EMPLOYEE_CREATE_MODAL: "EMPLOYEE_CREATE_MODAL",
    EMPLOYEE_UPDATE_MODAL: "EMPLOYEE_UPDATE_MODAL",
    LABELING_CREATE_MODAL: "LABELING_CREATE_MODAL",
    LABELING_UPDATE_MODAL: "LABELING_UPDATE_MODAL",
} as const
