import Form from '@front/widgets/Form'
import { Suspense } from 'react'
import styles from './styles.module.scss'
import LogoComponent from '@/shared/Logo'

interface IPageProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default function TrialFormPage ({params: paramsPromise}: IPageProps) {
  return (
    <div className={styles.bg}>
      <h1 className={styles.title}>Записаться вечеринку
        <span className={styles.partyName}>welcome зима</span>
      </h1>
      <LogoComponent isDarkProp={true} className={styles.logo}/>
      <Suspense fallback="loading">
        <Form purpose={'event'} isDarkProps={true} className={styles.form}>
          <div className={styles.description}>
            <h2 className={styles.subtitle}>В программе:</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>Музыкально-танцевальные игры</li>
              <li className={styles.listItem}>JUST DANCE - вечеринка</li>
              <li className={styles.listItem}>Зажигательная дискотека</li>
            </ul>
            <div className={styles.text}>
              <span>Мероприятие состоится 7 декабря в 16:00</span>
              <span>Адрес: ул. Льва Толстого 8</span>

            </div>
          </div>
        </Form>
      </Suspense>
    </div>
  )
}