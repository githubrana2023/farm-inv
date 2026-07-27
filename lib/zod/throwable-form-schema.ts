import { barcodeRegex, dateRegex } from "@/constants";
import { THROW_ABLE_SCAN_TYPE } from "@/constants/throwable";
import z from "zod";

export const throwableCreateFormSchema = z.object({
    type: z.enum(THROW_ABLE_SCAN_TYPE).nonoptional(),
    barcode: z.string().trim().nonempty().regex(barcodeRegex, { error: 'Invalid barcode!' }),
    quantity: z.string().trim().nonempty(),
    expireIn: z.string().trim().nonempty().regex(dateRegex, { error: 'Date must be like dd.mm.yyyy' }),
    hasImportedLabel: z.coerce.boolean<boolean>().nonoptional()
})

export type TThrowableCreateFormValue = z.infer<typeof throwableCreateFormSchema>