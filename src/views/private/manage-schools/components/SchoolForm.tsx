import React, { useState } from 'react';
import styles from './SchoolForm.module.css';

// Components
import Button from 'src/components/button/Button';
import Alert from 'src/components/alert/Alert';

// Icons
import { FiHome, FiMapPin, FiX } from 'react-icons/fi';

// Controllers
import SchoolController from 'src/controllers/SchoolController';

interface SchoolFormProps {
  school?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ school, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: school?.name || '',
    address: school?.address || '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (school) {
        // Atualizar escola existente
        await SchoolController.updateUser(formData, school.id);
      } else {
        // Criar nova escola
        await SchoolController.createSchool(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.toString() || 'Erro ao salvar escola');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.schoolForm}>
      {error && <Alert variant="error" className={styles.alert}>{error}</Alert>}

      <div className={styles.formHeader}>
        <h2>{school ? 'Editar Escola' : 'Nova Escola'}</h2>
        <p>Preencha os campos abaixo para {school ? 'atualizar' : 'criar'} a escola</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name">
          <FiHome className={styles.inputIcon} />
          Nome da Escola *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Digite o nome da escola"
          className={styles.inputWithIcon}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address">
          <FiMapPin className={styles.inputIcon} />
          Endereço
        </label>
        <textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Digite o endereço completo da escola"
          rows={3}
          className={styles.textareaWithIcon}
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
          {isSubmitting ? 'Salvando...' : school ? 'Atualizar Escola' : 'Criar Escola'}
        </Button>
      </div>
    </form>
  );
}

export default SchoolForm;