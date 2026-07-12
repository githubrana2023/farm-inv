import Toast from "react-native-toast-message"

export const showError = (msg: string) => {
    Toast.show({
        type: 'error',
        text1: msg
    })
}