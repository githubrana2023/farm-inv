import { MUTATION_KEY } from "@/constants/tanstack-query";
import { insertScannedItem } from "@/dal/item/insert-item";
import { AddItemFormValue } from "@/lib/zod/add-item-form-schema";
import { useMutation } from "@tanstack/react-query";

export const useScanItemInsertMutation = () => useMutation({
    mutationFn: (formValue: AddItemFormValue) => insertScannedItem(formValue),
    mutationKey: [MUTATION_KEY.SCANNED_ITEM.CREATE]
})
