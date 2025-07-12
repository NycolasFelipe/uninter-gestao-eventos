import { useState, useEffect } from 'react';
import styles from './EventTypeForm.module.css';

// Icons
import { FiX, FiBook } from 'react-icons/fi';

// Components
import Alert from 'src/components/alert/Alert';
import Button from 'src/components/button/Button';

// Interfaces
import type { IEventType, IEventTypeCreate } from 'src/interfaces/IEventType';

// Controllers
import EventTypeController from 'src/controllers/EventTypeController';

interface EventTypeFormProps {
  eventType?: IEventType;
  onSuccess: () => void;
  onCancel: () => void;
}

const EventTypeForm: React.FC<EventTypeFormProps> = ({ eventType, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<IEventTypeCreate>({
    name: '',
    description: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (eventType) {
      setFormData({
        name: eventType.name,
        description: eventType.description || '',
      });
    }
  }, [eventType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (eventType) {
        await EventTypeController.updateEventType(formData, eventType.id);
      } else {
        await EventTypeController.createEventType(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.toString() || 'Erro ao salvar tipo de evento');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.eventTypeForm}>
      {error && <Alert variant="error" className={styles.alert}>{error}</Alert>}

      <div className={styles.formGroup}>
        <label htmlFor="name">
          <FiBook className={styles.inputIcon} />
          Nome *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Digite o nome do tipo de evento"
        />
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
          placeholder="Descreva o tipo de evento"
          rows={3}
        />
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
          {isSubmitting ? 'Salvando...' : eventType ? 'Atualizar Tipo' : 'Criar Tipo'}
        </Button>
      </div>
    </form>
  );
}

export default EventTypeForm;