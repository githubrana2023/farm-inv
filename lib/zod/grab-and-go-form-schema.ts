import { barcodeRegex, dateRegex } from "@/constants";
import z from "zod";

export const grabAndGoCreateFormSchema = z.object({
    barcode: z.string().trim().nonempty().regex(barcodeRegex, { error: 'Invalid barcode!' }),
    quantity: z.string().trim().nonempty(),
})

export type TGrabAndGoCreateFormValue = z.infer<typeof grabAndGoCreateFormSchema>