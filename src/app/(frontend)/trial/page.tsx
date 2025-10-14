import Form from '@front/widgets/Form'

interface IPageProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}


export default async function Page ({params: paramsPromise}: IPageProps) {
  return (
    <>
      <h1> Заголовок страницы с формой </h1>
      <Form></Form>
    </>
  )
}