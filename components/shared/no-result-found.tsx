import { View } from "react-native";
import { SearchX } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

interface NoSearchResultsProps {
    query?: string;
    onClear?: () => void;
}

export function NoSearchResults({
    query = "your search",
    onClear,
}: NoSearchResultsProps) {
    return (
        <View className="flex-1 items-center justify-center px-6">
            <View className="w-full max-w-sm items-center rounded-xl border border-dashed border-border bg-card p-8">
                <View className="mb-6 rounded-full bg-muted p-5">
                    <SearchX
                        size={32}
                        className="text-muted-foreground"
                        strokeWidth={2}
                    />
                </View>

                <Text className="mb-2 text-center text-lg font-semibold">
                    No Results Found
                </Text>

                <Text className="mb-6 text-center text-sm text-muted-foreground">
                    We couldn't find anything matching{" "}
                    <Text className="font-medium text-foreground">
                        "{query}"
                    </Text>
                    . Try adjusting your search terms or using different keywords.

                </Text>

                {onClear && (
                    <Button
                        variant="secondary"
                        onPress={onClear}
                        className="min-w-40"
                    >
                        <Text>Clear Search</Text>
                    </Button>
                )}
            </View>
        </View>
    );
}