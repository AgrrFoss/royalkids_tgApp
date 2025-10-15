import React from 'react'
import './global.scss'
import TgScript from '@front/widgets/tgClient/tgScript'
import Script from 'next/script'
import Head from 'next/head'


export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
    {/* eslint-disable-next-line @next/next/no-script-component-in-head */}
      <Head>
        <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      </Head>
        <body>
        {children}
        </body>
    </html>
  )
}
