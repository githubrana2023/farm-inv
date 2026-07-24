import { MUTATION_KEY } from "@/constants/tanstack-query";
import { deleteItemById, deleteOrderItemByBarcode } from "@/dal/item/delete-items";
import { useMutation } from "@tanstack/react-query";

export const useDeleteOrderItem = () => useMutation({
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.UPDATE],
    mutationFn: (barcode: string) => deleteOrderItemByBarcode(barcode)
})

export const useDeleteItemById = () => useMutation({
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.UPDATE],
    mutationFn: deleteItemById
})