import { useState } from 'react';
import { View } from 'react-native';
// import { Calendar, FileIcon, Share2 } from 'lucide-react-native';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import Lucide from '@react-native-vector-icons/lucide';
import { File } from 'expo-file-system';

interface FileCardProps {
    file: File
    onShare?: () => Promise<void>;
}

export function FileCard({
    file,
    onShare,
}: FileCardProps) {
    const [isSharing, setIsSharing] = useState(false);
    const fileName = file.name
    const extension = file.extension
    const size = file.size
    const lastModified = file.lastModified

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]
            }`;
    };

    const formatDate = (date: Date): string => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        }).format(date);
    };

    const handleShare = async () => {
        setIsSharing(true);

        await onShare?.();

        setTimeout(() => {
            setIsSharing(false);
        }, 600);
    };

    const isDbFile = extension === '.db'
    const isTxtFile = extension === '.txt'
    const isExcelFile = extension === '.xlsx'

    return (
        <Card className="w-full max-w-md">
            {/* Header */}
            <CardHeader className="flex-row items-start justify-between">
                <View className="flex-1 flex-row items-start gap-3">
                    <View className="rounded-lg bg-muted p-3 border border-muted">
                        <Lucide
                            name={
                                isTxtFile ? 'file-text' : isDbFile ? 'database' : isExcelFile ? 'sheet' : 'triangle-alert'
                            }
                            size={20} className="text-primary" />
                    </View>

                    <View className="min-w-0 flex-1">
                        <CardTitle className="truncate">
                            {fileName}
                        </CardTitle>

                        <Text className="text-sm text-muted-foreground">
                            {extension}
                        </Text>
                    </View>
                </View>
            </CardHeader>

            {/* File details */}
            <CardContent>
                <View className="flex-row gap-4 border-y border-border">
                    {/* Size */}
                    <View className="flex-1">
                        <Text className="mb-1 text-xs font-medium text-muted-foreground">
                            Size
                        </Text>

                        <View className="flex-row items-center gap-1.5">
                            <Lucide
                                name='cpu'
                                size={14}
                                className="text-muted-foreground"
                            />

                            <Text className="text-sm font-semibold">
                                {formatFileSize(size)}
                            </Text>
                        </View>

                    </View>

                    {/* Modified */}
                    <View className="flex-1">
                        <Text className="mb-1 text-xs font-medium text-muted-foreground">
                            Modified
                        </Text>

                        <View className="flex-row items-center gap-1.5">
                            <Lucide
                                name='calendar'
                                size={14}
                                className="text-muted-foreground"
                            />

                            {
                                lastModified && (
                                    <Text className="text-sm font-semibold">
                                        {formatDate(new Date(lastModified))}
                                    </Text>
                                )
                            }
                        </View>
                    </View>
                </View>
            </CardContent>

            {/* Share */}
            <CardFooter>
                <Button
                    variant="outline"
                    className="w-full bg-muted"
                    onPress={handleShare}
                    disabled={isSharing}
                >
                    <Lucide
                        name='share-2'
                        size={16}
                        className={isSharing ? 'text-primary' : 'text-foreground'}
                    />

                    <Text>
                        {isSharing ? 'Sharing...' : 'Share'}
                    </Text>
                </Button>
            </CardFooter>
        </Card>
    );
}