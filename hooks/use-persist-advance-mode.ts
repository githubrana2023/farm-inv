import { ADVANCE_MODE_KEY, SCAN_FLAG, SCAN_TYPE_KEY } from "@/constants";
import { getNonStringStoredData, getStringStoredData, storeData } from "@/lib/async-storage";
import { AddItemFormValue } from "@/lib/zod/add-item-form-schema";
import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";

export const usePersistAdvanceMode = (
    form: UseFormReturn<AddItemFormValue>,
) => {
    const [isHydrated, setIsHydrated] = useState(false);
    const { control, reset, getValues } = form;

    const isAdvanceModeEnable = useWatch({
        control,
        name: "isAdvanceMode",
    });
    const scanType = useWatch({
        control,
        name: "scanType",
    });

    useEffect(() => {
        const loadAdvanceMode = async () => {
            const storedIsAdvanceModeEnable = await getNonStringStoredData<boolean>(
                ADVANCE_MODE_KEY
            );
            const storedScanType = await getStringStoredData(SCAN_TYPE_KEY);

            reset({
                ...getValues(),
                barcode: "",
                uom: "",
                isAdvanceMode: storedIsAdvanceModeEnable ?? undefined,
                scanType: storedIsAdvanceModeEnable
                    ? ((storedScanType as AddItemFormValue['scanType']) ?? "Inventory")
                    : undefined,
            });
            setIsHydrated(true);
        };
        loadAdvanceMode();
    }, []);

    useEffect(() => {
        if (!isHydrated) return;
        const sync = async () => {
            await storeData({ key: ADVANCE_MODE_KEY, isStringValue: false, value: isAdvanceModeEnable });
            await storeData({ key: SCAN_TYPE_KEY, isStringValue: true, value: scanType });
        };
        sync();
    }, [isHydrated, isAdvanceModeEnable, scanType]);


    return { isAdvanceModeEnable, isHydrated };
};
