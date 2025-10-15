import React from 'react'
import './global.scss'
import TgScript from '@front/widgets/tgClient/tgScript'


export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <head>
      </head>
        <body>
        {children}
        </body>
    </html>
  )
}
