type Key = 'EMPLOYEE' | 'LABELING' | 'ITEM' | 'SCANNED_ITEM'
type Action = 'CREATE' | 'READ' | 'UPDATE' | 'DELETE'



type MutationKey = {
    [K in Key]: {
        [A in Action]: `${K}-${A}`
    }
}

export const MUTATION_KEY: MutationKey = {
    EMPLOYEE: {
        CREATE: 'EMPLOYEE-CREATE',
        READ: 'EMPLOYEE-READ',
        DELETE: 'EMPLOYEE-DELETE',
        UPDATE: 'EMPLOYEE-UPDATE'
    },
    LABELING: {
        CREATE: 'LABELING-CREATE',
        READ: 'LABELING-READ',
        UPDATE: 'LABELING-UPDATE',
        DELETE: 'LABELING-DELETE'
    },
    ITEM: {
        CREATE: 'ITEM-CREATE',
        READ: 'ITEM-READ',
        DELETE: 'ITEM-DELETE',
        UPDATE: 'ITEM-UPDATE'
    },
    SCANNED_ITEM: {
        CREATE: 'SCANNED_ITEM-CREATE',
        READ: 'SCANNED_ITEM-READ',
        DELETE: 'SCANNED_ITEM-DELETE',
        UPDATE: 'SCANNED_ITEM-UPDATE'
    },
}