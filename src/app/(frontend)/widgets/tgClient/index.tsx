'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { validateTgSignature } from '@front/widgets/tgClient/verify-telegram-data'
import serverLog from '@/utilities/serverLog'
import { useUser } from '@front/widgets/UserContext'
import { useRouter } from 'next/navigation'
import { IPageStartParams, ITgClientProps, TelegramWebApp, UserData } from '@front/widgets/tgClient/types'
import { WebApp } from '@twa-dev/types'
import ym from 'react-yandex-metrika'

declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}

const waitForTelegram = (): Promise<void> => {
  return new Promise<void>((resolve) => {

    const checkTelegram = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        resolve()
      } else {
        setTimeout(checkTelegram, 500) // Проверяем каждые 500 миллисекунд
      }
    }
    checkTelegram()
  })
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
  const { user,  setUser } = useUser()
  const router = useRouter()
  const telegramInitialized = useRef(false);

  const checkSignature = useCallback(async (initData: string) => {
    try {
      return await validateTgSignature(initData)
    } catch (err) {
      throw new Error('Ошибка проверки подписи')
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (telegramInitialized.current) { // Проверка, была ли функция уже вызвана
        console.log("Telegram already initialized, skipping.");
        return;
      }
      try {
        await waitForTelegram()
        const tg = window.Telegram?.WebApp as WebApp
        if (tg) {
          setDarkMode(tg.colorScheme === 'dark');
          tg.onEvent('themeChanged', () => {
            setDarkMode(window.Telegram.WebApp.colorScheme === 'dark');
          });
          const initDataUnsafe = tg.initDataUnsafe || {}
          const user = initDataUnsafe.user
          if (user) {
            const processUserData = async () => {
              const isValid = await checkSignature(tg.initData)
              if (isValid) {
                setUser({
                  id: user.id,
                  firstName: user.first_name,
                  lastName: user.last_name,
                  username: user.username,
                  photoUrl: user.photo_url,
                  isDataValid: true,
                  startParam: initDataUnsafe.start_param
                })
                if (initDataUnsafe.start_param) {
                  const params = parseStartParams(initDataUnsafe.start_param)
                  if (params) {
                    const newUrl = buildUrl(params)
                    const urlForYM = baseUrl ? `${baseUrl}${newUrl}` : newUrl
                    ym('hit', urlForYM)
                    router.push(newUrl)
                  }
                }
                await serverLog('User установлен в контекст.')
              } else {
                console.error('Telegram data is not valid!')
                setUser(prevState => ({...prevState, isDataValid: false}))
              }
            }
            processUserData()
          } else {
            console.log('User data not available.')
            await serverLog('User data not available.')
          }
        } else {
          await serverLog('ТГ не найден')
        }
      } catch (error) {
        console.error('Ошибка при инициализации Telegram Web App:', error)
      } finally {
        telegramInitialized.current = true;
      }
    }
    fetchData()
  }, [user])

  return (
    <div  style={{ backgroundColor: isDarkMode ? '#222' : '#fff', color: isDarkMode ? '#fff' : '#000' }}>
      {children}
    </div>
  )
}
