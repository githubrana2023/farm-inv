import '@/global.css';

import { Tabs } from 'expo-router';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";



export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function TabsLayout() {

  return (
    <Tabs >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Scan',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='house' iconStyle='solid' size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="items-list"
        options={{
          title: 'Items-List',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='list' iconStyle='solid' size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="price"
        options={{
          title: 'Price',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='tags' iconStyle='solid' size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='magnifying-glass' iconStyle='solid' size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='file-lines' iconStyle='solid' size={size} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome6 name='gear' iconStyle='solid' size={size} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
