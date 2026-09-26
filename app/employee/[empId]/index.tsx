import { View, } from 'react-native'
import React from 'react'
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import CardWrapper from '@/components/shared/card-wrapper';
import EmployeeUpdateForm from '@/components/form/employee-update-form';
import Container from '@/components/shared/container';
import ChangePasswordModal from '@/components/modal/change-password-modal';
import { useModalAction } from '@/hooks/redux/use-modal';
import { MODAL_TYPE } from '@/constants';

const EmployeeDetails = () => {
    const { empId } = useLocalSearchParams<{ empId: string }>();
    return (
        <>
            <CardWrapper
                title="Employee settings"
                description={`Employee ${empId}`}
            >
                <View className='gap-2'>
                    <Link
                        href={`/employee/${empId}/expiry-scan`}
                        asChild
                    >
                        <Button>
                            <Text>
                                Expiry Scanning
                            </Text>
                        </Button>
                    </Link>
                    <Link
                        href={`/employee/${empId}/details`}
                        asChild
                    >
                        <Button>
                            <Text>
                                Employee Details
                            </Text>
                        </Button>
                    </Link>
                </View>
            </CardWrapper>
        </>
    )
}

export default EmployeeDetails
