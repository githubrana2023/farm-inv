import { FlatList, View, } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import CardWrapper from '@/components/shared/card-wrapper';
import EmployeeUpdateForm from '@/components/form/employee-update-form';
import Container from '@/components/shared/container';
import ChangePasswordModal from '@/components/modal/change-password-modal';
import { useModalAction } from '@/hooks/redux/use-modal';
import { ALERT_MODAL_TYPE, MODAL_TYPE } from '@/constants';
import { ExpiryScanForm } from '@/components/form/expiry-scan-form';
import { Separator } from '@/components/ui/separator';
import { ExpiryItemCard } from '@/components/expiry-item-card';
import { useGetExpiryItems } from '@/hooks/tanstack/mutation/expiry-monitor/get-expiry';
import AlertModal from '@/components/shared/alert-modal';
import { useAlertModal, useAlertModalAction } from '@/hooks/redux/use-alert-modal';
import { showError } from '@/lib/toast/error';
import { useExpiryItemDeleteMutation } from '@/hooks/tanstack/mutation/expiry-monitor/delete';
import { showDynamicToast } from '@/lib/toast/dynamic';
import { queryClient } from '@/components/provider/tanstack-query-client';
import { MUTATION_KEY } from '@/constants/tanstack-query';

const EmployeeScanExpiry = () => {
    const { empId } = useLocalSearchParams<{ empId: string }>();
    const [itemIndex, setItemIndex] = useState<number | null>(null)
    const { alertType, isAlertOpen } = useAlertModal()
    const { onAlertClose, onAlertOpen } = useAlertModalAction()
    const isAlertModalOpen = alertType === ALERT_MODAL_TYPE.EXPIRY_MONITOR.UPDATE && isAlertOpen

    const todaysExpiryScannedItems = [{
        id: "uniqueId",
        barcode: "6284575668454",
        description: 'item description',
        shelfNo: "A1",
        expireIn: "27.07.2026",
        removeBefore: "60"
    }]

    const { data, isPending } = useGetExpiryItems({ empId })
    const { mutate: deleteExpiryItemByIdAndEmpId } = useExpiryItemDeleteMutation()


    const onConfirm = () => {
        console.log({
            // item: data?.data,
            itemIndex,
            isTrue: !data?.data || itemIndex === null
        })
        if (!data?.data || itemIndex === null) return showError('Item is miss')
        const item = data.data[itemIndex]
        deleteExpiryItemByIdAndEmpId({
            id: item.id,
            empId: empId
        },
            {
                onSuccess({ data, success, message }) {
                    showDynamicToast(success, message)
                    if (success) {
                        setItemIndex(null)
                        onAlertClose()
                        queryClient.invalidateQueries({
                            queryKey: [MUTATION_KEY.EXPIRY_MONITOR.READ]
                        })
                    }
                },
            }
        )
    }


    return (
        <Container>

            <AlertModal
                isOpen={isAlertModalOpen}
                onCancel={() => {
                    onAlertClose()
                    setItemIndex(null)
                }}
                onConfirm={onConfirm}
                title='Expiry Item Delete Confirmation!'
                description={`${(data?.data && itemIndex !== null) && data.data[itemIndex].description}`}
            />

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
                    renderItem={({ item, index }) => {

                        return (
                            <View className='mb-2'>
                                <ExpiryItemCard item={item} index={index}
                                    onPress={() => {
                                        setItemIndex(index)
                                        onAlertOpen(ALERT_MODAL_TYPE.EXPIRY_MONITOR.UPDATE)
                                    }} />
                            </View>
                        )
                    }}
                />
            </View>
        </Container>
    )
}

export default EmployeeScanExpiry
