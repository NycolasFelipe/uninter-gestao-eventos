import { useEffect } from 'react';
import styles from './Modal.module.css';

// Lib
import classNames from 'classnames';

// Icons
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  icon,
  size = 'medium'
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={classNames(
          styles.modal,
          styles[`modal-${size}`]
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <div className={styles.modalTitle}>
            {icon && <span className={styles.modalIcon}>{icon}</span>}
            <h2>{title}</h2>
          </div>
          <button
            className={styles.modalClose}
            onClick={onClose}
            aria-label="Fechar modal"
          >
            <FiX />
          </button>
        </div>

        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;