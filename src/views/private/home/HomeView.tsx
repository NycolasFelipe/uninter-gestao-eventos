import React, { useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import styles from './HomeView.module.css';

// Lib
import classNames from 'classnames';

// Icons
import { FiHome } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { BiSolidSchool } from 'react-icons/bi';
import { RiRocket2Line } from 'react-icons/ri';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { FaRegCalendarPlus, FaRegCalendarAlt } from 'react-icons/fa';

// Context
import AuthContext from 'src/contexts/AuthContext';

// Components
import Header from './components/Header';
import Markdown from 'react-markdown';

// Controller
import EventController from 'src/controllers/EventController';

import type { IEvent } from 'src/interfaces/IEvent';
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

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  }

  return (
    <div className={styles.homeContainer}>
      <Header
        user={user}
        onLogout={logout}
      />

      <section className={styles.section}>
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
            {events.map((event) => (
              <div
                key={event.id}
                className={styles.card}
                onClick={() => navigate(`/event/${event.id}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.cardHeader}>
                  <h3>{event.name} <span className={styles.eventTypeBadge}>{event.eventType.name}</span></h3>
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
                <p className={styles.cardDescription}>
                  <div className="markdown">
                    <Markdown>
                      {event.description || 'Sem descrição disponível'}
                    </Markdown>
                  </div>
                </p>
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
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>
            Sem eventos futuros.
          </p>
        )}
        <div className={styles.seeAllLink}>
          <Link to="/events" className={styles.link}>
            Ver todos os eventos &rarr;
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}><RiRocket2Line /> Ações</h2>
        <div className={styles.quickActionsGrid}>
          <button onClick={() => navigate("/manage/events")} className={classNames("button-primary", styles.quickActionButton)}>
            <FaRegCalendarPlus className={styles.icon} size={20} /> Planejar Novo Evento
          </button>
          <button onClick={() => navigate("/manage/users")} className={classNames("button-secondary", styles.quickActionButton)}>
            <CgProfile className={styles.icon} size={20} /> Gerenciar Usuários
          </button>
          <button onClick={() => navigate("/manage/schools")} className={classNames("button-secondary", styles.quickActionButton)}>
            <BiSolidSchool className={styles.icon} size={20} /> Gerenciar Escolas
          </button>
          <button onClick={() => navigate("/manage/venues")} className={classNames("button-secondary", styles.quickActionButton)}>
            <FiHome className={styles.icon} size={20} /> Gerenciar Locais
          </button>
          <button onClick={() => navigate("/manage/venues")} className={classNames("button-secondary", styles.quickActionButton)}>
            <MdOutlineManageAccounts className={styles.icon} size={20} /> Gerenciar Permissões
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomeView;