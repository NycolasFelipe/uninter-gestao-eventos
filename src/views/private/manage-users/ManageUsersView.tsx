import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import styles from './ManageUsersView.module.css';

// Interfaces
import { type IUser, type IUserDetail } from 'src/interfaces/IUser';

// Controllers
import UserController from 'src/controllers/UserController';

// Components
import Button from 'src/components/button/Button';
import Alert from 'src/components/alert/Alert';
import Modal from 'src/components/modal/base/Modal';
import UserForm from './components/UserForm';
import UserDetail from './components/UserDetail';
import ConfirmationModal from 'src/components/modal/confirmation/ConfirmationModal';

// Icons
import { FiEdit, FiTrash2, FiPlus, FiUser, FiInfo, FiSearch } from 'react-icons/fi';
import { TbRefresh } from 'react-icons/tb';

const ManageUsersView = () => {
  const [selectedUser, setSelectedUser] = useState<IUser | IUserDetail>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();

  // Buscar todos os usuários
  const { data: users, isLoading, isError, refetch } = useQuery<IUser[]>({
    queryKey: ["users"],
    queryFn: () => UserController.getUsers()
  });

  // Mutation para deletar usuário
  const deleteMutation = useMutation({
    mutationFn: (id: number) => UserController.deleteUser(id),
    onSuccess: () => refetch()
  });

  // Filtrar usuários baseado no termo de busca
  const filteredUsers = users?.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handler para abrir modal de detalhes
  const handleViewDetails = async (userId: number) => {
    try {
      const response = await UserController.getUserDetail(userId);
      setSelectedUser(response);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
    }
  }

  // Handler para abrir modal de edição
  const handleEditUser = async (userId: number) => {
    try {
      const response = await UserController.getUserDetail(userId);
      setSelectedUser(response);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error);
    }
  }

  // Handler para deletar usuário
  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteMutation.mutateAsync(userToDelete);
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
      }
    }
  }

  return (
    <div className={styles.manageUsersContainer}>
      <header className={styles.pageHeader}>
        <h1>Gerenciamento de Usuários</h1>
        <p>Gerencie contas de usuários, permissões e acesso ao sistema</p>
        <div className={styles.headerAccent}></div>
      </header>

      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar usuários por nome ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          <Button
            variant="secondary"
            onClick={() => refetch()}
            icon={<TbRefresh />}
            className={styles.updateButton}>
            Atualizar
          </Button>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
          icon={<FiPlus />}
          className={styles.createButton}>
          Novo Usuário
        </Button>
      </div>

      {isError && (
        <Alert variant="error" className={styles.alert}>
          Ocorreu um erro ao carregar os usuários. Tente novamente.
        </Alert>
      )}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando usuários...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>Email</th>
                <th>Status</th>
                <th>Cargo</th>
                <th>Escola</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers && filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userCell}>
                        {user.profilePictureUrl ? (
                          <img
                            src={user.profilePictureUrl}
                            alt={`${user.firstName} ${user.lastName}`}
                            className={styles.avatar}
                          />
                        ) : (
                          <div className={styles.avatarPlaceholder}>
                            <FiUser />
                          </div>
                        )}
                        <span>{user.firstName} {user.lastName}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={classNames(
                        styles.statusBadge,
                        user.isActive ? styles.active : styles.inactive
                      )}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td>{user.role || 'Nenhum'}</td>
                    <td>{user.school || 'Nenhuma'}</td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="icon"
                          onClick={() => handleViewDetails(user.id)}
                          title="Ver detalhes"
                        >
                          <FiInfo />
                        </Button>
                        <Button
                          variant="icon"
                          onClick={() => handleEditUser(user.id)}
                          title="Editar usuário"
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          variant="icon"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Excluir usuário"
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Novo Usuário"
        icon={<FiUser />}
        size='large'
      >
        <UserForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            queryClient.invalidateQueries();
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Usuário"
        icon={<FiEdit />}
        size='large'
      >
        {selectedUser && (
          <UserForm
            user={selectedUser}
            onSuccess={() => {
              setIsEditModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['users'] });
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalhes do Usuário"
        icon={<FiInfo />}
        size="large"
      >
        {selectedUser && (
          <UserDetail
            user={selectedUser}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
}

export default ManageUsersView;