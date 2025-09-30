import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '@/payload-types'

export const revalidatePage: CollectionAfterChangeHook<Page> = ({doc, req: {payload}}) => {
  const path = doc.slug === 'home' ? '/' : `/${doc.slug}`
  payload.logger.info(`Revalidating page at path: ${path}`)

  revalidatePath(path)
  revalidateTag('pages-sitemap')
  revalidateTag('update_pages')
  return doc
}

export const revalidateDelete: CollectionAfterDeleteHook<Page> = ({ doc }) => {
  const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`
  revalidatePath(path)
  revalidateTag('pages-sitemap')
  revalidateTag('update_pages')
}