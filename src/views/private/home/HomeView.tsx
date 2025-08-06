import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './HomeView.module.css';

// Lib
import classNames from 'classnames';
import formatDate from 'src/lib/formatDate';

// Icons
import { BiSolidSchool } from 'react-icons/bi';
import { RiRocket2Line } from 'react-icons/ri';
import { FaRegCalendarAlt } from 'react-icons/fa';

// Context
import AuthContext from 'src/contexts/AuthContext';

// Components
import Header from './components/Header';
import Markdown from 'react-markdown';

// Controller
import EventController from 'src/controllers/EventController';
import SubscriptionController from 'src/controllers/SubscriptionController';

// Config
import ACTIONS from './config/actions';

// Interfaces
import type { IEvent } from 'src/interfaces/IEvent';
import type { ISubscription } from 'src/interfaces/ISubscription';
import EventStatus from 'src/enum/EventStatus';
import EventStatusTraduzido from 'src/enum/EventStatusTraduzido';

interface HomeViewProps {
  userName?: string;
}

const HomeView: React.FC<HomeViewProps> = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Buscar eventos
  const { data: events, isLoading: isLoadingEvents, isError: isErrorEvents } = useQuery<IEvent[]>({
    queryKey: ["events"],
    queryFn: () => EventController.getEventsByStatus({ limit: 10 })
  });

  // Buscar inscrições
  const { data: subscriptions } = useQuery<ISubscription[]>({
    queryKey: ["subscriptions"],
    queryFn: () => SubscriptionController.getSubscriptions()
  });

  return (
    <div className={styles.homeContainer}>
      <Header
        user={user}
        onLogout={logout}
      />

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}><RiRocket2Line /> Ações</h2>
        <div className={styles.quickActionsGrid}>
          <div className={styles.quickActionsGrid}>
            {ACTIONS.map((action) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={action.path}
                  onClick={() => navigate(action.path)}
                  className={classNames(
                    `button-${action.variant}`,
                    styles.quickActionButton
                  )}>
                  <IconComponent className={styles.icon} size={20} /> {action.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className={classNames(styles.section, "mt-5")}>
        <h2 className={styles.sectionTitle}>
          <FaRegCalendarAlt /> Próximos Eventos
        </h2>
        {isLoadingEvents ? (
          <div className={styles.cardGrid}>
            {[...Array(3)].map((_, index) => (
              <div key={index} className={styles.card}>
                <div className={styles.skeletonLoader} style={{ height: '24px', width: '60%' }} />
                <div className={styles.skeletonLoader} style={{ height: '16px', width: '80%' }} />
                <div className={styles.skeletonLoader} style={{ height: '16px', width: '70%' }} />
                <div className={styles.skeletonLoader} style={{ height: '60px', width: '100%' }} />
              </div>
            ))}
          </div>
        ) : isErrorEvents ? (
          <p className={styles.errorState}>Erro ao carregar eventos. Tente novamente mais tarde.</p>
        ) : events && events.length > 0 ? (
          <div className={styles.cardGrid}>
            {events.map((event) => {
              const hasSubscription = (subscriptions || []).some(sub => sub.event?.id === event?.id);
              const isEventAvailableForSubscription =
                ([EventStatus.Published, EventStatus.Ongoing] as string[]).includes(event.status) &&
                !event.isPublic;

              return (
                <div
                  key={event.id}
                  className={styles.card}
                  onClick={() => navigate(`/event/${event.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className={styles.cardHeader}>
                    <h3>
                      {event.name}
                      <span className={classNames(
                        styles.statusBadge,
                        styles[event.status]
                      )}>
                        {event.status === EventStatus.Published && EventStatusTraduzido[EventStatus.Published]}
                        {event.status === EventStatus.Ongoing && EventStatusTraduzido[EventStatus.Ongoing]}
                        {event.status === EventStatus.Completed && EventStatusTraduzido[EventStatus.Completed]}
                        {event.status === EventStatus.Cancelled && EventStatusTraduzido[EventStatus.Cancelled]}
                        {event.status === EventStatus.Draft && EventStatusTraduzido[EventStatus.Draft]}
                        {event.status === EventStatus.Planned && EventStatusTraduzido[EventStatus.Planned]}
                        {event.status === EventStatus.Archived && EventStatusTraduzido[EventStatus.Archived]}
                      </span>
                    </h3>
                    <p className={styles.cardDate}>
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </p>
                  </div>
                  <div className={styles.eventDetails}>
                    <p title='Organizador do evento'>
                      <BiSolidSchool className={styles.icon} size={20} /> {event.school.name}
                      <span className={styles.descricao}>escola</span>
                    </p>
                    <p title='Escola'>
                      <img
                        className={classNames(styles.icon, styles.organizerPicture)}
                        src={event.organizer.profilePictureUrl}
                        alt={`Foto de perfil de ${event.organizer.firstName} ${event.organizer.lastName}`}
                      />
                      {event.organizer.firstName} {event.organizer.lastName}
                      <span className={styles.descricao}>organizador do evento</span>
                    </p>
                  </div>
                  <div className={styles.cardDescription}>
                    <div className="markdown">
                      <Markdown>
                        {event.description || 'Sem descrição disponível'}
                      </Markdown>
                    </div>
                  </div>
                  <button
                    className={classNames('button-primary', styles.cardButton)}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/event/${event.id}`);
                    }}
                    aria-label={`Ver detalhes do evento ${event.name}`}
                  >
                    Ver Detalhes
                  </button>

                  {isEventAvailableForSubscription && (
                    <div className={styles.subscription}>
                      <span className={classNames(
                        styles.subscriptionBadge,
                        hasSubscription ? styles.subscriptionBadgeSubscribed : styles.subscriptionBadgeNotSubscribed)
                      }>
                        {hasSubscription ? "Inscrito" : "Não inscrito"}
                      </span>
                    </div>
                  )}

                </div>
              )
            })}
          </div>
        ) : (
          <p className={styles.emptyState}>
            Sem eventos futuros.
          </p>
        )}
        <div className={styles.seeAllLink}>
          {/* <Link to="/events" className={styles.link}>
            Ver todos os eventos &rarr;
          </Link> */}
        </div>
      </section>

    </div>
  );
}

export default HomeView;