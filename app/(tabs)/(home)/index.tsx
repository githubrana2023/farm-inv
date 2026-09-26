import AddItemForm from '@/components/form/add-item-form';
import Container from '@/components/shared/container';
import { EmptyState } from '@/components/shared/empty-state';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import FontAwesome6 from '@react-native-vector-icons/fontawesome6';
import { Link, useRouter, } from 'expo-router';
import { Menu, MoonStarIcon, MoreHorizontal, Plus, Search, StarIcon, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import * as React from 'react';
import { ActivityIndicator, FlatList, Image, type ImageStyle, View } from 'react-native';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migration/inventoryDb/migrations'
import { Card, CardContent } from '@/components/ui/card';
import Lucide from '@react-native-vector-icons/lucide';
import { useGetScannedItems } from '@/hooks/tanstack/mutation/item/get-item';
import ScannedItemCard from '@/components/shared/scanned-item-card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LoadingState } from '@/components/shared/loading-state';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { inventoryDb } from '@/drizzle/db/inventory-db';
import { FormRouteManu } from '@/components/shared/form-route-manu';
import { SaveActionLabel } from '@/components/shared/save-action-label';
const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const SCREEN_OPTIONS = {
  title: 'Home',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};


export default function Screen() {
  const { colorScheme } = useColorScheme();

  const { success, error } = useMigrations(inventoryDb, migrations);
  const { data } = useGetScannedItems()
  const scannedItems = data?.data?.scannedItems || []
  if (error) {
    console.log({ error });

    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }
  if (!success) {
    return (
      <LoadingState
        title='Preparing Database'
        description='Database migration is in progress. Please wait...'
        indicatorSize={'large'}
      />
    );
  }


  return (
    <>
      <AddItemForm />
      <View className='flex-1'>
        <FlatList
          className="pb-0 flex-1"
          showsVerticalScrollIndicator={false}
          data={scannedItems}
          renderItem={({ item, index }) => (
            <ScannedItemCard
              key={item.barcode + index}
              item={item}
              isCollapseAble
              defaultCollapse={false}
              enableActionBtn={false}
            />
          )}
        />
      </View>
      <View className='flex-row items-center gap-1 pb-2'>
        <FormRouteManu />

        <SaveActionLabel />

        <View className='flex-row'>
          <Button variant={'outline'} size={'sm'} className='rounded-r-none'>
            <Text>
              <Icon
                as={Search}
              />
            </Text>
          </Button>
          <Separator orientation='vertical' />
          <Button variant={'outline'} size={'sm'} className='rounded-l-none'>
            <Text>
              <Icon
                as={Plus}
              />
            </Text>
          </Button>
        </View>
      </View>
    </>
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
