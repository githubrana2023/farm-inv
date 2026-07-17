import { SCAN_FLAG } from "@/constants";
import z from "zod";

export const addItemFormSchema = z.object({
    barcode: z.string().trim().nonempty(),
    uom: z.string().trim().nonempty(),
    isAdvanceMode: z.coerce.boolean<boolean>(),
    quantity: z.string().trim().nonempty(),
    scanType: z.enum(SCAN_FLAG).default('Inventory').optional(),
})

export type AddItemFormValue = z.infer<typeof addItemFormSchema>