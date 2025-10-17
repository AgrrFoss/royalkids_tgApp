'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { validateTgSignature } from '@front/widgets/tgClient/verify-telegram-data'
import serverLog from '@/utilities/serverLog'
import { useUser } from '@front/widgets/UserContext'
import { useRouter } from 'next/navigation'

interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
}
interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramWebAppUser
    start_param: string
  }
  initData: string
}
declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}
export interface UserData {
  id?: number
  firstName?: string
  lastName?: string
  username?: string
  photoUrl?: string
  isDataValid: boolean
  startParam?: string
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

const parseStartParams = (startParams: string) => {
  const params: Record<string, string> = {}
  const paramPairs = startParams.split('_')
  for (const pair of paramPairs) {
    const [key, value] = pair.split('=')
    if (key && value) {
      params[key] = value
    }
  }
  console.log(params)
  return params
}


export default function TgClient( ) {
const [userData, setUserData] = useState<UserData>({ isDataValid: true })
  const [tgStatus, setTgStatus] = useState<string>('Телеграм не подключен')
  const [startParams, setStartParams] = useState<any>({})

  const checkSignature = useCallback(async (initData: string) => {
    try {
      return await validateTgSignature(initData)
    } catch (err) {
      throw new Error('Ошибка проверки подписи')
    }
  }, [])

  const { setUser } = useUser()
  const router = useRouter()

  const telegramInitialized = useRef(false);
  useEffect(() => {
    const fetchData = async () => {
      if (telegramInitialized.current) { // Проверка, была ли функция уже вызвана
        console.log("Telegram already initialized, skipping.");
        return;
      }
      try {
        await waitForTelegram()
        const tg = window.Telegram?.WebApp
        if (tg) {
          setTgStatus('Подключен ТГ')
          const initDataUnsafe = tg.initDataUnsafe || {}
          const user = initDataUnsafe.user
          if (user) {
            setTgStatus('есть юзер')
            const processUserData = async () => {
              const isValid = await checkSignature(tg.initData)
              if (isValid) {
                setUserData({
                  id: user.id,
                  firstName: user.first_name,
                  lastName: user.last_name,
                  username: user.username,
                  photoUrl: user.photo_url,
                  isDataValid: true,
                  startParam: initDataUnsafe.start_param
                })
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
                  if (params.pg) {
                    router.push(params.pg)
                  }
                  setStartParams(params)
                }
                await serverLog('User установлен в контекст.')
              } else {
                console.error('Telegram data is not valid!')
                setTgStatus('Тг данные на валидны')
                setUserData(prevState => ({...prevState, isDataValid: false}))
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

    setTgStatus('Эффект работы с ТГ отработал')

  }, [tgStatus, userData])

  return (
    <div>
      <h1>Информация от ТГ АПП</h1>
      <div>{tgStatus}</div>
      <div>{startParams.pg}</div>
      <div>{startParams.usr}</div>
      <div>{startParams.umd}</div>
      <>
        <p>User ID: {userData.id}</p>
        <p>First Name: {userData.firstName}</p>
        {userData.lastName && <p>Last Name: {userData.lastName}</p>}
        {userData.username && <p>Username: {userData.username}</p>}
        {userData.photoUrl && <img src={userData.photoUrl} alt="User Photo" />}
        {userData.isDataValid && <p>Данные валидны</p>}
        {userData.startParam && <p>{userData.startParam}</p>}
      </>
    </div>
  )
}