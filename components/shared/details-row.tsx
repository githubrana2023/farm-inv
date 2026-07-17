import FontAwesome6, { FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';
import Lucide, { LucideIconName } from '@react-native-vector-icons/lucide';
import { JSX, ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';


type DetailsRowProp = LucideIcon | FontAwesome
type LucideIcon = {
    library: 'Lucide',
    iconName: LucideIconName
    label: string;
    value: string;
}
type FontAwesome = {
    library: 'FontAwesome',
    iconName: FontAwesome6SolidIconName
    label: string;
    value: string;
}



export const DetailsRow = ({
    library,
    label,
    value,
    iconName
}: DetailsRowProp) => {


    return (

        <View className="flex-row items-start gap-2 ">
            <View className='flex-row items-center justify-center w-8 h-8 bg-[##E8F1FC] rounded-md'>
                {library === 'FontAwesome' && (<FontAwesome6 name={iconName} color={"#124DA1"} size={16} iconStyle='solid' />)}
                {library === 'Lucide' && <Lucide name={iconName} color={"#124DA1"} size={16} />}
            </View>

            <View className="flex-1">
                <Text
                    className="text-xs font-semibold uppercase text-muted-foreground"
                >
                    {label}
                </Text>
                <Text >
                    {value}
                </Text>
            </View>
        </View>
    )
}