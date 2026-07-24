import { PAGE_SIZE } from "@/constants"
import { MUTATION_KEY } from "@/constants/tanstack-query"
import { getGlobalSearchItems, getItemByBarcode, getItemDetailsByBarcode, getItemPriceCheckByBarcode, getScannedItems, getSearchItems } from "@/dal/item/get-item"
import { AddItemFormValue } from "@/lib/zod/add-item-form-schema"
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

export const useGetItemByBarcode = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.ITEM.READ],
        mutationFn: (payload: Pick<AddItemFormValue, 'scanType' | 'isAdvanceMode' | 'barcode'>) => getItemByBarcode(payload),
    })
}

export const useGetItemDetailsByBarcode = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.ITEM.READ],
        mutationFn: getItemDetailsByBarcode,
    })
}

export const useCheckItemPrice = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.ITEM.READ],
        mutationFn: getItemPriceCheckByBarcode
    })
}

export const useGetScannedItems = () => useQuery({
    queryKey: [MUTATION_KEY.SCANNED_ITEM.READ],
    queryFn: getScannedItems,
    networkMode: 'offlineFirst'
})


export const useGetGlobalSearchItems = (search: string) => useInfiniteQuery(
    {
        queryKey: [MUTATION_KEY["GLOBAL-QUERY"].READ, search],
        queryFn: async ({ pageParam }) => {
            console.log({ pageParam })
            return await getGlobalSearchItems({
                limit: PAGE_SIZE,
                offset: pageParam,
                query: search
            })
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage) return undefined
            if (lastPage.length < PAGE_SIZE) return undefined
            return allPages.length * PAGE_SIZE
        },
        enabled: search.trim().length > 0
    })


export const useGetStoredScannedItemsSearch = (search: string) => {
    const queryKey = [MUTATION_KEY.SCANNED_ITEM.READ, search];
    return useQuery({
        queryKey,
        queryFn: async () => await getSearchItems(search),
        enabled: search.length > 0,
    });
};