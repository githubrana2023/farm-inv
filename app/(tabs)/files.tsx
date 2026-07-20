import { ScrollView, View } from 'react-native'

import { useEffect, useState } from 'react'
import Container from '@/components/shared/container'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { getFiles } from '@/lib/expo-file-system/get-files'
import { getDirectory } from '@/lib/expo-file-system/directory-picker'
import { Directory, File, Paths } from 'expo-file-system'
import { FileCard } from '@/components/shared/file-card'
import { setDate, setHours } from 'date-fns'

import * as ShareFile from 'expo-sharing'
import { showError } from '@/lib/toast/error'
import { showSuccess } from '@/lib/toast/success'

const fileShare = async (existFile: File) => {
    try {
        const shareAvailable = await ShareFile.isAvailableAsync()
        if (!shareAvailable) {
            showError('Share is not available')
            return
        }

        const directory = new Directory(Paths.document, 'shared-documents')

        if (!directory.exists) {
            directory.create()
        }

        const file = new File(directory, existFile.name)

        await existFile.copy(file, { overwrite: true })

        await ShareFile.shareAsync(file.uri)
        file.delete()
        directory.delete()
    } catch (error) {
        showError('Failed to share!')
        console.log("failed", error)
    }
}




const Files = () => {
    const [directory, setDirectory] = useState<Directory | null>(null)

    useEffect(() => {
        const loadDirectory = async () => {
            const directory = await getDirectory()
            setDirectory(directory)
        }
        loadDirectory()
    }, [])

    if (!directory) return null

    const list = directory.list()
    const files = list.filter((file): file is File => file instanceof File)


    const deleteFiles = (date: Date) => {
        // const modifiedDate = new Date(setDate(date, 1).setHours(23, 59, 59, 0)).getTime()

        // console.log("===================================================")
        // try {
        //     const filteredFiles = files.filter(file => (file.lastModified as number) < modifiedDate)

        //     filteredFiles.forEach((file, i) => {
        //         if (file.exists) {
        //             file.delete()
        //         }
        //     })

        // } catch (error) {
        //     console.log(error)
        // }
        console.log("TODO : delete files before selected date")
    }


    return (
        <Container>

            <ScrollView>
                <View className='gap-2'>
                    {
                        files.map(file => (
                            <FileCard
                                key={file.uri.toString()}
                                file={file}
                                onShare={async () => { await fileShare(file) }}
                            />
                        ))
                    }
                </View>
            </ScrollView>

            <Button onPress={() => deleteFiles(new Date())} >
                <Text >Delete files</Text>
            </Button>
        </Container>
    )
}

export default Files