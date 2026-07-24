import { MUTATION_KEY } from "@/constants/tanstack-query";
import { updateItemById, updateOrderItemByBarcode } from "@/dal/item/update-item";
import { useMutation } from "@tanstack/react-query";

export const useUpdateOrderItem = () => useMutation({
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.UPDATE],
    mutationFn: ({ barcode, quantity }: { barcode: string; quantity: string }) => updateOrderItemByBarcode(barcode, quantity)
})

export const useUpdateItemById = () => useMutation({
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.UPDATE],
    mutationFn: async ({ id, quantity }: { id: string; quantity: string }) => updateItemById(id, quantity)
})