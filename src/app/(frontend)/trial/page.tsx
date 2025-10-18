import Form from '@front/widgets/Form'
import { Suspense } from 'react'
import Logo from '@public/logo.jpg'
import Image from 'next/image'

interface IPageProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default function TrialFormPage ({params: paramsPromise}: IPageProps) {
  return (
    <>
      <h1>Записаться на пробное занятие</h1>
      <Image src={Logo} alt={'Логотип RoyalKids'} width={200} height={100} />
      <Suspense fallback="loading">
        <Form></Form>
      </Suspense>
    </>
  )
}