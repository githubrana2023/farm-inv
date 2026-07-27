import { KeyActionMap } from "@/types"

type QueryKey = 'THROWABLE' | 'THROWABLE_BY_TYPE' | 'GRAB_AND_GO'
// 'EMPLOYEE' | 'LABELING' | 'ITEM' | 'SCANNED_ITEM' | 'ITEM_MASTER' | 'GLOBAL-QUERY' | 'SHELF_NO' | 'REMIND_BEFORE' | 'EXPIRY_MONITOR'
type QueryAction = 'READ'

export const QUERY_KEY: KeyActionMap<QueryKey, QueryAction> = {
    THROWABLE: { READ: 'THROWABLE_READ' },
    THROWABLE_BY_TYPE: { READ: 'THROWABLE_BY_TYPE_READ' },
    GRAB_AND_GO: { READ: 'GRAB_AND_GO_READ' },
}
