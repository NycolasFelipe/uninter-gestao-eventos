import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ManageSchoolsView.module.css';

// Interfaces
import type { ISchool } from 'src/interfaces/ISchool';

// Controllers
import SchoolController from 'src/controllers/SchoolController';

// Components
import Button from 'src/components/button/Button';
import Alert from 'src/components/alert/Alert';
import Modal from 'src/components/modal/base/Modal';
import Header from 'src/components/header/Header';
import SchoolForm from './components/SchoolForm';
import SchoolDetail from './components/SchoolDetail';
import ConfirmationModal from 'src/components/modal/confirmation/ConfirmationModal';

// Icons
import { FiEdit, FiTrash2, FiPlus, FiHome, FiInfo, FiSearch } from 'react-icons/fi';
import { TbRefresh } from 'react-icons/tb';

const ManageSchoolsView = () => {
  const queryClient = useQueryClient();
  const [selectedSchool, setSelectedSchool] = useState<ISchool>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<number | null>(null);

  // Buscar todas as escolas
  const { data: schools, isLoading, isError, refetch } = useQuery<ISchool[]>({
    queryKey: ["schools"],
    queryFn: () => SchoolController.getSchools()
  });

  // Mutation para deletar escola
  const deleteMutation = useMutation({
    mutationFn: (id: number) => SchoolController.deleteSchool(id),
    onSuccess: () => refetch()
  });

  // Filtrar escolas baseado no termo de busca
  const filteredSchools = schools?.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.address && school.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handler para abrir modal de detalhes
  const handleViewDetails = (school: ISchool) => {
    setSelectedSchool(school);
    setIsDetailModalOpen(true);
  }

  // Handler para abrir modal de edição
  const handleEditSchool = (school: ISchool) => {
    setSelectedSchool(school);
    setIsEditModalOpen(true);
  }

  // Handler para deletar escola
  const handleDeleteSchool = (schoolId: number) => {
    setSchoolToDelete(schoolId);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
    if (schoolToDelete) {
      try {
        await deleteMutation.mutateAsync(schoolToDelete);
        setIsDeleteModalOpen(false);
        setSchoolToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir escola:', error);
      }
    }
  }

  return (
    <div className={styles.manageSchoolsContainer}>
      <Header
        title='Gerenciamento de Escolas'
        description='Gerencie as escolas cadastradas no sistema'
      />

      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar escolas por nome ou endereço..."
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
          Nova Escola
        </Button>
      </div>

      {isError && (
        <Alert variant="error" className={styles.alert}>
          Ocorreu um erro ao carregar as escolas. Tente novamente.
        </Alert>
      )}

      {isLoading ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando escolas...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.schoolsTable}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchools && filteredSchools.length > 0 ? (
                filteredSchools.map((school) => (
                  <tr key={school.id}>
                    <td>{school.name}</td>
                    <td>{school.address || 'Não informado'}</td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="icon"
                          onClick={() => handleViewDetails(school)}
                          title="Ver detalhes"
                        >
                          <FiInfo />
                        </Button>
                        <Button
                          variant="icon"
                          onClick={() => handleEditSchool(school)}
                          title="Editar escola"
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          variant="icon"
                          onClick={() => handleDeleteSchool(school.id)}
                          title="Excluir escola"
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className={styles.emptyState}>
                    Nenhuma escola encontrada
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
        title="Criar Nova Escola"
        icon={<FiHome />}
        size='medium'
      >
        <SchoolForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['schools'] });
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Escola"
        icon={<FiEdit />}
        size='medium'
      >
        {selectedSchool && (
          <SchoolForm
            school={selectedSchool}
            onSuccess={() => {
              setIsEditModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['schools'] });
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalhes da Escola"
        icon={<FiInfo />}
        size="medium"
      >
        {selectedSchool && (
          <SchoolDetail
            school={selectedSchool}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta escola? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
}

export default ManageSchoolsView;