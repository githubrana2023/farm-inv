import z from "zod"
import { splitWord } from "../utils"
import { DOT_SEPARATOR } from "@/constants"
import { differenceInDays, endOfMonth } from 'date-fns'

export const expiryScanFormSchema = z.object({
    barcode: z.string().trim().nonempty(),
    expireIn: z.string().trim().nonempty().min(6, { error: 'Minimum 6 characters long!' }).max(10, { error: 'Maximum 10 characters long!' })
        .superRefine((text, ctx) => {
            const [date, month, year] = splitWord(text, DOT_SEPARATOR).map(v => Number(v))
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
                ctx.addIssue('Near expiry!')
                return
            }

            const yearDifference = expectedExpiryDate.getFullYear() - current.getFullYear()
            if (yearDifference >= 10) {
                ctx.addIssue('Very long expiry year!')
            }

        }),
    remindBefore: z.string().trim().nonempty({ error: 'Select remind before day' }),
    shelfNo: z.string().trim().nonempty({ error: 'Select Shelf NO' }),
})

export type ExpireScanFormValue = z.infer<typeof expiryScanFormSchema>