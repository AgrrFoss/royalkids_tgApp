'use client'
import { useCallback, useEffect, useState } from 'react'
import { validateTgSignature } from '@front/widgets/tgClient/verify-telegram-data'
import dynamic from 'next/dynamic'
import serverLog from '@/utilities/serverLog'

const TgScript = dynamic(
  () => import('@front/widgets/tgClient/tgScript'), // Создаем отдельный компонент для скрипта
  { ssr: false }, // Отключаем SSR для этого компонента
)

interface TelegramWebAppUser {
  id: number
  first_name: string
  last_name?: string
  username?: string
  photo_url?: string
  // Добавьте другие поля, если они вам нужны
}
interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramWebAppUser
  }
  initData: string // Строка с закодированными данными и подписью
  // Другие методы Telegram Web App API
}
declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp
    }
  }
}
interface UserData {
  id?: number
  firstName?: string
  lastName?: string
  username?: string
  photoUrl?: string
  isDataValid: boolean
  // Другие поля
}

const waitForTelegram = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    const checkTelegram = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        resolve()
      } else {
        setTimeout(checkTelegram, 50) // Проверяем каждые 50 миллисекунд
      }
    }
    checkTelegram()
  })
}

export default function TgClient() {
  const [userData, setUserData] = useState<UserData>({ isDataValid: true })
  const [tgStatus, setTgStatus] = useState<string>('Телеграм не подключен')

  const checkSignature = useCallback(async (initData: string) => {
    try {
      return await validateTgSignature(initData)
    } catch (err) {
      throw new Error('Ошибка проверки подписи')
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {

      await serverLog('запущен эффект работы с ТГ')

      try {
        await waitForTelegram()


        await serverLog('функция waitForTelegram сработала')

        const tg = window.Telegram?.WebApp
        if (tg) {

          await serverLog('ТГ найден')

          setTgStatus('Подключен ТГ')
          const initDataUnsafe = tg.initDataUnsafe || {}
          const user = initDataUnsafe.user
          if (user) {

            await serverLog('найден юзер')

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
                })
              } else {
                console.error('Telegram data is not valid!')
                setTgStatus('Тг данные на валидны')
                setUserData(prevState => ({...prevState, isDataValid: false}))
              }
            }
            processUserData()
          } else {
            console.log('User data not available.')
          }
        } else {

          await serverLog('ТГ не найден')

        }
      } catch (error) {

        await serverLog('Выброс в Catch')
        console.error('Ошибка при инициализации Telegram Web App:', error)
      }
    }
    fetchData()

    setTgStatus('Эффект работы с ТГ отработал')

  }, [checkSignature, tgStatus, userData])

  return (
    <div>
      <TgScript />
      <h1>Информация от ТГ АПП</h1>
      <>{tgStatus}</>
      <>
        <p>User ID: {userData.id}</p>
        <p>First Name: {userData.firstName}</p>
        {userData.lastName && <p>Last Name: {userData.lastName}</p>}
        {userData.username && <p>Username: {userData.username}</p>}
        {userData.photoUrl && <img src={userData.photoUrl} alt="User Photo" />}
        {userData.isDataValid && <p>Данные валидны</p>}
      </>
    </div>
  )
}