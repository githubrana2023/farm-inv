import { barcodeRegex, dateRegex } from "@/constants";
import z from "zod";

export const grabAndGoCreateFormSchema = z.object({
    barcode: z.string().trim().nonempty().regex(barcodeRegex, { error: 'Invalid barcode!' }),
    quantity: z.string().trim().nonempty(),
})

export type TGrabAndGoCreateFormValue = z.infer<typeof grabAndGoCreateFormSchema>


export const grabAndGoDeleteItemsFormSchema = z.object({
    confirmation: z.enum(['Confirm']).optional().superRefine(((value, ctx) => {
        if (!value) {
            ctx.addIssue('Confirmation is missing!')
            return
        }
        if (value !== 'Confirm') {
            ctx.addIssue(`Write 'Confirm' to clear the Grab & Go!`)
            return
        }
    }))
})

export type GrabAndGoDeleteItemsFormValue = z.infer<typeof grabAndGoDeleteItemsFormSchema>