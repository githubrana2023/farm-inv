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
import { ActivityIndicator, FlatList, Image, type ImageStyle, View } from 'react-native';

import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { inventoryDb } from '@/drizzle/db/inventory-db';
import migrations from '@/drizzle/migration/inventoryDb/migrations'
import { Card, CardContent } from '@/components/ui/card';
import Lucide from '@react-native-vector-icons/lucide';
import { useGetScannedItems } from '@/hooks/tanstack/mutation/item/get-item';
import ScannedItemCard from '@/components/shared/scanned-item-card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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


function MigrationInProgress() {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardContent className="items-center gap-4 p-6">
          <ActivityIndicator size="large" />
          <Text className="text-xl font-semibold">
            Preparing Database
          </Text>
          <Text className="text-center text-muted-foreground">
            Database migration is in progress. Please wait...
          </Text>
        </CardContent>
      </Card>
    </View>
  );
}


export default function Screen() {
  const { colorScheme } = useColorScheme();

  const { success, error } = useMigrations(inventoryDb, migrations);
  const [activeTab, setActiveTab] = React.useState('Total')

  const { data, isPending, isLoading, isFetching, isFetched } = useGetScannedItems()

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
      <Container>
        <MigrationInProgress />
      </Container>
    );
  }

  if (isPending) return (
    <View>
      <Text>Pending</Text>
    </View>
  );


  const scannedItems = data?.data?.scannedItems
  const scannedItemsCount = data?.data?.scannedItemsCount

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
      <AddItemForm />

      {
        scannedItems?.length ? (
          <View className='flex-1'>
            {
              scannedItemsCount && (
                // <View className='flex-row justify-center items-center gap-1 py-2'>
                //   {
                //     scannedItemsCount.map(
                //       itemCount => (
                //         <Badge
                //           key={itemCount.scanFlag}
                //         >
                //           <Text className='font-semibold text-sm'>
                //             {itemCount.scanFlag === 'Inventory' ? "Inv" : itemCount.scanFlag} : {itemCount.count}
                //           </Text>
                //         </Badge>
                //       )
                //     )
                //   }
                // </View>


                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v)}
                  className="flex-1"
                >
                  <TabsContent value={'Total'} className='flex-1'>
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
                  </TabsContent>
                  <TabsContent value={'Order'} className='flex-1'>
                    <FlatList
                      className="pb-0 flex-1"
                      showsVerticalScrollIndicator={false}
                      data={scannedItems.filter(i => i.scanFlag === 'Order')}
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
                  </TabsContent>
                  <TabsContent value={'Tags'} className='flex-1'>
                    <FlatList
                      className="pb-0 flex-1"
                      showsVerticalScrollIndicator={false}
                      data={scannedItems.filter(i => i.scanFlag === 'Tags')}
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
                  </TabsContent>
                  <TabsContent value={'Inventory'} className='flex-1'>
                    <FlatList
                      className="pb-0 flex-1"
                      showsVerticalScrollIndicator={false}
                      data={scannedItems.filter(i => i.scanFlag === 'Inventory')}
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
                  </TabsContent>

                  <TabsList className="w-full justify-around mt-auto h-8">
                    {
                      scannedItemsCount.map((tab) => (
                        <TabsTrigger key={tab.scanFlag} value={tab.scanFlag ?? "Total"}>
                          <View className='items-center justify-center'>
                            <Text className='font-semibold text-sm'>
                              {tab.scanFlag === 'Inventory' ? "Inv" : tab.scanFlag} : {tab.count}
                            </Text>
                          </View>
                        </TabsTrigger>
                      ))
                    }

                  </TabsList>
                </Tabs>
              )
            }
          </View>
        ) : (
          <EmptyState
            icon={<Lucide name='package' size={28} />}
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
