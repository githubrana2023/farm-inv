import { queryClient } from "@/components/provider/tanstack-query-client"

export const invalidQueries = async (keys: string[]) => {
    await queryClient.invalidateQueries({
        queryKey: keys
    })
}