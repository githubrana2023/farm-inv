import { queryClient } from "@/components/provider/tanstack-query-client"
import { MUTATION_KEY } from "@/constants/tanstack-query"

export const invalidateEmployeeGetQuery = () => {
    queryClient.invalidateQueries({
        queryKey: [MUTATION_KEY.EMPLOYEE.READ]
    })
}