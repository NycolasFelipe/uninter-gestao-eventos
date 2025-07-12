import { useState, useEffect } from 'react';
import styles from './PermissionManager.module.css';

// Icons
import { FiX } from 'react-icons/fi';

// Components
import Alert from 'src/components/alert/Alert';
import Button from 'src/components/button/Button';

// Interfaces
import type { IPermission, IPermissionCreate } from 'src/interfaces/IPermission';

// Controllers
import PermissionController from 'src/controllers/PermissionController';

interface PermissionFormProps {
  permission?: IPermission;
  onSuccess: () => void;
  onCancel: () => void;
}

const PermissionForm: React.FC<PermissionFormProps> = ({
  permission,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState<IPermissionCreate>({
    permissionName: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (permission) {
      setFormData({
        permissionName: permission.permissionName,
        description: permission.description || '',
      });
    }
  }, [permission]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (permission) {
        // Atualizar permissão existente
        await PermissionController.updatePermission(formData, permission.id);
      } else {
        // Criar nova permissão
        await PermissionController.createPermission(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar permissão');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.permissionForm}>
      {error && <Alert variant="error">{error}</Alert>}

      <div className={styles.formGroup}>
        <label htmlFor="permissionName">Permissão *</label>
        <input
          type="text"
          id="permissionName"
          name="permissionName"
          value={formData.permissionName}
          onChange={handleChange}
          required
          placeholder="Ex: criar_usuarios"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva o que esta permissão permite"
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
          {isSubmitting ? 'Salvando...' : permission ? 'Atualizar Permissão' : 'Criar Permissão'}
        </Button>
      </div>
    </form>
  );
};

export default PermissionForm;