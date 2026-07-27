import { MUTATION_KEY } from "@/constants/tanstack/mutation"
import { insertGrabAndGo } from "@/dal/grab-and-go/insert"
import { useMutation } from "@tanstack/react-query"

export const useGrabAndGoInsert = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.GRAB_AND_GO.CREATE],
        mutationFn: insertGrabAndGo
    })
}