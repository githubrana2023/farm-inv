import { FlatList, View, } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import CardWrapper from '@/components/shared/card-wrapper';
import EmployeeUpdateForm from '@/components/form/employee-update-form';
import Container from '@/components/shared/container';
import ChangePasswordModal from '@/components/modal/change-password-modal';
import { useModalAction } from '@/hooks/redux/use-modal';
import { MODAL_TYPE } from '@/constants';
import { ExpiryScanForm } from '@/components/form/expiry-scan-form';
import { Separator } from '@/components/ui/separator';
import { ExpiryItemCard } from '@/components/expiry-item-card';
import { useGetExpiryItems } from '@/hooks/tanstack/mutation/expiry-monitor/get-expiry';

const EmployeeScanExpiry = () => {
    const { empId } = useLocalSearchParams<{ empId: string }>();
    const { onOpen } = useModalAction()
    const todaysExpiryScannedItems = [{
        id: "uniqueId",
        barcode: "6284575668454",
        description: 'item description',
        shelfNo: "A1",
        expireIn: "27.07.2026",
        removeBefore: "60"
    }]

    const { data, isPending } = useGetExpiryItems({ empId })

    return (
        <Container>
            <CardWrapper
                title={`Expiry Scan Form - Emp : ${empId}`}
                description="Scan items to monitor your expiry"
            >
                <ExpiryScanForm />
            </CardWrapper>
            <Separator className='my-2' />
            <View className='flex-1'>
                <FlatList
                    data={data?.data ?? []}
                    keyExtractor={item => String(item.id)}
                    renderItem={({ item }) => {

                        return (
                            <View className='mb-2'>
                                <ExpiryItemCard item={item} />
                            </View>
                        )
                    }}
                />
            </View>
        </Container>
    )
}

export default EmployeeScanExpiry
