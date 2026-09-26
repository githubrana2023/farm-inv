import React from "react";
import { View } from "react-native";
import {
    Gesture,
    GestureDetector,
} from "react-native-gesture-handler";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { Button } from "../ui/button";
import { Text } from "../ui/text";
import { Icon } from "../ui/icon";
import { Edit, Trash } from "lucide-react-native";

type SwipeableRowProps = {
    children: React.ReactNode;
    onEdit?: () => void;
    onDelete?: () => void;
};

const ACTION_WIDTH = 100;

export function SwipeableRow({
    children,
    onEdit,
    onDelete,
}: SwipeableRowProps) {
    const translateX = useSharedValue(0);

    const pan = Gesture.Pan()
        .activeOffsetX([-10, 10])
        .failOffsetY([-10, 10])
        .onUpdate((event) => {
            // Only allow right → left

            const value = Math.min(
                0,
                Math.max(-ACTION_WIDTH, event.translationX)
            );

            translateX.value = value;
        })
        .onEnd(() => {
            if (translateX.value < -ACTION_WIDTH / 2) {
                translateX.value = withSpring(-ACTION_WIDTH);
            } else {
                translateX.value = withSpring(0);
            }
        });

    const rowAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value,
            },
        ],
    }));

    const actionsAnimatedStyle = useAnimatedStyle(() => ({
        opacity: interpolate(
            translateX.value,
            [-ACTION_WIDTH, 0],
            [1, 0]
        ),
    }));

    return (
        <View className="relative overflow-hidden">
            {/* Actions */}
            <Animated.View
                style={actionsAnimatedStyle}
                className="absolute right-0 top-0 bottom-0 flex-row gap-1"
            >

                <Button size='sm' variant={'outline'} className="items-center justify-center">
                    <Text>
                        <Icon
                            as={Edit}
                        />
                    </Text>
                </Button>
                <Button size='sm' variant={'destructive'} className="items-center justify-center">
                    <Text>
                        <Icon
                            as={Trash}
                        />
                    </Text>
                </Button>



            </Animated.View>

            {/* Main row */}
            <GestureDetector gesture={pan}>
                <Animated.View style={rowAnimatedStyle}>
                    {children}
                </Animated.View>
            </GestureDetector>
        </View>
    );
}

