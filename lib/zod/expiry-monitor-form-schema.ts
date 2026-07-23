import z from "zod"

export const expiryScanFormSchema = z.object({
    barcode: z.string().trim().nonempty(),
    expireIn: z.string().trim().nonempty().min(6, { error: 'Minimum 6 characters long!' }).max(10, { error: 'Maximum 10 characters long!' }),
    remindBefore: z.string().trim().nonempty({ error: 'Select remind before day' }),
    shelfNo: z.string().trim().nonempty({ error: 'Select Shelf NO' }),
})

export type ExpireScanFormValue = z.infer<typeof expiryScanFormSchema>