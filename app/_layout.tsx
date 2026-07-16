import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from 'expo-router/react-navigation';
import { PortalHost } from '@rn-primitives/portal';
import { Tabs, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";


import Toast from 'react-native-toast-message'
import ModalProvider from '@/components/provider/modal-provider';
import ReduxStoreProvider from '@/components/provider/redux-store-provider';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { TanstackQueryProvider } from '@/components/provider/tanstack-query-client';

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
            <Stack
              screenOptions={{
                headerShown: false
              }}
            />
            <Toast />
            <PortalHost />
            <ModalProvider />
          </ReduxStoreProvider>
        </TanstackQueryProvider>
      </KeyboardProvider>
    </ThemeProvider>
  );
}
