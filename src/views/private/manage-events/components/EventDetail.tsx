import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import styles from './EventDetail.module.css';

// Icons
import {
  FiBook,
  FiHome,
  FiUsers,
  FiGlobe,
  FiUser,
  FiInfo,
  FiClock,
  FiMapPin,
  FiImage
} from 'react-icons/fi';
import { MdOutlineFormatListBulleted } from 'react-icons/md';

// Components
import Button from 'src/components/button/Button';

// Interfaces
import type { IEvent } from 'src/interfaces/IEvent';
import type { IVenuePicture } from 'src/interfaces/IVenue';
import EventStatus from 'src/enum/EventStatus';
import EventStatusTraduzido from 'src/enum/EventStatusTraduzido';

// Controllers
import VenuePictureController from 'src/controllers/VenuePictureController';

interface EventDetailProps {
  event: IEvent;
  onClose: () => void;
}

type EventStatusType = typeof EventStatus[keyof typeof EventStatus];

const EventDetail: React.FC<EventDetailProps> = ({ event, onClose }) => {
  const { data: venuePictures } = useQuery<IVenuePicture[]>({
    queryKey: ["venuePictures", event.venue.id],
    queryFn: () => event.venue.id
      ? VenuePictureController.getPicturesByVenue(Number(event.venue.id))
      : Promise.resolve([]),
    enabled: Boolean(event.venue.id) && !isNaN(Number(event.venue.id))
  });

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

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR');
  }

  return (
    <div className={styles.eventDetail}>
      <div className={styles.detailSection}>
        <h5 className={styles.sectionTitle}>
          Informações Gerais
        </h5>

        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiBook className={styles.detailIcon} />
              <span>Nome</span>
            </div>
            <div className={styles.detailValue}>
              {event.name || '-'}
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiHome className={styles.detailIcon} />
              <span>Escola</span>
            </div>
            <div className={styles.detailValue}>
              {event.school?.name || '-'}
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <MdOutlineFormatListBulleted className={styles.detailIcon} />
              <span>Tipo</span>
            </div>
            <div className={styles.detailValue}>
              {event.eventType?.name || '-'}
            </div>
          </div>

          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiInfo className={styles.detailIcon} />
              <span>Status</span>
            </div>
            <div className={styles.detailValue}>
              <span className={classNames(styles.statusBadge, getStatusClass(event.status))}>
                {EventStatusTraduzido[event.status]}
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
              {event.organizer?.firstName ? `${event.organizer.firstName} ${event.organizer.lastName}` : '-'}
              {event.organizer?.email && (
                <div className={styles.detailSubtext}>{event.organizer.email}</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.detailSection}>
        <h5 className={styles.sectionTitle}>
          Datas
        </h5>
        <div className={styles.detailGrid}>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiClock className={styles.detailIcon} />
              <span>Início</span>
            </div>
            <div className={styles.detailValue}>
              {formatDate(event.startDate)}
            </div>
          </div>
          <div className={styles.detailItem}>
            <div className={styles.detailLabel}>
              <FiClock className={styles.detailIcon} />
              <span>Final</span>
            </div>
            <div className={styles.detailValue}>
              {formatDate(event.endDate)}
            </div>
          </div>
        </div>
      </div>

      {event.venue && (
        <div className={styles.detailSection}>
          <h5 className={styles.sectionTitle}>
            Local
          </h5>
          <div className={styles.detailGrid}>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>
                <FiHome className={styles.detailIcon} />
                <span>Nome</span>
              </div>
              <div className={styles.detailValue}>
                {event.venue.name || '-'}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>
                <FiMapPin className={styles.detailIcon} />
                <span>Endereço</span>
              </div>
              <div className={styles.detailValue}>
                {event.venue.address || '-'}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>
                <FiUsers className={styles.detailIcon} />
                <span>Capacidade</span>
              </div>
              <div className={styles.detailValue}>
                {event.venue.capacity || '-'}
              </div>
            </div>
          </div>
          {venuePictures && venuePictures.length > 0 && (
            <div className={styles.venuePictures}>
              <div className={styles.detailLabel}>
                <FiImage className={styles.detailIcon} />
                Fotos do Local
              </div>
              <div className={styles.venuePicturesGrid}>
                {venuePictures.map(picture => (
                  <div key={picture.id} className={styles.venuePicture}>
                    <img
                      src={picture.pictureUrl}
                      alt={`Local ${event.venue?.name}`}
                      className={styles.venuePictureImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {event.objective && (
        <div className={styles.detailSection}>
          <h5 className={styles.sectionTitle}>
            Objetivo
          </h5>
          <p className={styles.detailText}>{event.objective}</p>
        </div>
      )}

      {event.targetAudience && (
        <div className={styles.detailSection}>
          <h5 className={styles.sectionTitle}>
            Público-Alvo
          </h5>
          <p className={styles.detailText}>{event.targetAudience}</p>
        </div>
      )}

      <div className={styles.detailSection}>
        <h5 className={styles.sectionTitle}>
          Histórico de Atualizações
        </h5>
        <div className={styles.historyItem}>
          <div className={styles.historyDate}>01/01/2023 10:30</div>
          <div className={styles.historyAction}>Evento criado por {event.organizer?.firstName || 'Organizador'}</div>
        </div>
        <div className={styles.historyItem}>
          <div className={styles.historyDate}>05/01/2023 14:15</div>
          <div className={styles.historyAction}>Status alterado para {EventStatusTraduzido[event.status]}</div>
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