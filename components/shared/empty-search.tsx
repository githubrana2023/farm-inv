import { View } from "react-native";
import { Search } from "lucide-react-native";

import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

interface EmptySearchProps {
    placeholder?: string;
    description?: string;
}

export function EmptySearch({
    placeholder = "Start typing to search files...",
    description = "Enter a file name or keyword to find files in this folder.",
}: EmptySearchProps) {
    return (
        <View className="flex-1 items-center justify-center px-6 py-12">
            <Card className="w-full max-w-sm border-dashed">
                <CardContent className="items-center py-10">
                    <View className="mb-6 rounded-full bg-muted p-5">
                        <Search
                            size={32}
                            className="text-muted-foreground"
                            strokeWidth={2}
                        />
                    </View>

                    <Text className="mb-2 text-lg font-semibold">
                        Start Searching
                    </Text>

                    <Text className="mb-4 text-center text-sm text-muted-foreground">
                        {placeholder}
                    </Text>

                    <Text className="text-center text-xs text-muted-foreground">
                        {description}
                    </Text>
                </CardContent>
            </Card>
        </View>
    );
}