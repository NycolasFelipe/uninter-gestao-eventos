import styles from "./ConfirmationModal.module.css";

// Components
import Button from "src/components/button/Button";
import Modal from "../base/Modal";

// Icons
import { FiTrash2 } from 'react-icons/fi';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isProcessing?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isProcessing = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
      icon={<FiTrash2 />}
    >
      <div className={styles.modalContent}>
        <p>{message}</p>
        <div className={styles.modalActions}>
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isProcessing}>
            {cancelText}
          </Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            disabled={isProcessing}>
            {isProcessing ? 'Processando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;