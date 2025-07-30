import { useMutation, useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import styles from './VenueForm.module.css';

// Icons
import { FiMapPin, FiHome, FiX, FiPlus, FiUsers, FiBook } from 'react-icons/fi';

// Components
import Button from 'src/components/button/Button';
import Alert from 'src/components/alert/Alert';

// Controllers
import VenueController from 'src/controllers/VenueController';
import VenuePictureController from 'src/controllers/VenuePictureController';
import SchoolController from 'src/controllers/SchoolController';

// Interfaces
import type { ISchool } from 'src/interfaces/ISchool';
import type { IVenuePicture, IVenuePictureCreate } from 'src/interfaces/IVenue';

interface VenueFormProps {
  venue?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const VenueForm: React.FC<VenueFormProps> = ({ venue, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    schoolId: venue?.schoolId || '',
    name: venue?.name || '',
    address: venue?.address || '',
    capacity: venue?.capacity || '',
    isInternal: venue?.isInternal ?? true,
    venuePictures: venue?.venuePictures || []
  });

  // Estado para fotos
  const [pictures, setPictures] = useState<IVenuePicture[]>(venue?.venuePictures || []);
  const [picturesAdded, setPicturesAdded] = useState<IVenuePictureCreate[]>([]);
  const [picturesRemoved, setPicturesRemoved] = useState<number[]>([]);
  const [newPictureUrl, setNewPictureUrl] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: schools, isLoading: isLoadingSchools } = useQuery<ISchool[]>({
    queryKey: ["schools"],
    queryFn: () => SchoolController.getSchools()
  });

  const createPicturesMutation = useMutation({
    mutationFn: (pictures: IVenuePictureCreate[]) => VenuePictureController.createVenuePicture(pictures),
    onSuccess: () => onSuccess()
  });

  const removePictureMutation = useMutation({
    mutationFn: (id: number) => VenuePictureController.deleteVenuePicture(id),
    onSuccess: () => onSuccess()
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 0 : value
    }));
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  }

  const handleAddPictureUrl = () => {
    if (newPictureUrl.trim() !== '') {
      const newPicture: IVenuePictureCreate = {
        venueId: venue?.id || 0,
        pictureUrl: newPictureUrl
      }
      setPicturesAdded(prev => [...prev, newPicture]);
      setNewPictureUrl('');
    }
  }

  const handleRemovePictureUrl = (id: number, isNew: boolean) => {
    if (isNew) {
      setPicturesAdded(prev => prev.filter((_, i) => i !== id));
    } else {
      setPictures(prev => prev.filter(p => p.id !== id));
      setPicturesRemoved(prev => [...prev, id]);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let venueId: number;

      const dataToSend = {
        ...formData,
        schoolId: Number(formData.schoolId),
      }

      if (venue?.id) {
        await VenueController.updateVenue(dataToSend, venue.id);
        venueId = venue.id;
      } else {
        const createdVenue = await VenueController.createVenue(dataToSend);
        venueId = createdVenue.id;
      }

      // Associar venueId às novas fotos
      const picturesWithVenueId = picturesAdded.map(p => ({
        ...p,
        venueId,
      }));

      if (picturesWithVenueId.length > 0) {
        await createPicturesMutation.mutateAsync(picturesWithVenueId);
      }

      // Remover fotos marcadas
      for (const pictureId of picturesRemoved) {
        await removePictureMutation.mutateAsync(pictureId);
      }

      onSuccess();

    } catch (err: any) {
      setError(err.message || 'Erro ao salvar local');

    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.venueForm}>
      {error && <Alert variant="error" className={styles.alert}>{error}</Alert>}

      <div className={styles.formHeader}>
        <h2>{venue ? 'Editar Local' : 'Novo Local'}</h2>
        <p>Preencha os campos abaixo para {venue ? 'atualizar' : 'criar'} o local</p>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="name">
          <FiHome className={styles.inputIcon} />
          Nome do Local *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Digite o nome do local"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="address">
          <FiMapPin className={styles.inputIcon} />
          Endereço
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Digite o endereço completo"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="capacity">
          <FiUsers className={styles.inputIcon} />
          Capacidade
        </label>
        <input
          type="number"
          id="capacity"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Digite a capacidade do local"
          min={1}
        />
      </div>

      <div className={styles.formGroup}>
        <label>
          <input
            type="checkbox"
            name="isInternal"
            checked={formData.isInternal}
            onChange={handleCheckboxChange}
          />
          <span style={{ marginLeft: '8px' }}>Local interno?</span>
        </label>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="schoolId">
          <FiBook className={styles.inputIcon} />
          Escola *
        </label>
        {isLoadingSchools ? (
          <p>Carregando escolas...</p>
        ) : (
          <select
            id="schoolId"
            name="schoolId"
            value={formData.schoolId}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma escola</option>
            {(schools || []).map(school => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className={styles.formGroup}>
        <label>Fotos do Local (URLs)</label>
        <div className={styles.pictureUrls}>
          {/* Fotos existentes */}
          {pictures.map((picture) => (
            <div key={picture.id} className={styles.pictureUrlItem}>
              <img src={picture.pictureUrl} alt="Foto do local" style={{ maxWidth: '100px' }} />
              <Button
                variant="icon"
                onClick={() => handleRemovePictureUrl(picture.id, false)}
                title="Remover"
                type="button"
              >
                <FiX />
              </Button>
            </div>
          ))}
          {/* Fotos novas adicionadas */}
          {picturesAdded.map((picture, index) => (
            <div key={`new-${index}`} className={styles.pictureUrlItem}>
              <img src={picture.pictureUrl} alt="Nova foto" style={{ maxWidth: '100px' }} />
              <Button
                variant="icon"
                onClick={() => handleRemovePictureUrl(index, true)}
                title="Remover"
                type="button"
              >
                <FiX />
              </Button>
            </div>
          ))}
          {/* Campo para adicionar nova URL */}
          <div className={styles.pictureUrlItem}>
            <input
              type="text"
              value={newPictureUrl}
              onChange={(e) => setNewPictureUrl(e.target.value)}
              placeholder="Cole a URL da foto"
            />
            <Button
              variant="primary"
              onClick={handleAddPictureUrl}
              icon={<FiPlus />}
              type="button"
            >
              Adicionar
            </Button>
          </div>
        </div>
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
          {isSubmitting ? 'Salvando...' : venue ? 'Salvar alterações' : 'Criar Local'}
        </Button>
      </div>
    </form>
  );
}

export default VenueForm;