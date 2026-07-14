import AddItemForm from '@/components/form/add-item-form';
import PickDocument, { getStoredData } from '@/components/pick-document';
import Container from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Link, } from 'expo-router';
import { MoonStarIcon, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { Image, type ImageStyle, View } from 'react-native';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  title: 'Home',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

export default function Screen() {
  const { colorScheme } = useColorScheme();

const storedScannedItems:unknown[] = []
  return (
    <Container>
      {/* <Tabs.Screen options={SCREEN_OPTIONS} />
      <View className="flex-1 items-center justify-center gap-8 p-4">
        <Image source={LOGO[colorScheme ?? 'light']} style={IMAGE_STYLE} resizeMode="contain" />
        <View className="gap-2 p-4">
          <Text className="ios:text-foreground font-mono text-sm text-muted-foreground">
            1. Edit <Text variant="code">app/index.tsx</Text> to get started.
          </Text>
          <Text className="ios:text-foreground font-mono text-sm text-muted-foreground">
            2. Save to see your changes instantly.
          </Text>
        </View>
        <View className="flex-row gap-2">
          <Link href="https://reactnativereusables.com" asChild>
          </Link>
          <Button onPress={() => { }}>
            <Text>Browse the Docs</Text>
          </Button>
          <Link href="https://github.com/founded-labs/react-native-reusables" asChild>
            <Button variant="ghost">
              <Text>Star the Repo</Text>
              <Icon as={StarIcon} />
            </Button>
          </Link>
          <PickDocument />
        </View>
      </View> */}
      <AddItemForm/>

      {
        storedScannedItems.length > 0 ? (
          // <FlatList
          //   className="pb-0 flex-1"
          //   showsVerticalScrollIndicator={false}
          //   data={storedScannedItems}
          //   renderItem={({ item }) => (
          //     <ScannedItemCard
          //       key={item.barcode}
          //       item={item}
          //       isCollapseAble
          //       defaultCollapse={false}
          //     />
          //   )}
          // />
          <Text>Show scanned items</Text>
        ) : (
          <EmptyState
            icon={<FontAwesome6 name='box' iconStyle='solid' size={28} />}
          />
        )
      }
    </Container>
  );
}

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Button
      onPressIn={toggleColorScheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4">
      <Icon as={THEME_ICONS[colorScheme ?? 'light']} className="size-5" />
    </Button>
  );
}
