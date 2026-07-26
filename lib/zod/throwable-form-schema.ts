import { THROW_ABLE_SCAN_TYPE } from "@/constants/throwable";
import z from "zod";

export const throwableCreateFormSchema = z.object({
    type: z.enum(THROW_ABLE_SCAN_TYPE).nonoptional(),
    barcode: z.string().trim().nonempty(),
    quantity: z.string().trim().nonempty(),
    expireIn: z.string().trim().nonempty(),
    hasImportedLabel: z.boolean().default(false)
})

export type TThrowableCreateFormValue = z.infer<typeof throwableCreateFormSchema>