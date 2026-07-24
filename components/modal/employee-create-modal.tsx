import Modal from '../shared/modal'
import EmployeeCreateForm from '../form/employee-create-form'
import { useModal, useModalAction } from '@/hooks/redux/use-modal'
import { MODAL_TYPE } from '@/constants'

const EmployeeCreateModal = () => {
    const { isOpen, type } = useModal()
    const { onClose } = useModalAction()
    const open = isOpen && type === MODAL_TYPE.EMPLOYEE.CREATE
    return (
        <Modal
            open={open}
            onOpenChange={onClose}
            title="Create Employee"
            description="Fill the following fields"
            isWithoutHeader={false}
        >
            <EmployeeCreateForm />
        </Modal>
    )
}

export default EmployeeCreateModal