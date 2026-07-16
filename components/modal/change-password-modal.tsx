import Modal from '../shared/modal'
import { useModal, useModalAction } from '@/hooks/redux/use-modal'
import { MODAL_TYPE } from '@/constants'
import ChangePasswordForm from '../form/change-password-form'

const ChangePasswordModal = ({ employeeId }: { employeeId: string }) => {
    const { isOpen, type } = useModal()
    const { onClose } = useModalAction()
    const open = isOpen && type === MODAL_TYPE.CHANGE_PASSWORD.UPDATE
    return (
        <Modal
            open={open}
            onOpenChange={onClose}
            title="Change Password Form"
            description="Fill the following fields"
            isWithoutHeader={false}
        >
            <ChangePasswordForm employeeId={employeeId} />
        </Modal>
    )
}

export default ChangePasswordModal