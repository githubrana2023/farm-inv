import { MUTATION_KEY } from "@/constants/tanstack-query"
import { getRemindBeforeDays } from "@/dal/remind-before/get-remind-before"
import { useMutation } from "@tanstack/react-query"

export const useGetRemindBeforeMutation = (empId: string) => {
    return useMutation({
        mutationKey: [MUTATION_KEY.REMIND_BEFORE.READ, empId],
        mutationFn: async () => await getRemindBeforeDays(empId)
    })
}