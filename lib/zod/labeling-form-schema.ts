import { SAVE_FLAG } from "@/constants";
import z from "zod";

export const labelingCreateFormSchema = z.object({
    label: z.string().nonempty({ error: "Label is required!" }).min(3, { error: 'Label at least 3 characters long! ' }),
    saveFlag: z.enum(SAVE_FLAG),
    password: z.string(),
})

export type LabelingCreateFormValue = z.infer<typeof labelingCreateFormSchema>