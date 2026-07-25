import { MUTATION_KEY } from "@/constants/tanstack-query"
import { insertRemindBefore } from "@/dal/remind-before/insert-remind-before"
import { useMutation } from "@tanstack/react-query"

export const useInsertRemindBeforeMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.SHELF_NO.CREATE],
        mutationFn: insertRemindBefore
    })
}