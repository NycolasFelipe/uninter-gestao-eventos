import styles from "./ManageSubscriptionsView.module.css";

// Components
import Header from "src/components/header/Header";

const ManageSubscriptionsView = () => {
  return (
    <div className={styles.container}>
      <Header
        title='Gerenciamento de Inscrições'
        description='Visualizar inscrições dos eventos'
      />
    </div>
  )
}

export default ManageSubscriptionsView;