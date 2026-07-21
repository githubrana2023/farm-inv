import { useState } from 'react';
import { View } from 'react-native';

import {
    Card,
    CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useColorScheme } from 'nativewind';
import Lucide from '@react-native-vector-icons/lucide';

interface FolderSelectorProps {
    selectedFolder?: string | null;
    onFolderSelect?: (folderPath: string) => void;
}

export function FolderSelector({ handlePick }: { handlePick: () => void }) {

    const isDark = useColorScheme().colorScheme === 'dark'

    return (
        <View className="flex-1 items-center justify-center bg-background px-5">
            <View className="w-full max-w-md">
                <Card className="rounded-2xl">
                    <CardContent className="items-center gap-8 p-8">
                        {/* Icon */}
                        <View className="items-center justify-center">
                            <View className="rounded-2xl bg-primary/10 p-5">
                                <Lucide
                                    name='folder-open'
                                    size={48}
                                    className="text-primary"
                                />
                            </View>
                        </View>

                        {/* Title */}
                        <View className="gap-3">
                            <Text className="text-center text-2xl font-bold">
                                Select a Folder
                            </Text>

                            <Text className="text-center leading-6 text-muted-foreground">
                                Choose a folder to view and manage your files.
                                You'll be able to see the file size, type,
                                and last modified date.
                            </Text>
                        </View>

                        {/* Browse Button */}
                        <Button
                            className="w-full"
                            size="lg"
                            onPress={handlePick}
                        >
                            <Lucide
                                name='plus'
                                size={18}
                                className="mr-2 text-primary-foreground"
                                color={isDark ? 'black' : 'white'}
                            />
                            <Text>Browse Folder</Text>
                        </Button>


                        {/* Helper Text */}
                        <View className="w-full border-t border-border pt-5">
                            <Text className="text-center text-xs text-muted-foreground">
                                Select a folder from your device to start
                                browsing files.
                            </Text>
                        </View>
                    </CardContent>
                </Card>

                {/* Tip Card */}
                <Card className="mt-5 border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                        <Text className="mb-2 font-semibold">
                            💡 Tip
                        </Text>

                        <Text className="text-xs leading-5 text-muted-foreground">
                            Once you select a folder, all files inside it
                            will be displayed with their size, type, and
                            last modified date.
                        </Text>
                    </CardContent>
                </Card>
            </View>
        </View>
    );
}