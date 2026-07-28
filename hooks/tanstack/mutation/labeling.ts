import { MUTATION_KEY } from "@/constants/tanstack-query"
import { createLabeling } from "@/dal/employee/create-labeling"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { labelingTable } from "@/drizzle/schema/inventory"
import { saveFile, saveInventory, saveOrder } from "@/lib/expo-file-system/save-file"
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
                const invLabels = labels.filter(label => label.saveFlag === 'Inventory').map(label => ({ ...label, onPress: saveInventory }))
                const orderLabels = labels.filter(label => label.saveFlag === 'Order').map(label => ({ ...label, onPress: saveOrder }))

                return { invLabels, orderLabels }
            } catch (error) {
                console.log('Failed to get labels', error)
                showError('Failed to get labels')
                return null
            }
        }
    })
}
