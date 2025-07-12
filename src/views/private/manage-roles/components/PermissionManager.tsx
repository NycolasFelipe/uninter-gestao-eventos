import { useEffect, useState } from 'react';
import styles from './PermissionManager.module.css';

// Components
import Button from 'src/components/button/Button';
import Alert from 'src/components/alert/Alert';

// Interfaces
import type { IPermission } from 'src/interfaces/IPermission';
import type { IRole } from 'src/interfaces/IRole';

// Controllers
import RoleController from 'src/controllers/RoleController';

// Lib
import classNames from 'classnames';

// Icons
import { FiCheck, FiX } from 'react-icons/fi';

interface PermissionManagerProps {
  role: IRole;
  permissions: IPermission[];
  onSuccess: () => void;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({
  role,
  permissions,
  onSuccess
}) => {
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (role.permissions) {
      setSelectedPermissions(role.permissions.map(p => p.id));
    }
  }, [role]);

  const handlePermissionChange = (permissionId: number) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      await RoleController.assignPermissions(role.id, selectedPermissions);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar permissões');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredPermissions = permissions.filter(permission =>
    permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={styles.permissionManager}>
      {error && <Alert variant="error" className={styles.alert}>{error}</Alert>}

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Buscar permissões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.permissionsGrid}>
        {filteredPermissions.map(permission => (
          <div
            key={permission.id}
            className={classNames(
              styles.permissionCard,
              selectedPermissions.includes(permission.id) && styles.selected
            )}
          >
            <div
              className={styles.permissionInfo}
              onClick={() => handlePermissionChange(permission.id)}
            >
              <div className={styles.permissionName}>
                {permission.permissionName}
                {selectedPermissions.includes(permission.id) ? (
                  <span className={styles.checkmark}><FiCheck /></span>
                ) : (
                  <span className={styles.xmark}><FiX /></span>
                )}
              </div>
              <div className={styles.permissionDescription}>
                {permission.description || 'Sem descrição'}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? 'Salvando...' : 'Salvar Permissões'}
        </Button>
      </div>
    </div>
  );
};

export default PermissionManager;