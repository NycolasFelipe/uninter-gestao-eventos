import { useMutation, useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import styles from './ManageSubscriptionsView.module.css';

// Components
import Header from 'src/components/header/Header';
import Button from 'src/components/button/Button';

// Lib
import formatDate from 'src/lib/formatDate';
import getStatusClass from 'src/lib/getStatusClass';

// Controllers
import SubscriptionController from 'src/controllers/SubscriptionController';

// Interfaces
import type { ISubscription } from 'src/interfaces/ISubscription';
import type { EventStatus } from 'src/enum/EventStatus';
import EventStatusTraduzido from 'src/enum/EventStatusTraduzido';

const ManageSubscriptionsView = () => {
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

  // Mutação para cancelar inscrição
  const mutationUnsubscribe = useMutation({
    mutationFn: async (eventId: number) => {
      await SubscriptionController.cancelSubscription(eventId);
    },
    onSuccess: () => {
      refetchSubscriptions();
    },
  });

  if (isLoadingSubscriptions) {
    return (
      <div className={styles.container}>
        <Header
          title='Gerenciamento de Inscrições'
          description='Visualizar inscrições dos eventos'
        />
        <div className={styles.loadingContainer}>
          Carregando inscrições
        </div>
      </div>
    );
  }

  if (isErrorSubscriptions) {
    return (
      <div className={styles.container}>
        <Header
          title='Gerenciamento de Inscrições'
          description='Visualizar inscrições dos eventos'
        />
        <p>Ocorreu um erro ao carregar suas inscrições. Por favor, tente novamente.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header
        title='Gerenciamento de Inscrições'
        description='Visualizar inscrições dos eventos'
      />

      <div className={styles.content}>
        {subscriptions && subscriptions.length > 0 ? (
          <div className={styles.subscriptionsList}>
            {subscriptions.map((subscription) => {
              const subscriptionIndex = (subscriptions || [])?.findIndex(sub => subscription.id === sub.id);
              const subscriptionDate = new Date(subscriptions?.[subscriptionIndex]?.createdAt || "").toLocaleDateString("pt-BR");
              return (
                <div key={subscription.id} className={styles.subscriptionCard}>
                  <div className={styles.eventInfo}>
                    <h3>{subscription.event.name}</h3>
                    <p className={styles.eventObjective}>{subscription.event.objective}</p>
                    <div className={styles.eventDetails}>
                      <div className={styles.detailItem}>
                        <strong>Data: </strong>{formatDate(subscription.event.startDate)} - {formatDate(subscription.event.endDate)}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Local: </strong>{subscription.event.venue.name} - {subscription.event.school.name}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Data de inscrição: </strong> Inscreveu-se em {subscriptionDate}
                      </div>
                      <div className={styles.detailItem}>
                        <strong>Status: </strong>
                        <span className={classNames(styles.statusBadge, getStatusClass(subscription.event.status as EventStatus, styles))}>
                          {EventStatusTraduzido[subscription.event.status as EventStatus]}
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className={styles.actions}>
                    <Link
                      to={`/event/${subscription.event.id}`}
                      className={styles.viewButton}
                    >
                      Ver detalhes do evento
                    </Link>
                    <Button
                      variant="secondary"
                      onClick={() => mutationUnsubscribe.mutate(subscription.event.id)}
                      disabled={mutationUnsubscribe.isPending}
                      className={styles.unsubscribeButton}
                    >
                      {mutationUnsubscribe.isPending ? 'Processando...' : 'Cancelar inscrição'}
                    </Button>
                  </div>
                </div>
              )
            }
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Você não está inscrito em nenhum evento no momento.</p>
            <Link to="/home" className={styles.browseEvents}>
              Explorar eventos disponíveis
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageSubscriptionsView;