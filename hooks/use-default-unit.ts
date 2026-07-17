import { getItemByBarcode } from "@/dal/item/get-item"
import { AddItemFormValue } from "@/lib/zod/add-item-form-schema"
import { useEffect } from "react"
import { UseFormReturn } from "react-hook-form"
import { useGetItemByBarcode } from "./tanstack/mutation/item/get-item"

export function useDefaultUnitFromItemDetails(
    form: UseFormReturn<AddItemFormValue>,
    itemDetails: Awaited<ReturnType<typeof useGetItemByBarcode>>['data']
) {
    const { setValue } = form

    useEffect(() => {
        if (!itemDetails?.data?.item) return

        setValue("uom", `${itemDetails?.data?.item.uom}|${itemDetails?.data?.item.packing}`, {
            shouldValidate: true,
            shouldDirty: true,
        })
    }, [itemDetails, setValue])
}
