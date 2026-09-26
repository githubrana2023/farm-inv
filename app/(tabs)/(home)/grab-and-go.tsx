import { FormRouteManu } from '@/components/shared/form-route-manu';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { useRouter, } from 'expo-router';
import { Menu, Plus, Search } from 'lucide-react-native';
import { View } from 'react-native';


const GrabAndGo = () => {
    const router = useRouter()
    return (
        <View>
            <Text>Grab & GO</Text>
            <View className='flex-row items-center gap-1'>
                <FormRouteManu />

                <Button size={'sm'} className='flex-1'>
                    <Text>Save</Text>
                </Button>
                <View className='flex-row'>
                    <Button variant={'outline'} size={'sm'} className='rounded-r-none'>
                        <Text>
                            <Icon
                                as={Search}
                            />
                        </Text>
                    </Button>
                    <Separator orientation='vertical' />
                    <Button variant={'outline'} size={'sm'} className='rounded-l-none'>
                        <Text>
                            <Icon
                                as={Plus}
                            />
                        </Text>
                    </Button>
                </View>
            </View>
        </View>
    )
}

export default GrabAndGo