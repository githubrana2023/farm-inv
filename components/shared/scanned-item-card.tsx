import React from "react";
import { Controller, useForm } from "react-hook-form";
import { TouchableOpacity, View } from "react-native";
// import { DetailsRow } from "@/components/shared/details-row";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { getScannedItems } from "@/dal/item/get-item";
import Lucide from "@react-native-vector-icons/lucide";
import { DetailsRow } from "./details-row";
import { Text } from "../ui/text";
import { useColorScheme } from "nativewind";

type Item = NonNullable<Awaited<ReturnType<typeof getScannedItems>>['data']>['scannedItems'][number]
type WithActionBtn = {
  item: Item;
  enableActionBtn: true;
  defaultCollapse: boolean;
  isCollapseAble: boolean;
  onUpdate: (item: Item) => void;
  onDelete: (item: Item) => void;
};
type WithoutActionBtn = {
  item: Item;
  enableActionBtn: false;
  defaultCollapse?: boolean;
  isCollapseAble?: boolean;
  onUpdate?: never;
  onDelete?: never;
};
type ScannedItemCardProps = WithActionBtn | WithoutActionBtn;

const ScannedItemCard = ({
  item,
  enableActionBtn,
  isCollapseAble,
  defaultCollapse,
  onDelete,
  onUpdate,
}: ScannedItemCardProps) => {
  const [isEditState, setIsEditState] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(
    () => defaultCollapse ?? false,
  );

  const quantityRef = React.useRef<any>(null);
  const isDark = useColorScheme().colorScheme === 'dark'

  const form = useForm({
    defaultValues: {
      quantity: item.quantity,
    },
  });

  const onSubmit = form.handleSubmit((params) => {
    if (!!onUpdate && item.quantity !== params.quantity) {
      onUpdate({
        ...item,
        quantity: params.quantity,
      });
    }
    setIsEditState(false);
  });

  React.useEffect(() => {
    if (!isEditState) {
      form.reset({
        quantity: item.quantity,
      });
    }
  }, [isEditState, item.quantity, form]);

  return (
    <>

      <Card className=" border-muted my-0.5 p-2 gap-4">
        {/* Card Header Start */}
        <TouchableOpacity onPress={() => setIsCollapsed((prev) => !prev)}>
          <CardHeader className="flex-row items-center justify-between px-0">
            <View className="w-2/3">
              <View className="flex-row items-center gap-1">
                <CardTitle className="text-sm">BARCODE</CardTitle>

                {item.scanFlag && (
                  <Badge variant={"outline"} >
                    <Text className="text-xs">
                      {item.scanFlag === "Inventory" ? "Inv" : item.scanFlag}
                    </Text>
                  </Badge>
                )}
              </View>

              <CardDescription >
                {item.barcode}
              </CardDescription>
            </View>

            <View>
              {enableActionBtn ? (
                <>
                  {
                    !isEditState ? (
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        onPress={() => { onDelete(item) }}
                      >
                        <Lucide name={"trash"} size={14} color={"#fff"} />
                      </Button>
                    ) : (
                      <Button
                        variant={"outline"}
                        className="bg-[#E8F1FC]"
                        size={"sm"}
                        onPress={onSubmit}
                      >
                        <Lucide name={"save"} color={"#124DA1"} size={14} />
                      </Button>
                    )
                  }
                </>
              ) : (
                <ItemQuantityUnit
                  quantity={Number(item.quantity)}
                  uom={item.uom}
                  onPress={() => setIsEditState((prev) => !prev)}
                />
              )}
            </View>
          </CardHeader>
        </TouchableOpacity>
        {/*! Card Header End */}

        {isCollapseAble && !isCollapsed && (
          <>
            <CardContent className="flex-col gap-2 px-0 py-0">
              <View className="flex-row items-center">
                <View className="flex-1">
                  <DetailsRow
                    library="Lucide"
                    iconName="hash"
                    label="item code"
                    value={item.item_number}
                  />
                </View>
                <Button
                  variant={"outline"}
                  className="flex-row items-center gap-1"
                  size={"sm"}
                  onPress={async () => {
                  }}
                >
                  <Text className="text-muted-foreground">
                    <Lucide name="copy" color={isDark ? '#fff' : '#000'} />
                  </Text>
                  <Text>Barcode</Text>
                </Button>
              </View>
              <DetailsRow
                library="Lucide"
                iconName="file"
                label="description"
                value={item.description}
              />
            </CardContent>
            {enableActionBtn && (
              <>
                <Separator />
                <CardFooter className="items-center justify-between px-0">
                  <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center justify-center w-8 h-8 bg-[#E8F1FC] rounded-md">
                      <Lucide
                        name={"layers"}
                        color={"#124DA1"}
                        size={20}
                      />
                    </View>
                    <Text className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Quantity
                    </Text>
                  </View>

                  {isEditState ? (
                    <View>
                      <Controller
                        control={form.control}
                        name="quantity"
                        render={({ field: { onChange, value } }) => (
                          <Input
                            ref={quantityRef}
                            className="h-8 w-28" // same height & width as badge
                            returnKeyType="go"
                            keyboardType="numeric"
                            onSubmitEditing={onSubmit}
                            onChangeText={onChange}
                            value={value.toString()}
                          />
                        )}
                      />
                    </View>
                  ) : (
                    <ItemQuantityUnit
                      quantity={Number(item.quantity)}
                      uom={item.uom}
                      onPress={() => {
                        setIsEditState((prev) => !prev);
                        quantityRef.current?.focus();
                      }}
                    />
                  )}
                </CardFooter>
              </>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default ScannedItemCard;

type ItemQuantityUnitProps = {
  quantity: number;
  uom: string;
} & React.ComponentProps<typeof Text>;

export const ItemQuantityUnit = ({
  quantity,
  uom,
  ...props
}: ItemQuantityUnitProps) => {
  return (
    <Badge variant="outline" className="rounded-full px-2.5">
      <Text {...props} className="text-center text-sm ">
        {quantity} - {uom.toUpperCase()}
      </Text>
    </Badge>
  );
};
