import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";
import { Card, CardContent } from "../ui/card";
import { Text } from "../ui/text";


type LoadingStateProp = {
    title: string;
    description: string;
    indicatorSize?: number | 'small' | 'large'
}

export function LoadingState({ title, description, indicatorSize }: LoadingStateProp) {
    return (
        <View className="flex-1 items-center justify-center p-6">
            <Card className="w-full max-w-md">
                <CardContent className="items-center gap-4 p-6">
                    <ActivityIndicator size={indicatorSize} />
                    <Text className="text-xl font-semibold">
                        {title}
                    </Text>
                    <Text className="text-center text-muted-foreground">
                        {description}
                    </Text>
                </CardContent>
            </Card>
        </View>
    );
}