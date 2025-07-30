import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

// Icons
import { FaArrowLeft } from 'react-icons/fa';

interface HeaderProps {
  title: string;
  description: string;
}

const Header: React.FC<HeaderProps> = ({ title, description }) => {
  const navigate = useNavigate();
  return (
    <header className={styles.pageHeader}>
      <div className={styles.content}>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className={styles.headerAccent}></div>
      </div>
      <div className={styles.navigation}>
        <button onClick={() => navigate("/home")}>
          <FaArrowLeft className={styles.icon} size={14} /> Voltar
        </button>
      </div>
    </header>
  );
}

export default Header;