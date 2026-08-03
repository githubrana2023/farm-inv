import { MUTATION_KEY } from "@/constants/tanstack/mutation"
import { deleteGrabAndGoById, deleteGrabAndGoItems } from "@/dal/grab-and-go/delete"
import { useMutation } from "@tanstack/react-query"

export const useGrabAndGoDeleteMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.GRAB_AND_GO.DELETE],
        mutationFn: deleteGrabAndGoById
    })
}

export const useGrabAndGoDeleteItemsMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.GRAB_AND_GO.DELETE],
        mutationFn: deleteGrabAndGoItems
    })
}