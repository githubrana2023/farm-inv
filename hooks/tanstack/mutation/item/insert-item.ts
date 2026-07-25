import { MUTATION_KEY } from "@/constants/tanstack-query";
import { insertInventoryItem, insertOrderItem, insertPriceCheckerTag, insertScannedItem } from "@/dal/item/insert-item";
import { useMutation } from "@tanstack/react-query";

export const useScanItemInsertMutation = () => useMutation({
    mutationFn: insertScannedItem,
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.CREATE]
})

export const useTagInsertMutation = () => useMutation({
    mutationFn: insertPriceCheckerTag,
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.CREATE]
})

export const useInventoryInsertMutation = () => useMutation({
    mutationFn: insertInventoryItem,
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.CREATE]
})

export const useOrderInsertMutation = () => useMutation({
    mutationFn: insertOrderItem,
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.CREATE]
})
