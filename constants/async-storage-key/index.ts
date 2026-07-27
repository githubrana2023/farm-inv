import { AsyncStorageKeyMap } from "@/types"

type AsyncStorageKeyPrefix = 'ASYNC_STORAGE'
type StorageKey = 'THROWABLE_TYPE' | 'SHELF_NO' | 'REMIND_BEFORE'



export const ASYNC_STORAGE_KEY: AsyncStorageKeyMap<StorageKey, AsyncStorageKeyPrefix> = {
    THROWABLE_TYPE: 'ASYNC_STORAGE_THROWABLE_TYPE',
    REMIND_BEFORE: 'ASYNC_STORAGE_REMIND_BEFORE',
    SHELF_NO: 'ASYNC_STORAGE_SHELF_NO'
}