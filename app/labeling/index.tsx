import { View } from 'react-native'
import ReusableTab from '@/components/shared/tab'
import { Text } from '@/components/ui/text'
import Container from '@/components/shared/container'
import { Button } from '@/components/ui/button'

const Labeling = () => {
    return (
        <Container>
            <View className='flex-1 py-3'>
                <ReusableTab
                    tabLabels={[{
                        label: 'Inventory',
                        hidden: false,
                    }, {
                        label: 'Order'
                    }]}
                    tabContent={{
                        Inventory: <InventoryLabeling />,
                        Order: <OrderLabeling />,
                    }}
                />
            </View>
        </Container>
    )
}

export default Labeling

const OrderLabeling = () => {
    return <View className='flex-1 justify-between pb-2'>
        <View>
            <Text>
                content
            </Text>
        </View>
        <View>
            <Button >

                <Text>
                    content
                </Text>
            </Button>
        </View>
    </View>
}

const InventoryLabeling = () => {
    return <View>
        <Text>
            Inventory
        </Text>
    </View>
}

const Tab2 = () => {
    return <View>
        <Text>
            Tab2
        </Text>
    </View>
}

const Todo = () => {
    return <View>
        <Text>
            Todo
        </Text>
    </View>
}