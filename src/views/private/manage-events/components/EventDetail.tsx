import classNames from 'classnames';
import styles from './EventDetail.module.css';

// Icons
import {
  FiBook,
  FiHome,
  FiTarget,
  FiUsers,
  FiGlobe,
  FiUser,
  FiInfo,
  FiClock
} from 'react-icons/fi';

// Components
import Button from 'src/components/button/Button';

// Interfaces
import type { IEvent } from 'src/interfaces/IEvent';
import EventStatus from 'src/enum/EventStatus';

interface EventDetailProps {
  event: IEvent;
  onClose: () => void;
}

type EventStatusType = typeof EventStatus[keyof typeof EventStatus];

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  const getStatusClass = (status: EventStatusType) => {
    switch (status) {
      case EventStatus.Draft: return styles.statusDraft;
      case EventStatus.Planned: return styles.statusPlanned;
      case EventStatus.Published: return styles.statusPublished;
      case EventStatus.Ongoing: return styles.statusOngoing;
      case EventStatus.Completed: return styles.statusCompleted;
      case EventStatus.Cancelled: return styles.statusCancelled;
      case EventStatus.Archived: return styles.statusArchived;
      default: return '';
    }
  }

  return (
    <div className={styles.eventDetail}>
      <div className={styles.eventHeader}>
        <h2 className={styles.eventName}>{event.name}</h2>
        <p className={styles.eventDescription}>{event.description}</p>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <FiInfo className={styles.sectionIcon} />
          Informações Gerais
        </h3>

        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiHome className={styles.detailIcon} />
              <span>Escola</span>
            </div>
            <div className={styles.detailValue}>
              {event.school?.name || event.schoolId}
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiBook className={styles.detailIcon} />
              <span>Tipo de Evento</span>
            </div>
            <div className={styles.detailValue}>
              {event.eventType?.name || event.eventTypeId}
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiInfo className={styles.detailIcon} />
              <span>Status</span>
            </div>
            <div className={styles.detailValue}>
              <span className={classNames(styles.statusBadge, getStatusClass(event.status))}>
                {event.status}
              </span>
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiGlobe className={styles.detailIcon} />
              <span>Visibilidade</span>
            </div>
            <div className={styles.detailValue}>
              {event.isPublic ? 'Público' : 'Privado'}
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiUser className={styles.detailIcon} />
              <span>Organizador</span>
            </div>
            <div className={styles.detailValue}>
              {event.organizer?.firstName} {event.organizer?.lastName}
            </div>
          </div>
        </div>
      </div>

      {event.objective && (
        <div className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>
            <FiTarget className={styles.sectionIcon} />
            Objetivo
          </h3>
          <p className={styles.detailText}>{event.objective}</p>
        </div>
      )}

      {event.targetAudience && (
        <div className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>
            <FiUsers className={styles.sectionIcon} />
            Público-Alvo
          </h3>
          <p className={styles.detailText}>{event.targetAudience}</p>
        </div>
      )}

      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>
          <FiClock className={styles.sectionIcon} />
          Histórico de Atualizações
        </h3>
        <div className={styles.historyItem}>
          <div className={styles.historyDate}>01/01/2023 10:30</div>
          <div className={styles.historyAction}>Evento criado por João Silva</div>
        </div>
        <div className={styles.historyItem}>
          <div className={styles.historyDate}>05/01/2023 14:15</div>
          <div className={styles.historyAction}>Status alterado para Planejado</div>
        </div>
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default EventDetail;