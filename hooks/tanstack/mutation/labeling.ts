import { MUTATION_KEY } from "@/constants/tanstack-query"
import { createLabeling } from "@/dal/employee/create-labeling"
import { inventoryDb } from "@/drizzle/db/inventory-db"
import { labelingTable } from "@/drizzle/schema/inventory"
import { saveFile } from "@/lib/expo-file-system"
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
                const labels = await inventoryDb.select().from(labelingTable)
                const modifiedLabels = labels.map(label => ({ onPress: saveFile, ...label }))
                const invLabels = modifiedLabels.filter(label => label.saveFlag === 'Inventory')
                const orderLabels = modifiedLabels.filter(label => label.saveFlag === 'Order')

                return { invLabels, orderLabels }
            } catch (error) {
                console.log('Failed to get labels', error)
                showError('Failed to get labels')
                return null
            }
        }
    })
}
