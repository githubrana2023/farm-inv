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
                    <Pressable onPress={() => setIsLoginState(prev => !prev)}>
                        <View>
                            <CardTitle>{employeeId}</CardTitle>
                            <CardDescription>{employeeName}</CardDescription>
                        </View>
                    </Pressable>
                    <Separator />
                </>
            )
            }
            {isLoginState ? (
                <View className='flex-1'>
                    <EmployeeLoginForm employeeId={employeeId} onSubmitCallback={() => setIsLoginState(false)} />
                </View>
            ) : (
                <Pressable onPress={() => setIsLoginState(prev => !prev)}>
                    <View>
                        <CardTitle>{employeeId}</CardTitle>
                        <CardDescription>{employeeName}</CardDescription>
                    </View>
                </Pressable>
            )}
        </View>
    )
}
