import AsyncStorage from "@react-native-async-storage/async-storage"
import Toast from "react-native-toast-message"
import { storageEvent } from "@/lib/even-emitter/storage-event"

export type StringStoredData = {
    key: string,
    isStringValue: true,
    value: string
}

export type NonStringStoredData<T> = {
    key: string,
    isStringValue: false,
    value: T extends string ? never : T
}

export type StoredData<T> = StringStoredData | NonStringStoredData<T>


export const storeData = async<T>({ key, isStringValue, value }: StoredData<T>) => {
    const stringifiedValue = !isStringValue ? JSON.stringify(value) : value

    try {
        await AsyncStorage.setItem(key, stringifiedValue)
        // storageEvent.emit('permissionChanged',)
    } catch (error) {
        console.log('error storing data', error)
    }
}


export const getStringStoredData = async (key: string) => {
    try {
        return await AsyncStorage.getItem(key);
    } catch (e) {
        console.log('error reading stored data', e)
    }
}


export const getNonStringStoredData = async <T = unknown>(key: string) => {
    try {
        const storedData = await AsyncStorage.getItem(key);
        return storedData ? JSON.parse(storedData) as T : null
    } catch (e) {
        console.log('error reading stored data', e)
    }
}

export const removeStoredData = async (key: string) => {
    await AsyncStorage.removeItem(key)
    storageEvent.emit('permissionChanged')
    Toast.show({
        type: 'success',
        text1: 'Data removed successfully!'
    })
    storageEvent.emit('permissionChanged',)
}