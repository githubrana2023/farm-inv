// hooks/use-folder.ts

import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory } from "expo-file-system";
import { showError } from "@/lib/toast/error";
import { DIRECTORY_PERMISSION_KEY } from "@/constants";
import { getNonStringStoredData, storeData } from "@/lib/async-storage";
import { StoredDirectoryInfo } from "@/constants/type";
import { showSuccess } from "@/lib/toast/success";


export function useDirectory() {
    const [directory, setDirectory] = useState<Directory | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        restoreDirectory();
    }, []);

    const restoreDirectory = async () => {
        try {
            const uri = await getNonStringStoredData<StoredDirectoryInfo>(DIRECTORY_PERMISSION_KEY)

            if (!uri) {
                setLoading(false);
                return;
            }

            const dir = new Directory(uri.directoryUri);

            setDirectory(dir);
        } finally {
            setLoading(false);
        }
    };

    const pickFolder = async () => {
        try {
            const dir = await Directory.pickDirectoryAsync();

            if (!dir) return;


            await storeData<StoredDirectoryInfo>({
                key: DIRECTORY_PERMISSION_KEY,
                isStringValue: false,
                value: {
                    directoryUri: dir.uri,
                    directoryName: dir.name
                }
            })

            setDirectory(dir);
        } catch (error) {
            showError('Please select a folder')
            return null
        }
    };

    const clearFolder = async () => {
        try {
            await AsyncStorage.removeItem(DIRECTORY_PERMISSION_KEY);
            setDirectory(null);
            showSuccess('removed')
        } catch (error) {
            return
        }
    };



    return {
        directory,
        loading,
        pickFolder,
        clearFolder,
    };
}