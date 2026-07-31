import { MUTATION_KEY } from "@/constants/tanstack/mutation"
import { getThrowableItemDetails } from "@/dal/throwable/get"
import { useMutation } from "@tanstack/react-query"

export const useGetThrowableItemDetailsMutation = () => {
    return useMutation(
        {
            mutationFn: getThrowableItemDetails,
            mutationKey: [MUTATION_KEY.THROWABLE.READ]
        }
    )
}