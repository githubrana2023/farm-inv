import { MUTATION_KEY } from "@/constants/tanstack-query"
import { createLabeling } from "@/dal/employee/create-labeling"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { labelingTable } from "@/drizzle/schema/inventory"
import { saveInventory } from "@/lib/expo-file-system/save-inventory"
import { saveOrder } from "@/lib/expo-file-system/save-order"
import { saveTags } from "@/lib/expo-file-system/save-tags"
import { showError } from "@/lib/toast/error"
import { useMutation, useQuery } from "@tanstack/react-query"

export const useLabelingCreateMutation = () => {
    return useMutation({
        mutationKey: [MUTATION_KEY.LABELING.CREATE],
        mutationFn: createLabeling
    })
}



export const useLabelingGetQuery = () => {
    return useQuery({
        queryKey: [MUTATION_KEY.LABELING.READ],
        queryFn: async () => {
            try {
                const labels = await inventoryDb.select(
                    {
                        id: labelingTable.id,
                        label: labelingTable.label,
                        saveFlag: labelingTable.saveFlag
                    }
                ).from(labelingTable)
                const inventory = labels.filter(label => label.saveFlag === 'Inventory').map(label => ({ ...label, onPress: saveInventory }))
                const order = labels.filter(label => label.saveFlag === 'Order').map(label => ({ ...label, onPress: saveOrder }))
                const tag = labels.filter(label => label.saveFlag === 'Tags').map(label => ({ ...label, onPress: saveTags }))

                const invLabels = [{ id: 'inventory', label: "inventory", saveFlag: "Inventory", onPress: saveInventory }, ...inventory]
                const orderLabels = [{ id: 'order', label: "order", saveFlag: "Order", onPress: saveOrder }, ...order]
                const tagLabels = [{ id: 'tag', label: "tag", saveFlag: "Tags", onPress: saveTags }, ...tag]

                return { invLabels, orderLabels, tagLabels }
            } catch (error) {
                console.log('Failed to get labels', error)
                showError('Failed to get labels')
                return null
            }
        }
    })
}
