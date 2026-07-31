import { barcodeRegex, dateRegex, DOT_SEPARATOR } from "@/constants";
import { THROW_ABLE_SCAN_TYPE } from "@/constants/throwable";
import { differenceInDays, endOfMonth } from "date-fns";
import z from "zod";
import { splitWord } from "../utils";

export const throwableCreateFormSchema = z.object({
    type: z.enum(THROW_ABLE_SCAN_TYPE).nonoptional(),
    barcode: z.string().trim().nonempty().regex(barcodeRegex, { error: 'Invalid barcode!' }),
    quantity: z.string().trim().nonempty(),
    expireIn: z.string().trim().nonempty()
        .regex(dateRegex, { error: 'Date must be like dd.mm.yyyy' })
        .superRefine((text, ctx) => {
            const [date, month, year] = splitWord(text, DOT_SEPARATOR).map(Number)
            const current = new Date()
            const expectedExpiryDate = new Date(year, (month - 1), 1)
            const endOfMonthDate = endOfMonth(expectedExpiryDate).getDate()

            const isValidDate = date <= endOfMonthDate
            const isValidMonth = month < 13
            const isYearEqualOrGraterThanCurrentYear = year >= current.getFullYear()

            if (!isValidDate) {
                ctx.addIssue('Invalid date entered!')
                return
            }
            if (!isValidMonth) {
                ctx.addIssue('Invalid month entered!')
                return
            }
            if (!isYearEqualOrGraterThanCurrentYear) {
                ctx.addIssue(`Expiry year can't be before current year!`)
                return
            }
            const difference = differenceInDays(new Date(year, month - 1, date), current)

            const isNearExpiry = difference < 3
            if (isNearExpiry) {
                ctx.addIssue('Already Expired!')
                return
            }

            const yearDifference = expectedExpiryDate.getFullYear() - current.getFullYear()
            if (yearDifference >= 10) {
                ctx.addIssue('Very long expiry year!')
            }

        }),
    hasImportedLabel: z.coerce.boolean<boolean>().nonoptional()
})

export type TThrowableCreateFormValue = z.infer<typeof throwableCreateFormSchema>