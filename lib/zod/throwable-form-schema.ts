import { barcodeRegex, dateRegex, DOT_SEPARATOR } from "@/constants";
import { THROW_ABLE_SCAN_TYPE } from "@/constants/throwable";
import { differenceInDays, endOfMonth } from "date-fns";
import z from "zod";
import { splitWord } from "../utils";

export const throwableCreateFormSchema = z.object({
    type: z.enum(THROW_ABLE_SCAN_TYPE).nonoptional(),
    barcode: z.string().trim().nonempty().regex(barcodeRegex, { error: 'Invalid barcode!' }),
    quantity: z.string().trim().nonempty(),
    expireIn: z.string().trim().nonempty(),
    hasImportedLabel: z.coerce.boolean<boolean>().nonoptional()
}).superRefine((value, ctx) => {

    const isOnePlusOne = value.type === 'ONE_PLUS_ONE'
    const isThrowing = value.type === 'THROWING'
    const isOverstock = value.type === 'OVERSTOCK'

    const [date, month, year] = splitWord(value.expireIn, DOT_SEPARATOR).map(Number)
    const current = new Date()
    const expectedExpiryDate = new Date(year, (month - 1), 1)
    const endOfMonthDate = endOfMonth(expectedExpiryDate).getDate()

    const isValidDate = date <= endOfMonthDate
    const isValidMonth = month < 13
    const isYearEqualOrGraterThanCurrentYear = year >= current.getFullYear()

    const dayDifference = differenceInDays(new Date(year, month - 1, date), current)
    const isNearExpiry = dayDifference < 7
    const yearDifference = expectedExpiryDate.getFullYear() - current.getFullYear()


    //! Invalid date check
    if (!isValidDate) {
        ctx.addIssue({
            message: 'Invalid date entered!',
            code: 'invalid_type',
            path: ['expireIn'],
            expected: 'number'
        })
        return
    }


    //! Invalid month check
    if (!isValidMonth) {
        ctx.addIssue({
            message: 'Invalid month entered!',
            code: 'invalid_type',
            path: ['expireIn'],
            expected: 'number'
        })
        return
    }

    if (yearDifference >= 10) {
        ctx.addIssue({
            message: 'Very long expiry date!',
            code: 'invalid_type',
            path: ['expireIn'],
            expected: 'number'
        })
    }


    if (isOnePlusOne || isOverstock) {
        //! one plus one and overstock must be current year
        if (!isYearEqualOrGraterThanCurrentYear) {
            ctx.addIssue({
                message: `Expiry year can't be before current year!`,
                code: 'invalid_type',
                path: ['expireIn'],
                expected: 'number'
            })
            return
        }

        //! Near expiry item are not allow
        if (isNearExpiry) {
            ctx.addIssue({
                message: 'Already Expired!',
                code: 'invalid_type',
                path: ['expireIn'],
                expected: 'number'
            })
            return
        }
    }
})

export type TThrowableCreateFormValue = z.infer<typeof throwableCreateFormSchema>