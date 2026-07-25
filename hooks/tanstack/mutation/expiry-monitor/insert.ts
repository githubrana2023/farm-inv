import { MUTATION_KEY } from "@/constants/tanstack-query"
import { insertExpiryMonitor } from "@/dal/expiry-monitor/insert"
import { ExpireScanFormValue } from "@/lib/zod/expiry-monitor-form-schema"
import { useMutation } from "@tanstack/react-query"

export const useExpiryMonitorInsert = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.EXPIRY_MONITOR.CREATE],
        mutationFn: insertExpiryMonitor
    })
}