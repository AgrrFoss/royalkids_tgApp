import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import styles from './styles.module.scss'

export default async function DashboardLayout() {
  const cookieStore = await cookies();
  const token = cookieStore.get('jwt')?.value;
  if (!token) {
    redirect('/login'); // Если нет токена, редирект на логин
  }
  return (
    <header className={styles.header}>
      <div className={styles.container}></div>
    </header>
  )
}