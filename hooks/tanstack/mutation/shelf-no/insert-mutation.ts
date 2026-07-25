import { MUTATION_KEY } from "@/constants/tanstack-query"
import { insertShelfNo } from "@/dal/shelf-no/insert-shelf-no"
import { useMutation } from "@tanstack/react-query"

export const useInsertShelfNoMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.SHELF_NO.CREATE],
        mutationFn: insertShelfNo
    })
}