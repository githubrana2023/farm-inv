import { QUERY_KEY } from "@/constants/tanstack/query"
import { getGrabAndGoFiftyPercentBarcodes } from "@/dal/grab-and-go/get"
import { useQuery } from "@tanstack/react-query"

export const useGetGrabAndGoFiftyPercentBarcodes = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEY.GRAB_AND_GO.READ],
            queryFn: getGrabAndGoFiftyPercentBarcodes
        }
    )
}
