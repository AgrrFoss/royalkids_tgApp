import styles from './page.module.scss';
import { DataFromCollectionSlug } from 'payload'
import { Metadata, ResolvingMetadata } from 'next'
import { getCachedDocument } from '@/utilities/getDocument'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@public/logo.jpg'
import LogoComponent from '@/shared/Logo'


// export async function  generateStaticParams() {
//   const payload = await getPayload({ config: configPromise})
//   const pages = await payload.find({
//     collection: 'pages',
//     limit: 1000,
//     pagination: false,
//     select: {
//       slug: true,
//     }
//   })
//   const params = pages?.docs
//     ?.filter((doc) => {
//       return doc?.slug !== 'home'
//     })
//     .map(({ slug }) => {
//       return { slug }
//     })
//   return params;
// }


interface IPageProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}
export default async function Page({ params: paramsPromise }: IPageProps) {
  const { slug = 'home' } = await paramsPromise
  const page = (await getCachedDocument('pages', slug, 4)()) as DataFromCollectionSlug<'pages'>
  if (!page) {
    notFound()
  }

  return (
    page && (
      <>
        {page && (
          <section className={styles.main}>
            <h1 className={styles.title}>Школа танцев Royal kids</h1>
            <LogoComponent/>
            <p>Скоро тут будет вся информация о нас, а пока вы можете</p>
            <Link href={`/trial`} className={styles.linkButton}>
              Записаться на пробное занятие
            </Link>
            <p>и оценить насколько у нас классно!</p>
          </section>
        )}
      </>
    )
  )
}

export async function generateMetadata(
  { params: paramsPromise }: IPageProps,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const page = (await getCachedDocument('pages', slug)()) as DataFromCollectionSlug<'pages'>
  return {
    title: page?.meta?.title || (await parent).title,
    description: page?.meta?.description || (await parent).description,
  }
}