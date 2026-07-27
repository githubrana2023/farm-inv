import { MUTATION_KEY } from "@/constants/tanstack/mutation"
import { deleteGrabAndGoById } from "@/dal/grab-and-go/delete"
import { useMutation } from "@tanstack/react-query"

export const useGrabAndGoDeleteMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.GRAB_AND_GO.DELETE],
        mutationFn: deleteGrabAndGoById
    })
}