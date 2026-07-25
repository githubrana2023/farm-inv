import { MUTATION_KEY } from "@/constants/tanstack-query"
import { getRemindBeforeDays } from "@/dal/remind-before/get-remind-before"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useGetRemindBeforeMutation = (empId: string) => {
    return useQuery({
        queryKey: [MUTATION_KEY.REMIND_BEFORE.READ, empId],
        queryFn: async () => await getRemindBeforeDays(empId)
    })
}