import { MUTATION_KEY } from "@/constants/tanstack-query"
import { deleteExpiryMonitorItemByIdAndEmpId } from "@/dal/expiry-monitor/delete-expiry-item"
import { useMutation } from "@tanstack/react-query"

export const useExpiryItemDeleteMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.EXPIRY_MONITOR.CREATE],
        mutationFn: deleteExpiryMonitorItemByIdAndEmpId
    })
}