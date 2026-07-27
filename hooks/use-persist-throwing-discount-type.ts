import { ASYNC_STORAGE_KEY } from "@/constants/async-storage-key";
import { TThrowableScanType } from "@/constants/throwable/type";
import { getStringStoredData, storeData } from "@/lib/async-storage";
import { TThrowableCreateFormValue } from "@/lib/zod/throwable-form-schema";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

export const usePersistThrowingDiscountType = (form: ReturnType<typeof useForm<TThrowableCreateFormValue>>) => {
    const [isHydrated, setIsHydrated] = useState(false)
    const type = useWatch({
        name: 'type',
        control: form.control
    })

    useEffect(() => {
        const loadStoredType = async () => {
            try {
                const persistedType = await getStringStoredData(ASYNC_STORAGE_KEY.THROWABLE_TYPE) as TThrowableScanType
                form.reset({
                    ...form.getValues(),
                    type: persistedType ? persistedType : 'ONE_PLUS_ONE'
                })
                setIsHydrated(true)
            } catch (error) {
                console.log('Failed to load persist throwable type')
            }
        }
        loadStoredType()
    }, [])

    useEffect(() => {
        if (!isHydrated) {
            return;
        };
        const sync = async () => {
            try {
                await storeData<TThrowableScanType>({
                    key: ASYNC_STORAGE_KEY.THROWABLE_TYPE,
                    isStringValue: true,
                    value: type ?? 'ONE_PLUS_ONE'
                })
            } catch (error) {
                console.log('Failed to sync persist throwable type')
            }
        }
        sync()
    }, [isHydrated, type])




}