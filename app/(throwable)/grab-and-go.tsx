import { View } from 'react-native'
import Container from '@/components/shared/container';
import { GrabAndGoForm } from '@/components/form/grab-and-go-scan-form';
const Throwable = () => {

    return (
        <Container>
            <View className='flex-1'>
                <GrabAndGoForm />
            </View>
        </Container>
    )
}

export default Throwable