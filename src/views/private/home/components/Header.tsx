import styles from './Header.module.css';

// Icons
import { IoLogOutOutline } from 'react-icons/io5';

interface HeaderProps {
  user: {
    email: string;
    name: string;
    profilePictureUrl: string;
  }
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className={styles.header}>
      <div className={styles.siteInfo}>
        <h1 className={styles.siteTitle}>Transforma Eventos</h1>
        <p className={styles.siteTagline}>Seu hub central para eventos escolares, comunicados e contato com a comunidade.</p>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.userGreeting}>
          <h2 className={styles.userName}>Olá, {user.name}</h2>
          <p className={styles.userEmail}>{user.email}</p>
        </div>
        {user.profilePictureUrl && (
          <img
            src={user.profilePictureUrl}
            alt={`Foto de ${user.name}`}
            className={styles.profilePicture}
          />
        )}
        <button onClick={onLogout} className={styles.logoutButton}>
          Sair <IoLogOutOutline size={20} />
        </button>
      </div>
    </header>
  );
}

export default Header;