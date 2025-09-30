import { getServerSideSitemap } from 'next-sitemap'
import { getDocuments } from '@/utilities/getDocument'
import { DataFromCollectionSlug } from 'payload'
import { unstable_cache } from 'next/cache'

const getPagesSitemap = unstable_cache(
  async () => {
    const pages = await getDocuments('pages') as DataFromCollectionSlug<'pages'>[]
    const articles = await getDocuments('articles') as DataFromCollectionSlug<'articles'>[]
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      'https://example.com'

    const dateFallback = new Date().toISOString()

    const pagesSitemap = pages && pages.length > 0 ? pages.map((page) => ({
      loc: `${SITE_URL}/${page?.slug}`,
      lastmod: page.updatedAt || dateFallback,
    })) : []
    const articlesSitemap = articles && articles.length > 0 ? articles.map((article) => ({
      loc: `${SITE_URL}/blog/${article.slug}`,
      lastmod: article.updatedAt || dateFallback,
    })) : []
    const sitemap = [...pagesSitemap, ...articlesSitemap]
    return sitemap
  },
  ['pages-sitemap', 'articles-sitemap'],
  {
    tags: ['pages-sitemap', 'articles-sitemap'],
  },)

export async function GET() {
  const sitemap = await getPagesSitemap()
  return getServerSideSitemap(sitemap)
}