import Form from '@front/widgets/Form'
import { Suspense } from 'react'
import styles from './styles.module.scss'
import LogoComponent from '@/shared/Logo'
import GiftForm from '@front/widgets/GIftForm'
import NavElements from '@front/widgets/Navigation'

interface IPageProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default function GiftFormPage ({params: paramsPromise}: IPageProps) {
  return (
    <>
    <div className={styles.bg}>
      <NavElements/>
      <h1 className={styles.title}>Определи свой
        <span className={styles.partyName}>подарок</span>
      </h1>
      <LogoComponent className={styles.logo}/>
      <Suspense fallback="loading">
        <GiftForm purpose={'lottery'} isDarkProps={true} className={styles.form}>
        </GiftForm>
      </Suspense>
    </div>
    </>
  )
}