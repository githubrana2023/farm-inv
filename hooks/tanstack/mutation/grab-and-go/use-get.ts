import { QUERY_KEY } from "@/constants/tanstack/query"
import { getGrabAndGoFifthyPercentBarcode } from "@/dal/grab-and-go/get"
import { useMutation } from "@tanstack/react-query"

export const useGetGrabAndGoFifthyPercentBarcode = () => {
    return useMutation({
        mutationKey: [QUERY_KEY.GRAB_AND_GO.READ],
        mutationFn: getGrabAndGoFifthyPercentBarcode
    })
}