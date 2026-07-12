import { getStoredData } from "@/components/pick-document"
import { DIRECTORY_PERMISSION_KEY } from "@/constants"
import { StoredDirectoryInfo } from "@/constants/type"
import { getNonStringStoredData, } from "@/lib/async-storage"
import { storageEvent } from "@/lib/even-emitter/storage-event"

import * as FileSystem from 'expo-file-system'
import { useEffect, useState } from "react"

export const usePermission = () => {
    const [state, setState] = useState<StoredDirectoryInfo>({ directoryUri: "", directoryName: "" })
    const load = async () => {
        const storedData = await getNonStringStoredData<StoredDirectoryInfo>(DIRECTORY_PERMISSION_KEY)
        setState(storedData ?? { directoryUri: "", directoryName: "" })
    }

    useEffect(() => {

        load()
        storageEvent.on('permissionChanged', load)
        return () => {
            storageEvent.off('permissionChanged', load)
        }
    }, [setState])
    return state
}

export const useFile = (key: string) => {
    const [file, setFile] = useState<FileSystem.File>()
    const loadFile = async () => {
        const storedData = await getStoredData(key)
        if (!storedData) return

        const file = new FileSystem.File(storedData)
        if (file.exists) {
            setFile(file)
        }
    }

    useEffect(() => { loadFile() }, [])
    return file
}