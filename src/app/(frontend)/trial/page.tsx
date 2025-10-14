import Form from '@front/widgets/Form'
import { Suspense } from 'react'

interface IPageProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default function TrialFormPage ({params: paramsPromise}: IPageProps) {
  return (
    <>
      <h1> Заголовок страницы с формой </h1>
      <Suspense fallback="loading">
        <Form></Form>
      </Suspense>
    </>
  )
}