import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";


import Toast from 'react-native-toast-message'
import ModalProvider from '@/components/provider/modal-provider';
import ReduxStoreProvider from '@/components/provider/redux-store-provider';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { TanstackQueryProvider } from '@/components/provider/tanstak-query-client';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>

      <KeyboardProvider>
        <TanstackQueryProvider>
          <ReduxStoreProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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
            <Toast />
            <PortalHost />
            <ModalProvider />
          </ReduxStoreProvider>
        </TanstackQueryProvider>
      </KeyboardProvider>
    </ThemeProvider>
  );
}
