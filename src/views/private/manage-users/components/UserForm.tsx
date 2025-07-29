import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import classNames from 'classnames';
import styles from './UserForm.module.css';

// Icons
import { FiImage, FiLock, FiMail, FiPhone, FiUser, FiX } from 'react-icons/fi';

// Components
import Alert from 'src/components/alert/Alert';
import Button from 'src/components/button/Button';

// Services
import SchoolController from 'src/controllers/SchoolController';
import RoleController from 'src/controllers/RoleController';

// Interfaces
import type { ISchool } from 'src/interfaces/ISchool';
import type { IUser, IUserCreate, IUserDetail } from 'src/interfaces/IUser';
import type { IRole } from 'src/interfaces/IRole';

// Controllers
import UserController from 'src/controllers/UserController';

// Lib
import maskPhone from 'src/lib/maskPhone';

interface UserFormProps {
  user?: IUser | IUserDetail;
  onSuccess: () => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<IUserCreate>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    isActive: true,
    profilePictureUrl: '',
    schoolId: undefined,
    roleId: undefined,
  });

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar escolas e cargos
  const { data: schools } = useQuery<ISchool[]>({
    queryKey: ["schools"],
    queryFn: () => SchoolController.getSchools()
  });

  const { data: roles } = useQuery<IRole[]>({
    queryKey: ["roles"],
    queryFn: () => RoleController.getRoles()
  });

  useEffect(() => {
    if (user) {
      const schoolId = typeof user.school === 'object' ? user.school?.id : null;
      const roleId = typeof user.role === 'object' ? user.role?.id : null;
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: '',
        phoneNumber: user.phoneNumber || '',
        isActive: user.isActive,
        profilePictureUrl: user.profilePictureUrl || '',
        schoolId: schoolId || undefined,
        roleId: roleId || undefined,
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      if (user) {
        await UserController.updateUser(formData, user.id);
      } else {
        await UserController.createUser(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.toString() || 'Erro ao salvar usuário');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.userForm}>
      {error && <Alert variant="error" className={styles.alert}>{error}</Alert>}

      <div className={styles.formHeader}>
        <h2>{user ? 'Editar Usuário' : 'Novo Usuário'}</h2>
        <p>Preencha os campos abaixo para {user ? 'atualizar' : 'criar'} o usuário</p>
      </div>

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstName">
            <FiUser className={styles.inputIcon} />
            Nome *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
            placeholder="Digite seu nome"
            className={styles.inputWithIcon}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName">
            <FiUser className={styles.inputIcon} />
            Sobrenome *
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
            placeholder="Digite seu sobrenome"
            className={styles.inputWithIcon}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">
          <FiMail className={styles.inputIcon} />
          Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="exemplo@email.com"
          className={styles.inputWithIcon}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="phoneNumber">
          <FiPhone className={styles.inputIcon} />
          Telefone
        </label>
        <input
          type="tel"
          id="phoneNumber"
          name="phoneNumber"
          value={maskPhone(formData.phoneNumber || "")}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
          className={styles.inputWithIcon}
        />
      </div>

      {!user && (
        <div className={styles.formGroup}>
          <label htmlFor="password">
            <FiLock className={styles.inputIcon} />
            Senha *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Crie uma senha segura"
            className={styles.inputWithIcon}
          />
        </div>
      )}

      <div className={styles.formRow}>
        <div className={styles.formGroup}>
          <label htmlFor="schoolId">
            <FiImage className={styles.inputIcon} />
            Escola
          </label>
          <select
            id="schoolId"
            name="schoolId"
            value={formData.schoolId || ''}
            onChange={handleChange}
            className={styles.inputWithIcon}
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
          <label htmlFor="roleId">
            <FiUser className={styles.inputIcon} />
            Cargo
          </label>
          <select
            id="roleId"
            name="roleId"
            value={formData.roleId || ''}
            onChange={handleChange}
            className={styles.inputWithIcon}
          >
            <option value="">Selecione um cargo</option>
            {roles?.map(role => (
              <option key={role.id} value={role.id}>
                {role.roleName}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="profilePictureUrl">
          <FiImage className={styles.inputIcon} />
          URL da Foto de Perfil
        </label>
        <input
          type="url"
          id="profilePictureUrl"
          name="profilePictureUrl"
          value={formData.profilePictureUrl}
          onChange={handleChange}
          placeholder="https://exemplo.com/foto.jpg"
          className={styles.inputWithIcon}
        />
      </div>

      <div className={classNames(styles.formGroup, styles.checkboxGroup)}>
        <div className={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleChange}
            className={styles.customCheckbox}
          />
          <label htmlFor="isActive" className={styles.checkboxLabel}>
            Usuário ativo
          </label>
        </div>
      </div>

      <div className={styles.formActions}>
        <Button
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          icon={<FiX />}
          className={styles.cancelButton}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className={styles.submitButton}
        >
          {isSubmitting ? (
            <span className={styles.loadingText}>Salvando...</span>
          ) : user ? (
            'Atualizar Usuário'
          ) : (
            'Criar Usuário'
          )}
        </Button>
      </div>
    </form>
  );
}

export default UserForm;