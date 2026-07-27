import { AsyncStorageKeyMap } from "@/types"

type AsyncStorageKeyPrefix = 'ASYNC_STORAGE'
type StorageKey = 'THROWABLE_TYPE'



export const ASYNC_STORAGE_KEY: AsyncStorageKeyMap<StorageKey, AsyncStorageKeyPrefix> = {
    THROWABLE_TYPE: 'ASYNC_STORAGE_THROWABLE_TYPE',
}