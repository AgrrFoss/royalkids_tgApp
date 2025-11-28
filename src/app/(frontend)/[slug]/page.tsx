'use server'
import styles from './page.module.scss';
import { DataFromCollectionSlug } from 'payload'
import { Metadata, ResolvingMetadata } from 'next'
import { getCachedDocument } from '@/utilities/getDocument'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import Logo from '@public/logo.jpg'
import bg from '@public/images/bg.jpg'
import LogoComponent from '@/shared/Logo'
import Header from '@/shared/Blocks/Header'
import CallToAction from '@/shared/Blocks/CallToAction'
import CardsBlockComponent from '@/shared/Blocks/Cards'


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
  const blocks = page?.blocks
  if (!page) {
    notFound()
  }

  return (
    page &&
      <>
        <Header/>
        {blocks && blocks.length > 0 &&
        blocks.map((block) => {
          switch (block.blockType) {
            case 'cardsBlock':
              return (
                <CardsBlockComponent key={block.id} block={block} />
              )
            case 'callToActionBlock':
              return (
                <CallToAction key={block.id} block={block}/>
              )
          }
        })}
      </>
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