import { MUTATION_KEY } from "@/constants/tanstack-query";
import { insertPriceCheckerTag, insertScannedItem } from "@/dal/item/insert-item";
import { useMutation } from "@tanstack/react-query";

export const useScanItemInsertMutation = () => useMutation({
    mutationFn: insertScannedItem,
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.CREATE]
})

export const useTagInsertMutation = () => useMutation({
    mutationFn: insertPriceCheckerTag,
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.CREATE]
})
