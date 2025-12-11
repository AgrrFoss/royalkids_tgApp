// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Admins } from '@cms/collections/Admins'
import { Media } from '@cms/collections/Media'
import process from 'node:process'
import addFriendlyUrl from '@cms/plugins/addFriendlyURL/addFriendlyUrl'
import { s3Storage } from '@payloadcms/storage-s3'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Pages } from '@cms/collections/Pages'
import Options from '@cms/globals/Options'
import { Articles } from '@cms/collections/Articles'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Admins.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      icons: [
        {
          rel: 'icon',
          type: 'image/png',
          url: '/favicon.png',
        }
      ]
    }
  },
  // Заменяем стандартный роут админки
  routes: {
    admin: '/cms-mng-panel'
  },
  collections: [Admins, Media, Pages, Articles],
  globals: [Options],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    seoPlugin({
      collections: ['pages', 'articles'],
      globals: ['options'],
      uploadsCollection: 'media',
    }),
    addFriendlyUrl({
      enable: true,
      currentCollections: ['pages', 'articles'],
      slugField: {
        slug: 'slug',
        label: 'slug',
        inSidebar: true,
      },
      rewriteRules: {
        baseLanguage: 'ru'
      }
    }),
    s3Storage({
      enabled: process.env.MINIO_STORAGE_ENABLE === 'true',
      collections: {
        media: true,
      },
      bucket: `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}`,
      config: {
        credentials: {
          accessKeyId: process.env.MINIO_USER || '',
          secretAccessKey: process.env.MINIO_SECRET || '',
        },
        region: process.env.MINIO_REGION,
        endpoint: process.env.MINIO_ENDPOINT,
        bucketEndpoint: true,
      },
    }),
  ],
})
