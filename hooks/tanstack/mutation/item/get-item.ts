import { MUTATION_KEY } from "@/constants/tanstack-query"
import { getItemByBarcode } from "@/dal/item/get-item"
import { AddItemFormValue } from "@/lib/zod/add-item-form-schema"
import { useMutation } from "@tanstack/react-query"

export const useGetItemByBarcode = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.ITEM.READ],
        mutationFn: (payload: Pick<AddItemFormValue, 'scanType' | 'isAdvanceMode' | 'barcode'>) => getItemByBarcode(payload),
    })
}

