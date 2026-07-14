import { multitaskVariantValues } from "@/constants";
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


const schema = z.object({
    barcode:z.string(),
    uom:z.string(),
    isAdvanceMode:z.coerce.boolean<boolean>(),
    quantity:z.coerce.number<number>(),
    scanType:z.string(),
})

export default function AddItemForm() {
  const [triggerWidth, setTriggerWidth] = React.useState(0);
  const { isTimerFinish, startTimer } = useCountDown(5);

  const quantityInputRef = React.useRef<any>(null);
  const barcodeInputRef = React.useRef<any>(null);


  //! React-hook-form
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      barcode: "",
      uom: "",
      quantity: 1,
      isAdvanceMode: false,
      scanType: undefined,
    },
  });
  const {
    control,
    handleSubmit,
    reset: resetForm,
    setValue: setFormValue,
    getValues: getFormValues,
  } = form;
  const isAdvanceMode = useWatch({
    control,
    name: "isAdvanceMode",
  });
  const scanType = useWatch({ control, name: "scanType" });

  //! Tanstack mutation hook
  

  //! handle submit function
  const onSubmit = handleSubmit(async (value) => {
    
    handleResetForm();

    barcodeInputRef.current?.focus();
  });

  //! handle submit function
  const handleOnSubmitEditing = React.useCallback(
    (code: string) => {
      if (!code) {
        return;
      }

    },
    [ isAdvanceMode, scanType, setFormValue],
  );

  // handle reset form
  const handleResetForm = () => {
    const currentAdvanceMode = getFormValues("isAdvanceMode");
    const currentScanFor = getFormValues("scanType");

    resetForm({
      barcode: "",
      uom: "",
      quantity: 1,
      isAdvanceMode: currentAdvanceMode,
      scanType: currentAdvanceMode ? (currentScanFor ?? "Inventory") : undefined,
    });
  };

  const handleBarcodeSubmit = React.useCallback(() => {
    const barcode = getFormValues("barcode");
    handleOnSubmitEditing(barcode);
  }, [getFormValues, handleOnSubmitEditing]);


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
                  onChangeText={field.onChange}
                  value={field.value}
                  onSubmitEditing={handleBarcodeSubmit}
                />

                {/* Clear Button */}
                {field.value.length > 0 ? (
                  <View className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    <TouchableOpacity
                      onPress={async () => {
                        handleResetForm();
                      }}
                    >
                      <FontAwesome6 name="x" iconStyle="solid" size={24} />
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
                        value={{
                          value: field.value,
                          label:"Select an unit"
                        }}
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
                        <SelectContent style={{ width: triggerWidth }}>
                          <SelectGroup>
                            <SelectLabel>Units</SelectLabel>
                            <SelectItem
                                value={"N/A"}
                                label={`na`}
                              />
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
                        <FontAwesome6 name="info" iconStyle="solid" size={18} />
                      </Text>
                    </Pressable>
                  </View>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      className="flex-row gap-0"
                    >
                      {multitaskVariantValues.map((variant) => {
                        const isActive = field.value === variant;

                        return (
                          <Pressable
                            onPress={() => field.onChange(variant)}
                            key={variant}
                            className={cn(
                              "flex-1 rounded-md",
                              isActive ? "bg-black" : "",
                            )}
                          >
                            <Text
                              className={cn(
                                "py-1 text-center font-semibold",
                                isActive && "text-white",
                              )}
                            >
                              {variant}{" "}
                              {isActive && (
                                <FontAwesome6
                                  name="check"
                                  iconStyle="solid"
                                  color="#fff"
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
        {/* <View>
          {itemDetails && itemDetails.data && (
            <>
              <ItemDetails
                header={{
                  title: "Item Details",
                  description: itemDetails.data.storedItem
                    ? "Duplicate scan for order"
                    : "Scanned item",
                }}
                item={itemDetails.data}
                onUpdate={(item, quantity) => {
                  updateScannedItemMutation(
                    {
                      storedScannedItemId: item.storedItem?.storedId!,
                      quantity: quantity.toString(),
                    },
                    {
                      onSuccess() {
                        dispatch(onClose());
                        handleResetForm();
                        refetchStoredItems();
                        resetItemDetailsMutation();
                      },
                    },
                  );
                }}
                onDelete={(item) => {
                  deleteScannedItemMutation(item.storedItem?.storedId!, {
                    onSuccess() {
                      dispatch(onClose());
                      refetchStoredItems();
                      handleResetForm();
                      resetItemDetailsMutation();
                    },
                  });
                }}
              />
              <Separator className="my-3" />
            </>
          )}
        </View> */}
      </Form>
    </>
  );
}
