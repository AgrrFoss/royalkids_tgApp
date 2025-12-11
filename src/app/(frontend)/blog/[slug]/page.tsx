import { DataFromCollectionSlug, DataFromGlobalSlug, getPayload } from 'payload'
import configPromise from '@payload-config'
import { Metadata, ResolvingMetadata } from 'next'
import { getCachedDocument } from '@/utilities/getDocument'
import { notFound } from 'next/navigation'
import RichText from '@/shared/RichText'

import styles from './blog.module.scss'
import NavElements from '@front/widgets/Navigation'

export async function  generateStaticParams() {
  const payload = await getPayload({ config: configPromise})
  const articles = await payload.find({
    collection: 'articles',
    limit: 1000,
    pagination: false,
    select: {
      slug: true,
    }
  })
  const params = articles?.docs?.map(({ slug }) => {
      return { slug }
    })
  return params;
}

interface IArticleProps {
  params: Promise<{slug: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Blog ({params: paramsPromise}: IArticleProps) {
  const {slug} = await paramsPromise
  const article = await getCachedDocument('articles', slug, 4)() as DataFromCollectionSlug<'articles'>
  if(!article){notFound()}
  return (
    article && (
      <section className={styles.section}>
        <NavElements/>
        <article className={styles.article}>
          <h1 className={styles.title}>{article.title}</h1>
          <RichText data={article.content} className={styles.content} />
        </article>
      </section>
    )
  )
}


export async function generateMetadata({ params: paramsPromise }: IArticleProps, parent: ResolvingMetadata): Promise<Metadata> {
  const {slug = 'home'} = await paramsPromise
  const article = await getCachedDocument('articles', slug)() as DataFromCollectionSlug<'articles'>
  return {
    title: article?.meta?.title || (await parent).title,
    description: article?.meta?.description || (await parent).description,
  }
}