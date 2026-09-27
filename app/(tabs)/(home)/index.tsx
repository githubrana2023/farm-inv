import AddItemForm from '@/components/form/add-item-form';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { MoonStarIcon, Plus, Search, SunIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { FlatList, View } from 'react-native';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import migrations from '@/drizzle/migration/inventoryDb/migrations'
import { useGetScannedItems } from '@/hooks/tanstack/mutation/item/get-item';
import ScannedItemCard from '@/components/shared/scanned-item-card';
import { LoadingState } from '@/components/shared/loading-state';
import { inventoryDb } from '@/drizzle/db/inventory-db';
import { FormRouteManu } from '@/components/shared/form-route-manu';
import { SaveActionLabel } from '@/components/shared/save-action-label';
import { useModalAction } from '@/hooks/redux/use-modal';
import { MODAL_TYPE } from '@/constants';
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

  const { onOpen } = useModalAction()

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
          <Button
            variant={'outline'}
            size={'sm'}
            className='rounded-l-none'
            onPress={() => onOpen(MODAL_TYPE.LABELING.CREATE)}
          >
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
