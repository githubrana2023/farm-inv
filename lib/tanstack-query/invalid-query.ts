import { queryClient } from "@/components/provider/tanstack-query-client"

export const invalidQueries = (keys: string[]) => {
    queryClient.invalidateQueries({
        queryKey: keys
    })
}