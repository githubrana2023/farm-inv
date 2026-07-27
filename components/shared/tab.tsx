import { View, Text } from 'react-native'
import React, { JSX } from 'react'

const Tab = ({ tabName, tabContent }: {
    tabContent: Record<string, () => JSX.Element>;
    tabName: readonly string[]
}) => {
    return (
        <View>
            <Text>Tab</Text>
        </View>
    )
}

export default Tab