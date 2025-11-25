'use client'
import styles from './styles.module.scss'
import { useEffect, useMemo, useState } from 'react'
import { useUser } from '@front/widgets/UserContext'
import { useRouter } from 'next/navigation'
import { IPageStartParams, ITgClientProps, TelegramWebApp } from '@front/widgets/tgClient/types'
import ym from 'react-yandex-metrika'
import { useTg } from '@front/widgets/TgContext'
import serverLog from '@/utilities/serverLog'
import sendUserData from '@/utilities/sendData'
import cn from 'classnames'

interface ISubsriber {
  id?: number,
  firstName?: string,
  lastName?: string,
  photoUrl?: string | undefined;
  username?: string,
  utmSource?: string,
  utmMedium?: string,
  utmCampaign?: string,
}

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

  const parsedParams = useMemo(() => {
    if (user?.startParam) {
      return parseStartParams(user.startParam)
    }
    return null
  }, [user?.startParam])

  const newUrl = useMemo(()=> {
    if (parsedParams) {
      return buildUrl(parsedParams)
    }
    return ''
  }, [parsedParams])

  useEffect(() => {
    if (user) {
      const subscriber: ISubsriber = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        username: user.username,
      }
      if (parsedParams) {
        subscriber.utmSource = parsedParams.usr || ''
        subscriber.utmMedium = parsedParams.umd || ''
        subscriber.utmCampaign = parsedParams.ucm || ''
      }
      const sendUser = async () => {
        await sendUserData('/subscribers', subscriber)
        // await sendUserData('/v1.0/auth/telegram', { initData: tg?.initData })
      }
      sendUser()
    }
  }, [user])

  useEffect(() => {
    if (isTgReady && tg) {
      setDarkMode(tg.colorScheme === 'dark');
      tg.onEvent('themeChanged', () => {
        setDarkMode(tg.colorScheme === 'dark');
      });
      if (newUrl) { // Используем кешированный newUrl
        const urlForYM = baseUrl ? `${baseUrl}${newUrl}` : newUrl;
        ym('hit', urlForYM);
        router.push(newUrl);
      }
    }
  }, [baseUrl, isTgReady, router, tg, user])

  return (
    <div className={cn(isDarkMode ? styles.darkTheme : styles.defaultTheme)}>
      {children}
    </div>
  )
}
