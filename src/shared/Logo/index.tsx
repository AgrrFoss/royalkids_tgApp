import Logo from '@public/logo.svg'
import styles from './styles.module.scss'

export default function LogoComponent() {
  return (
    <Logo className={styles.logo} width={200} height={100}/>
  )
};