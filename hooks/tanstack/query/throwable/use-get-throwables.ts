import { QUERY_KEY } from "@/constants/tanstack/query"
import { TThrowableScanType } from "@/constants/throwable/type"
import { getThrowables, getThrowablesByType } from "@/dal/throwable/get"
import { useQuery } from "@tanstack/react-query"

export const useGetThrowables = () => {
    return useQuery(
        {
            queryKey: [QUERY_KEY.THROWABLE.READ],
            queryFn: getThrowables
        }
    )
}

export const useGetThrowablesByType = (type: TThrowableScanType) => {
    return useQuery(
        {
            queryKey: [QUERY_KEY.THROWABLE_BY_TYPE.READ, type],
            queryFn: async () => getThrowablesByType(type)
        }
    )
}