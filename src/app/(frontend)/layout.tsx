import React, { Suspense } from 'react'
import './global.scss'
import TgScript from '@front/widgets/tgClient/tgScript'
import Script from 'next/script'
import Head from 'next/head'
import { UserContextProvider } from '@front/widgets/UserContext'
import TgClient from '@front/widgets/tgClient'
import YandexMetrika from '@front/features/yandexMetrica/component'
import { DataFromGlobalSlug } from 'payload'
import { getCachedGlobal } from '@/utilities/getGlobals'
import process from 'node:process'


export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props
  const options = await getCachedGlobal('options', 2)() as DataFromGlobalSlug<'options'>
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL
  return (
    <html lang="en">
      <head>
        {typeof window !== undefined && <TgScript/>}
      </head>
      <UserContextProvider>
        <body>
          <YandexMetrika counter={Number(options.yandexMetrikaId)}/>
          <TgClient baseUrl={baseUrl}>
            {children}
          </TgClient>
        </body>
      </UserContextProvider>
    </html>
  )
}
