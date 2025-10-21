import styles from './styles.module.scss'
import { useEffect, useState } from 'react';
import cn from 'classnames'

interface IPopupProps {
  children?: React.ReactNode;
}


export const Popup = ({ children }: IPopupProps) => {
  const [isVisible] = useState(true);

  // useEffect(() => {
  //   // Можно добавить логику анимации исчезновения здесь.
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    isVisible && (
      <div className={cn(styles.popup, isVisible && styles.fadeIn)}>
        {children}
      </div>
    )
  );
};
