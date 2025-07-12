import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import styles from './EventForm.module.css';

// Icons
import { FiX, FiBook, FiHome } from 'react-icons/fi';

// Components
import Alert from 'src/components/alert/Alert';
import Button from 'src/components/button/Button';

// Controllers
import EventController from 'src/controllers/EventController';
import EventTypeController from 'src/controllers/EventTypeController';
import SchoolController from 'src/controllers/SchoolController';

// Interfaces
import type { ISchool } from 'src/interfaces/ISchool';
import type { IEventType } from 'src/interfaces/IEventType';
import type { IEvent, IEventCreate } from 'src/interfaces/IEvent';

// Enums
import EventStatus from 'src/enum/EventStatus';
import EventStatusTraduzido from 'src/enum/EventStatusTraduzido';

interface EventFormProps {
  event?: IEvent;
  onSuccess: () => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<IEventCreate>({
    schoolId: 0,
    eventTypeId: 0,
    name: '',
    description: '',
    objective: '',
    targetAudience: '',
    status: EventStatus.Draft,
    isPublic: true
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar escolas e tipos de eventos
  const { data: schools } = useQuery<ISchool[]>({
    queryKey: ["schools"],
    queryFn: () => SchoolController.getSchools()
  });

  const { data: eventTypes } = useQuery<IEventType[]>({
    queryKey: ["eventTypes"],
    queryFn: () => EventTypeController.getEventTypes()
  });

  useEffect(() => {
    if (event) {
      setFormData({
        schoolId: event.schoolId,
        eventTypeId: event.eventTypeId,
        name: event.name,
        description: event.description || '',
        objective: event.objective || '',
        targetAudience: event.targetAudience || '',
        status: event.status,
        isPublic: event.isPublic
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (event) {
        await EventController.updateEvent(formData, event.id);
      } else {
        await EventController.createEvent(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.toString() || 'Erro ao salvar evento');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.eventForm}>
      {error && <Alert variant="error" className={styles.alert}>{error}</Alert>}

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="name">
            <FiBook className={styles.inputIcon} />
            Nome do Evento *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Digite o nome do evento"
          />
        </div>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="schoolId">
            <FiHome className={styles.inputIcon} />
            Escola *
          </label>
          <select
            id="schoolId"
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma escola</option>
            {schools?.map(school => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="eventTypeId">
            <FiBook className={styles.inputIcon} />
            Tipo de Evento *
          </label>
          <select
            id="eventTypeId"
            name="eventTypeId"
            value={formData.eventTypeId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione um tipo</option>
            {eventTypes?.map(eventType => (
              <option key={eventType.id} value={eventType.id}>
                {eventType.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o evento"
          rows={3}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="objective">
          Objetivo
        </label>
        <textarea
          id="objective"
          name="objective"
          value={formData.objective}
          onChange={handleChange}
          placeholder="Qual o objetivo do evento?"
          rows={2}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="targetAudience">
          Público-Alvo
        </label>
        <input
          type="text"
          id="targetAudience"
          name="targetAudience"
          value={formData.targetAudience}
          onChange={handleChange}
          placeholder="Quem é o público-alvo?"
        />
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="status">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {Object.values(EventStatus).map(status => (
              <option key={status} value={status}>
                {EventStatusTraduzido[status]}
              </option>
            ))}
          </select>
        </div>

        <div className={classNames(styles.formGroup, styles.checkboxGroup)}>
          <div className={styles.checkboxContainer}>
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={formData.isPublic}
              onChange={handleChange}
            />
            <label htmlFor="isPublic" className={styles.checkboxLabel}>
              Evento Público
            </label>
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          icon={<FiX />}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : event ? 'Atualizar Evento' : 'Criar Evento'}
        </Button>
      </div>
    </form>
  );
}

export default EventForm;