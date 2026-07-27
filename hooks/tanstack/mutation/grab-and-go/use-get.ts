import { QUERY_KEY } from "@/constants/tanstack/query"
import { getGrabAndGoFiftyPercentBarcode } from "@/dal/grab-and-go/get"
import { useMutation } from "@tanstack/react-query"

export const useGetGrabAndGoFiftyPercentBarcode = () => {
    return useMutation({
        mutationKey: [QUERY_KEY.GRAB_AND_GO.READ],
        mutationFn: getGrabAndGoFiftyPercentBarcode
    })
}