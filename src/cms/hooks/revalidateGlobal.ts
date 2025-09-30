import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'
const GlobalRevalidate: GlobalAfterChangeHook = async ({global, doc, req: {payload} }) => {

  payload.logger.info(`Revalidating ${global.slug}`)

  revalidateTag(`global_${global.slug}`)
  return doc
}
export default GlobalRevalidate


export  const FooterRevalidate: CollectionAfterChangeHook = async ({doc, req: {payload} }) => {

  payload.logger.info(`Revalidating Footer`)

  revalidateTag(`global_footer`)
  return doc
}