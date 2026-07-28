import { FlatList, View } from "react-native"
import { Button } from "./ui/button"
import { Text } from "./ui/text"
import Lucide from "@react-native-vector-icons/lucide"
import { DetailsRow } from "./shared/details-row"
import { useGetGrabAndGoFiftyPercentBarcodes } from "@/hooks/tanstack/query/grab-and-go/use-get-grab-and-go"
import { LoadingState } from "./shared/loading-state"
import { useGrabAndGoDeleteMutation } from "@/hooks/tanstack/mutation/grab-and-go/use-delete"
import { showDynamicToast } from "@/lib/toast/dynamic"
import { invalidQueries } from "@/lib/tanstack-query/invalid-query"
import { QUERY_KEY } from "@/constants/tanstack/query"

export const GrabAndGoItemList = () => {

    const { data, isPending } = useGetGrabAndGoFiftyPercentBarcodes()
    const { mutate: grabAndGoDeleteMutation, isPending: isGrabAndGoDeleteMutationPending } = useGrabAndGoDeleteMutation()

    if (isPending) return <LoadingState title="Fetching grab and go items" description="Please wait!" />

    const OnDelete = (id: string) => {
        grabAndGoDeleteMutation(id, {
            async onSuccess({ data, success, message }) {
                showDynamicToast(success, message)
                if (success) {
                    await invalidQueries([QUERY_KEY.GRAB_AND_GO.READ])
                }
            },
        })
    }


    return (
        <View className="pb-28 gap-1">
            <FlatList
                data={data?.data ?? []}
                keyExtractor={item => String(item.id)}
                renderItem={({ item }) => {
                    return (
                        <GrabAndGoItemCard item={item} onPress={OnDelete} />
                    )
                }}
            />
        </View>
    )
}

export const GrabAndGoItemCard = ({ item, onPress }: {
    item: {
        id: string;
        barcode: string;
        quantity: string;
        description: string;
    },
    onPress: (barcode: string) => void
}) => {

    return (
        <View className="flex-row border border-dashed  p-2 rounded-lg mb-2"        >
            <View className="flex-1 gap-1">
                <DetailsRow
                    label="Barcode"
                    value={item.barcode}
                    library="Lucide"
                    iconName="barcode"
                />
                <DetailsRow
                    label="Description"
                    value={item.description ?? "no description"}
                    library="Lucide"
                    iconName="file-text"
                />
                <DetailsRow
                    label="Quantity"
                    value={item.quantity}
                    library="Lucide"
                    iconName="layers"
                />
            </View>
            <Button size={'sm'} variant={'destructive'} onPress={() => onPress(item.id)}>
                <Text>
                    <Lucide name="trash" color={'white'} size={16} />
                </Text>
            </Button>
        </View>
    )
}