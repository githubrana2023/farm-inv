import { SCAN_FLAG } from "@/constants";
import z from "zod";

export const addItemFormSchema = z.object({
    barcode: z.string().trim().nonempty({ error: 'Barcode is required!' }),
    uom: z.string().trim().nonempty({ error: 'Uom is required!' }),
    isAdvanceMode: z.coerce.boolean<boolean>(),
    quantity: z.string().trim().nonempty({ error: 'Quantity is required!' }),
    scanType: z.enum(SCAN_FLAG).default('Inventory').optional(),
})

export type AddItemFormValue = z.infer<typeof addItemFormSchema>