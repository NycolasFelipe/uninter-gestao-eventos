import React from 'react';
import styles from './VenueGallery.module.css';

interface VenueGalleryProps {
  pictures: { id: number; pictureUrl: string }[];
}

const VenueGallery: React.FC<VenueGalleryProps> = ({ pictures }) => {
  if (!pictures || pictures.length === 0) {
    return <p>Nenhuma foto disponível.</p>;
  }

  return (
    <div className={styles.galleryGrid}>
      {pictures.map((picture) => (
        <div key={picture.id} className={styles.galleryItem}>
          <img
            src={picture.pictureUrl}
            alt={`Venue ${picture.id}`}
            className={styles.galleryImage}
          />
        </div>
      ))}
    </div>
  );
}

export default VenueGallery;