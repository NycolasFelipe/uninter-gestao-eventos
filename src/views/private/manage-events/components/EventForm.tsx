import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import styles from './EventForm.module.css';

// Icons
import { IoRainy } from 'react-icons/io5';
import { BiSolidSchool } from 'react-icons/bi';
import { TbCalendar, TbCalendarCheck } from 'react-icons/tb';
import { MdOutlineFormatListBulleted } from 'react-icons/md';
import { FiX, FiBook, FiHome, FiMapPin, FiUsers } from 'react-icons/fi';

// Components
import Alert from 'src/components/alert/Alert';
import Button from 'src/components/button/Button';

// Controllers
import EventController from 'src/controllers/EventController';
import EventTypeController from 'src/controllers/EventTypeController';
import SchoolController from 'src/controllers/SchoolController';
import VenueController from 'src/controllers/VenueController';
import VenuePictureController from 'src/controllers/VenuePictureController';

// Interfaces
import type { ISchool } from 'src/interfaces/ISchool';
import type { IEventType } from 'src/interfaces/IEventType';
import type { IEvent, IEventCreate } from 'src/interfaces/IEvent';
import type { IVenue, IVenuePicture } from 'src/interfaces/IVenue';

// Enums
import EventStatus from 'src/enum/EventStatus';
import EventStatusTraduzido from 'src/enum/EventStatusTraduzido';

// Lib
import getFormattedDate from 'src/lib/getFormattedDate';

interface EventFormProps {
  event?: IEvent;
  onSuccess: () => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<IEventCreate>({
    name: '',
    description: '',
    objective: '',
    targetAudience: '',
    status: EventStatus.Draft,
    isPublic: true,
    schoolId: 0,
    eventTypeId: 0,
    venueId: 0,
    startDate: '',
    endDate: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [venue, setVenue] = useState<IVenue | null>(null);


  // Buscar escolas e tipos de eventos
  const { data: schools } = useQuery<ISchool[]>({
    queryKey: ["schools"],
    queryFn: () => SchoolController.getSchools()
  });

  const { data: eventTypes } = useQuery<IEventType[]>({
    queryKey: ["eventTypes"],
    queryFn: () => EventTypeController.getEventTypes()
  });

  const { data: venues } = useQuery<IVenue[]>({
    queryKey: ["venues", formData.schoolId],
    queryFn: () => VenueController.getVenuesSchool(Number(formData.schoolId)),
    enabled: Boolean(formData.schoolId) && !isNaN(Number(formData.schoolId)),
    initialData: event?.school.id === formData.schoolId ? [event.venue] : undefined
  });

  const { data: venuePictures } = useQuery<IVenuePicture[]>({
    queryKey: ["venuePictures", formData.venueId],
    queryFn: () => formData.venueId ? VenuePictureController.getPicturesByVenue(Number(formData.venueId)) : Promise.resolve([]),
    enabled: Boolean(formData.venueId) && !isNaN(Number(formData.venueId))
  });

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        description: event.description || '',
        objective: event.objective || '',
        targetAudience: event.targetAudience || '',
        status: event.status,
        isPublic: event.isPublic,
        schoolId: event.school.id,
        eventTypeId: event.eventType.id,
        venueId: event.venue.id,
        startDate: event.startDate,
        endDate: event.endDate,
      });
    }
  }, [event]);


  // Sincroniza o venue quando o venueId ou venues mudam
  useEffect(() => {
    if (formData.venueId && venues) {
      const selectedVenue = venues.find(v => v.id === formData.venueId);
      setVenue(selectedVenue || null);
    }
  }, [formData.venueId, venues]);

  // Garante que os venues são carregados quando o formulário é aberto para edição
  useEffect(() => {
    if (event && event.school.id && !venues) {
      VenueController.getVenuesSchool(event.school.id).then(data => {
        const selectedVenue = data.find(v => v.id === event.venue.id);
        setVenue(selectedVenue || null);
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

  function handleStartDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    const endDateInput = document.getElementById('endDate');
    if (endDateInput instanceof HTMLInputElement) {
      endDateInput.min = e.target.value;
    }
    handleChange(e);
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
            onChange={(e) => {
              handleChange(e);
              !e.target.value && setVenue(null);
            }}
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
          <label htmlFor="venueId">
            <FiMapPin className={styles.inputIcon} />
            Local *
          </label>
          {formData.schoolId ? (
            venues && venues.length > 0 ? (
              <select
                id="venueId"
                name="venueId"
                value={formData.venueId}
                onChange={(e) => {
                  handleChange(e);
                  setVenue(venues.find(v => v.id === Number(e.target.value)) || null);
                }}
                required
              >
                <option value="">Selecione um local</option>
                {venues.map(venue => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name} (Capacidade: {venue.capacity})
                  </option>
                ))}
              </select>
            ) : (
              <Alert
                variant="error"
                className={styles.alertVenueSchool}
                children={"Esta escola não possui locais disponíveis."}
              />
            )
          ) : (
            <select id="venueId" name="venueId" className={styles.disabled} disabled>
              <option value="">Selecione uma escola primeiro</option>
            </select>
          )}
        </div>
      </div>

      {/* Seção para exibir detalhes do local selecionado */}
      {venue && (
        <div className={styles.venueDetails}>
          <h3 className={styles.venueDetailsTitle}>Detalhes do Local</h3>
          <div className={styles.venueInfo}>
            <div className={styles.venueInfoItem}>
              <BiSolidSchool className={styles.venueInfoIcon} />
              <span>Local: {venue.name}</span>
            </div>
            <div className={styles.venueInfoItem}>
              <FiMapPin className={styles.venueInfoIcon} />
              <span>Endereço: {venue.address}</span>
            </div>
            <div className={styles.venueInfoItem}>
              <FiUsers className={styles.venueInfoIcon} />
              <span>Capacidade: {venue.capacity} {venue.capacity > 1 ? "pessoas" : "pessoa"}</span>
            </div>
            <div className={styles.venueInfoItem}>
              <IoRainy className={styles.venueInfoIcon} />
              <span>Interno: {venue.isInternal ? "Sim" : "Não"}</span>
            </div>
          </div>

          {venuePictures && venuePictures.length > 0 && (
            <div className={styles.venuePictures}>
              <h4>Fotos</h4>
              <div className={styles.venuePicturesGrid}>
                {venuePictures.map(picture => (
                  <div key={picture.id} className={styles.venuePicture}>
                    <img
                      src={picture.pictureUrl}
                      alt={`Local ${venue.name}`}
                      className={styles.venuePictureImage}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="eventTypeId">
          <MdOutlineFormatListBulleted className={styles.inputIcon} />
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

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="startDate">
            <TbCalendar className={styles.inputIcon} />
            Data de início *
          </label>
          <input
            type="datetime-local"
            name="startDate"
            id="startDate"
            min={getFormattedDate(new Date(), { startOfDay: true })}
            defaultValue={event?.startDate
              ? getFormattedDate(new Date(event.startDate))
              : getFormattedDate(new Date())}
            onChange={handleStartDateChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="endDate">
            <TbCalendarCheck className={styles.inputIcon} />
            Data final *
          </label>
          <input
            type="datetime-local"
            name="endDate"
            id="endDate"
            min={getFormattedDate(new Date())}
            defaultValue={event?.endDate
              ? getFormattedDate(new Date(event.endDate))
              : getFormattedDate(new Date(), { daysOffset: 1 })}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Restante do formulário permanece igual */}
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