import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import type { ReactNode } from "react"
import { View } from "react-native"

interface EmptyStateProps {
    icon?: ReactNode
    title?: string
    description?: string
    action?: ReactNode
}

export function EmptyState({
    icon,
    title = "No inventory items",
    description = "Your inventory is empty. Start scanning or adding items.",
    action,
}: EmptyStateProps) {
    return (
        <Empty className="col-span-full border border-dashed border-border bg-card mb-4">
            <EmptyHeader>
                <EmptyMedia>
                    <View className="h-14 w-14 items-center justify-center rounded-full bg-secondary">
                        {icon && icon}
                    </View>
                </EmptyMedia>

                <EmptyTitle>{title}</EmptyTitle>
                <EmptyDescription>{description}</EmptyDescription>
            </EmptyHeader>

            {action && <EmptyContent>{action}</EmptyContent>}
        </Empty>
    )
}
