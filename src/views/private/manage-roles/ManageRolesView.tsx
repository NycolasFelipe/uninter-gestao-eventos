import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ManageRolesView.module.css';

// Interfaces
import type { IRole } from 'src/interfaces/IRole';
import type { IPermission } from 'src/interfaces/IPermission';

// Controllers
import RoleController from 'src/controllers/RoleController';
import PermissionController from 'src/controllers/PermissionController';

// Components
import Button from 'src/components/button/Button';
import Alert from 'src/components/alert/Alert';
import Modal from 'src/components/modal/base/Modal';
import RoleForm from './components/RoleForm';
import RoleDetail from './components/RoleDetail';
import PermissionManager from './components/PermissionManager';
import ConfirmationModal from 'src/components/modal/confirmation/ConfirmationModal';
import PermissionForm from './components/PermissionForm';
import MethodBadge from './components/MethodBadge';

// Icons
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiUser,
  FiInfo,
  FiSearch,
  FiShield,
  FiLock,
  FiChevronUp,
  FiChevronDown
} from 'react-icons/fi';
import { TbRefresh } from 'react-icons/tb';

const ManageRolesView = () => {
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [selectedPermission, setSelectedPermission] = useState<IPermission | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [isCreatePermissionModalOpen, setIsCreatePermissionModalOpen] = useState(false);
  const [isEditPermissionModalOpen, setIsEditPermissionModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeletePermissionModalOpen, setIsDeletePermissionModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<number | null>(null);
  const [permissionToDelete, setPermissionToDelete] = useState<number | null>(null);

  const queryClient = useQueryClient();

  // Buscar todos os cargos
  const { data: roles, isLoading, isError, refetch } = useQuery<IRole[]>({
    queryKey: ["roles"],
    queryFn: () => RoleController.getRolesWithUsers()
  });

  // Buscar todas as permissões
  const { data: permissions, refetch: refetchPermissions } = useQuery<IPermission[]>({
    queryKey: ["permissions"],
    queryFn: () => PermissionController.getPermissions()
  });

  // Mutation para deletar cargo
  const deleteRoleMutation = useMutation({
    mutationFn: (id: number) => RoleController.deleteRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    }
  });

  // Mutation para deletar permissão
  const deletePermissionMutation = useMutation({
    mutationFn: (id: number) => PermissionController.deletePermission(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['permissions'] });
      queryClient.invalidateQueries({ queryKey: ['roles'] })
    }
  });

  // Filtrar cargos baseado no termo de busca
  const filteredRoles = roles?.filter(role =>
    role.roleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description && role.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtrar permissões baseado no termo de busca
  const filteredPermissions = permissions?.filter(permission =>
    permission.permissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (permission.description && permission.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handler para abrir modal de detalhes
  const handleViewDetails = (role: IRole) => {
    setSelectedRole(role);
    setIsDetailModalOpen(true);
  }

  // Handler para abrir modal de edição
  const handleEditRole = (role: IRole) => {
    setSelectedRole(role);
    setIsEditModalOpen(true);
  }

  // Handler para abrir modal de permissões
  const handleManagePermissions = (role: IRole) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
  }

  // Handler para deletar cargo
  const handleDeleteRole = (roleId: number) => {
    setRoleToDelete(roleId);
    setIsDeleteModalOpen(true);
  }

  // Handler para deletar permissão
  const handleDeletePermission = (permissionId: number) => {
    setPermissionToDelete(permissionId);
    setIsDeletePermissionModalOpen(true);
  }

  const confirmDeleteRole = async () => {
    if (roleToDelete) {
      try {
        await deleteRoleMutation.mutateAsync(roleToDelete);
        setIsDeleteModalOpen(false);
        setRoleToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir cargo:', error);
      }
    }
  }

  const confirmDeletePermission = async () => {
    if (permissionToDelete) {
      try {
        await deletePermissionMutation.mutateAsync(permissionToDelete);
        setIsDeletePermissionModalOpen(false);
        setPermissionToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir permissão:', error);
      }
    }
  }

  // Handler para editar permissão
  const handleEditPermission = (permission: IPermission) => {
    setSelectedPermission(permission);
    setIsEditPermissionModalOpen(true);
  }

  // Controle de estados da tabela de permissões
  const [expandedResources, setExpandedResources] = useState<Record<string, boolean>>({});

  const toggleResource = (resource: string) => {
    setExpandedResources(prev => ({
      ...prev,
      [resource]: !prev[resource]
    }));
  };

  // Agrupar permissões por recurso
  const groupedPermissions = useMemo(() => {
    if (!filteredPermissions) return {};

    // Ordem desejada dos métodos HTTP
    const methodOrder = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

    const grouped = filteredPermissions.reduce((acc, permission) => {
      const parts = permission.permissionName.split('.');
      const httpMethod = parts.pop()?.toUpperCase() || '';
      const resource = parts.join('.') || 'Geral';

      if (!acc[resource]) {
        acc[resource] = {
          permissions: [],
          expanded: expandedResources[resource] || false
        };
      }

      acc[resource].permissions.push({
        ...permission,
        httpMethod,
        description: permission.description || 'Nenhuma descrição'
      });

      return acc;
    }, {} as Record<string, {
      permissions: Array<{
        id: number;
        permissionName: string;
        description: string;
        httpMethod: string;
      }>;
      expanded: boolean;
    }>);

    // Ordenar as permissões dentro de cada grupo
    Object.keys(grouped).forEach(resource => {
      grouped[resource].permissions.sort((a, b) => {
        const indexA = methodOrder.indexOf(a.httpMethod);
        const indexB = methodOrder.indexOf(b.httpMethod);

        // Tratar métodos fora da ordem especificada
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;

        return indexA - indexB;
      });
    });

    return grouped;
  }, [filteredPermissions, expandedResources]);

  return (
    <div className={styles.manageRolesContainer}>
      <header className={styles.pageHeader}>
        <h1>Gerenciamento de Cargos e Permissões</h1>
        <p>Gerencie cargos e permissões de acesso ao sistema</p>
        <div className={styles.headerAccent}></div>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'roles' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('roles')}
        >
          Cargos
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'permissions' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('permissions')}
        >
          Permissões
        </button>
      </div>

      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder={
                activeTab === 'roles'
                  ? "Buscar cargos por nome ou descrição..."
                  : "Buscar permissões por nome ou descrição..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => activeTab === 'roles' ? refetch() : refetchPermissions()}
            icon={<TbRefresh />}
            className={styles.updateButton}>
            Atualizar
          </Button>
        </div>

        <div className={styles.buttonGroup}>
          {activeTab === 'roles' ? (
            <Button
              variant="primary"
              onClick={() => setIsCreateModalOpen(true)}
              icon={<FiPlus />}
              className={styles.createButton}>
              Novo Cargo
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setIsCreatePermissionModalOpen(true)}
              icon={<FiPlus />}
              className={styles.createButton}>
              Nova Permissão
            </Button>
          )}
        </div>
      </div>

      {isError && (
        <Alert variant="error" className={styles.alert}>
          Ocorreu um erro ao carregar os dados. Tente novamente.
        </Alert>
      )}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando dados...</p>
        </div>
      ) : (
        <>
          {/* TABELA DE CARGOS */}
          {activeTab === 'roles' && (
            <div className={styles.tableContainer}>
              <table className={styles.rolesTable}>
                <thead>
                  <tr>
                    <th>Cargo</th>
                    <th>Descrição</th>
                    <th>Nº de Permissões</th>
                    <th>Nº de Usuários</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoles && filteredRoles.length > 0 ? (
                    filteredRoles.map((role) => (
                      <tr key={role.id}>
                        <td>{role.roleName}</td>
                        <td>{role.description || 'Nenhuma descrição'}</td>
                        <td>{role.permissions?.length || 0}</td>
                        <td>{role.users?.length || 0}</td>
                        <td>
                          <div className={styles.actions}>
                            <Button
                              variant="icon"
                              onClick={() => handleViewDetails(role)}
                              title="Ver detalhes"
                            >
                              <FiInfo />
                            </Button>
                            <Button
                              variant="icon"
                              onClick={() => handleEditRole(role)}
                              title="Editar cargo"
                            >
                              <FiEdit />
                            </Button>
                            <Button
                              variant="icon"
                              onClick={() => handleManagePermissions(role)}
                              title="Gerenciar permissões"
                            >
                              <FiShield />
                            </Button>
                            <Button
                              variant="icon"
                              onClick={() => handleDeleteRole(role.id)}
                              title="Excluir cargo"
                            >
                              <FiTrash2 />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className={styles.emptyState}>
                        Nenhum cargo encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TABELA DE PERMISSÕES */}
          {activeTab === 'permissions' && (
            <div className={styles.tableContainer}>
              <table className={styles.rolesTable}>
                <thead>
                  <tr>
                    <th>Recurso</th>
                    <th>Permissões</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(groupedPermissions).length > 0 ? (
                    Object.entries(groupedPermissions).map(([resource, group]) => (
                      <React.Fragment key={resource}>
                        {/* Linha do recurso (cabeçalho do grupo) */}
                        <tr className={styles.resourceHeader}>
                          <td>
                            <div
                              className={styles.resourceTitle}
                              onClick={() => toggleResource(resource)}
                            >
                              {resource}
                              <span className={styles.toggleIcon}>
                                {group.expanded ? <FiChevronUp /> : <FiChevronDown />}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className={styles.badgeGroup}>
                              {group.permissions.slice(0, 3).map(p => (
                                <MethodBadge key={`${resource}-${p.httpMethod}`} method={p.httpMethod} />
                              ))}
                              {group.permissions.length > 3 && (
                                <span className={styles.moreBadges}>
                                  +{group.permissions.length - 3} mais
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className={styles.actions}>
                              <Button
                                variant="icon"
                                onClick={() => toggleResource(resource)}
                                title={group.expanded ? "Recolher" : "Expandir"}
                              >
                                {group.expanded ? <FiChevronUp /> : <FiChevronDown />}
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {/* Linhas de permissões (visíveis quando expandidas) */}
                        {group.expanded && group.permissions.map(permission => (
                          <tr key={permission.id} className={styles.permissionRow}>
                            <td></td> {/* Célula vazia para alinhamento */}
                            <td>
                              <div className={styles.permissionDetail}>
                                <MethodBadge method={permission.httpMethod} />
                                <span>{permission.description || 'Nenhuma descrição'}</span>
                              </div>
                            </td>
                            <td>
                              <div className={styles.actions}>
                                <Button
                                  variant="icon"
                                  onClick={() => handleEditPermission(permission)}
                                  title="Editar permissão"
                                >
                                  <FiEdit />
                                </Button>
                                <Button
                                  variant="icon"
                                  onClick={() => handleDeletePermission(permission.id)}
                                  title="Excluir permissão"
                                >
                                  <FiTrash2 />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className={styles.emptyState}>
                        Nenhuma permissão encontrada
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* Modals para Cargos */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Novo Cargo"
        icon={<FiUser />}
        size='large'
      >
        <RoleForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['roles'] });
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Cargo"
        icon={<FiEdit />}
        size='large'
      >
        {selectedRole && (
          <RoleForm
            role={selectedRole}
            onSuccess={() => {
              setIsEditModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['roles'] });
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalhes do Cargo"
        icon={<FiInfo />}
        size="large"
      >
        {selectedRole && (
          <RoleDetail
            role={selectedRole}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isPermissionModalOpen}
        onClose={() => setIsPermissionModalOpen(false)}
        title={selectedRole ? `Permissões: ${selectedRole.roleName}` : "Gerenciar Permissões"}
        icon={<FiShield />}
        size="large"
      >
        {selectedRole && permissions && (
          <PermissionManager
            role={selectedRole}
            permissions={permissions}
            onSuccess={() => {
              setIsPermissionModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['roles'] });
            }}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteRole}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este cargo? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isProcessing={deleteRoleMutation.isPending}
      />

      {/* Modals para Permissões */}
      <Modal
        isOpen={isCreatePermissionModalOpen}
        onClose={() => setIsCreatePermissionModalOpen(false)}
        title="Criar Nova Permissão"
        icon={<FiLock />}
        size="medium"
      >
        <PermissionForm
          onSuccess={() => {
            setIsCreatePermissionModalOpen(false);
            refetchPermissions();
          }}
          onCancel={() => setIsCreatePermissionModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditPermissionModalOpen}
        onClose={() => setIsEditPermissionModalOpen(false)}
        title="Editar Permissão"
        icon={<FiEdit />}
        size="medium"
      >
        {selectedPermission && (
          <PermissionForm
            permission={selectedPermission}
            onSuccess={() => {
              setIsEditPermissionModalOpen(false);
              refetchPermissions();
            }}
            onCancel={() => setIsEditPermissionModalOpen(false)}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeletePermissionModalOpen}
        onClose={() => setIsDeletePermissionModalOpen(false)}
        onConfirm={confirmDeletePermission}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta permissão? Esta ação não pode ser desfeita e afetará todos os cargos que utilizam esta permissão."
        confirmText="Excluir"
        cancelText="Cancelar"
        isProcessing={deletePermissionMutation.isPending}
      />
    </div>
  );
}

export default ManageRolesView;