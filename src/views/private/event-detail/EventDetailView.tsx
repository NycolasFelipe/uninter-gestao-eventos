import { useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import classNames from 'classnames';
import styles from './EventDetailView.module.css';

// Components
import Header from 'src/components/header/Header';
import Markdown from 'react-markdown';

// Controllers
import EventController from 'src/controllers/EventController';
import SubscriptionController from 'src/controllers/SubscriptionController';

// Interfaces
import type { IEvent } from 'src/interfaces/IEvent';
import type { ISubscription } from 'src/interfaces/ISubscription';

// Icons
import { TbCancel, TbTargetArrow } from 'react-icons/tb';
import { IoMdPeople } from 'react-icons/io';
import { TbCalendar, TbCalendarCheck } from 'react-icons/tb';
import { FaCheck, FaGlobe } from 'react-icons/fa';
import { MdEventAvailable } from 'react-icons/md';

// Enums
import EventStatus from 'src/enum/EventStatus';
import EventStatusTraduzido from 'src/enum/EventStatusTraduzido';

// Lib
import formatDate from 'src/lib/formatDate';

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

  // Buscar inscrições
  const {
    data: subscriptions,
    isLoading: isLoadingSubscriptions,
    isError: isErrorSubscriptions,
    refetch: refetchSubscriptions,
  } = useQuery<ISubscription[]>({
    queryKey: ["subscriptions"],
    queryFn: () => SubscriptionController.getSubscriptions()
  });

  const mutationSubscribe = useMutation({
    mutationFn: async (eventId: number) => {
      await SubscriptionController.createSubscription({ eventId: eventId });
    },
    onSuccess: () => {
      refetchSubscriptions();
    },
  });

  const mutationUnsubscribe = useMutation({
    mutationFn: async (eventId: number) => {
      await SubscriptionController.cancelSubscription(eventId);
    },
    onSuccess: () => {
      refetchSubscriptions();
    },
  });

  const [isHovered, setIsHovered] = useState(false);
  const [subscribeText] = useState({ default: "Inscrito", hover: "Cancelar" });
  const subscriptionIndex = (subscriptions || [])?.findIndex(sub => sub.event?.id === event?.id);
  const isSubscribed = subscriptionIndex > -1;
  const subscriptionDate = new Date(subscriptions?.[subscriptionIndex]?.createdAt || "").toLocaleDateString("pt-BR");
  const isEventAvailableForSubscription = ([EventStatus.Published, EventStatus.Ongoing] as string[])
    .includes(event?.status as string) && !event?.isPublic;

  const isLoading = isLoadingEvents || isLoadingSubscriptions;
  const isError = !event || isErrorEvents || isErrorSubscriptions;

  if (isLoading) {
    return <div className={styles.container}>Carregando...</div>;
  }

  if (isError) {
    return <div className={styles.container}>Erro ao carregar o evento.</div>;
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
        extra={
          <>
            <span className={classNames(styles.statusBadge, styles[event.status])}>
              {EventStatusTraduzido[event.status]}
            </span>
            <div className={styles.spaceBadge} />
          </>
        }
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

        <section className={styles.subscriptionSection}>
          <h2 className={styles.sectionTitle}>Inscrição</h2>
          <div className={styles.content}>
            {event?.isPublic ? (
              <div className={styles.eventPublic}>
                <FaGlobe className={styles.icon} /> Não requer inscrição
              </div>
            ) : !isEventAvailableForSubscription ? (
              <div className={styles.eventClosed}>
                <TbCancel className={styles.icon} /> Inscrições não estão mais disponíveis
              </div>
            ) : (
              <div className={styles.button}>
                {isSubscribed ? (
                  <button
                    className={styles.subscribed}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={() => mutationUnsubscribe.mutate(event.id)}
                  >
                    {isHovered ? subscribeText.hover : subscribeText.default}
                    {isHovered ? <TbCancel size={18} className={styles.icon} /> : <FaCheck size={14} className={styles.icon} />}
                  </button>
                ) : (
                  <button
                    className={styles.subscribe}
                    onClick={() => mutationSubscribe.mutate(event.id)}
                  >
                    Inscrever-se <MdEventAvailable size={20} className={styles.icon} />
                  </button>
                )}
              </div>
            )}
            {isSubscribed && (
              <div className={styles.info}>Inscreveu-se em {subscriptionDate}</div>
            )}
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
    </div >
  );
}

export default EventDetailView;