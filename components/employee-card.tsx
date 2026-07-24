import Lucide from "@react-native-vector-icons/lucide"
import { Pressable, View } from "react-native"
import { EmployeeLoginForm } from "./form/employee-login-form"
import { CardDescription, CardTitle } from "./ui/card"
import { Separator } from "./ui/separator"
import { useState } from "react"

export const EmployeeCard = (
    { employeeName, employeeId }: { employeeName: string, employeeId: string }
) => {

    const [isLoginState, setIsLoginState] = useState(false)

    return (

        <View className="gap-2 border border-muted rounded-lg px-4 py-2">
            {isLoginState && (
                <>
                    <View>
                        <CardTitle>{employeeId}</CardTitle>
                        <CardDescription>{employeeName}</CardDescription>
                    </View>
                    <Separator />
                </>
            )
            }
            <View className="flex-row items-center justify-between gap-2">

                {isLoginState ? (
                    <View className='flex-1'>
                        <EmployeeLoginForm employeeId={employeeId} onSubmitCallback={() => setIsLoginState(false)} />
                    </View>
                ) : (
                    <View>
                        <CardTitle>{employeeId}</CardTitle>
                        <CardDescription>{employeeName}</CardDescription>
                    </View>
                )}
                <Pressable
                    className='active:bg-muted-foreground/20 rounded-full border border-muted bg-muted '
                    onPress={() => setIsLoginState(prev => !prev)}
                >

                    <View className="items-center justify-center p-3">
                        <Lucide
                            name='arrow-right'
                            size={20}
                        />
                    </View>
                </Pressable>
            </View>
        </View>
    )
}
