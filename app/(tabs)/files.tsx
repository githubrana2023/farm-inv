import { ScrollView, View } from 'react-native'

import { useEffect, useState } from 'react'
import Container from '@/components/shared/container'
import { Text } from '@/components/ui/text'
import { Button } from '@/components/ui/button'
import { getFiles } from '@/lib/expo-file-system/get-files'
import { getDirectory } from '@/lib/expo-file-system/directory-picker'
import { Directory, File, Paths } from 'expo-file-system'
import { FileCard } from '@/components/shared/file-card'
import { format, setDate, setHours } from 'date-fns'

import * as ShareFile from 'expo-sharing'
import { showError } from '@/lib/toast/error'
import { FolderSelector } from '@/components/shared/folder-selector'
import { useDirectory } from '@/hooks/use-directory'
import { LoadingState } from '@/components/shared/loading-state'

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

        const copiedFiles = directory.list()
        const current = new Date()

        const modifiedDate = current.setHours(0, 1, 0, 0)

        const olderFiles = copiedFiles.filter(file => {
            const copiedFile = new File(file)
            return new Date(copiedFile.creationTime ?? new Date()).getTime() < modifiedDate
        })

        await ShareFile.shareAsync(file.uri)

        if (olderFiles.length > 0) {
            for (const oldFile of olderFiles) {
                if (oldFile.exists) {
                    oldFile.delete()
                }
            }
        }


    } catch (error) {
        showError('Failed to share!')
        console.log("failed", error)
    }
}




const Files = () => {

    const { directory, pickFolder, loading, clearFolder } = useDirectory()

    if (loading) return <LoadingState title='Precessing...' description='Please select folder!' />

    if (!directory) return (
        <FolderSelector handlePick={pickFolder} />
    )

    const list = directory.list()
    const files = list.filter((file): file is File => file instanceof File)
    const sortedFiles = [...files].sort((a, b) => (a.creationTime ?? 0) - (b.creationTime ?? 0))


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
                        sortedFiles.map(file => (
                            <FileCard
                                key={file.uri.toString()}
                                file={file}
                                onShare={async () => { await fileShare(file) }}
                            />
                        ))
                    }
                </View>
            </ScrollView>

            <Button onPress={clearFolder} >
                <Text >Remove Permission</Text>
                {/* <Button onPress={() => deleteFiles(new Date())} >
                <Text >Delete files</Text> */}
            </Button>
        </Container>
    )
}

export default Files