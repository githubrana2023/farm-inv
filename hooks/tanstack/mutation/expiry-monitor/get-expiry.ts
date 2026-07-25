import { MUTATION_KEY } from "@/constants/tanstack-query"
import { getExpiryItem } from "@/dal/expiry-monitor/get-expiry-item"
import { useQuery } from "@tanstack/react-query"

export const useGetExpiryItems = ({ empId, after, before }: { empId: string; after?: Date; before?: Date }) => {
    return useQuery({
        queryKey: [MUTATION_KEY.EXPIRY_MONITOR.READ,after,before,empId],
        queryFn: async () => getExpiryItem({ empId, after, before })
    })
}