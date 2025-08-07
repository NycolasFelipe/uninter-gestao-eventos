import styles from "./EventReviewView.module.css";

// Components
import Header from "src/components/header/Header";

const EventReviewView = () => {
  return (
    <div className={styles.container}>
      <Header
        title='Analisar Eventos'
        description=''
      />
    </div>
  );
}

export default EventReviewView;