import { MUTATION_KEY } from "@/constants/tanstack-query"
import { getExpiryItemByEmpId, getExpiryItemsRemoveDateIsToday } from "@/dal/expiry-monitor/get-expiry-item"
import { useQuery } from "@tanstack/react-query"

export const useGetExpiryItems = ({ empId, after, before }: { empId: string; after?: Date; before?: Date }) => {
    return useQuery({
        queryKey: [MUTATION_KEY.EXPIRY_MONITOR.READ, after, before, empId],
        queryFn: async () => getExpiryItemByEmpId({ empId, after, before })
    })
}

export const useGetExpiryRemovableItems = () => {
    return useQuery({
        queryKey: [MUTATION_KEY.EXPIRY_MONITOR.READ],
        queryFn: getExpiryItemsRemoveDateIsToday
    })
}