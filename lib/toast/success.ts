import Toast from "react-native-toast-message"

export const showSuccess = (msg: string) => {
    Toast.show({
        type: 'success',
        text1: msg
    })
}