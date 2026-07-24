import { View, Text } from 'react-native'
import React from 'react'
import Lucide from '@react-native-vector-icons/lucide';
import { CardDescription, CardTitle } from './ui/card';
import { cn } from '@/lib/utils';

const ShowMessage = ({ success, title, description }: {
    success?: boolean
    title?: string;
    description: string
}) => {

    return (
        <View className={cn('flex-row items-center gap-2 px-2 py-2 rounded-md border-2', success ? "bg-emerald-400 border-emerald-500" : "bg-destructive/20 border-destructive/30")}>
            <View className='px-2'>
                <Lucide
                    name={success ? 'check-circle' : 'triangle-alert'}
                    color={success ? '#047857' : 'red'}
                    size={20}
                />
            </View>
            <View>
                {title && <CardTitle className={cn(success ? 'text-emerald-800' : 'text-destructive')}>{title}</CardTitle>}
                <CardDescription className={cn(success ? 'text-emerald-800' : 'text-destructive')}>{description}</CardDescription>
            </View>
        </View>
    )
}

export default ShowMessage