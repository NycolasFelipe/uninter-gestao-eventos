import React from 'react';
import styles from './VenueDetail.module.css';

// Interfaces
import type { IVenue, IVenuePicture } from 'src/interfaces/IVenue';

// Components
import Button from 'src/components/button/Button';
import VenueGallery from './VenueGallery';

// Icons
import { FiMapPin, FiHome, FiInfo, FiUsers, FiCheckSquare, FiXSquare } from 'react-icons/fi';

interface VenueDetailProps {
  venue: IVenue;
  pictures: IVenuePicture[];
  onClose: () => void;
}

const VenueDetail: React.FC<VenueDetailProps> = ({ venue, pictures, onClose }) => {
  return (
    <div className={styles.venueDetail}>
      <div className={styles.venueHeader}>
        <h2 className={styles.venueName}>{venue.name}</h2>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <FiInfo className={styles.detailIcon} />
          Informações do Local
        </h3>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiHome className={styles.detailIcon} />
            <span>Nome</span>
          </div>
          <div className={styles.detailValue}>{venue.name}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiMapPin className={styles.detailIcon} />
            <span>Endereço</span>
          </div>
          <div className={styles.detailValue}>
            {venue.address || 'Não informado'}
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiUsers className={styles.detailIcon} />
            <span>Capacidade</span>
          </div>
          <div className={styles.detailValue}>
            {venue.capacity || 'Não informado'}
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            {venue.isInternal ? (
              <FiCheckSquare className={styles.detailIcon} />
            ) : (
              <FiXSquare className={styles.detailIcon} />
            )}
            <span>É interno?</span>
          </div>
          <div className={styles.detailValue}>
            {venue.isInternal ? 'Sim' : 'Não'}
          </div>
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <FiInfo className={styles.detailIcon} />
          Galeria de Fotos
        </h3>
        <VenueGallery pictures={pictures} />
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}

export default VenueDetail;