import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginView.module.css';

// Icons
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { IoWarningOutline } from 'react-icons/io5';

// Context
import AuthContext from 'src/contexts/AuthContext';

// Lib
import classNames from 'classnames';
import Button from 'src/components/button/Button';
import { CgLogIn } from 'react-icons/cg';

export default function LoginView() {
  const navigate = useNavigate();
  const { login, mutationLogin } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    login(email, password, navigate);
  }

  return (
    <div className={styles.splitContainer}>
      <div className={styles.brandingSection}>
        <div className={styles.brandingContent}>
          <h1 className={styles.platformTitle}>Transforma Eventos</h1>
          <p className={styles.platformSlogan}>
            Conectando a comunidade escolar através de experiências significativas
          </p>
          <ul className={styles.benefitsList}>
            <li><FiArrowRight /> Planejamento integrado de eventos</li>
            <li><FiArrowRight /> Gerenciamento de inscrições</li>
            <li><FiArrowRight /> Controle de acesso e permissões</li>
            <li><FiArrowRight /> Análise de participação em tempo real</li>
          </ul>
        </div>
      </div>

      <div className={styles.loginSection}>
        <div className={styles.loginWrapper}>
          <h2 className={styles.welcomeTitle}>Bem-vindo(a)</h2>
          <p className={styles.welcomeText}>Acesse sua conta para gerenciar eventos</p>

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">
                <FiMail className={styles.inputIcon} />
                E-mail institucional
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@escola.com.br"
                className={styles.inputField}
                required={true}
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="password">
                <FiLock className={styles.inputIcon} />
                Senha de acesso
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="digite sua senha"
                  className={styles.inputField}
                  required={true}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={styles.togglePassword}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div className={classNames({
              "invisible": !mutationLogin.isError,
              "visible": mutationLogin.isError
            })}>
              <span className="text-danger w-100 text-end d-flex align-items-center gap-1">
                <IoWarningOutline />
                {mutationLogin?.error?.message || "Mensagem de erro"}
              </span>
            </div>

            <Button
              title="Acessar plataforma"
              type="submit"
              children="Acessar plataforma"
              icon={<CgLogIn size={20} />}
            />
          </form>
        </div>
      </div>
    </div>
  );
}