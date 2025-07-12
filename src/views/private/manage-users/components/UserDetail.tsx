import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './UserDetail.module.css';

// Components
import Button from 'src/components/button/Button';

// Lib
import maskPhone from 'src/lib/maskPhone';

// Icons
import { FiUser, FiMail, FiPhone, FiCheck, FiX, FiShield, FiHome } from 'react-icons/fi';


interface UserDetailProps {
  user: any;
  onClose: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onClose }) => {
  const [showPermissions, setShowPermissions] = useState(false);

  return (
    <div className={styles.userDetail}>
      <div className={styles.userHeader}>
        {user.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={`${user.firstName} ${user.lastName}`}
            className={styles.userAvatar}
          />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <FiUser size={24} />
          </div>
        )}
        <div>
          <h2 className={styles.userName}>{user.firstName} {user.lastName}</h2>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Informações Básicas</h3>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiMail className={styles.detailIcon} />
            <span>Email</span>
          </div>
          <div className={styles.detailValue}>{user.email}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiPhone className={styles.detailIcon} />
            <span>Telefone</span>
          </div>
          <div className={styles.detailValue}>{maskPhone(user.phoneNumber) || 'Não informado'}</div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <div className={classNames(
              styles.statusIndicator,
              user.isActive ? styles.active : styles.inactive
            )}>
              {user.isActive ? <FiCheck /> : <FiX />}
            </div>
            <span>Status</span>
          </div>
          <div className={styles.detailValue}>
            {user.isActive ? 'Ativo' : 'Inativo'}
          </div>
        </div>
      </div>

      <div className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Permissões e Acesso</h3>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiShield className={styles.detailIcon} />
            <span>Cargo</span>
          </div>
          <div className={styles.detailValue}>
            {user.role?.roleName || 'Nenhum cargo atribuído'}
          </div>
        </div>

        <div className={styles.detailItem}>
          <div className={styles.detailLabel}>
            <FiHome className={styles.detailIcon} />
            <span>Escola</span>
          </div>
          <div className={styles.detailValue}>
            {user.school?.name || 'Nenhuma escola vinculada'}
          </div>
        </div>

        {user.role?.permissions?.length > 0 ? (
          <div className={styles.permissionsContainer}>
            <button
              onClick={() => setShowPermissions(!showPermissions)}
              className={styles.toggleButton}
            >
              {showPermissions ? 'Ocultar permissões' : 'Mostrar permissões'}
            </button>

            {showPermissions && (
              <div className={styles.permissions}>
                {user.role.permissions.map((permission: any) => (
                  <div key={permission.id} className={styles.permission}>
                    <div className={styles.permissionBadge}>
                      {permission.permissionName}
                    </div>
                    <div className={styles.permissionDescription}>
                      {permission.description}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className={styles.noPermissions}>
            <p>
              Não possui permissões
            </p>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
}

export default UserDetail;