import '@/global.css';

import { Tabs } from 'expo-router';
import { Lucide } from "@react-native-vector-icons/lucide";



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
          tabBarIcon: ({ color }) => (
            <Lucide name='house' size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="items-list"
        options={{
          title: 'Items-List',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Lucide name='list' size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="price"
        options={{
          title: 'Price',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Lucide name='tags' size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Lucide name='search' size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: 'Files',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Lucide name='file-text' size={20} color={color} />
          )
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <Lucide name='settings' size={20} color={color} />
          )
        }}
      />
    </Tabs>
  );
}
