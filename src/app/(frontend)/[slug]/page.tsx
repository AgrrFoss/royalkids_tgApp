import styles from './page.module.scss';
import { DataFromCollectionSlug, DataFromGlobalSlug, getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata, ResolvingMetadata } from 'next'
import { getCachedDocument, getCachedDocuments } from '@/utilities/getDocument'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Media } from '@/payload-types'
import TgClient from '@front/widgets/tgClient'
import Link from 'next/link'
import { Suspense } from 'react'
import Form from '@front/widgets/Form'


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
export default async function Page ({params: paramsPromise}: IPageProps) {
  const {slug = 'home'} = await paramsPromise
  const options = await getCachedGlobal('options', 1)() as DataFromGlobalSlug<'options'>
  const page = await getCachedDocument('pages', slug, 4)() as DataFromCollectionSlug<'pages'>
  const cities = await getCachedDocuments('pages', 2)() as DataFromCollectionSlug<'pages'>[]
  if(!page){notFound()}

  const image2 = page.image2 as Media
  return (
    page && (
      <>
        {page && (
          <main className={styles.main}>
            <TgClient/>

            <Suspense fallback="loading">
              <Form></Form>
            </Suspense>
          </main>
          )}
      </>
    )
  )
}

export async function generateMetadata({ params: paramsPromise }: IPageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const {slug = 'home'} = await paramsPromise
  const page = await getCachedDocument('pages', slug)() as DataFromCollectionSlug<'pages'>
  return {
    title: page?.meta?.title || (await parent).title,
    description: page?.meta?.description || (await parent).description,
  }
}