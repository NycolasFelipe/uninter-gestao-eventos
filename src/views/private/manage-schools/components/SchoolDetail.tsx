import React from 'react';
import styles from './SchoolDetail.module.css';

// Icons
import { FiHome, FiMapPin, FiInfo } from 'react-icons/fi';

// Components
import Button from 'src/components/button/Button';

interface SchoolDetailProps {
  school: any;
  onClose: () => void;
}

const SchoolDetail: React.FC<SchoolDetailProps> = ({ school, onClose }) => {
  return (
    <div className={styles.schoolDetail}>
      <div className={styles.schoolHeader}>
        <h2 className={styles.schoolName}>{school.name}</h2>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <FiInfo className={styles.detailIcon} />
          Informações da Escola
        </h3>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiHome className={styles.detailIcon} />
            <span>Nome</span>
          </div>
          <div className={styles.detailValue}>{school.name}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiMapPin className={styles.detailIcon} />
            <span>Endereço</span>
          </div>
          <div className={styles.detailValue}>
            {school.address || 'Não informado'}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}

export default SchoolDetail;