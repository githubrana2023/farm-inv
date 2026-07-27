import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"
import { cn } from "@/lib/utils"
import { Link, Stack, usePathname } from "expo-router"
import { Pressable, View } from "react-native"

const ThrowableLayout = () => {
    const pathName = usePathname()
    const isGrabAndGoActive = pathName === '/grab-and-go'
    const isThrowableActive = pathName === '/throwable'
    console.log({
        isGrabAndGoActive,
        isThrowableActive
    })
    return (
        <View className="flex-1">
            <Stack screenOptions={{
                headerShown: false
            }} />
            <View className="flex-row items-center justify-center">
                <View className="flex-row items-center justify-center gap-2 p-2 bg-secondary rounded-full">
                    <Link
                        href={'/throwable'}
                        asChild
                    >
                        <Pressable className={cn("px-2 py-0.5 rounded-full", isThrowableActive && 'bg-white')}>
                            <Text>Throwing</Text>
                        </Pressable>
                    </Link>
                    <Link
                        href={'/(throwable)/grab-and-go'}
                        asChild
                    >
                        <Pressable className={cn("px-2 py-0.5 rounded-full", isGrabAndGoActive && 'bg-white')}>
                            <View >
                                <Text>Grab & Go</Text>
                            </View>
                        </Pressable>
                    </Link>
                </View>
            </View>
        </View>
    )
}
export default ThrowableLayout