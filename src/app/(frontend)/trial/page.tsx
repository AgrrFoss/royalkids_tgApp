import Form from '@front/widgets/Form'
import { Suspense } from 'react'
import Logo from '@public/logo.jpg'
import Image from 'next/image'
import styles from './styles.module.scss'
import LogoComponent from '@/shared/Logo'
import NavElements from '@front/widgets/Navigation'

interface IPageProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default function TrialFormPage ({params: paramsPromise}: IPageProps) {
  return (
    <>
      <NavElements/>
      <h1 className={styles.title}>Записаться на пробное занятие</h1>
      <LogoComponent className={styles.logo}/>
      <Suspense fallback="loading">
        <Form purpose={'trial'}></Form>
      </Suspense>
    </>
  )
}