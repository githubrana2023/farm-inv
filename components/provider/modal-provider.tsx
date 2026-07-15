import { View, Text } from 'react-native'
import EmployeeCreateModal from '@/components/modal/employee-create-modal'
import LabelingCreateModal from '../modal/labeling-create-modal'

const ModalProvider = () => {
  return (
    <>
      <EmployeeCreateModal />
      <LabelingCreateModal />
    </>
  )
}

export default ModalProvider