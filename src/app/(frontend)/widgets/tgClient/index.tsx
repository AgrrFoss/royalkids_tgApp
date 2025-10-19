'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import serverLog from '@/utilities/serverLog'
import { useUser } from '@front/widgets/UserContext'
import { useRouter } from 'next/navigation'
import { IPageStartParams, ITgClientProps, TelegramWebApp, UserData } from '@front/widgets/tgClient/types'
import { WebApp } from '@twa-dev/types'
import ym from 'react-yandex-metrika'
import { useTranslation } from '@payloadcms/ui'
import { useTg } from '@front/widgets/TgContext'

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}

export const parseStartParams = (startParams: string): IPageStartParams => {
  const params: Record<string, string> = {}
  const paramPairs = startParams.split('_')
  for (const pair of paramPairs) {
    const [key, value] = pair.split('=')
    if (key && value) {
      params[key] = value
    }
  }
  return params
}
const buildUrl = (params: IPageStartParams): string => {
  let urlString = ''
  if (params.pg) {
    urlString = `/${params.pg}`
  }
  if (params.usr && params.umd && params.ucm) {
    const utmParams = new URLSearchParams()
    utmParams.append('utm_source', params.usr)
    utmParams.append('utm_medium', params.umd)
    utmParams.append('utm_campaign', params.ucm)
    if (params.ucn) {
      utmParams.append("utm_content", params.ucn);
    }
    if (params.utr) {
      utmParams.append("utm_term", params.utr);
    }
    urlString += utmParams ? `?${utmParams.toString()}` : '';
  }
  return urlString
}

export default function TgClient( { children, baseUrl }: ITgClientProps ) {
  const [isDarkMode, setDarkMode] = useState<boolean>(false)
  const { user } = useUser()
  const { tg, isTgReady} = useTg()
  const router = useRouter()

  useEffect(() => {
    if (isTgReady && tg) {
      setDarkMode(tg.colorScheme === 'dark');
      tg.onEvent('themeChanged', () => {
        setDarkMode(tg.colorScheme === 'dark');
      });
      if (user?.startParam) {
        const params = parseStartParams(user.startParam)
        if (params) {
          const newUrl = buildUrl(params)
          const urlForYM = baseUrl ? `${baseUrl}${newUrl}` : newUrl
          ym('hit', urlForYM)
          router.push(newUrl)
        }
      }
    }
  }, [baseUrl, isTgReady, router, tg, user])

  return (
    <div  style={{ backgroundColor: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
      <div>User: {user?.username}</div>
      <div>startParam: {user?.startParam}</div>
      {children}
    </div>
  )
}
