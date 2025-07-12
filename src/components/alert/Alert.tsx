import React from 'react';
import styles from './Alert.module.css';

// Lib
import classNames from 'classnames';

// Icons
import { FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({
  children,
  variant = 'info',
  className,
}) => {
  const alertClass = classNames(
    styles.alert,
    styles[`alert-${variant}`],
    className
  );

  const iconMap = {
    success: <FiCheckCircle />,
    error: <FiAlertCircle />,
    warning: <FiAlertTriangle />,
    info: <FiInfo />,
  }

  return (
    <div className={alertClass}>
      <span className={styles.alertIcon}>{iconMap[variant]}</span>
      <div className={styles.alertContent}>{children}</div>
    </div>
  );
}

export default Alert;