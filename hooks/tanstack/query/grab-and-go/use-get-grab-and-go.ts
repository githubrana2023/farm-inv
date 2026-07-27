import { QUERY_KEY } from "@/constants/tanstack/query"
import { getGrabAndGoFifthyPercentBarcodes } from "@/dal/grab-and-go/get"
import { useQuery } from "@tanstack/react-query"

export const useGetGrabAndGoFifthyPercentBarcodes = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEY.GRAB_AND_GO.READ],
            queryFn: getGrabAndGoFifthyPercentBarcodes
        }
    )
}
