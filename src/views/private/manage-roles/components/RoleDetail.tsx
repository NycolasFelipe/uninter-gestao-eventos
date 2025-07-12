import styles from './RoleDetail.module.css';

// Interfaces
import type { IRole } from 'src/interfaces/IRole';
import type { IUser } from 'src/interfaces/IUser';

// Lib
import classNames from 'classnames';

// Components
import Button from 'src/components/button/Button';

interface RoleDetailProps {
  role: IRole;
  onClose: () => void;
}

const RoleDetail: React.FC<RoleDetailProps> = ({ role, onClose }) => {
  return (
    <div className={styles.roleDetail}>
      <div className={styles.section}>
        <h3>Informações do Cargo</h3>
        <div className={styles.detailItem}>
          <strong>Nome:</strong> {role.roleName}
        </div>
        <div className={styles.detailItem}>
          <strong>Descrição:</strong> {role.description || 'Nenhuma descrição'}
        </div>
      </div>

      <div className={styles.section}>
        <h3>Permissões ({role.permissions?.length || 0})</h3>
        {role.permissions && role.permissions.length > 0 ? (
          <ul className={styles.permissionsList}>
            {role.permissions.map(permission => (
              <li key={permission.id} className={styles.permissionItem}>
                <div className={styles.permissionName}>{permission.permissionName}</div>
                {permission.description && (
                  <div className={styles.permissionDescription}>{permission.description}</div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhuma permissão vinculada a este cargo.</p>
        )}
      </div>

      <div className={styles.section}>
        <h3>Usuários com este cargo ({role.users?.length || 0})</h3>
        {role.users && role.users.length > 0 ? (
          <ul className={styles.usersList}>
            {role.users.map((user: IUser) => (
              <li key={user.id} className={styles.userItem}>
                <div className={styles.userInfo}>
                  <span className={styles.userName}>
                    {user.firstName} {user.lastName}
                  </span>
                  <span className={styles.userEmail}>{user.email}</span>
                  <span className={classNames(
                    styles.statusBadge,
                    user.isActive ? styles.active : styles.inactive
                  )}>
                    {user.isActive ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nenhum usuário possui este cargo.</p>
        )}
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onClose}>
          Fechar
        </Button>
      </div>
    </div>
  );
};

export default RoleDetail;