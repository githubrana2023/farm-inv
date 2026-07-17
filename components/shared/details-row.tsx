import FontAwesome6, { FontAwesome6SolidIconName } from '@react-native-vector-icons/fontawesome6';
import { ReactNode } from 'react';
import { View } from 'react-native';
import { Text } from '../ui/text';



export const DetailsRow = ({
    label,
    value
}: { label: string, value: string }) => {


    return (

        <View className="flex-row items-start gap-2 ">
            <View className='flex-row items-center justify-center w-8 h-8 bg-[##E8F1FC] rounded-md'>
                {/* {isFontAwesome ? (
                    <FontAwesome6 name={name} color={"#124DA1"} size={16} />
                ) : (
                    <MaterialIcons name={name} color={"#124DA1"} size={16} />
                )} */}
                <Text>Icon</Text>
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