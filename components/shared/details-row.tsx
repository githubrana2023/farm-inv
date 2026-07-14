// import { FontAwesome6, MaterialIcons } from '@expo/vector-icons';
// import { Text, View } from 'react-native';


// type MaterialIconName = keyof typeof MaterialIcons.glyphMap;
// type FontAwesomeIconName = keyof typeof FontAwesome6.glyphMap;

// type IconName = {
//     library: 'MaterialIcons';
//     name: MaterialIconName;
// } | {
//     library: 'FontAwesome';
//     name: FontAwesomeIconName;
// }




// export const DetailsRow = ({
//     icon: { library, name },
//     label,
//     value
// }: { icon: IconName, label: string, value: string }) => {

//     const isFontAwesome = library === 'FontAwesome';

//     return (

//         <View className="flex-row items-start gap-2 bg-white">
//             <View className='flex-row items-center justify-center w-8 h-8 bg-[##E8F1FC] rounded-md'>
//                 {isFontAwesome ? (
//                     <FontAwesome6 name={name} color={"#124DA1"} size={16} />
//                 ) : (
//                     <MaterialIcons name={name} color={"#124DA1"} size={16} />
//                 )}
//             </View>

//             <View className="flex-1">
//                 <Text className="text-xs font-semibold uppercase text-muted-foreground">
//                     {label}
//                 </Text>
//                 <Text className="text-sm text-foreground">
//                     {value}
//                 </Text>
//             </View>
//         </View>
//     )
// }