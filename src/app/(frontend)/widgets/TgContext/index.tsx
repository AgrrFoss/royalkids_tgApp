'use client'
import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { WebApp } from '@twa-dev/types';
import { validateTgSignature } from '@front/widgets/TgContext/verify-telegram-data'
import serverLog from '@/utilities/serverLog'
import { useUser } from '@front/widgets/UserContext'
import bridge from '@vkontakte/vk-bridge'

interface TgContextProps {
  tg: WebApp | null;
  isTgReady: 'tg' | 'vk' | null;
}
const TgContext = createContext<TgContextProps>({
  tg: null,
  isTgReady: null,
});

interface TgProviderProps {
  children: React.ReactNode;
}

const waitForTelegram = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    const checkTelegram = () => {
      if (window.Telegram && window.Telegram.WebApp) {

        console.log('Работает ожидатель тг')
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
  const [ isTgReady, setIsTgReady] = useState<'tg' | 'vk' | null>(null);
  const [isDarkMode, setDarkMode] = useState<boolean>(false)
  const telegramInitialized = useRef(false);
  const { user,  setUser } = useUser()

  const checkSignature = useCallback(async (initData: string) => {
    try {
      return await validateTgSignature(initData)
    } catch (err) {
      throw new Error('Ошибка проверки подписи')
    }
  }, [])


  const initVk = async (startParam: string) =>  {
    try {
      const vk = await bridge.send('VKWebAppInit')
      if (vk.result) {
        setIsTgReady('vk')
        const userData = await bridge.send('VKWebAppGetUserInfo')
        if(userData) {
          setUser ({
            vkId: userData.id,
            firstName: userData.first_name,
            lastName: userData.last_name,
            photoUrl: userData.photo_200,
            isDataValid: true,
            startParam
          })
        }
      }
    } catch (error) {
      console.error('Ошибка при инициализации VkMiniApp:', error)
      await serverLog('Ошибка при инициализации VkMiniApp:', error)
    }
  }
  const initializeTg = async () => {
    if (telegramInitialized.current) {
      return;
    }
    try {
      await waitForTelegram()
      const tgInstance = window.Telegram?.WebApp as WebApp
      if (tgInstance) {
        setTg(tgInstance)
        setIsTgReady('tg');
        const initDataUnsafe = tgInstance.initDataUnsafe || {}

        setDarkMode(tgInstance.colorScheme === 'dark');
        tgInstance.onEvent('themeChanged', () => {
          setDarkMode(tgInstance.colorScheme === 'dark');
        });
        const user = initDataUnsafe.user
        if (user) {
          await serverLog('user')
          const processUserData = async () => {
            const isValid = await checkSignature(tgInstance.initData)
            if (isValid) {
              setUser({
                tgId: user.id,
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
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
  }, [isDarkMode])

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const isVkApp = searchParams.has('vk_app_id');
    const isTgApp = searchParams.has('tgWebAppPlatform') || !!window.Telegram?.WebApp?.initData;
    if (isVkApp) {
      const startParam = window.location.hash.replace('#', '');
      initVk(startParam);
    } else {
      initializeTg();
    }
  }, [])

  return (
    <TgContext.Provider value={{tg, isTgReady}}>
      {children}
    </TgContext.Provider>
  )
}

export const useTg = () => useContext(TgContext);