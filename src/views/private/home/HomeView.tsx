import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styles from './HomeView.module.css';

// Lib
import classNames from 'classnames';

// Icons
import { FaRegCalendarAlt, FaRegCalendarPlus } from 'react-icons/fa';
import { GrAnnounce } from 'react-icons/gr';
import { RiRocket2Line } from 'react-icons/ri';
import { HiAnnotation } from 'react-icons/hi';
import { TbReportSearch } from 'react-icons/tb';
import { CgProfile } from 'react-icons/cg';

// Interfaces
import type IEvent from 'src/interfaces/IEvent';
import type Announcement from 'src/interfaces/IAnnouncement';
import AuthContext from 'src/contexts/AuthContext';

const upcomingEvents: IEvent[] = [
  {
    id: 1,
    name: 'Feira de Ciências 2025',
    date: '15/06/2025',
    description: 'Feira de ciências anual da escola, apresentando projetos inovadores dos alunos.'
  },
  {
    id: 2,
    name: 'Exposição de Arte: "Cores da Primavera"',
    date: '02/2025/07',
    description: 'Uma exposição vibrante de obras de arte de alunos de todas as séries.'
  },
  {
    id: 3,
    name: 'Dia Anual do Esporte',
    date: '20/07/2025',
    description: 'Eventos emocionantes de atletismo, esportes em equipe e diversão para todos.'
  },
  {
    id: 4,
    name: 'Noite de Gala Musical',
    date: '05/08/2025',
    description: 'Uma noite de maravilhosas apresentações musicais pelos nossos talentosos alunos.'
  },
];

const recentAnnouncements: Announcement[] = [
  {
    id: 1,
    title: 'Bem-vindo à Plataforma Transforma Educação!',
    message: 'Estamos animados com o lançamento da nossa nova plataforma integrada para gerenciar eventos escolares. Explore e participe!',
    date: '20/05/2025'
  },
  {
    id: 2,
    title: 'Chamada para Voluntários: Feira de Ciências',
    message: 'Precisamos de voluntários entre pais e professores para ajudar a tornar a Feira de Ciências um sucesso. Inscreva/se até 30 de maio.',
    date: '22/05/2025'
  },
  {
    id: 3,
    title: 'Calendário Escolar Atualizado',
    message: 'O calendário escolar do próximo trimestre foi atualizado. Verifique a seção de eventos.',
    date: '24/05/2025'
  },
];

interface HomeViewProps {
  userName?: string;
}

const HomeView: React.FC<HomeViewProps> = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className={styles.homeContainer}>
      <header className={styles.pageHeader}>
        <h1>Bem-vindo(a) de volta, {user.name}!</h1>
        <p>Seu hub central para eventos escolares, comunicados e contato com a comunidade.</p>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}><FaRegCalendarAlt /> Próximos Eventos</h2>
        {upcomingEvents.length > 0 ? (
          <div className={styles.cardGrid}>
            {upcomingEvents.map(event => (
              <div key={event.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <h3>{event.name}</h3>
                  <p className={styles.cardDate}>{event.date}</p>
                </div>
                <p className={styles.cardDescription}>{event.description}</p>
                <button className={classNames("button-primary", styles.cardButton)}>Ver Detalhes</button>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyState}>Sem eventos futuros. Hora de planejar algo!</p>
        )}
        <div className={styles.seeAllLink}>
          <Link to="/events" className={styles.link}>Ver todos os eventos &rarr;</Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}><GrAnnounce /> Anúncios Recentes</h2>
        {recentAnnouncements.length > 0 ? (
          <ul className={styles.announcementList}>
            {recentAnnouncements.map(announcement => (
              <li key={announcement.id} className={styles.announcementItem}>
                <h3>{announcement.title}</h3>
                <p>{announcement.message}</p>
                <small>Postado em: {announcement.date}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.emptyState}>No recent announcements at the moment.</p>
        )}
        <div className={styles.seeAllLink}>
          <Link to="/announcements" className={styles.link}>Ver todos os anúncios &rarr;</Link>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}><RiRocket2Line /> Ações Rápidas</h2>
        <div className={styles.quickActionsGrid}>
          <button className={classNames("button-primary", styles.quickActionButton)}>
            <FaRegCalendarPlus size={20} /> Planejar Novo Evento
          </button>
          <button className={classNames("button-secondary", styles.quickActionButton)}>
            <HiAnnotation size={20} /> Criar Anúncio
          </button>
          <button className={classNames("button-secondary", styles.quickActionButton)}>
            <TbReportSearch size={20} /> Ver Relatórios
          </button>
          <button className={classNames("button-secondary", styles.quickActionButton)}>
            <CgProfile size={20} /> Meu Perfil
          </button>
        </div>
      </section>
    </div>
  );
}

export default HomeView;