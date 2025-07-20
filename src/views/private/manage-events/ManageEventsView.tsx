import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import styles from './ManageEventsView.module.css';

// Components
import Button from 'src/components/button/Button';
import Alert from 'src/components/alert/Alert';
import Modal from 'src/components/modal/base/Modal';
import EventForm from './components/EventForm';
import EventDetail from './components/EventDetail';
import EventTypeForm from './components/EventTypeForm';
import ConfirmationModal from 'src/components/modal/confirmation/ConfirmationModal';

// Icons
import { FiEdit, FiTrash2, FiPlus, FiCalendar, FiList, FiSearch, FiInfo } from 'react-icons/fi';
import { TbRefresh } from 'react-icons/tb';

// Controllers
import EventController from 'src/controllers/EventController';
import EventTypeController from 'src/controllers/EventTypeController';

// Interfaces
import type { IEvent } from 'src/interfaces/IEvent';
import type { IEventType } from 'src/interfaces/IEventType';
import EventStatusTraduzido from 'src/enum/EventStatusTraduzido';

const ManageEventsView = () => {
  const [activeTab, setActiveTab] = useState<'events' | 'eventTypes'>('events');

  // Event
  const [selectedEvent, setSelectedEvent] = useState<IEvent>();
  const [isCreateEventModalOpen, setIsCreateEventModalOpen] = useState(false);
  const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);
  const [isDeleteEventModalOpen, setIsDeleteEventModalOpen] = useState(false);

  // Event type
  const [selectedEventType, setSelectedEventType] = useState<IEventType>();
  const [isCreateEventTypeModalOpen, setIsCreateEventTypeModalOpen] = useState(false);
  const [isEditEventTypeModalOpen, setIsEditEventTypeModalOpen] = useState(false);
  const [isDeleteEventTypeModalOpen, setIsDeleteEventTypeModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [itemToDelete, setItemToDelete] = useState<{ id: number, type: 'event' | 'eventType' } | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const queryClient = useQueryClient();

  // Buscar eventos
  const { data: events, isLoading: isLoadingEvents, isError: isErrorEvents, refetch: refetchEvents } = useQuery<IEvent[]>({
    queryKey: ["events"],
    queryFn: () => EventController.getEvents()
  });

  // Buscar tipos de eventos
  const { data: eventTypes, isLoading: isLoadingEventTypes, isError: isErrorEventTypes, refetch: refetchEventTypes } = useQuery<IEventType[]>({
    queryKey: ["eventTypes"],
    queryFn: () => EventTypeController.getEventTypes()
  });

  // Mutation para deletar evento
  const deleteEventMutation = useMutation({
    mutationFn: (id: number) => EventController.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }
  });

  // Mutation para deletar tipo de evento
  const deleteEventTypeMutation = useMutation({
    mutationFn: (id: number) => EventTypeController.deleteEventType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventTypes'] });
    }
  });

  // Filtrar eventos
  const filteredEvents = events?.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar tipos de eventos
  const filteredEventTypes = eventTypes?.filter(eventType =>
    eventType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    eventType.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handlers para eventos
  const handleEditEvent = (event: IEvent) => {
    setSelectedEvent(event);
    setIsEditEventModalOpen(true);
  }

  const handleDeleteEvent = (id: number) => {
    setItemToDelete({ id, type: 'event' });
    setIsDeleteEventModalOpen(true);
  }

  // Handlers para tipos de eventos
  const handleEditEventType = (eventType: IEventType) => {
    setSelectedEventType(eventType);
    setIsEditEventTypeModalOpen(true);
  }

  const handleDeleteEventType = (id: number) => {
    setItemToDelete({ id, type: 'eventType' });
    setIsDeleteEventTypeModalOpen(true);
  }

  const handleViewDetails = (event: IEvent) => {
    setSelectedEvent(event);
    setIsDetailModalOpen(true);
  }

  const confirmDelete = async () => {
    if (itemToDelete) {
      try {
        if (itemToDelete.type === 'event') {
          await deleteEventMutation.mutateAsync(itemToDelete.id);
          setIsDeleteEventModalOpen(false);
        } else {
          await deleteEventTypeMutation.mutateAsync(itemToDelete.id);
          setIsDeleteEventTypeModalOpen(false);
        }
        setItemToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir:', error);
      }
    }
  }

  console.log(events);


  return (
    <div className={styles.manageEventsContainer}>
      <header className={styles.pageHeader}>
        <h1>Gerenciamento de Eventos</h1>
        <p>Gerencie eventos e tipos de eventos</p>
        <div className={styles.headerAccent}></div>
      </header>

      <div className={styles.tabs}>
        <button
          className={classNames(styles.tab, activeTab === 'events' && styles.active)}
          onClick={() => setActiveTab('events')}
        >
          <FiCalendar className={styles.tabIcon} /> Eventos
        </button>
        <button
          className={classNames(styles.tab, activeTab === 'eventTypes' && styles.active)}
          onClick={() => setActiveTab('eventTypes')}
        >
          <FiList className={styles.tabIcon} /> Tipos de Eventos
        </button>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'events' ? 'eventos' : 'tipos de eventos'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Button
            variant="secondary"
            onClick={activeTab === 'events' ? refetchEvents : refetchEventTypes}
            icon={<TbRefresh />}
            className={styles.updateButton}
          >
            Atualizar
          </Button>
        </div>

        {activeTab === 'events' ? (
          <Button
            variant="primary"
            onClick={() => setIsCreateEventModalOpen(true)}
            icon={<FiPlus />}
            className={styles.createButton}
          >
            Novo Evento
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => setIsCreateEventTypeModalOpen(true)}
            icon={<FiPlus />}
            className={styles.createButton}
          >
            Novo Tipo de Evento
          </Button>
        )}
      </div>

      {activeTab === 'events' ? (
        <>
          {isErrorEvents && (
            <Alert variant="error" className={styles.alert}>
              Ocorreu um erro ao carregar os eventos. Tente novamente.
            </Alert>
          )}

          {isLoadingEvents ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Carregando eventos...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.eventsTable}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Escola</th>
                    <th>Dia de início</th>
                    <th>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEvents && filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <tr key={event.id}>
                        <td>{event.name}</td>
                        <td>{event.eventType.name}</td>
                        <td>{event.school.name}</td>
                        <td>{new Date(event.startDate).toLocaleDateString()}</td>
                        <td>
                          <span className={classNames(
                            styles.statusBadge,
                            styles[event.status]
                          )}>
                            {EventStatusTraduzido[event.status]}
                          </span>
                        </td>
                        <td>
                          <div className={styles.actions}>
                            <Button
                              variant="icon"
                              onClick={() => handleViewDetails(event)}
                              title="Ver detalhes"
                            >
                              <FiInfo />
                            </Button>
                            <Button
                              variant="icon"
                              onClick={() => handleEditEvent(event)}
                              title="Editar evento"
                            >
                              <FiEdit />
                            </Button>
                            <Button
                              variant="icon"
                              onClick={() => handleDeleteEvent(event.id)}
                              title="Excluir evento"
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className={styles.emptyState}>
                        Nenhum evento encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {isErrorEventTypes && (
            <Alert variant="error" className={styles.alert}>
              Ocorreu um erro ao carregar os tipos de eventos. Tente novamente.
            </Alert>
          )}

          {isLoadingEventTypes ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner}></div>
              <p>Carregando tipos de eventos...</p>
            </div>
          ) : (
            <div className={styles.tableContainer}>
              <table className={styles.eventTypesTable}>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEventTypes && filteredEventTypes.length > 0 ? (
                    filteredEventTypes.map((eventType) => (
                      <tr key={eventType.id}>
                        <td>{eventType.name}</td>
                        <td>{eventType.description || '—'}</td>
                        <td>
                          <div className={styles.actions}>
                            <Button
                              variant="icon"
                              onClick={() => handleEditEventType(eventType)}
                              title="Editar tipo de evento"
                            >
                              <FiEdit />
                            </Button>
                            <Button
                              variant="icon"
                              onClick={() => handleDeleteEventType(eventType.id)}
                              title="Excluir tipo de evento"
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className={styles.emptyState}>
                        Nenhum tipo de evento encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modals para Eventos */}
      <Modal
        isOpen={isCreateEventModalOpen}
        onClose={() => setIsCreateEventModalOpen(false)}
        title="Criar Novo Evento"
        icon={<FiCalendar />}
        size="large"
      >
        <EventForm
          onSuccess={() => {
            setIsCreateEventModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['events'] });
          }}
          onCancel={() => setIsCreateEventModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditEventModalOpen}
        onClose={() => setIsEditEventModalOpen(false)}
        title="Editar Evento"
        icon={<FiEdit />}
        size="large"
      >
        {selectedEvent && (
          <EventForm
            event={selectedEvent}
            onSuccess={() => {
              setIsEditEventModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['events'] });
            }}
            onCancel={() => setIsEditEventModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modals para Tipos de Eventos */}
      <Modal
        isOpen={isCreateEventTypeModalOpen}
        onClose={() => setIsCreateEventTypeModalOpen(false)}
        title="Criar Novo Tipo de Evento"
        icon={<FiList />}
        size="medium"
      >
        <EventTypeForm
          onSuccess={() => {
            setIsCreateEventTypeModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['eventTypes'] });
          }}
          onCancel={() => setIsCreateEventTypeModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditEventTypeModalOpen}
        onClose={() => setIsEditEventTypeModalOpen(false)}
        title="Editar Tipo de Evento"
        icon={<FiEdit />}
        size="medium"
      >
        {selectedEventType && (
          <EventTypeForm
            eventType={selectedEventType}
            onSuccess={() => {
              setIsEditEventTypeModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['eventTypes'] });
            }}
            onCancel={() => setIsEditEventTypeModalOpen(false)}
          />
        )}
      </Modal>

      {/* Modals de confirmação de exclusão */}
      <ConfirmationModal
        isOpen={isDeleteEventModalOpen}
        onClose={() => setIsDeleteEventModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isProcessing={deleteEventMutation.isPending}
      />

      <ConfirmationModal
        isOpen={isDeleteEventTypeModalOpen}
        onClose={() => setIsDeleteEventTypeModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este tipo de evento? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isProcessing={deleteEventTypeMutation.isPending}
      />

      {/* Modal para detalhes */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalhes do Evento"
        icon={<FiInfo />}
        size="large"
      >
        {selectedEvent && (
          <EventDetail
            event={selectedEvent}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </Modal>
    </div>
  );
}

export default ManageEventsView;