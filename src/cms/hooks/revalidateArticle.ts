import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Article } from '@/payload-types'

export const revalidateArticle: CollectionAfterChangeHook<Article> = async ({doc, req: {payload}}) => {
  const path = `/blog/${doc.slug}`
  payload.logger.info(`Revalidating page at path: ${path}`)

  revalidatePath(path)
  revalidateTag('articles-sitemap')
  revalidateTag('update_articles')

  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Article> = ({ doc }) => {
  const path = `/blog/${doc.slug}`

  revalidatePath(path)
  revalidateTag('articles-sitemap')
  revalidateTag('update_articles')
}