import { insertExpiryMonitor } from "@/dal/expiry-monitor/insert"
import { ExpireScanFormValue } from "@/lib/zod/expiry-monitor-form-schema"
import { useMutation } from "@tanstack/react-query"

export const useExpiryMonitorInsert = () => {
    return useMutation({
        mutationFn: insertExpiryMonitor
    })
}