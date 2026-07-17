import { SCAN_FLAG } from "@/constants";
import { useCountDown } from "@/hooks/use-count-down";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Pressable, TouchableOpacity, View } from "react-native";
import InputField from "@/components/shared/input-field";
// import { ItemDetails } from "@/components/shared/item-details";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import { Label } from "../ui/label";
import { RadioGroup } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";
import { Text } from "../ui/text";
import z from "zod";
import FontAwesome6 from "@react-native-vector-icons/fontawesome6";
import { useColorScheme } from "nativewind";
import { addItemFormSchema, AddItemFormValue } from "@/lib/zod/add-item-form-schema";
import { usePersistAdvanceMode } from "@/hooks/use-persist-advance-mode";
import { useGetItemByBarcode } from "@/hooks/tanstack/mutation/item/get-item";
import { ItemDetails } from "../shared/item-details";
import { useDefaultUnitFromItemDetails } from "@/hooks/use-default-unit";
import Lucide from "@react-native-vector-icons/lucide";
import { showDynamicToast } from "@/lib/toast/dynamic";
import { useScanItemInsertMutation } from "@/hooks/tanstack/mutation/item/insert-item";



export default function AddItemForm() {
  const [triggerWidth, setTriggerWidth] = React.useState(0);
  const { isTimerFinish, startTimer } = useCountDown(5);
  const isDark = useColorScheme().colorScheme === 'dark';

  const quantityInputRef = React.useRef<any>(null);
  const barcodeInputRef = React.useRef<any>(null);


  //! React-hook-form
  const form = useForm<AddItemFormValue>({
    defaultValues: {
      barcode: "",
      uom: "",
      quantity: "",
      isAdvanceMode: false,
    },
    resolver: zodResolver(addItemFormSchema),
  });


  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue: setFormValue,
    getValues: getFormValues,
  } = form;


  const { isHydrated } = usePersistAdvanceMode(form)

  const isAdvanceMode = useWatch({
    control,
    name: "isAdvanceMode",
  });

  const scanType = useWatch({ control, name: "scanType" });


  //! Tanstack mutation hook
  const { mutate: getItemByBarcode, data: itemDetails, reset: resetGetItem } = useGetItemByBarcode()
  const { mutate: insertScannedItem, } = useScanItemInsertMutation()


  useDefaultUnitFromItemDetails(form, itemDetails)

  //! handle submit function
  const onSubmit = handleSubmit((value) => {

    insertScannedItem(value, {
      onSuccess({ data, success, message }) {
        showDynamicToast(message, success)
        if (success) {
          handleResetForm();
          barcodeInputRef.current?.focus();
        }
      }
    })
  });

  //! handle submit function
  const handleOnSubmitEditing = React.useCallback(
    () => {
      const barcode = getFormValues('barcode')
      getItemByBarcode(
        { barcode, isAdvanceMode, scanType },
        {
          onSuccess({ success, message }) {
            showDynamicToast(message, success)
            if (success) {
              quantityInputRef.current?.focus()
            } else {

              barcodeInputRef.current?.focus()
            }

          }
        }
      )
    },
    [isAdvanceMode, scanType, setFormValue],
  );

  // handle reset form
  const handleResetForm = () => {
    const currentAdvanceMode = getFormValues("isAdvanceMode");
    const currentScanFor = getFormValues("scanType");

    resetForm({
      barcode: "",
      uom: "",
      quantity: "",
      isAdvanceMode: currentAdvanceMode,
      scanType: currentAdvanceMode ? (currentScanFor ?? "Inventory") : undefined,
    });
  };


  if (!isHydrated) return null

  return (
    <>
      <Form {...form}>
        <View className="gap-1.5">
          {/* Barcode Input */}
          <FormField
            control={control}
            name="barcode"
            render={({ field }) => (
              <View className="relative">
                <InputField
                  ref={barcodeInputRef}
                  placeholder="Barcode/Item-Code"
                  keyboardType="numeric"
                  returnKeyType="next"
                  onChangeText={(text) => {
                    field.onChange(text)
                    if (text.length === 0) {
                      resetGetItem()
                      handleResetForm();
                    }
                  }}
                  value={field.value}
                  onSubmitEditing={handleOnSubmitEditing}
                />

                {/* Clear Button */}
                {field.value.length > 0 ? (
                  <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <TouchableOpacity
                      onPress={async () => {
                        handleResetForm();
                        resetGetItem()
                      }}
                    >
                      <Lucide name="x-circle" size={24} />
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          />

          {/* UOM & Quantity Container Start */}
          <View className="flex-row items-center gap-1">
            {/* UOM Select Input */}
            <View className="flex-1">
              <FormField
                name="uom"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(option) => {
                          field.onChange(option?.value);
                        }}
                        value={
                          field.value ? {
                            value: field.value,
                            label: field.value
                          } : undefined
                        }
                      // disabled={!itemDetails}
                      >
                        <SelectTrigger
                          onLayout={(e) =>
                            setTriggerWidth(e.nativeEvent.layout.width)
                          }
                        //   disabled={!itemDetails || !itemDetails.data}
                        >
                          <SelectValue placeholder="UOM" />
                        </SelectTrigger>
                        <SelectContent style={{ width: triggerWidth }} className="mt-2">
                          <SelectGroup className="">
                            <SelectLabel>Units</SelectLabel>
                            {
                              itemDetails?.data?.item?.itemUoms && (
                                itemDetails?.data?.item?.itemUoms.map(
                                  ({ uom, barcode, packing }) => (
                                    <SelectItem
                                      key={barcode}
                                      value={`${uom}|${String(packing)}`}
                                      label={`${uom} (${String(packing)})`}
                                    />
                                  )
                                )

                              )
                            }
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </View>

            {/* Quantity Input */}
            <View className="flex-1">
              <FormField
                control={control}
                name="quantity"
                render={({ field }) => (
                  <InputField
                    {...field}
                    ref={quantityInputRef}
                    placeholder="Quantity"
                    keyboardType="numeric"
                    returnKeyType="go"
                    value={field.value.toString()}
                    onChangeText={field.onChange}
                    onSubmitEditing={onSubmit}
                  />
                )}
              />
            </View>
          </View>
          {/* UOM & Quantity Container Finish */}

          <FormField
            name="isAdvanceMode"
            control={control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <View className="flex-row items-center justify-between">
                    <Label>Advance Mode</Label>
                    <Switch
                      onCheckedChange={(isEnable) => {
                        field.onChange(isEnable);
                        setFormValue(
                          "scanType",
                          "Inventory"
                        );
                      }}
                      checked={field.value}
                    />
                  </View>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Multitask Scan*/}
          {isAdvanceMode && (
            <FormField
              control={control}
              name="scanType"
              render={({ field }) => (
                <FormItem>
                  <View className="flex-row items-center gap-3">
                    <Label className="font-semibold">Scan For</Label>
                    <Pressable onPress={startTimer}>
                      <Text className="">
                        <Lucide name="info" size={18} />
                      </Text>
                    </Pressable>
                  </View>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex-row gap-2"
                    >
                      {SCAN_FLAG.map((variant) => {
                        const isActive = field.value === variant;

                        return (
                          <Pressable
                            onPress={() => field.onChange(variant)}
                            key={variant}
                            className={cn(
                              "flex-1 rounded-md",
                              isActive ? "dark:bg-white bg-black" : "border border-gray-100",
                            )}
                          >
                            <Text
                              className={cn(
                                "py-1 text-center font-semibold",
                                isActive && "dark:text-black text-white",
                              )}
                            >
                              {variant}{" "}
                              {isActive && (
                                <FontAwesome6
                                  name="check"
                                  iconStyle="solid"
                                  color={isDark ? "#000" : "#fff"}
                                  size={14}
                                />
                              )}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  {!isTimerFinish && (
                    <FormDescription>
                      By using this feature merchandiser can scan multi type
                      inventory at the same time. Like{" "}
                      <Text className="font-semibold text-sm">
                        Inventory, Shelf tags, Order
                      </Text>
                    </FormDescription>
                  )}
                </FormItem>
              )}
            />
          )}
        </View>
        <Separator className="my-3" />
        <View>
          {itemDetails && itemDetails.data && (
            <ItemDetails
              header={{
                title: "Item Details",
                description: itemDetails.data.orderItem?.isDuplicated
                  ? "Duplicate scan for order"
                  : "Scanned item",
              }}
              item={itemDetails.data}
              onUpdate={(item, quantity) => {
                // updateScannedItemMutation(
                //   {
                //     storedScannedItemId: item.storedItem?.storedId!,
                //     quantity: quantity.toString(),
                //   },
                //   {
                //     onSuccess() {
                //       dispatch(onClose());
                //       handleResetForm();
                //       refetchStoredItems();
                //       resetItemDetailsMutation();
                //     },
                //   },
                // );
              }}
              onDelete={(item) => {
                // deleteScannedItemMutation(item.storedItem?.storedId!, {
                //   onSuccess() {
                //     dispatch(onClose());
                //     refetchStoredItems();
                //     handleResetForm();
                //     resetItemDetailsMutation();
                //   },
                // });
              }}
            />
          )}
        </View>
      </Form>
    </>
  );
}
