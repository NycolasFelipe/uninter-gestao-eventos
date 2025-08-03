import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import styles from './EventDetailView.module.css';

// Components
import Header from 'src/components/header/Header';
import Markdown from 'react-markdown';

// Controllers
import EventController from 'src/controllers/EventController';

// Interfaces
import type { IEvent } from 'src/interfaces/IEvent';

// Icons
import { TbTargetArrow } from 'react-icons/tb';
import { IoMdPeople } from 'react-icons/io';
import { TbCalendar, TbCalendarCheck } from 'react-icons/tb';

const EventDetailView = () => {
  const { id } = useParams();

  // Buscar eventos
  const {
    data: event,
    isLoading: isLoadingEvents,
    isError: isErrorEvents,
  } = useQuery<IEvent | null>({
    queryKey: ["event", id],
    queryFn: () => EventController.getEventById(Number(id)),
    enabled: !!id
  });

  if (isLoadingEvents) {
    return <div className={styles.container}>Carregando...</div>;
  }

  if (isErrorEvents || !event) {
    return <div className={styles.container}>Erro ao carregar o evento.</div>;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

  const eventTitle = "Evento" + (event?.name && ` | ${event?.name}`);
  const eventLocationInfo = `
    ${event.school.name},
    ${formatDate(event.startDate)},
    ${event.venue.name}
  `;

  return (
    <div className={styles.container}>
      <Header
        title={eventTitle}
        description={eventLocationInfo}
      />

      <main className={styles.mainContent}>

        {/* Seção de detalhes do evento */}
        <section className={styles.detailsSection}>
          <div className={styles.detailCard}>
            <div className={classNames("markdown", styles.eventDescription)}>
              <Markdown>
                {event.description || 'Sem descrição disponível'}
              </Markdown>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}><IoMdPeople size={16} className={styles.icon} /> Público-alvo</span>
                <span className={styles.detailValue}>{event.targetAudience}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}><IoMdPeople size={16} className={styles.icon} /> Participantes</span>
                <span className={styles.detailValue}>{event.venue.capacity} pessoa{event.venue.capacity !== 1 ? 's' : ''}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}><TbCalendar size={16} className={styles.icon} /> Data de início</span>
                <span className={styles.detailValue}>{formatDate(event.startDate)}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}><TbCalendarCheck size={16} className={styles.icon} />Data de término</span>
                <span className={styles.detailValue}>{formatDate(event.endDate)}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}><TbTargetArrow size={16} className={styles.icon} /> Objetivo</span>
                <span className={styles.detailValue}>{event.objective}</span>
              </div>

              <div className={styles.detailItem}>
                <span className={styles.detailLabel}><TbTargetArrow size={16} className={styles.icon} /> Organizador do evento</span>
                <span className={styles.detailValue}>{event.organizer.firstName} {event.organizer.lastName}</span>
                <span className={styles.detailValue}>{event.organizer.email}</span>
                <span className={styles.detailValue}>{event.organizer?.role?.roleName}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de imagens do local */}
        {event.venue.venuePictures && event.venue.venuePictures.length > 0 && (
          <section className={styles.imageSection}>
            <h2 className={styles.sectionTitle}>Imagens </h2>
            <div className={styles.imageGrid}>
              {event.venue.venuePictures.map((pic) => (
                <img
                  key={pic.id}
                  src={pic.pictureUrl}
                  alt={`Visualização do local ${event.venue.name}`}
                  className={styles.venueImage}
                />
              ))}
            </div>
          </section>
        )}

        {/* Seção de localização */}
        <section className={styles.locationSection}>
          <div className={styles.detailCard}>
            <h2 className={styles.sectionTitle}>Localização</h2>

            <div className={styles.venueDetails}>
              <h3 className={styles.venueName}>{event.venue.name}</h3>
              <p className={styles.venueAddress}>{event.school.address}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default EventDetailView;