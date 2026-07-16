import Modal from '../shared/modal'
import { useModal, useModalAction } from '@/hooks/redux/use-modal'
import { MODAL_TYPE } from '@/constants'
import LabelingCreateForm from '../form/labeling-create-form'

const LabelingCreateModal = () => {
    const { isOpen, type } = useModal()
    const { onClose } = useModalAction()
    const open = isOpen && type === MODAL_TYPE.LABELING.CREATE
    return (
        <Modal
            open={open}
            onOpenChange={onClose}
            title="Create Labeling"
            description="Fill the following fields"
            isWithoutHeader={false}
        >
            <LabelingCreateForm />
        </Modal>
    )
}

export default LabelingCreateModal