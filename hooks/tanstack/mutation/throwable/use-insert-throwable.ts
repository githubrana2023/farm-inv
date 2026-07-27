import { MUTATION_KEY } from "@/constants/tanstack/mutation"
import { insertThrowable } from "@/dal/throwable/insert"
import { useMutation } from "@tanstack/react-query"

export const useInsertThrowable = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.THROWABLE.CREATE],
        mutationFn: insertThrowable
    })
}