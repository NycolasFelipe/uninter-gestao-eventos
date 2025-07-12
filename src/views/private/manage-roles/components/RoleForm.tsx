import { useState, useEffect } from 'react';
import styles from './RoleForm.module.css';

// Icons
import { FiX } from 'react-icons/fi';

// Components
import Alert from 'src/components/alert/Alert';
import Button from 'src/components/button/Button';

// Interfaces
import type { IRole } from 'src/interfaces/IRole';

// Controllers
import RoleController from 'src/controllers/RoleController';

interface RoleFormProps {
  role?: IRole;
  onSuccess: () => void;
  onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (role) {
      setFormData({
        roleName: role.roleName,
        description: role.description || '',
      });
    }
  }, [role]);

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
      if (role) {
        await RoleController.updateRole(formData, role.id);
      } else {
        await RoleController.createRole(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar cargo');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.roleForm}>
      {error && <Alert variant="error" className={styles.alert}>{error}</Alert>}

      <div className={styles.formGroup}>
        <label htmlFor="roleName">Nome do Cargo *</label>
        <input
          type="text"
          id="roleName"
          name="roleName"
          value={formData.roleName}
          onChange={handleChange}
          required
          placeholder="Ex: Administrador"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descreva as responsabilidades deste cargo"
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
          {isSubmitting ? 'Salvando...' : role ? 'Atualizar Cargo' : 'Criar Cargo'}
        </Button>
      </div>
    </form>
  );
}

export default RoleForm;