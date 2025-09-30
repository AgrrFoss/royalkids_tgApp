import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Collection = keyof Config['collections']

export async function getDocuments(collection: Collection, depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    pagination: false,
    collection,
    depth,
  })

  return page.docs
}
export async function getDocument(collection: Collection, slug: string, depth = 1) {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection,
    depth,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return page.docs[0] || null
}




/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, slug: string, depth?: number) =>
  unstable_cache(async () => getDocument(collection, slug, depth), [collection, slug], {
    tags: [`${collection}_${slug}`],
  })
export const getCachedDocuments = (collection: Collection, depth?: number) =>
  unstable_cache(async () => getDocuments(collection, depth), [collection], {
    tags: [`update_${collection}`],
  })
