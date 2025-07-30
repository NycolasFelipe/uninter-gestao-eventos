import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './ManageVenuesView.module.css';

// Interfaces
import type { IVenue, IVenuePicture } from 'src/interfaces/IVenue';
import type { ISchool } from 'src/interfaces/ISchool';

// Icons
import { FiEdit, FiTrash2, FiPlus, FiHome, FiInfo, FiSearch } from 'react-icons/fi';
import { TbRefresh } from 'react-icons/tb';

// Components
import Button from 'src/components/button/Button';
import Alert from 'src/components/alert/Alert';
import Modal from 'src/components/modal/base/Modal';
import Header from 'src/components/header/Header';
import VenueForm from './components/VenueForm';
import VenueDetail from './components/VenueDetail';
import ConfirmationModal from 'src/components/modal/confirmation/ConfirmationModal';

// Controllers
import VenueController from 'src/controllers/VenueController';
import VenuePictureController from 'src/controllers/VenuePictureController';
import SchoolController from 'src/controllers/SchoolController';

const ManageVenuesView = () => {
  const queryClient = useQueryClient();
  const [selectedVenue, setSelectedVenue] = useState<IVenue>();
  const [selectedVenuePictures, setSelectedVenuePictures] = useState<IVenuePicture[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<number | null>(null);

  const { data: venues, isLoading, isError, refetch } = useQuery<IVenue[]>({
    queryKey: ["venues"],
    queryFn: () => VenueController.getVenues()
  });

  const { data: schools, isLoading: isLoadingSchools } = useQuery<ISchool[]>({
    queryKey: ["schools"],
    queryFn: () => SchoolController.getSchools()
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => VenueController.deleteVenue(id),
    onSuccess: () => refetch()
  });

  const filteredVenues = venues?.filter(venue =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (venue.address && venue.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetails = async (venue: IVenue) => {
    setSelectedVenue(venue);
    try {
      const pictures = await VenuePictureController.getPicturesByVenue(venue.id);
      setSelectedVenuePictures(pictures);
      setIsDetailModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      setSelectedVenuePictures([]);
      setIsDetailModalOpen(true);
    }
  }

  const handleEditVenue = async (venue: IVenue) => {
    setSelectedVenue(venue);
    try {
      const pictures = await VenuePictureController.getPicturesByVenue(venue.id);
      setSelectedVenue({ ...venue, venuePictures: pictures });
      setIsEditModalOpen(true);
    } catch (error) {
      console.error('Erro ao carregar fotos:', error);
      setIsEditModalOpen(true);
    }
  }

  const handleDeleteVenue = (venueId: number) => {
    setVenueToDelete(venueId);
    setIsDeleteModalOpen(true);
  }

  const confirmDelete = async () => {
    if (venueToDelete) {
      try {
        await deleteMutation.mutateAsync(venueToDelete);
        setIsDeleteModalOpen(false);
        setVenueToDelete(null);
      } catch (error) {
        console.error('Erro ao excluir local:', error);
      }
    }
  }

  const schoolMap = new Map((schools || []).map(school => [school.id, school.name]));

  return (
    <div className={styles.manageVenuesContainer}>
      <Header
        title='Gerenciamento de Locais'
        description='Gerencie os locais cadastrados no sistema'
      />

      <div className={styles.controlsSection}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <FiSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar locais por nome ou endereço..."
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
          Novo Local
        </Button>
      </div>

      {isError && (
        <Alert variant="error" className={styles.alert}>
          Ocorreu um erro ao carregar os locais. Tente novamente.
        </Alert>
      )}

      {(isLoading || isLoadingSchools) ? (
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Carregando locais...</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.venuesTable}>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Escola</th>
                <th>Endereço</th>
                <th>Capacidade</th>
                <th>Interno</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredVenues && filteredVenues.length > 0 ? (
                filteredVenues.map((venue) => (
                  <tr key={venue.id}>
                    <td>{venue.name}</td>
                    <td>{schoolMap.get(venue.schoolId) || 'N/A'}</td>
                    <td>{venue.address || 'Não informado'}</td>
                    <td>{venue.capacity || 'Não informado'}</td>
                    <td>{venue.isInternal ? 'Sim' : 'Não'}</td>
                    <td>
                      <div className={styles.actions}>
                        <Button
                          variant="icon"
                          onClick={() => handleViewDetails(venue)}
                          title="Ver detalhes"
                        >
                          <FiInfo />
                        </Button>
                        <Button
                          variant="icon"
                          onClick={() => handleEditVenue(venue)}
                          title="Editar local"
                        >
                          <FiEdit />
                        </Button>
                        <Button
                          variant="icon"
                          onClick={() => handleDeleteVenue(venue.id)}
                          title="Excluir local"
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
                    Nenhum local encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Criar Novo Local"
        icon={<FiHome />}
        size='medium'
      >
        <VenueForm
          onSuccess={() => {
            setIsCreateModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ['venues'] });
          }}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Local"
        icon={<FiEdit />}
        size='medium'
      >
        {selectedVenue && (
          <VenueForm
            venue={selectedVenue}
            onSuccess={() => {
              setIsEditModalOpen(false);
              queryClient.invalidateQueries({ queryKey: ['venues'] });
            }}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalhes do Local"
        icon={<FiInfo />}
        size="medium"
      >
        {selectedVenue && (
          <VenueDetail
            venue={selectedVenue}
            pictures={selectedVenuePictures}
            onClose={() => setIsDetailModalOpen(false)}
          />
        )}
      </Modal>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este local? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        isProcessing={deleteMutation.isPending}
      />
    </div>
  );
}

export default ManageVenuesView;