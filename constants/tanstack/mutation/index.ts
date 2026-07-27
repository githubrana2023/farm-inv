import { KeyActionMap } from "@/types"

type MutationKey = 'THROWABLE' | 'GRAB_AND_GO'
// 'EMPLOYEE' | 'LABELING' | 'ITEM' | 'SCANNED_ITEM' | 'ITEM_MASTER' | 'GLOBAL-QUERY' | 'SHELF_NO' | 'REMIND_BEFORE' | 'EXPIRY_MONITOR'
type MutationAction = 'CREATE' | 'UPDATE' | 'DELETE'



type MutationKeyMap = {
    [MK in MutationKey]: {
        [MA in MutationAction]: `${MK}-${MA}`
    }
}
export const MUTATION_KEY: KeyActionMap<MutationKey, MutationAction> = {
    THROWABLE: {
        CREATE: 'THROWABLE_CREATE',
        UPDATE: 'THROWABLE_UPDATE',
        DELETE: 'THROWABLE_DELETE'
    },
    GRAB_AND_GO: {
        CREATE: 'GRAB_AND_GO_CREATE',
        UPDATE: 'GRAB_AND_GO_UPDATE',
        DELETE: 'GRAB_AND_GO_DELETE'
    }
}
