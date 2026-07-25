import { MUTATION_KEY } from "@/constants/tanstack-query"
import { getShelfsNo } from "@/dal/shelf-no/get-shelf-no"
import { useQuery } from "@tanstack/react-query"

export const useGetShelfNoMutation = (empId: string) => {
    return useQuery({
        queryKey: [MUTATION_KEY.SHELF_NO.READ, empId],
        queryFn: async () => await getShelfsNo(empId)
    })
}