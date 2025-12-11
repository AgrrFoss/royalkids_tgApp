'use client'
import styles from './styles.module.scss'
import { useRouter } from 'next/navigation'
import Cross from '@public/icons/cross.svg'
import Link from 'next/link'

const NavElements = () => {
  const router = useRouter()
  return (
    <nav className={styles.navigation}>
      <button
        type="button"
        onClick={() => router.back()} // Используем router.back()
        className={styles.backButton}
      >
        Назад
      </button>
      <Link href={'/'} className={styles.cross}><Cross width={30} height={30}/></Link>
    </nav>
  )
}

export default NavElements