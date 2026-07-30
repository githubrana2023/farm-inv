import { ASYNC_STORAGE_KEY } from "@/constants/async-storage-key";
import { getStringStoredData, storeData } from "@/lib/async-storage";
import { ExpireScanFormValue } from "@/lib/zod/expiry-monitor-form-schema";
import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

export const usePersistShelfAndRemindBefore = (form: UseFormReturn<ExpireScanFormValue>, employeeId: string) => {
    const [isHydrated, setIsHydrated] = useState(false)
    const { control, reset } = form
    const selectedShelf = useWatch({ control, name: 'shelfNo' })
    const selectedRemindBefore = useWatch({ control, name: 'remindBefore' })

    useEffect(() => {

        const load = async () => {
            try {
                const persistedShelf = await getStringStoredData(`${ASYNC_STORAGE_KEY.SHELF_NO}_EMP_ID:${employeeId}`)
                const persistedRemindBefore = await getStringStoredData(`${ASYNC_STORAGE_KEY.REMIND_BEFORE}_EMP_ID:${employeeId}`)

                reset({
                    shelfNo: persistedShelf ?? undefined,
                    remindBefore: persistedRemindBefore ?? undefined
                })
                setIsHydrated(true)
            } catch (error) {
                console.log(error, 'Failed to load persist expiry shelf & remind before')
            }
        }
        load()

    }, [])

    useEffect(() => {

        if (!isHydrated) return;

        const sync = async () => {
            await storeData({
                key: `${ASYNC_STORAGE_KEY.REMIND_BEFORE}_EMP_ID:${employeeId}`,
                isStringValue: true,
                value: selectedRemindBefore
            })
            await storeData({
                key: `${ASYNC_STORAGE_KEY.SHELF_NO}_EMP_ID:${employeeId}`,
                isStringValue: true,
                value: selectedShelf
            })
        }

        sync()

    }, [isHydrated, selectedRemindBefore, selectedShelf, employeeId])

}