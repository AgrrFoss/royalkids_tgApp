'use client'
import { useEffect, useMemo, useState } from 'react'
import { useUser } from '@front/widgets/UserContext'
import { useRouter } from 'next/navigation'
import { IPageStartParams, ITgClientProps, TelegramWebApp } from '@front/widgets/tgClient/types'
import ym from 'react-yandex-metrika'
import { useTg } from '@front/widgets/TgContext'
import sendUserData from '@/api/bot-api'
import serverLog from '@/utilities/serverLog'

interface ISubsriber {
  id?: string,
  tgId?: number,
  vkId?: number,
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
        firstName: user.firstName,
        lastName: user.lastName,
        photoUrl: user.photoUrl,
        username: user.username,
      }
      switch (isTgReady) {
        case 'vk': subscriber.vkId = user.id
          break
        case 'tg': subscriber.tgId = user.id
          break
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
  }, [user, parsedParams])

  useEffect(() => {
    console.log(isTgReady)
    if (isTgReady !== null) {
      if (newUrl) { // Используем кешированный newUrl
        const urlForYM = baseUrl ? `${baseUrl}${newUrl}` : newUrl;
        ym('hit', urlForYM);
        router.push(newUrl);
      }
    }
  }, [baseUrl, isTgReady, router, user])

  return (
    <div>
      {children}
    </div>
  )
}
