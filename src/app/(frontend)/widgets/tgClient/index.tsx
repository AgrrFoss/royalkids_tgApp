'use client'
import { useEffect, useState } from 'react';
import { validateTgSignature } from '@front/widgets/tgClient/verify-telegram-data'
import dynamic from 'next/dynamic';
const TgScript = dynamic(
  () => import('@front/widgets/tgClient/tgScript'), // Создаем отдельный компонент для скрипта
  { ssr: false } // Отключаем SSR для этого компонента
)

interface TelegramWebAppUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  // Добавьте другие поля, если они вам нужны
}
interface TelegramWebApp {
  initDataUnsafe: {
    user?: TelegramWebAppUser;
  };
  initData: string; // Строка с закодированными данными и подписью
  // Другие методы Telegram Web App API
}
declare global {
  interface Window {
    Telegram: {
      WebApp: TelegramWebApp;
    };
  }
}
interface UserData {
  id?: number;
  firstName?: string;
  lastName?: string;
  username?: string;
  photoUrl?: string;
  isDataValid: boolean;
  // Другие поля
}

const waitForTelegram = (): Promise<void> => {
  return new Promise<void>((resolve) => {
    const checkTelegram = () => {
      if (window.Telegram && window.Telegram.WebApp) {
        resolve();
      } else {
        setTimeout(checkTelegram, 50); // Проверяем каждые 50 миллисекунд
      }
    };
    checkTelegram();
  });
};



export default function TgClient () {
  const [userData, setUserData] = useState<UserData>({ isDataValid: true });
  const [tgStatus, setTgStatus] = useState<string>('Телеграм не подключен');

  useEffect( () => {
    const fetchData = async () => {
      try {
        await waitForTelegram()
        const tg = window.Telegram?.WebApp;
        if (tg) {
          setTgStatus('Подключен ТГ')
          const initDataUnsafe = tg.initDataUnsafe || {};
          const user = initDataUnsafe.user;
          if (user) {
            setTgStatus('есть юзер')
            const data = {
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              username: user.username,
              photoUrl: user.photo_url,
              isDataValid: false, // Изначально считаем, что данные невалидны
            };
            setUserData({
              id: user.id,
              firstName: user.first_name,
              lastName: user.last_name,
              username: user.username,
              photoUrl: user.photo_url,
              isDataValid: false, // Изначально считаем, что данные невалидны
            });
            const checkSignature = async (initData: string) => {
              try {
                const isValid = await validateTgSignature(initData);
                setUserData({...userData, isDataValid: isValid.isValid })
              } catch(err) {
                throw new Error('Ошибка проверки подписи')
              }
            }
            checkSignature(tg.initData)
            if (userData.isDataValid) {
              setUserData({
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                username: user.username,
                photoUrl: user.photo_url,
                isDataValid: true,
              });
            } else {
              console.error('Telegram data is not valid!');
              // Обработка случая, когда данные не прошли проверку
              setUserData(prevState => ({...prevState, isDataValid: false}))
            }
          } else {
            console.log('User data not available.');
          }
        }
      }
      catch (error) {
        console.error('Ошибка при инициализации Telegram Web App:', error)
      }
    }
    fetchData();



    // const tg = window.Telegram?.WebApp;
    // if (tg) {
    //   setTgStatus('Подключен ТГ')
    //   const initDataUnsafe = tg.initDataUnsafe || {};
    //   const user = initDataUnsafe.user;
    //   if (user) {
    //     setTgStatus('есть юзер')
    //     const data = {
    //       id: user.id,
    //       firstName: user.first_name,
    //       lastName: user.last_name,
    //       username: user.username,
    //       photoUrl: user.photo_url,
    //       isDataValid: false, // Изначально считаем, что данные невалидны
    //     };
    //     setUserData({
    //       id: user.id,
    //       firstName: user.first_name,
    //       lastName: user.last_name,
    //       username: user.username,
    //       photoUrl: user.photo_url,
    //       isDataValid: false, // Изначально считаем, что данные невалидны
    //     });
    //     const checkSignature = async (initData: string) => {
    //       try {
    //         const isValid = await validateTgSignature(initData);
    //         setUserData({...userData, isDataValid: isValid.isValid })
    //       } catch(err) {
    //         throw new Error('Ошибка проверки подписи')
    //       }
    //     }
    //     checkSignature(tg.initData)
    //     if (userData.isDataValid) {
    //       setUserData({
    //         id: user.id,
    //         firstName: user.first_name,
    //         lastName: user.last_name,
    //         username: user.username,
    //         photoUrl: user.photo_url,
    //         isDataValid: true,
    //       });
    //     } else {
    //       console.error('Telegram data is not valid!');
    //       // Обработка случая, когда данные не прошли проверку
    //       setUserData(prevState => ({...prevState, isDataValid: false}))
    //     }
    //   } else {
    //     console.log('User data not available.');
    //   }
    // }



  }, [tgStatus, userData]);


  return (
    <div>
      <TgScript/>
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