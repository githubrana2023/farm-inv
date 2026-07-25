import { MUTATION_KEY } from "@/constants/tanstack-query"
import { getShelfsNo } from "@/dal/shelf-no/get-shelf-no"
import { useMutation } from "@tanstack/react-query"

export const useGetShelfNoMutation = (empId: string) => {
    return useMutation({
        mutationKey: [MUTATION_KEY.SHELF_NO.READ, empId],
        mutationFn: async () => await getShelfsNo(empId)
    })
}