import { View, } from 'react-native'
import { Button } from './ui/button'
import { Text } from './ui/text'
import { inventoryDb } from '@/drizzle/db/inventory-db'
import { employeeTable, labelingTable } from '@/drizzle/schema/inventory'
import { invalidateEmployeeGetQuery } from '@/lib/tanstack-query/employee'
import { invalidateLabelingGetQuery } from '@/lib/tanstack-query/labeling'

const EmployeeSettings = () => {




    return (
        <View className='gap-3'>
            <Button onPress={async () => {
                await inventoryDb.delete(employeeTable)
                invalidateEmployeeGetQuery()
            }}>
                <Text>Delete Emp</Text>
            </Button>
            <Button onPress={async () => {
                await inventoryDb.delete(labelingTable)
                invalidateLabelingGetQuery()
            }}>
                <Text>Delete Labeling</Text>
            </Button>
        </View>
    )
}

export default EmployeeSettings