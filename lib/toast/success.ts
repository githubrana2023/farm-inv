import Toast from "react-native-toast-message"

export const showSuccess = (msg: string, msg2?: string) => {

    Toast.show({
        type: 'success',
        text1: msg,
        text2: msg === msg2 ? undefined : msg2,
        visibilityTime: 1500
    })
}