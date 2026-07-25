
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { View } from 'react-native'
import { Separator } from '../ui/separator'

type CardWrapperProp = {
    title: string | React.ReactNode
    description: string | React.ReactNode
    children: React.ReactNode
    footerContent?: React.ReactNode
    headerContent?: React.ReactNode
    isSeparated?: boolean
}


const CardWrapper = ({ title, description, children, footerContent, headerContent, isSeparated }: CardWrapperProp) => {
    return (
        <Card className='p-2 gap-2'>
            <CardHeader className='flex-row justify-between px-0'>
                <View className='gap-1'>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </View>
                {headerContent && <View>{headerContent}</View>}
            </CardHeader>
            {
                isSeparated && (
                    <View className="px-0">
                        <Separator />
                    </View>
                )
            }
            <CardContent className='p-0'>{children}</CardContent>
            {footerContent && <CardFooter>{footerContent}</CardFooter>}
        </Card>
    )
}

export default CardWrapper