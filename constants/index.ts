import { saveFile } from "@/lib/expo-file-system/save-file"
import { saveOrder } from "@/lib/utils"

export const APP_SETTINGS_TAB = 'app-settings' as const
export const USER_SETTINGS_TAB = 'user-settings' as const

export const SETTINGS_TABS = [APP_SETTINGS_TAB, USER_SETTINGS_TAB] as const


export const DIRECTORY_PERMISSION_KEY = 'directory-permission' as const
export const FILE_URI_KEY = 'file-uri' as const

export const ORDER_NAME = [
    {
        name: 'Kwh',
        onPress: saveFile
    },
    {
        name: 'Veg',
        onPress: saveFile
    },
    {
        name: 'Louziano',
        onPress: saveFile
    },
    {
        name: 'Meat',
        onPress: saveFile
    },
    {
        name: 'Direct',
        onPress: saveFile
    },
]
export const SAVE_NAME = [
    {
        name: 'Cigarettes',
        onPress: saveFile
    },
    {
        name: 'Louziano',
        onPress: saveFile
    },
    {
        name: 'Veg',
        onPress: saveFile
    }
]

export const EMPLOYEE_NAME = [
    {
        name: 'Ruel',
        onPress: saveFile
    },
    {
        name: 'Jojo',
        onPress: saveFile
    },
    {
        name: 'Jitendra',
        onPress: saveFile
    },
]