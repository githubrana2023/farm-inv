import { View, Text } from 'react-native'
import React from 'react'
import { Dialog, DialogFooter, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'


type WithoutHeader = {
    isWithoutHeader: true
    title?: never;
    description?: never;
}
type WithHeader = {
    isWithoutHeader: false
    title: string;
    description: string;
}
type Header = WithHeader | WithoutHeader



type BaseProp = {
    open: boolean;
    onOpenChange: () => void;
    children: React.ReactNode;
    footerContent?: string | React.ReactNode;
} & Header
const Modal = ({ description, onOpenChange, open, title, isWithoutHeader, footerContent, children }: BaseProp) => {

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {
                    !isWithoutHeader && (
                        <DialogHeader>
                            <DialogTitle>{title}</DialogTitle>
                            <DialogDescription>{description}</DialogDescription>
                        </DialogHeader>
                    )
                }
                <View>{children}</View>
                {
                    footerContent && (
                        <DialogFooter>
                            {footerContent}
                        </DialogFooter>
                    )
                }
            </DialogContent>
        </Dialog>
    )
}

export default Modal