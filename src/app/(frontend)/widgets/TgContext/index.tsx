'use client'
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { WebApp } from '@twa-dev/types';
import { validateTgSignature } from '@front/widgets/TgContext/verify-telegram-data'
import serverLog from '@/utilities/serverLog'
import { useUser } from '@front/widgets/UserContext'

interface TgContextProps {
  tg: WebApp | null;
  isTgReady: boolean;
}
const TgContext = createContext<TgContextProps>({
  tg: null,
  isTgReady: false,
});

interface TgProviderProps {
  children: React.ReactNode;
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

export const TgContextProvider = ({children}: TgProviderProps) => {
  const [tg, setTg] = useState<WebApp | null>(null);
  const [ isTgReady, setIsTgReady] = useState<boolean>(false);
  const telegramInitialized = useRef(false);
  const { user,  setUser } = useUser()

  const checkSignature = useCallback(async (initData: string) => {
    try {
      return await validateTgSignature(initData)
    } catch (err) {
      throw new Error('Ошибка проверки подписи')
    }
  }, [])


  useEffect(() => {
    const initializeTg = async () => {
      if (telegramInitialized.current) {
        return;
      }
      try {
        await waitForTelegram()
        const tgInstance = window.Telegram?.WebApp as WebApp
        if (tgInstance) {
          setTg(tgInstance)
          setIsTgReady(true);
          const initDataUnsafe = tgInstance.initDataUnsafe || {}
          const user = initDataUnsafe.user
          if (user) {
            const processUserData = async () => {
              const isValid = await checkSignature(tgInstance.initData)
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
              } else {
                console.error('Telegram data is not valid!')
                setUser(prevState => ({...prevState, isDataValid: false}))
              }
            }
            processUserData()
          } else {
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
    initializeTg()
  }, [])

  return (
    <TgContext.Provider value={{tg, isTgReady}}>
      {children}
    </TgContext.Provider>
  )
}

export const useTg = () => useContext(TgContext);