import { useColorScheme } from "nativewind";

export const useThemeColor = (isReverse: boolean = false) => {
    const { colorScheme } = useColorScheme();

    if (!isReverse) return colorScheme === 'dark' ? 'black' : 'white'
    return colorScheme === 'dark' ? 'white' : 'black'
}